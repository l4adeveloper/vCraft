import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'

export type Overlay =
  | { type: 'product'; id: string }
  | { type: 'artisan'; id: string }
  | { type: 'batch'; id: string }
  | {
      type: 'quote'
      productId?: string
      publishedProductName?: string
      preset?: 'example'
    }

interface ExploreValue {
  /** Chồng overlay: phần tử cuối là nội dung đang hiển thị trong drawer. */
  stack: Array<Overlay>
  open: (overlay: Overlay) => void
  back: () => void
  close: () => void
  selectedWorkshopId: string | null
  selectWorkshop: (id: string | null) => void
  /** Đóng drawer, chọn xưởng và cuộn tới bản đồ. */
  showOnMap: (id: string) => void
}

const ExploreContext = createContext<ExploreValue | null>(null)

export function overlayKey(overlay: Overlay): string {
  if (overlay.type === 'quote') {
    return `quote:${overlay.productId ?? ''}:${overlay.preset ?? ''}`
  }
  return `${overlay.type}:${overlay.id}`
}

export function ExploreProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Array<Overlay>>([])
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(
    null,
  )

  const open = useCallback((overlay: Overlay) => {
    setStack((current) => {
      const top = current.at(-1)
      if (top && overlayKey(top) === overlayKey(overlay)) return current
      return [...current, overlay]
    })
  }, [])
  const back = useCallback(
    () => setStack((current) => current.slice(0, -1)),
    [],
  )
  const close = useCallback(() => setStack([]), [])
  const showOnMap = useCallback((id: string) => {
    setStack([])
    setSelectedWorkshopId(id)
    // Chờ drawer mở khóa cuộn rồi mới đưa bản đồ vào tầm nhìn.
    window.setTimeout(() => {
      document.getElementById('ban-do')?.scrollIntoView({ block: 'start' })
    }, 80)
  }, [])

  const value = useMemo<ExploreValue>(
    () => ({
      stack,
      open,
      back,
      close,
      selectedWorkshopId,
      selectWorkshop: setSelectedWorkshopId,
      showOnMap,
    }),
    [stack, open, back, close, selectedWorkshopId, showOnMap],
  )

  return (
    <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>
  )
}

export function useExplore(): ExploreValue {
  const value = useContext(ExploreContext)
  if (!value) throw new Error('useExplore phải nằm trong ExploreProvider')
  return value
}
