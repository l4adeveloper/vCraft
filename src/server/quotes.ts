import { getProduct, getWorkshop } from '#/data'
import { QUOTE_STATUSES } from '#/data/types'
import { BUDGETS, PRODUCT_TYPES, validate } from '#/lib/quote'
import { database } from './db'
import { record } from './http'
import type {
  AdminQuote,
  QuoteAllocation,
  QuoteInput,
  QuoteReceipt,
  QuoteStatus,
} from '#/data/types'

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const PAGE_SIZE = 25

type QuoteRow = {
  id: string
  created_at: Date
  request: QuoteInput
  status: QuoteStatus
  allocations: Array<QuoteAllocation>
  version: number
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

export async function createQuote(value: unknown) {
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
    !UUID.test(id) ||
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
      (typeof productId !== 'string' || !getProduct(productId)))
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
    productId,
  }
  const key = id.toLowerCase()
  const db = database()
  const existing = await db.query<Pick<QuoteRow, 'request'>>(
    'SELECT request FROM quotes WHERE id = $1',
    [key],
  )
  const stored = existing.rows.at(0)
  if (stored) return receipt(key, stored.request)

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
    `INSERT INTO quotes (id, request) VALUES ($1, $2)
     ON CONFLICT (id) DO NOTHING RETURNING request`,
    [key, input],
  )
  if (inserted.rowCount) return receipt(key, inserted.rows[0].request)

  const concurrent = await db.query<Pick<QuoteRow, 'request'>>(
    'SELECT request FROM quotes WHERE id = $1',
    [key],
  )
  return receipt(key, concurrent.rows[0].request)
}

export async function getQuotes(page: number) {
  const db = database()
  const count = await db.query<{ total: string }>(
    'SELECT COUNT(*) AS total FROM quotes',
  )
  const total = Number(count.rows[0].total)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.max(1, Math.min(page, pages))
  const { rows } = await db.query<QuoteRow>(
    'SELECT * FROM quotes ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2',
    [PAGE_SIZE, (currentPage - 1) * PAGE_SIZE],
  )
  const quotes = rows.map<AdminQuote>((row) => ({
    ...row.request,
    ...receipt(row.id, row.request),
    createdAt: row.created_at.toISOString(),
    status: row.status,
    allocations: row.allocations,
    version: row.version,
  }))
  return { quotes, total, page: currentPage, pages }
}

export async function updateQuote(value: unknown) {
  if (!record(value)) return 400
  const { id, status, allocations, version } = value
  if (
    typeof id !== 'string' ||
    !UUID.test(id) ||
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
      !getWorkshop(entry.workshopId) ||
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
  const { rows } = await db.query<Pick<QuoteRow, 'request' | 'version'>>(
    'SELECT request, version FROM quotes WHERE id = $1',
    [id],
  )
  const current = rows.at(0)
  if (!current) return 404
  if (current.version !== version) return 409
  if (total > current.request.quantity) return 422
  const result = await db.query(
    `UPDATE quotes SET status = $1, allocations = $2, version = version + 1
     WHERE id = $3 AND version = $4`,
    [status, JSON.stringify(updated), id, version],
  )
  return result.rowCount ? 200 : 409
}
