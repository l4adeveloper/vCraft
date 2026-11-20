import { createFileRoute } from '@tanstack/react-router'
import { currentAccount, currentAdmin } from '#/server/auth'
import { isSameOrigin, readJson, reply } from '#/server/http'
import { createQuote, updateQuote } from '#/server/quotes'

export const Route = createFileRoute('/api/quotes')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        const account = await currentAccount()
        if (!account) return reply({}, 401)
        if (account.role !== 'customer') return reply({}, 403)
        const result = await createQuote(await readJson(request), account.email)
        return result ? reply(result, 201) : reply({}, 400)
      },
      PATCH: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        if (!(await currentAdmin())) return reply({}, 401)
        const result = await updateQuote(await readJson(request))
        return reply({ ok: result === 200 }, result)
      },
    },
  },
})
