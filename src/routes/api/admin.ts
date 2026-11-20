import { createFileRoute } from '@tanstack/react-router'
import { reviewArtisan } from '#/server/moderation'
import { currentAdmin } from '#/server/auth'
import { saveNotice } from '#/server/community-store'
import { isSameOrigin, readJson, record, reply } from '#/server/http'

export const Route = createFileRoute('/api/admin')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request)) return reply({}, 403)
        if (!(await currentAdmin())) return reply({}, 403)
        const input = await readJson(request)
        if (!record(input)) return reply({}, 400)

        switch (input.action) {
          case 'review-artisan':
            return reply({}, await reviewArtisan(input.data))
          case 'save-notice':
            return reply({}, await saveNotice(input.data))
          default:
            return reply({}, 400)
        }
      },
    },
  },
})
