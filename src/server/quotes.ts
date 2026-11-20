import { getProduct, getWorkshop, workshops } from '#/data'
import { QUOTE_STATUSES } from '#/data/types'
import { BUDGETS, PRODUCT_TYPES, validate } from '#/lib/quote'
import { database } from './db'
import { record, UUID_V4 } from './http'
import type { ArtisanQuote, QuoteReply } from '#/lib/artisan'
import type {
  AdminQuote,
  QuoteAllocation,
  QuoteInput,
  QuoteReceipt,
  QuoteStatus,
} from '#/data/types'

const PAGE_SIZE = 25

type QuoteRow = {
  id: string
  created_at: Date
  request: QuoteInput
  status: QuoteStatus
  allocations: Array<QuoteAllocation>
  version: number
}

const REPLY_FIELDS = `w.id AS "workshopId", w.name AS "workshopName",
  r.message, r.unit_price AS "unitPrice", r.quantity`

const QUOTE_REPLIES = `COALESCE((
  SELECT jsonb_agg(to_jsonb(reply) - 'updated_at' ORDER BY reply.updated_at DESC) FROM (
    SELECT ${REPLY_FIELDS}, r.updated_at FROM artisan_quote_replies r
    JOIN artisan_workshops w ON w.id = r.workshop_id
    WHERE r.quote_id = q.id
  ) reply
), '[]'::jsonb) AS replies`

export async function getQuoteWorkshops() {
  const { rows } = await database().query<{
    id: string
    name: string
    active: boolean
  }>(
    `SELECT w.id, w.name, a.artisan_status = 'approved' AS active
     FROM artisan_workshops w JOIN accounts a ON a.email = w.account_email
     ORDER BY w.name, w.id`,
  )
  return [
    ...rows,
    ...workshops.map(({ id, name }) => ({ id, name, active: true })),
  ]
}

function quoteCode(id: string) {
  return `YC-${Buffer.from(id.replaceAll('-', ''), 'hex').toString('base64url')}`
}

function receipt(id: string, input: QuoteInput): QuoteReceipt {
  return {
    id,
    code: quoteCode(id),
    quantity: input.quantity,
    productType: input.productType,
    deadline: input.deadline,
  }
}

export async function createQuote(value: unknown, buyerEmail: string) {
  if (!record(value)) return null
  const {
    id,
    productType,
    quantity,
    deadline,
    budget,
    customization,
    name,
    organization,
    email,
    phone,
    productId,
  } = value
  if (
    typeof id !== 'string' ||
    !UUID_V4.test(id) ||
    typeof productType !== 'string' ||
    !PRODUCT_TYPES.includes(productType) ||
    typeof quantity !== 'number' ||
    typeof deadline !== 'string' ||
    typeof budget !== 'string' ||
    !BUDGETS.includes(budget) ||
    typeof customization !== 'string' ||
    typeof name !== 'string' ||
    typeof organization !== 'string' ||
    typeof email !== 'string' ||
    typeof phone !== 'string' ||
    (productId !== undefined &&
      (typeof productId !== 'string' ||
        (!getProduct(productId) && !UUID_V4.test(productId))))
  )
    return null

  const input: QuoteInput = {
    productType,
    quantity,
    deadline,
    budget,
    customization: customization.trim(),
    name: name.trim(),
    organization: organization.trim(),
    email: email.trim(),
    phone: phone.trim(),
    productId:
      productId && UUID_V4.test(productId)
        ? productId.toLowerCase()
        : productId,
  }
  const key = id.toLowerCase()
  const db = database()
  const existing = await db.query<
    Pick<QuoteRow, 'request'> & { buyer_email: string | null }
  >('SELECT request, buyer_email FROM quotes WHERE id = $1', [key])
  const stored = existing.rows.at(0)
  if (stored)
    return stored.buyer_email === buyerEmail
      ? receipt(key, stored.request)
      : null

  if (productId && !getProduct(productId)) {
    const product = await db.query(
      `SELECT 1 FROM artisan_products p
       JOIN artisan_workshops w ON w.id = p.workshop_id
       JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
       WHERE p.id = $1`,
      [productId],
    )
    if (!product.rowCount) return null
  }

  if (Object.keys(validate({ ...input, quantity: String(quantity) })).length)
    return null
  // PostgreSQL JSONB requires valid Unicode and cannot store null characters.
  if (
    Object.values(input).some(
      (field) =>
        typeof field === 'string' &&
        (field.includes('\0') || /\p{Surrogate}/u.test(field)),
    )
  )
    return null

  const inserted = await db.query<Pick<QuoteRow, 'request'>>(
    `INSERT INTO quotes (id, request, buyer_email) VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING RETURNING request`,
    [key, input, buyerEmail],
  )
  if (inserted.rowCount) return receipt(key, inserted.rows[0].request)

  const concurrent = await db.query<Pick<QuoteRow, 'request'>>(
    'SELECT request FROM quotes WHERE id = $1 AND buyer_email = $2',
    [key, buyerEmail],
  )
  const retried = concurrent.rows.at(0)
  return retried ? receipt(key, retried.request) : null
}

export async function getQuotes(page: number) {
  const db = database()
  const count = await db.query<{ total: string }>(
    'SELECT COUNT(*) AS total FROM quotes',
  )
  const total = Number(count.rows[0].total)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.max(1, Math.min(page, pages))
  const { rows } = await db.query<
    QuoteRow & { replies: Array<QuoteReply>; productName: string | null }
  >(
    `SELECT q.*, ${QUOTE_REPLIES}, p.name AS "productName"
     FROM quotes q LEFT JOIN artisan_products p ON p.id::text = q.request->>'productId'
     ORDER BY q.created_at DESC, q.id DESC LIMIT $1 OFFSET $2`,
    [PAGE_SIZE, (currentPage - 1) * PAGE_SIZE],
  )
  const quotes = rows.map(
    (
      row,
    ): AdminQuote & {
      replies: Array<QuoteReply>
      productName: string | null
    } => ({
      ...row.request,
      ...receipt(row.id, row.request),
      createdAt: row.created_at.toISOString(),
      status: row.status,
      allocations: row.allocations,
      version: row.version,
      replies: row.replies,
      productName: row.productName,
    }),
  )
  return { quotes, total, page: currentPage, pages }
}

export async function getBuyerQuotes(email: string) {
  const { rows } = await database().query<
    Pick<QuoteRow, 'id' | 'request' | 'status'> & { replies: Array<QuoteReply> }
  >(
    `SELECT q.id, q.request, q.status, ${QUOTE_REPLIES}
     FROM quotes q WHERE q.buyer_email = $1 ORDER BY q.created_at DESC, q.id DESC`,
    [email],
  )
  return rows.map(({ id, request, status, replies }) => ({
    ...receipt(id, request),
    status,
    replies,
  }))
}

export async function getArtisanQuotes(workshopId: string) {
  const { rows } = await database().query<
    QuoteRow & { reply: QuoteReply | null; productName: string | null }
  >(
    `SELECT q.id, q.request, q.status, q.allocations, p.name AS "productName",
       (SELECT to_jsonb(reply) FROM (
         SELECT ${REPLY_FIELDS} FROM artisan_quote_replies r
         JOIN artisan_workshops w ON w.id = r.workshop_id
         WHERE r.quote_id = q.id AND r.workshop_id = $1
       ) reply) AS reply
     FROM quotes q LEFT JOIN artisan_products p ON p.id::text = q.request->>'productId'
     WHERE q.allocations @> $2::jsonb ORDER BY q.created_at DESC, q.id DESC`,
    [workshopId, JSON.stringify([{ workshopId }])],
  )
  return rows.map<ArtisanQuote>((row) => ({
    ...receipt(row.id, row.request),
    status: row.status,
    budget: row.request.budget,
    customization: row.request.customization,
    productName:
      row.productName ?? getProduct(row.request.productId ?? '')?.name ?? null,
    allocatedQuantity: row.allocations.find(
      (item) => item.workshopId === workshopId,
    )!.quantity,
    reply: row.reply,
  }))
}

export async function updateQuote(value: unknown) {
  if (!record(value)) return 400
  const { id, status, allocations, version } = value
  if (
    typeof id !== 'string' ||
    !UUID_V4.test(id) ||
    typeof status !== 'string' ||
    !Object.hasOwn(QUOTE_STATUSES, status) ||
    !Array.isArray(allocations) ||
    typeof version !== 'number' ||
    !Number.isSafeInteger(version) ||
    version < 0
  )
    return 400

  const seen = new Set<string>()
  const updated: Array<QuoteAllocation> = []
  let total = 0
  for (const entry of allocations as Array<unknown>) {
    if (
      !record(entry) ||
      typeof entry.workshopId !== 'string' ||
      (!getWorkshop(entry.workshopId) && !UUID_V4.test(entry.workshopId)) ||
      seen.has(entry.workshopId) ||
      typeof entry.quantity !== 'number' ||
      !Number.isSafeInteger(entry.quantity) ||
      entry.quantity < 1 ||
      entry.quantity > 1_000_000
    )
      return 400
    seen.add(entry.workshopId)
    total += entry.quantity
    updated.push({ workshopId: entry.workshopId, quantity: entry.quantity })
  }

  const db = database()
  const { rows } = await db.query<
    Pick<QuoteRow, 'request' | 'version' | 'allocations'>
  >('SELECT request, version, allocations FROM quotes WHERE id = $1', [id])
  const current = rows.at(0)
  if (!current) return 404
  if (current.version !== version) return 409
  if (total > current.request.quantity) return 422
  const currentQuantities = new Map(
    current.allocations.map(({ workshopId, quantity }) => [
      workshopId,
      quantity,
    ]),
  )
  const increased = updated
    .filter(
      ({ workshopId, quantity }) =>
        !getWorkshop(workshopId) &&
        quantity > (currentQuantities.get(workshopId) ?? 0),
    )
    .map(({ workshopId }) => workshopId)
  if (increased.length) {
    const approved = await db.query(
      `SELECT w.id FROM artisan_workshops w
       JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
       WHERE w.id::text = ANY($1::text[])`,
      [increased],
    )
    if (approved.rowCount !== increased.length) return 409
  }
  const result = await db.query(
    `UPDATE quotes SET status = $1, allocations = $2, version = version + 1
     WHERE id = $3 AND version = $4`,
    [status, JSON.stringify(updated), id, version],
  )
  return result.rowCount ? 200 : 409
}
