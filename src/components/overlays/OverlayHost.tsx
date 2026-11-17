import { AnimatePresence, motion } from 'motion/react'
import { Drawer } from '#/components/ui/Drawer'
import { ArrowLeft, Close } from '#/components/ui/Icon'
import { DUR, EASE_OUT } from '#/lib/motion'
import { overlayKey, useExplore } from '#/state/explore'
import { ArtisanSheet } from './ArtisanSheet'
import { BatchSheet } from './BatchSheet'
import { ProductSheet } from './ProductSheet'
import { QuoteSheet } from './QuoteSheet'
import type { Overlay } from '#/state/explore'

export const OVERLAY_TITLE_ID = 'overlay-title'

const KICKER: Record<Overlay['type'], string> = {
  product: 'Tác phẩm',
  artisan: 'Hồ sơ nghệ nhân',
  batch: 'Nguồn gốc theo lô',
  quote: 'Yêu cầu báo giá',
}

function Sheet({ overlay }: { overlay: Overlay }) {
  switch (overlay.type) {
    case 'product':
      return <ProductSheet id={overlay.id} />
    case 'artisan':
      return <ArtisanSheet id={overlay.id} />
    case 'batch':
      return <BatchSheet id={overlay.id} />
    case 'quote':
      return (
        <QuoteSheet productId={overlay.productId} preset={overlay.preset} />
      )
  }
}

/** Gắn một lần ở gốc ứng dụng; hiển thị overlay trên cùng của chồng. */
export function OverlayHost() {
  const { stack, back, close } = useExplore()
  const current = stack.at(-1)

  return (
    <Drawer
      open={Boolean(current)}
      onClose={close}
      labelledBy={OVERLAY_TITLE_ID}
    >
      {current ? (
        <>
          <div className="drawer__bar">
            {stack.length > 1 ? (
              <button type="button" className="drawer__back" onClick={back}>
                <ArrowLeft size={18} />
                Quay lại
              </button>
            ) : (
              <p className="eyebrow">{KICKER[current.type]}</p>
            )}
            <button
              type="button"
              className="icon-button"
              aria-label="Đóng"
              onClick={close}
            >
              <Close />
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={overlayKey(current)}
              className="drawer__body"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.swap * 0.75, ease: EASE_OUT }}
            >
              <Sheet overlay={current} />
            </motion.div>
          </AnimatePresence>
        </>
      ) : null}
    </Drawer>
  )
}
