import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { SignOutButton } from '#/components/account/SignOutButton'
import { getCurrentAccount } from '#/server/account'

export const Route = createFileRoute('/account')({
  loader: async () => {
    const account = await getCurrentAccount()
    if (!account) throw redirect({ to: '/login', replace: true })
    if (account.role === 'admin')
      throw redirect({ to: '/admin', replace: true })
    return account
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
  const { displayName, email } = Route.useLoaderData()
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
      <div className="account-panel__actions">
        <Link to="/home">Về trang triển lãm</Link>
        <SignOutButton />
      </div>
    </div>
  )
}
