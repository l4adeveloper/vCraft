import { NOTICE_CATEGORIES } from '#/lib/community'
import { database } from './db'
import { cleanText, record, UUID_V4 } from './http'
import type { CommunityNotice } from '#/lib/community'

type NoticeRow = Omit<CommunityNotice, 'publishedAt'> & {
  published_at: Date | null
}

export async function getNotices(publicOnly: boolean) {
  const { rows } = await database().query<NoticeRow>(
    publicOnly
      ? `SELECT id, title, category, body, published_at, version FROM community_notices
         WHERE published_at IS NOT NULL ORDER BY published_at DESC, id`
      : `SELECT id, title, category, body, published_at, version FROM community_notices
         ORDER BY updated_at DESC, id`,
  )
  return rows.map(({ published_at, ...notice }) => ({
    ...notice,
    publishedAt: published_at?.toISOString() ?? null,
  }))
}

export function getAdminNotices() {
  return getNotices(false)
}

export async function saveNotice(value: unknown) {
  if (!record(value)) return 400
  const { id, category, published, version } = value
  const title = cleanText(value.title, 2, 160)
  const body = cleanText(value.body, 1, 3000)
  if (
    typeof id !== 'string' ||
    !UUID_V4.test(id) ||
    typeof category !== 'string' ||
    !Object.hasOwn(NOTICE_CATEGORIES, category) ||
    typeof published !== 'boolean' ||
    (version !== null &&
      (typeof version !== 'number' ||
        !Number.isSafeInteger(version) ||
        version < 0 ||
        version >= 2_147_483_647)) ||
    !title ||
    !body
  )
    return 400

  const db = database()
  const fields = [id, title, category, body, published]
  const result =
    version === null
      ? await db.query(
          `INSERT INTO community_notices (id, title, category, body, published_at)
         VALUES ($1, $2, $3, $4, CASE WHEN $5 THEN CURRENT_TIMESTAMP END)
         ON CONFLICT (id) DO NOTHING`,
          fields,
        )
      : await db.query(
          `UPDATE community_notices SET title = $2, category = $3, body = $4,
           published_at = CASE WHEN $5 THEN COALESCE(published_at, CURRENT_TIMESTAMP) END,
           updated_at = CURRENT_TIMESTAMP, version = version + 1
         WHERE id = $1 AND version = $6`,
          [...fields, version],
        )
  return result.rowCount ? 200 : 409
}
