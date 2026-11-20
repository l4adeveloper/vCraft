import { MAX_UNIT_PRICE, PRODUCTION_STAGES } from '#/lib/artisan'
import { isoDate, isValidDate } from '#/lib/quote'
import { database, withTransaction } from './db'
import { cleanText, record, UUID_V4 } from './http'
import type {
  ArtisanProduct,
  JournalEntry,
  PublicArtisanProduct,
  WorkshopProfile,
} from '#/lib/artisan'

const PROFILE_FIELDS =
  'id, name, history, photo_urls AS "photoUrls", certificates'
const PRODUCT_FIELDS =
  'id, name, description, price, photo_url AS "photoUrl", journal'

function imageUrl(value: unknown) {
  const text = cleanText(value, 1, 1024)
  if (!text || !/^https:\/\//i.test(text) || /[\s\\]/u.test(text)) return null
  try {
    const url = new URL(text)
    return url.protocol === 'https:' && !url.username && !url.password
      ? text
      : null
  } catch {
    return null
  }
}

function unitPrice(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= MAX_UNIT_PRICE
  )
}

export async function getWorkshopProfile(email: string) {
  const { rows } = await database().query<WorkshopProfile>(
    `SELECT ${PROFILE_FIELDS} FROM artisan_workshops WHERE account_email = $1`,
    [email],
  )
  return rows.at(0) ?? null
}

export async function getArtisanProducts(workshopId: string) {
  const { rows } = await database().query<ArtisanProduct>(
    `SELECT ${PRODUCT_FIELDS} FROM artisan_products
     WHERE workshop_id = $1 ORDER BY created_at DESC, id DESC`,
    [workshopId],
  )
  return rows
}

export async function getPublicArtisanProducts() {
  const { rows } = await database().query<
    Pick<ArtisanProduct, 'id' | 'name' | 'price' | 'photoUrl'> & {
      workshopName: string
    }
  >(
    `SELECT p.id, p.name, p.price, p.photo_url AS "photoUrl",
            w.name AS "workshopName"
     FROM artisan_products p JOIN artisan_workshops w ON w.id = p.workshop_id
     JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
     ORDER BY p.created_at DESC, p.id DESC`,
  )
  return rows
}

export async function getPublicArtisanProduct(id: string) {
  if (!UUID_V4.test(id)) return null
  const { rows } = await database().query<PublicArtisanProduct>(
    `SELECT p.id, p.name, p.description, p.price, p.photo_url AS "photoUrl", p.journal,
            jsonb_build_object('id', w.id, 'name', w.name, 'history', w.history,
              'photoUrls', w.photo_urls, 'certificates', w.certificates) AS workshop
     FROM artisan_products p JOIN artisan_workshops w ON w.id = p.workshop_id
     JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
     WHERE p.id = $1`,
    [id],
  )
  return rows.at(0) ?? null
}

export async function saveWorkshopProfile(email: string, value: unknown) {
  if (!record(value)) return 400
  const name = cleanText(value.name, 2, 120)
  const history = cleanText(value.history, 1, 2000)
  const certificates = cleanText(value.certificates, 0, 1200)
  if (
    !name ||
    !history ||
    certificates === null ||
    !Array.isArray(value.photoUrls) ||
    value.photoUrls.length > 4
  )
    return 400
  const photos = (value.photoUrls as Array<unknown>).map(imageUrl)
  if (photos.some((url) => url === null)) return 400

  const result = await database().query(
    `INSERT INTO artisan_workshops (id, account_email, name, history, photo_urls, certificates)
     SELECT $1::uuid, email, $3, $4, $5::text[], $6 FROM accounts
     WHERE email = $2 AND artisan_status = 'approved'
     ON CONFLICT (account_email) DO UPDATE SET name = EXCLUDED.name,
       history = EXCLUDED.history, photo_urls = EXCLUDED.photo_urls,
       certificates = EXCLUDED.certificates`,
    [crypto.randomUUID(), email, name, history, photos, certificates],
  )
  return result.rowCount ? 200 : 403
}

export async function saveArtisanProduct(email: string, value: unknown) {
  if (!record(value)) return 400
  const { id, price, journal } = value
  const name = cleanText(value.name, 2, 120)
  const description = cleanText(value.description, 1, 1200)
  const photoUrl = imageUrl(value.photoUrl)
  if (
    typeof id !== 'string' ||
    !UUID_V4.test(id) ||
    !unitPrice(price) ||
    !name ||
    !description ||
    !photoUrl ||
    !Array.isArray(journal) ||
    journal.length !== PRODUCTION_STAGES.length
  )
    return 400

  const entries: Array<JournalEntry> = []
  const today = isoDate(0)
  for (const entry of journal as Array<unknown>) {
    if (
      !record(entry) ||
      typeof entry.date !== 'string' ||
      !isValidDate(entry.date) ||
      entry.date < '0001-01-01' ||
      entry.date > today ||
      entry.date < (entries.at(-1)?.date ?? '')
    )
      return 400
    const note = cleanText(entry.note, 0, 400)
    if (note === null) return 400
    entries.push({ date: entry.date, note })
  }

  const result = await database().query(
    `INSERT INTO artisan_products (id, workshop_id, name, description, price, photo_url, journal)
     SELECT $1::uuid, w.id, $2, $3, $4::integer, $5, $6::jsonb FROM artisan_workshops w
     JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
     WHERE w.account_email = $7
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description,
       price = EXCLUDED.price, photo_url = EXCLUDED.photo_url, journal = EXCLUDED.journal
     WHERE artisan_products.workshop_id = EXCLUDED.workshop_id`,
    [id, name, description, price, photoUrl, JSON.stringify(entries), email],
  )
  return result.rowCount ? 200 : 403
}

export async function saveQuoteReply(email: string, value: unknown) {
  if (!record(value)) return 400
  const { id, unitPrice: price } = value
  const message = cleanText(value.message, 1, 1200)
  if (
    typeof id !== 'string' ||
    !UUID_V4.test(id) ||
    !message ||
    (price !== null && !unitPrice(price))
  )
    return 400

  return withTransaction(async (client) => {
    const { rows } = await client.query<{
      workshop_id: string
      status: string
      quantity: number
    }>(
      `SELECT w.id AS workshop_id, q.status, allocation.quantity FROM quotes q
       JOIN artisan_workshops w ON w.account_email = $2
       JOIN accounts a ON a.email = w.account_email AND a.artisan_status = 'approved'
       JOIN LATERAL jsonb_to_recordset(q.allocations) AS allocation("workshopId" text, quantity integer)
         ON allocation."workshopId" = w.id::text
       WHERE q.id = $1
       FOR UPDATE OF q`,
      [id, email],
    )
    const quote = rows.at(0)
    if (!quote) return 404
    if (quote.status === 'completed') return 409
    await client.query(
      `INSERT INTO artisan_quote_replies (quote_id, workshop_id, message, unit_price, quantity)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (quote_id, workshop_id) DO UPDATE SET message = EXCLUDED.message,
         unit_price = EXCLUDED.unit_price, quantity = EXCLUDED.quantity,
         updated_at = CURRENT_TIMESTAMP`,
      [id, quote.workshop_id, message, price, quote.quantity],
    )
    return 200
  })
}
