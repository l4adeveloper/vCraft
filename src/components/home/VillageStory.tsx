import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { Reveal } from '#/components/ui/Reveal'
import { SectionTitle } from '#/components/ui/SectionTitle'
import { featuredBatchId, getBatch, panorama, storyChapters } from '#/data'
import { cx, pad2 } from '#/lib/format'
import { useParallax } from '#/lib/useParallax'
import { useExplore } from '#/state/explore'

/**
 * Bốn chất liệu kể chuyện, xếp thành bốn tấm ảnh trong một màn hình. Tấm đang
 * chọn mở rộng và hiện nội dung; rê chuột, bấm hoặc Tab tới đều chọn được.
 */
export function VillageStory() {
  const { open } = useExplore()
  const batch = getBatch(featuredBatchId)
  const [active, setActive] = useState(0)
  const band = useRef<HTMLElement>(null)
  const yBand = useParallax(band, 7)

  return (
    <section className="story" id="cau-chuyen" aria-labelledby="story-title">
      <div className="shell">
        <header className="story__head">
          <SectionTitle
            id="story-title"
            eyebrow="Câu chuyện làng nghề"
            lines={[
              <>Một dáng gốm được kể</>,
              <>
                bằng <em>bốn chất liệu.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="lead">
              Ở làng, người ta ít nói về kỹ thuật. Người ta nói về đất năm nay
              dẻo hay khô, về đôi tay đã quen vòng xoay, về mẻ lửa đêm qua và
              nước men vừa ra lò.
            </p>
          </Reveal>
        </header>

        <Reveal>
          <div className="materials">
            {storyChapters.map((chapter, index) => {
              const on = index === active
              return (
                <article
                  key={chapter.id}
                  className={cx('material', on && 'is-active')}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setActive(index)
                  }}
                >
                  <Photo image={chapter.image} className="material__photo" />
                  <div className="material__content">
                    <h3 className="material__head">
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={`material-${chapter.id}`}
                        onClick={() => setActive(index)}
                        onFocus={() => setActive(index)}
                      >
                        <span className="material__no">{pad2(index + 1)}</span>
                        <span className="material__word">{chapter.word}</span>
                      </button>
                    </h3>
                    <div
                      className="material__body"
                      id={`material-${chapter.id}`}
                      hidden={!on}
                    >
                      <p>{chapter.text}</p>
                      <p className="material__caption">
                        {chapter.image.caption} · hình minh họa
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Reveal>
        {batch ? (
          <Reveal className="story__trace">
            <p>
              Mỗi mẻ gốm trên vCraft có một nhật ký riêng: ngày nhào đất, người
              chuốt dáng, nhiệt độ lò và số tác phẩm đạt.
            </p>
            <button
              type="button"
              className="link-arrow"
              onClick={() => open({ type: 'batch', id: batch.id })}
            >
              Xem nhật ký lô {batch.code}
              <ArrowRight size={18} />
            </button>
          </Reveal>
        ) : null}
      </div>

      <figure className="story__band" ref={band}>
        <div className="story__band-frame">
          <motion.div className="story__band-move" style={{ y: yBand }}>
            <Photo image={panorama} />
          </motion.div>
        </div>
        <figcaption className="shell">
          <span>{panorama.caption}</span>
          <span>Hình minh họa</span>
        </figcaption>
      </figure>
    </section>
  )
}
