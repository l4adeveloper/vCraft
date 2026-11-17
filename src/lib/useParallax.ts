import { useScroll, useTransform } from 'motion/react'
import { useReducedMotion } from '#/lib/motionPref'
import type { MotionValue } from 'motion/react'
import type { RefObject } from 'react'
import { useMediaQuery } from './hooks'

/**
 * Parallax nhẹ theo cuộn. Trả về `undefined` trên màn hình hẹp hoặc khi người
 * dùng chọn giảm chuyển động, khi đó ảnh đứng yên.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  /** Quãng dịch tối đa mỗi phía, tính theo % chiều cao phần tử. */
  distance: number,
): MotionValue<string> | undefined {
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 48rem)')
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-distance}%`, `${distance}%`],
  )
  return reduced || !wide ? undefined : y
}
