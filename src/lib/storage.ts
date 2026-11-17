import { useSyncExternalStore } from 'react'
import type { QuoteInput, QuoteReceipt } from '#/data/types'

type LocalReceipt = QuoteReceipt & { status: 'sent' | 'saved-locally' }

const REQUESTS_KEY = 'vcraft:quote-requests:v1'
const DRAFT_KEY = 'vcraft:quote-draft:v1'

const EMPTY: Array<LocalReceipt> = []
let cache: Array<LocalReceipt> | null = null
const listeners = new Set<() => void>()

function readRequests(): Array<LocalReceipt> {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(REQUESTS_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed)
      ? (parsed as Array<LocalReceipt>).map(
          ({ id, code, quantity, productType, deadline, status }) => ({
            id,
            code,
            quantity,
            productType,
            deadline,
            status,
          }),
        )
      : EMPTY
  } catch {
    cache = EMPTY
  }
  return cache
}

function writeRequests(next: Array<LocalReceipt>) {
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(next))
  cache = next
  listeners.forEach((notify) => notify())
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  const onStorage = (event: StorageEvent) => {
    if (event.key === REQUESTS_KEY) {
      cache = null
      notify()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(notify)
    window.removeEventListener('storage', onStorage)
  }
}

/** Danh sách yêu cầu báo giá đã lưu trên thiết bị này, mới nhất trước. */
export function useQuoteRequests(): Array<LocalReceipt> {
  return useSyncExternalStore(subscribe, readRequests, () => EMPTY)
}

export async function saveQuoteRequest(
  id: string,
  input: QuoteInput,
): Promise<QuoteReceipt> {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, id }),
  })
  if (!response.ok) throw new Error('Không gửi được yêu cầu báo giá.')
  const receipt = (await response.json()) as QuoteReceipt
  try {
    cache = null
    writeRequests([
      { ...receipt, status: 'sent' },
      ...readRequests().filter((request) => request.id !== receipt.id),
    ])
  } catch {
    // Máy chủ đã nhận được yêu cầu dù trình duyệt không lưu được biên nhận.
  }
  return receipt
}

export function clearQuoteRequests() {
  try {
    writeRequests([])
  } catch {
    // Không ghi được thì giữ nguyên danh sách đang hiển thị.
  }
}

export function readDraft<T>(): Partial<T> | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export function writeDraft(value: unknown) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(value))
  } catch {
    // Bản nháp chỉ là tiện ích; bỏ qua khi không ghi được.
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY)
  } catch {
    // Như trên.
  }
}
