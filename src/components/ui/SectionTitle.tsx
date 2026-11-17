import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { DUR, EASE_OUT, IN_VIEW, STAGGER } from '#/lib/motion'
import { useReducedMotion } from '#/lib/motionPref'
import { Reveal } from './Reveal'

interface SectionTitleProps {
  id: string
  eyebrow: string
  /** Mỗi phần tử là một dòng của tiêu đề; xuống dòng có chủ đích. */
  lines: Array<ReactNode>
}

/** Tiêu đề section: mỗi dòng trượt lên từ sau một khung che, dòng sau trễ hơn. */
export function SectionTitle({ id, eyebrow, lines }: SectionTitleProps) {
  const reduced = useReducedMotion()
  return (
    <div className="section-title">
      <Reveal y={12}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <motion.h2
        id={id}
        className="display"
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: STAGGER + 0.04 } },
        }}
      >
        {lines.map((line, index) => (
          <span className="display__line" key={index}>
            <motion.span
              data-reveal
              variants={{
                hidden: { y: '112%' },
                show: {
                  y: '0%',
                  transition: reduced
                    ? { duration: 0 }
                    : { duration: DUR.scene, ease: EASE_OUT },
                },
              }}
            >
              {line}
            </motion.span>{' '}
          </span>
        ))}
      </motion.h2>
    </div>
  )
}
