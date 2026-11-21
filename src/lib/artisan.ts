import type { QuoteReceipt, QuoteStatus } from '#/data/types'

export const PRODUCTION_STAGES = [
  'Nhào đất',
  'Vuốt tạo hình',
  'Nung gốm',
  'Hoàn thiện',
] as const

export const MAX_UNIT_PRICE = 1_000_000_000
export const MAX_WORKSHOP_PHOTOS = 4
export const MAX_IMAGE_URL_LENGTH = 1024

export function parseHttpsImageUrl(value: unknown) {
  if (typeof value !== 'string' || /\0|\p{Surrogate}/u.test(value)) return null
  const text = value.trim()
  if (
    text.length > MAX_IMAGE_URL_LENGTH ||
    !/^https:\/\//i.test(text) ||
    /[\s\\]/u.test(text)
  )
    return null
  try {
    const url = new URL(text)
    return url.protocol === 'https:' && !url.username && !url.password
      ? text
      : null
  } catch {
    return null
  }
}

export interface WorkshopProfile {
  id: string
  name: string
  history: string
  photoUrls: Array<string>
  certificates: string
}

export interface JournalEntry {
  date: string
  note: string
}

export interface ArtisanProduct {
  id: string
  name: string
  description: string
  price: number
  photoUrl: string
  journal: Array<JournalEntry>
}

export interface PublicArtisanProduct extends ArtisanProduct {
  workshop: WorkshopProfile
}

export interface QuoteReply {
  workshopId: string
  workshopName: string
  message: string
  unitPrice: number | null
  quantity: number
}

export interface ArtisanQuote extends QuoteReceipt {
  budget: string
  customization: string
  productName: string | null
  status: QuoteStatus
  allocatedQuantity: number
  reply: QuoteReply | null
}
