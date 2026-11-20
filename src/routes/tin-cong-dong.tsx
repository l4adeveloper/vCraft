import { Link, createFileRoute } from '@tanstack/react-router'
import { NOTICE_CATEGORIES } from '#/lib/community'
import { formatDate } from '#/lib/format'
import { vietnamCalendarDate } from '#/lib/quote'
import { getPublishedNotices } from '#/server/community'

export const Route = createFileRoute('/tin-cong-dong')({
  loader: () => getPublishedNotices(),
  head: () => ({ meta: [{ title: 'Tin cộng đồng — vCraft' }] }),
  component: CommunityNews,
})

function CommunityNews() {
  const notices = Route.useLoaderData()
  return (
    <div className="community-news shell">
      <header className="admin-heading">
        <Link to="/home">Về trang triển lãm</Link>
        <h1>Tin cộng đồng</h1>
      </header>
      {notices.length ? (
        <ul className="governance-list">
          {notices.map(({ id, title, category, body, publishedAt }) => (
            <li key={id}>
              <article className="community-notice">
                <div className="community-notice__meta">
                  <span>{NOTICE_CATEGORIES[category]}</span>
                  {publishedAt && (
                    <time dateTime={publishedAt}>
                      {formatDate(vietnamCalendarDate(new Date(publishedAt)))}
                    </time>
                  )}
                </div>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="notice">Chưa có thông báo cộng đồng.</p>
      )}
    </div>
  )
}
