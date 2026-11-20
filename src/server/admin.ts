import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { currentAdmin } from './auth'
import { getAdminNotices } from './community-store'
import { database } from './db'
import { getQuoteWorkshops, getQuotes } from './quotes'
import type { ArtisanRegistration } from '#/lib/account'

export const getAdminDashboard = createServerFn()
  .validator((page: number) => (Number.isSafeInteger(page) ? page : 1))
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control', 'private, no-store')
    const admin = await currentAdmin()
    if (!admin) return null
    const [quotes, workshops, registrations, notices] = await Promise.all([
      getQuotes(data),
      getQuoteWorkshops(),
      database().query<ArtisanRegistration>(
        `SELECT a.email, a.display_name AS "displayName", a.artisan_status AS status,
                w.name AS "workshopName"
         FROM accounts a LEFT JOIN artisan_workshops w ON w.account_email = a.email
         WHERE a.role = 'artisan'
         ORDER BY CASE a.artisan_status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
                  a.display_name NULLS LAST, a.email`,
      ),
      getAdminNotices(),
    ])
    return {
      admin,
      ...quotes,
      workshops,
      registrations: registrations.rows,
      notices,
    }
  })
