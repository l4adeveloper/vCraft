import { ARTISAN_STATUSES } from '#/lib/account'
import { database } from './db'
import { cleanText, record } from './http'

export async function reviewArtisan(value: unknown) {
  if (!record(value)) return 400
  const { status, previousStatus } = value
  const email = cleanText(value.email, 1, 254)
  if (
    !email ||
    (status !== 'approved' && status !== 'rejected') ||
    typeof previousStatus !== 'string' ||
    !Object.hasOwn(ARTISAN_STATUSES, previousStatus)
  )
    return 400

  const result = await database().query(
    `UPDATE accounts SET artisan_status = $2
     WHERE email = $1 AND role = 'artisan' AND artisan_status = $3`,
    [email, status, previousStatus],
  )
  return result.rowCount ? 200 : 409
}
