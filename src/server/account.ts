import { createServerFn } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'
import { currentAccount } from './auth'

export const getCurrentAccount = createServerFn().handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store')
  return await currentAccount()
})
