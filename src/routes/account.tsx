import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { SignOutButton } from '#/components/account/SignOutButton'
import { BuyerQuotation } from '#/components/quotation/QuotationCards'
import { accountPage } from '#/lib/account'
import { getBuyerDashboard } from '#/server/account'
import { useExplore } from '#/state/explore'
import { useSessionRole } from '#/state/session'

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
  const { open } = useExplore()
  const role = useSessionRole()
  return (
    <div className="account-panel account-panel--buyer">
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
        <div className="quotation-card__heading">
          <h2 id="account-quotes-heading">Yêu cầu báo giá của tôi</h2>
          <button
            className="btn btn--primary btn--small"
            type="button"
            disabled={role !== 'customer'}
            onClick={() => open({ type: 'quote' })}
          >
            Soạn yêu cầu báo giá
          </button>
        </div>
        {quotes.length ? (
          <div className="admin-quotes">
            {quotes.map((quote) => (
              <BuyerQuotation key={quote.id} quote={quote} />
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
