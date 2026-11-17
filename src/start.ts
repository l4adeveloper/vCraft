import { createCsrfMiddleware, createStart } from '@tanstack/react-start'
import { isSameOrigin } from '#/server/http'

const csrf = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === 'serverFn',
  origin: (origin, { request }) => isSameOrigin(request, origin),
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrf],
}))
