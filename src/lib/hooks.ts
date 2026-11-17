import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { RefObject } from 'react'

const noop = () => () => {}

/** `false` khi render phía máy chủ và trong lượt hydrate đầu tiên. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', notify)
      return () => list.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function focusableIn(node: HTMLElement): Array<HTMLElement> {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  )
}

/**
 * Hành vi chung của drawer và menu mobile: khóa cuộn trang, giữ focus bên
 * trong, đóng bằng Escape và trả focus về nơi đã mở.
 */
export function useDialogBehavior(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
  options: { autoFocus?: boolean } = {},
) {
  const { autoFocus = true } = options
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const root = document.documentElement
    root.classList.add('is-locked')
    if (autoFocus) ref.current?.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close.current()
        return
      }
      if (event.key !== 'Tab') return
      const node = ref.current
      if (!node) return
      const items = focusableIn(node)
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (!node.contains(active)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      root.classList.remove('is-locked')
      previous?.focus({ preventScroll: true })
    }
  }, [open, ref, autoFocus])
}
