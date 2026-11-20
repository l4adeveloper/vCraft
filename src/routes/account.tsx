import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { SignOutButton } from '#/components/account/SignOutButton'
import { QuoteReplies } from '#/components/artisan/QuoteReplies'
import { QUOTE_STATUSES } from '#/data/types'
import { accountPage } from '#/lib/account'
import { formatDate, formatNumber } from '#/lib/format'
import { getBuyerDashboard } from '#/server/account'

export const Route = createFileRoute('/account')({
  loader: async () => {
    const { account, quotes } = await getBuyerDashboard()
    if (!account) throw redirect({ to: '/login', replace: true })
    if (account.role !== 'customer')
      throw redirect({ to: accountPage(account.role), replace: true })
    return { account, quotes }
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: () => ({
    meta: [
      { title: 'Tài khoản — vCraft' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Account,
})

function Account() {
  const {
    account: { displayName, email },
    quotes,
  } = Route.useLoaderData()
  return (
    <div className="account-panel">
      <Link to="/home" className="wordmark">
        vCraft
      </Link>
      <h1>Tài khoản của bạn</h1>
      <dl className="account-panel__details">
        <dt>Họ và tên</dt>
        <dd>{displayName}</dd>
        <dt>Email</dt>
        <dd>{email}</dd>
      </dl>
      <section
        className="account-quotes"
        aria-labelledby="account-quotes-heading"
      >
        <h2 id="account-quotes-heading">Yêu cầu báo giá của tôi</h2>
        {quotes.length ? (
          <div className="admin-quotes">
            {quotes.map((quote) => (
              <details className="admin-quote" key={quote.id}>
                <summary>
                  <span>
                    <strong>
                      {formatNumber(quote.quantity)} × {quote.productType}
                    </strong>
                    <span>Hạn giao {formatDate(quote.deadline)}</span>
                  </span>
                </summary>
                <div className="admin-quote__body">
                  <p className={`admin-status admin-status--${quote.status}`}>
                    {QUOTE_STATUSES[quote.status]}
                  </p>
                  <p>
                    Mã yêu cầu{' '}
                    <strong className="account-quote-code">{quote.code}</strong>
                  </p>
                  {quote.replies.length ? (
                    <QuoteReplies replies={quote.replies} />
                  ) : (
                    <p>Chưa có phản hồi từ xưởng.</p>
                  )}
                </div>
              </details>
            ))}
          </div>
        ) : (
          <p>Chưa có yêu cầu báo giá nào được gửi từ tài khoản này.</p>
        )}
      </section>
      <div className="account-panel__actions">
        <Link to="/home">Về trang triển lãm</Link>
        <SignOutButton />
      </div>
    </div>
  )
}
