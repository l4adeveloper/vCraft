import { createFileRoute } from '@tanstack/react-router'
import { currentAccount } from '#/server/auth'
import { isSameOrigin, readJson, reply } from '#/server/http'
import { actOnQuotation } from '#/server/quotation-actions'

export const Route = createFileRoute('/api/quotation')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        const account = await currentAccount()
        if (!account) return reply({}, 401)
        const { role, email, artisanStatus } = account
        if (
          role !== 'customer' &&
          !(role === 'artisan' && artisanStatus === 'approved')
        )
          return reply({}, 403)
        return reply(
          {},
          await actOnQuotation({ role, email }, await readJson(request)),
        )
      },
    },
  },
})
