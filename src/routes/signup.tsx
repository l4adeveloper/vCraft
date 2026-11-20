import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthForm } from '#/components/account/AuthForm'
import { accountPage } from '#/lib/account'
import { getCurrentAccount } from '#/server/account'

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const account = await getCurrentAccount()
    if (account)
      throw redirect({
        to: accountPage(account.role),
        replace: true,
      })
  },
  head: () => ({
    meta: [
      { title: 'Đăng ký tài khoản — vCraft' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
})
