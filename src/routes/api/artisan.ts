import { createFileRoute } from '@tanstack/react-router'
import {
  saveArtisanProduct,
  saveQuoteReply,
  saveWorkshopProfile,
} from '#/server/artisan-store'
import { currentAccount } from '#/server/auth'
import { isSameOrigin, readJson, record, reply } from '#/server/http'

export const Route = createFileRoute('/api/artisan')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        const account = await currentAccount()
        if (!account) return reply({}, 401)
        if (account.role !== 'artisan' || account.artisanStatus !== 'approved')
          return reply({}, 403)
        const input = await readJson(request)
        if (!record(input)) return reply({}, 400)

        const { action, data } = input
        switch (action) {
          case 'profile':
            return reply({}, await saveWorkshopProfile(account.email, data))
          case 'product':
            return reply({}, await saveArtisanProduct(account.email, data))
          case 'quote':
            return reply({}, await saveQuoteReply(account.email, data))
          default:
            return reply({}, 400)
        }
      },
    },
  },
})
