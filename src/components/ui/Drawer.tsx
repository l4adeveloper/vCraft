import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { DUR, EASE_IN_OUT } from '#/lib/motion'
import { useDialogBehavior, useHydrated } from '#/lib/hooks'

interface DrawerProps {
  open: boolean
  onClose: () => void
  /** id của tiêu đề bên trong, dùng làm nhãn truy cập cho hộp thoại. */
  labelledBy: string
  children: ReactNode
}

/**
 * Tấm trượt từ mép phải. Mọi nội dung chi tiết (tác phẩm, nghệ nhân, lô sản
 * xuất, form báo giá) dùng chung tấm này để chuyển động mở/đóng nhất quán.
 */
export function Drawer({ open, onClose, labelledBy, children }: DrawerProps) {
  const hydrated = useHydrated()
  const panel = useRef<HTMLDivElement>(null)
  useDialogBehavior(open, panel, onClose)

  if (!hydrated) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="drawer" key="drawer">
          <motion.div
            className="drawer__backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.swap }}
          />
          <motion.div
            ref={panel}
            className="drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DUR.overlay, ease: EASE_IN_OUT }}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
