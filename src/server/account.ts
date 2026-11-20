import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { currentAccount } from './auth'
import { getBuyerQuotes } from './quotes'

export const getCurrentAccount = createServerFn().handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store')
  return await currentAccount()
})

export const getBuyerDashboard = createServerFn().handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store')
  const account = await currentAccount()
  const quotes =
    account?.role === 'customer' ? await getBuyerQuotes(account.email) : []
  return { account, quotes }
})
