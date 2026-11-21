import type { QuoteInput, QuoteReceipt } from '#/data/types'

export const QUOTATION_STATES = {
  draft: 'Bản nháp',
  sent: 'Đã gửi đến xưởng',
  bidding: 'Đang nhận chào giá',
  accepted: 'Khách đã chấp nhận',
  'in-production': 'Đang sản xuất',
  delivered: 'Đã giao hàng',
} as const

export type QuotationState = Exclude<keyof typeof QUOTATION_STATES, 'draft'>

export function canBid(state: QuotationState) {
  return state === 'sent' || state === 'bidding'
}

export type QuoteSubmission = QuoteInput & {
  targetUnitPrice: number
}

export interface WorkshopOffer {
  invitationId: string
  artisanName: string
  unitPrice: number
  completionDate: string
  version: number
  available: boolean
}

export interface DirectQuote {
  state: QuotationState
  acceptedInvitationId: string | null
  offers: Array<WorkshopOffer>
  sentCount: number
  declinedCount: number
}

export interface ArtisanInvitation extends QuoteReceipt {
  state: QuotationState
  selected: boolean
  response: 'pending' | 'offered' | 'declined'
  unitPrice: number | null
  completionDate: string | null
  targetUnitPrice: number
  hidden: boolean
  version: number
  customization: string
  productName: string | null
}

export type QuotationAction =
  | { action: 'delete'; id: string }
  | { action: 'choose'; id: string; invitationId: string; version: number }
  | {
      action: 'offer'
      id: string
      unitPrice: number
      completionDate: string
      version: number
    }
  | { action: 'decline' | 'restore' | 'hide'; id: string; version: number }
  | { action: 'start' | 'deliver'; id: string }

export function validUnitPrice(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    value > 0 &&
    value <= 1_000_000_000
  )
}
