export type SignupRole = 'customer' | 'artisan'

export type AccountRole = 'admin' | SignupRole

const accountPages = {
  admin: '/admin',
  artisan: '/artisan',
  customer: '/account',
} as const

export function accountPage(role: AccountRole) {
  return accountPages[role]
}

export const ARTISAN_STATUSES = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
} as const

export type ArtisanStatus = keyof typeof ARTISAN_STATUSES

export interface ArtisanRegistration {
  email: string
  displayName: string | null
  workshopName: string | null
  status: ArtisanStatus
}
