import { createFileRoute } from '@tanstack/react-router'
import { signUp } from '#/server/auth'
import { isSameOrigin, readJson, record, reply } from '#/server/http'

export const Route = createFileRoute('/api/signup')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        const input = await readJson(request)
        if (!record(input)) return reply({}, 400)
        const { email, name, password, role } = input
        if (
          (role !== 'customer' && role !== 'artisan') ||
          typeof email !== 'string' ||
          email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
          email.includes('\0') ||
          typeof name !== 'string' ||
          name.trim().length < 2 ||
          name.trim().length > 100 ||
          name.includes('\0') ||
          typeof password !== 'string' ||
          [...password].length < 4 ||
          [...password].length > 128
        )
          return reply({}, 400)

        const result = await signUp(
          email.trim().toLowerCase(),
          name.trim(),
          password,
          role,
        )
        if (result === 'limited') return reply({}, 429)
        if (result === 'unavailable') return reply({}, 409)
        return reply({ ok: true }, 201)
      },
    },
  },
})
