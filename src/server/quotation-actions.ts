import { canBid, validUnitPrice } from '#/lib/quotation'
import { isoDate, isValidDate } from '#/lib/quote'
import { database, withTransaction } from './db'
import { record, UUID_V4 } from './http'
import type { QuotationState } from '#/lib/quotation'

type Actor = { role: 'customer' | 'artisan'; email: string }

function validVersion(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value >= 0 &&
    value < 2_147_483_647
  )
}

export async function actOnQuotation(actor: Actor, input: unknown) {
  if (!record(input)) return 400
  const { id, action } = input
  if (typeof id !== 'string' || !UUID_V4.test(id)) return 400

  if (actor.role === 'customer') {
    if (action === 'delete') {
      const result = await database().query(
        `DELETE FROM quotes
         WHERE id = $1 AND buyer_email = $2 AND (
           flow_state IN ('sent', 'bidding') OR (flow_state IS NULL AND status = 'new')
         )`,
        [id, actor.email],
      )
      return result.rowCount ? 200 : 404
    }

    const { invitationId, version } = input
    if (
      action !== 'choose' ||
      typeof invitationId !== 'string' ||
      !UUID_V4.test(invitationId) ||
      !validVersion(version)
    )
      return 400

    return withTransaction(async (client) => {
      const { rows } = await client.query<{
        flow_state: QuotationState
        accepted_invitation_id: string | null
      }>(
        `SELECT flow_state, accepted_invitation_id FROM quotes
         WHERE id = $1 AND buyer_email = $2 AND flow_state IS NOT NULL FOR UPDATE`,
        [id, actor.email],
      )
      const quote = rows.at(0)
      if (!quote) return 404
      if (!canBid(quote.flow_state)) {
        return quote.accepted_invitation_id === invitationId.toLowerCase()
          ? 200
          : 409
      }
      const offer = await client.query(
        `SELECT 1 FROM quote_invitations i
         JOIN accounts a ON a.email = i.artisan_email AND a.artisan_status = 'approved'
         WHERE i.quote_id = $1 AND i.id = $2 AND i.version = $3
           AND i.response = 'offered' AND i.completion_date >= $4::date
         FOR SHARE OF a`,
        [id, invitationId, version, isoDate(0)],
      )
      if (!offer.rowCount) return 409

      await client.query(
        `UPDATE quotes SET flow_state = 'accepted', accepted_invitation_id = $2 WHERE id = $1`,
        [id, invitationId],
      )
      return 200
    })
  }

  if (
    action !== 'offer' &&
    action !== 'decline' &&
    action !== 'restore' &&
    action !== 'hide' &&
    action !== 'start' &&
    action !== 'deliver'
  )
    return 400
  const { version, unitPrice, completionDate } = input
  if (action !== 'start' && action !== 'deliver' && !validVersion(version))
    return 400
  if (
    action === 'offer' &&
    (!validUnitPrice(unitPrice) ||
      typeof completionDate !== 'string' ||
      !isValidDate(completionDate) ||
      completionDate < isoDate(0))
  )
    return 400

  return withTransaction(async (client) => {
    // All responses and awards take the request lock before reading offer terms.
    const locked = await client.query<{
      flow_state: QuotationState
      accepted_invitation_id: string | null
    }>(
      `SELECT flow_state, accepted_invitation_id FROM quotes
       WHERE id = $1 AND flow_state IS NOT NULL FOR UPDATE`,
      [id],
    )
    const request = locked.rows.at(0)
    if (!request) return 404
    const { rows } = await client.query<{
      id: string
      response: 'pending' | 'offered' | 'declined'
      version: number
    }>(
      `SELECT i.id, i.response, i.version FROM quote_invitations i
       JOIN accounts a ON a.email = i.artisan_email AND a.artisan_status = 'approved'
       WHERE i.quote_id = $1 AND i.artisan_email = $2 FOR SHARE OF a`,
      [id, actor.email],
    )
    const invitation = rows.at(0)
    if (!invitation) return 404
    const quote = { ...request, ...invitation }

    if (action === 'start' || action === 'deliver') {
      if (quote.accepted_invitation_id !== quote.id) return 403
      const prior = action === 'start' ? 'accepted' : 'in-production'
      const next = action === 'start' ? 'in-production' : 'delivered'
      if (quote.flow_state === next) return 200
      if (quote.flow_state !== prior) return 409
      await client.query('UPDATE quotes SET flow_state = $2 WHERE id = $1', [
        id,
        next,
      ])
      return 200
    }

    if (quote.version !== version) return 409
    if (action === 'hide') {
      if (quote.response !== 'declined') return 409
      await client.query(
        `UPDATE quote_invitations SET hidden = TRUE, version = version + 1
         WHERE quote_id = $1 AND id = $2`,
        [id, quote.id],
      )
      return 200
    }

    if (!canBid(quote.flow_state)) return 409
    if ((action === 'restore') !== (quote.response === 'declined')) return 409
    const response =
      action === 'offer'
        ? 'offered'
        : action === 'decline'
          ? 'declined'
          : 'pending'
    await client.query(
      `UPDATE quote_invitations SET response = $3, unit_price = $4, completion_date = $5,
         hidden = FALSE, version = version + 1 WHERE quote_id = $1 AND id = $2`,
      [
        id,
        quote.id,
        response,
        action === 'offer' ? unitPrice : null,
        action === 'offer' ? completionDate : null,
      ],
    )
    if (action === 'offer' && quote.flow_state === 'sent')
      await client.query(
        "UPDATE quotes SET flow_state = 'bidding' WHERE id = $1",
        [id],
      )
    return 200
  })
}
