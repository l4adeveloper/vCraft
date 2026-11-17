import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { currentAdmin } from './auth'
import { getQuotes } from './quotes'

export const getAdminDashboard = createServerFn()
  .validator((page: number) => (Number.isSafeInteger(page) ? page : 1))
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control', 'private, no-store')
    const admin = await currentAdmin()
    return admin ? { admin, ...(await getQuotes(data)) } : null
  })
