import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import type { CSSProperties, PointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Pause, Play } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { getProduct, heroSlides, photoUrl, tickerWords } from '#/data'
import { cx, pad2 } from '#/lib/format'
import { useHydrated } from '#/lib/hooks'
import { DUR, EASE_IN_OUT, EASE_OUT } from '#/lib/motion'
import { useReducedMotion } from '#/lib/motionPref'
import { useExplore } from '#/state/explore'

const line = (index: number) => ({ '--i': index }) as CSSProperties
const STRIPS = [0, 1, 2, 3, 4]

const slideVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
  // Cảnh cũ nằm yên bên dưới cho tới khi các lát của cảnh mới phủ kín.
  leave: { opacity: 0.99, transition: { duration: 1.4 } },
}
const stripVariants = {
  hidden: { y: '101%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EASE_IN_OUT } },
}

/**
 * Hero phủ kín màn hình. Cảnh tự chuyển theo năm lát dọc; thời lượng mỗi cảnh
 * do animation của thanh tiến trình (`.hero__dot-fill`, --hero-interval) quyết
 * định. Ảnh trôi nhẹ ngược hướng chuột. Chuyển động mở đầu chạy bằng CSS.
 */
export function Hero() {
  const { open } = useExplore()
  const root = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [engaged, setEngaged] = useState(false)
  const hydrated = useHydrated()
  const reduced = useReducedMotion()
  const inView = useInView(root, { amount: 0.35 })
  const running = hydrated && !reduced && !paused && !engaged && inView

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 60, damping: 18 })
  const smoothY = useSpring(pointerY, { stiffness: 60, damping: 18 })
  const mediaX = useTransform(smoothX, (value) => value * -18)
  const mediaY = useTransform(smoothY, (value) => value * -12)
  const titleX = useTransform(smoothX, (value) => value * 10)

  const slide = heroSlides[index]
  const piece = slide.productId ? getProduct(slide.productId) : undefined

  // Tải trước các cảnh sau để lúc chuyển không lộ nền trống.
  useEffect(() => {
    heroSlides.slice(1).forEach((item) => {
      const url = photoUrl(item.image.key)
      if (url) new Image().src = url
    })
  }, [])

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - box.left) / box.width - 0.5) * 2)
    pointerY.set(((event.clientY - box.top) / box.height - 0.5) * 2)
  }
  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }
  const next = () => setIndex((value) => (value + 1) % heroSlides.length)

  return (
    <>
      <section
        className="hero"
        ref={root}
        aria-labelledby="hero-title"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <motion.div className="hero__media" style={{ x: mediaX, y: mediaY }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={slide.id}
              className="hero__slide"
              style={{ '--focus': slide.focus } as CSSProperties}
              initial="hidden"
              animate="show"
              exit="leave"
              variants={slideVariants}
            >
              {STRIPS.map((strip) => (
                <div className="hero__strip" key={strip} style={line(strip)}>
                  <motion.div
                    className="hero__strip-inner"
                    variants={stripVariants}
                  >
                    <Photo
                      image={slide.image}
                      priority
                      decorative={strip !== 0}
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="hero__veil" aria-hidden="true" />

        <div className="hero__badge" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs>
              <path
                id="hero-badge-ring"
                d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"
              />
            </defs>
            <circle cx="60" cy="60" r="59" className="hero__badge-disc" />
            <text className="hero__badge-text">
              <textPath
                href="#hero-badge-ring"
                textLength="276"
                lengthAdjust="spacing"
              >
                TRIỂN LÃM SỐ · LÀNG GỐM BÁT TRÀNG ·
              </textPath>
            </text>
            <circle cx="60" cy="60" r="20" className="hero__badge-ring" />
            <circle cx="60" cy="60" r="3" className="hero__badge-dot" />
          </svg>
        </div>

        <div className="shell hero__content">
          <p className="eyebrow hero__eyebrow">
            Triển lãm số làng gốm Bát Tràng
          </p>
          <motion.h1
            id="hero-title"
            className="hero__title"
            style={{ x: titleX }}
          >
            <span className="line" style={line(0)}>
              <span>Từ đất làng,</span>
            </span>{' '}
            <span className="line line--join" style={line(1)}>
              <span>thành</span>
            </span>{' '}
            <span className="line line--join" style={line(2)}>
              <span>
                <em>câu chuyện.</em>
              </span>
            </span>
          </motion.h1>

          <div className="hero__row">
            <div className="hero__intro">
              <p className="hero__lead">
                Mỗi dáng gốm bắt đầu từ một nắm đất, đi qua bàn tay người thợ và
                một đêm lửa lò, rồi bước vào căn nhà hôm nay. vCraft mở cửa từng
                xưởng để bạn nghe trọn câu chuyện ấy.
              </p>
              <div className="hero__actions">
                <a className="btn btn--paper" href="#trien-lam">
                  Khám phá triển lãm
                  <ArrowRight />
                </a>
                <a className="btn btn--ghost" href="#nghe-nhan">
                  Gặp người làm gốm
                </a>
              </div>
            </div>

            <div
              className="hero__aside"
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setEngaged(true)
              }}
              onPointerLeave={() => setEngaged(false)}
              onFocus={() => setEngaged(true)}
              onBlur={() => setEngaged(false)}
            >
              <div
                className="hero__label"
                aria-live={running ? 'off' : 'polite'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={slide.id}
                    className="hero__label-body"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: DUR.swap * 0.7, ease: EASE_OUT }}
                  >
                    <p className="hero__label-no">N° {pad2(index + 1)}</p>
                    <div>
                      <p className="hero__label-name">{slide.title}</p>
                      <p>{slide.note} · hình minh họa</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                {piece ? (
                  <button
                    type="button"
                    className="link-arrow"
                    onClick={() => open({ type: 'product', id: piece.id })}
                  >
                    Xem tác phẩm
                    <ArrowUpRight size={18} />
                  </button>
                ) : (
                  <a className="link-arrow" href="#cau-chuyen">
                    Đọc câu chuyện làng nghề
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              <div className="hero__controls">
                <ol className="hero__dots">
                  {heroSlides.map((item, position) => {
                    const active = position === index
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={cx('hero__dot', active && 'is-active')}
                          aria-label={`Cảnh ${position + 1}: ${item.title}`}
                          aria-current={active ? 'true' : undefined}
                          onClick={() => setIndex(position)}
                        >
                          <span>{pad2(position + 1)}</span>
                          <i className="hero__dot-bar">
                            {active ? (
                              <b
                                key={index}
                                className={cx(
                                  'hero__dot-fill',
                                  running && 'is-running',
                                )}
                                onAnimationEnd={next}
                              />
                            ) : null}
                          </i>
                        </button>
                      </li>
                    )
                  })}
                </ol>
                <button
                  type="button"
                  className="icon-button hero__toggle"
                  aria-pressed={paused}
                  aria-label={
                    paused
                      ? 'Tiếp tục tự chuyển cảnh'
                      : 'Tạm dừng tự chuyển cảnh'
                  }
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <ul key={copy}>
              {tickerWords.map((word) => (
                <li key={word}>{word}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  )
}
