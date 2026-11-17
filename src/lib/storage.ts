import { useSyncExternalStore } from 'react'
import type { QuoteRequest } from '#/data/types'

/**
 * Lưu trữ cục bộ cho chế độ demo. Khi có backend, thay phần thân của
 * `saveQuoteRequest` bằng lời gọi API và giữ nguyên chữ ký hàm.
 */
const REQUESTS_KEY = 'vcraft:quote-requests:v1'
const DRAFT_KEY = 'vcraft:quote-draft:v1'

const EMPTY: Array<QuoteRequest> = []
let cache: Array<QuoteRequest> | null = null
const listeners = new Set<() => void>()

function readRequests(): Array<QuoteRequest> {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(REQUESTS_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    cache = Array.isArray(parsed) ? (parsed as Array<QuoteRequest>) : EMPTY
  } catch {
    cache = EMPTY
  }
  return cache
}

function writeRequests(next: Array<QuoteRequest>) {
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
export function useQuoteRequests(): Array<QuoteRequest> {
  return useSyncExternalStore(subscribe, readRequests, () => EMPTY)
}

export type QuoteInput = Omit<
  QuoteRequest,
  'id' | 'code' | 'createdAt' | 'status'
>

/** Ném lỗi nếu trình duyệt không cho ghi localStorage. */
export async function saveQuoteRequest(
  input: QuoteInput,
): Promise<QuoteRequest> {
  // Giả lập độ trễ mạng để giao diện có trạng thái "đang gửi".
  await new Promise((resolve) => window.setTimeout(resolve, 900))
  const now = new Date()
  const existing = readRequests()
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const request: QuoteRequest = {
    ...input,
    id: `yc-${now.getTime()}`,
    code: `YC-${stamp}-${String(existing.length + 1).padStart(2, '0')}`,
    createdAt: now.toISOString(),
    status: 'saved-locally',
  }
  writeRequests([request, ...existing])
  return request
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
