import { createServerFn } from '@tanstack/react-start'
import { getNotices } from './community-store'

export const getPublishedNotices = createServerFn().handler(async () => {
  const notices = await getNotices(true)
  return notices.map(({ id, title, body, category, publishedAt }) => ({
    id,
    title,
    body,
    category,
    publishedAt,
  }))
})
