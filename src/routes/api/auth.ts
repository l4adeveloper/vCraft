import { createFileRoute } from '@tanstack/react-router'
import { currentAccount, signIn, signOut } from '#/server/auth'
import { isSameOrigin, readJson, record, reply } from '#/server/http'

export const Route = createFileRoute('/api/auth')({
  server: {
    handlers: {
      GET: async () => {
        const account = await currentAccount()
        return reply({ role: account?.role ?? null })
      },
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        const input = await readJson(request)
        if (
          !record(input) ||
          typeof input.email !== 'string' ||
          input.email.length > 254 ||
          input.email.includes('\0') ||
          typeof input.password !== 'string' ||
          !input.password ||
          Buffer.byteLength(input.password) > 128
        )
          return reply({}, 400)

        const result = await signIn(
          input.email.trim().toLowerCase(),
          input.password,
        )
        if (result === 'limited') return reply({}, 429)
        if (result === 'invalid') return reply({}, 401)
        return reply({ ok: true, role: result })
      },
      DELETE: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        await signOut()
        return reply({ ok: true })
      },
    },
  },
})
