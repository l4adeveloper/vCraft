import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import {
  getArtisanProducts,
  getPublicArtisanProduct,
  getPublicArtisanProducts,
  getWorkshopProfile,
} from './artisan-store'
import { currentAccount } from './auth'
import { getArtisanInvitations, getArtisanQuotes } from './quotes'

export const getArtisanDashboard = createServerFn().handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store')
  const account = await currentAccount()
  if (account?.role !== 'artisan') return { role: account?.role ?? null }
  if (account.artisanStatus !== 'approved')
    return {
      role: 'artisan' as const,
      account,
      profile: null,
      products: [],
      quotes: [],
      invitations: [],
    }
  const [profile, invitations] = await Promise.all([
    getWorkshopProfile(account.email),
    getArtisanInvitations(account.email),
  ])
  const [products, quotes] = profile
    ? await Promise.all([
        getArtisanProducts(profile.id),
        getArtisanQuotes(profile.id),
      ])
    : [[], []]
  return {
    role: 'artisan' as const,
    account,
    profile,
    products,
    quotes,
    invitations,
  }
})

export const listPublishedProducts = createServerFn().handler(
  getPublicArtisanProducts,
)

export const readPublishedProduct = createServerFn()
  .validator((id: string) => (typeof id === 'string' ? id : ''))
  .handler(({ data }) => getPublicArtisanProduct(data))
