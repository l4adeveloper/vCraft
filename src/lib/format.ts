const priceFormat = new Intl.NumberFormat('vi-VN')

export function formatPrice(value: number): string {
  return `${priceFormat.format(value)} ₫`
}

export function formatNumber(value: number): string {
  return priceFormat.format(value)
}

/** "2026-11-06" → "06/11/2026". Không dùng Date để tránh lệch múi giờ. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

export function daysBetween(startIso: string, endIso: string): number {
  const start = Date.parse(`${startIso}T00:00:00Z`)
  const end = Date.parse(`${endIso}T00:00:00Z`)
  return Math.round((end - start) / 86_400_000) + 1
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
