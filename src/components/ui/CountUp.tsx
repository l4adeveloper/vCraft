import { useEffect, useRef } from 'react'
import { animate, useInView } from 'motion/react'
import { formatNumber } from '#/lib/format'
import { EASE_OUT } from '#/lib/motion'
import { useReducedMotion } from '#/lib/motionPref'

/** Con số đếm lên khi cuộn tới. Không có JavaScript thì hiện sẵn giá trị cuối. */
export function CountUp({ value }: { value: number }) {
  const node = useRef<HTMLSpanElement>(null)
  const inView = useInView(node, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = node.current
    if (!inView || !el || reduced) return
    const controls = animate(0, value, {
      duration: 1.6,
      ease: EASE_OUT,
      onUpdate: (current) => {
        el.textContent = formatNumber(Math.round(current))
      },
    })
    return () => controls.stop()
  }, [inView, value, reduced])

  return <span ref={node}>{formatNumber(value)}</span>
}
