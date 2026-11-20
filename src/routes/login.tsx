import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthForm } from '#/components/account/AuthForm'
import { accountPage } from '#/lib/account'
import { getCurrentAccount } from '#/server/account'

export const Route = createFileRoute('/login')({
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
      { title: 'Đăng nhập — vCraft' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: () => <AuthForm mode="login" />,
})
