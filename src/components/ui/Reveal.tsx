import { motion } from 'motion/react'
import { useReducedMotion } from '#/lib/motionPref'
import type { ReactNode } from 'react'
import { DUR, EASE_IN_OUT, EASE_OUT, IN_VIEW } from '#/lib/motion'
import { cx } from '#/lib/format'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Quãng trượt lên, tính bằng px. */
  y?: number
}

const INSTANT = { duration: 0 }

/** Nội dung trượt nhẹ lên và hiện dần khi cuộn tới. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={
        reduced ? INSTANT : { duration: DUR.section, ease: EASE_OUT, delay }
      }
    >
      {children}
    </motion.div>
  )
}

/** Ảnh được hé lộ bằng mask từ dưới lên, đồng thời thu về đúng tỉ lệ. */
export function MaskReveal({
  children,
  className,
  delay = 0,
}: Omit<RevealProps, 'y'>) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      data-reveal
      className={cx('mask', className)}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={IN_VIEW}
      transition={
        reduced ? INSTANT : { duration: DUR.scene, ease: EASE_IN_OUT, delay }
      }
    >
      <motion.div
        data-reveal
        className="mask__inner"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={IN_VIEW}
        transition={
          reduced ? INSTANT : { duration: 1.4, ease: EASE_OUT, delay }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
