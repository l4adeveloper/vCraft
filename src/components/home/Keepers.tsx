import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { Reveal } from '#/components/ui/Reveal'
import { SectionTitle } from '#/components/ui/SectionTitle'
import {
  artisans,
  getProductsByWorkshop,
  getWorkshop,
  visitStatusLabel,
} from '#/data'
import { cx, pad2 } from '#/lib/format'
import { DUR, EASE_OUT, IN_VIEW, STAGGER } from '#/lib/motion'
import { useReducedMotion } from '#/lib/motionPref'
import { useExplore } from '#/state/explore'
import type { Artisan } from '#/data'

/** Tác phẩm đại diện cho xưởng: ưu tiên tác phẩm có nhiều ảnh nhất. */
function signaturePiece(artisan: Artisan) {
  const pieces = getProductsByWorkshop(artisan.workshopId)
  return pieces.reduce<(typeof pieces)[number] | undefined>(
    (best, piece) =>
      !best || piece.images.length > best.images.length ? piece : best,
    undefined,
  )
}

/**
 * Mỗi nghệ nhân một thẻ: ảnh tác phẩm tiêu biểu, tên, câu nói, trạng thái
 * xưởng và hai thao tác rõ ràng. Trên điện thoại các thẻ xếp thành hàng vuốt
 * ngang để không phải cuộn dài.
 */
export function Keepers() {
  const { open, showOnMap } = useExplore()
  const reduced = useReducedMotion()

  return (
    <section className="keepers" id="nghe-nhan" aria-labelledby="keepers-title">
      <div className="shell">
        <header className="keepers__head">
          <SectionTitle
            id="keepers-title"
            eyebrow="Người giữ lửa"
            lines={[
              <>Sau mỗi dáng gốm</>,
              <>
                là <em>một người làm nghề.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="keepers__hint">
              Bốn xưởng, bốn cách giữ nghề. Mở hồ sơ để đọc câu chuyện, xem bộ
              sưu tập và thông tin tham quan.
            </p>
          </Reveal>
        </header>

        <motion.ul
          className="keepers__list"
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: STAGGER + 0.04 } },
          }}
        >
          {artisans.map((artisan, index) => {
            const workshop = getWorkshop(artisan.workshopId)
            const piece = signaturePiece(artisan)
            return (
              <motion.li
                key={artisan.id}
                data-reveal
                className="keeper"
                // Bấm đâu trên thẻ cũng mở hồ sơ; nút ở tên là điểm vào cho bàn phím.
                onClick={() => open({ type: 'artisan', id: artisan.id })}
                variants={{
                  hidden: { opacity: 0, y: 36 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: reduced
                      ? { duration: 0 }
                      : { duration: DUR.scene, ease: EASE_OUT },
                  },
                }}
              >
                <div className="keeper__visual">
                  {piece ? <Photo image={piece.images[0]} decorative /> : null}
                  <span className="keeper__no">{pad2(index + 1)}</span>
                  {workshop ? (
                    <span
                      className={cx(
                        'status',
                        'keeper__status',
                        `status--${workshop.visitStatus}`,
                      )}
                    >
                      {visitStatusLabel[workshop.visitStatus]}
                    </span>
                  ) : null}
                  <div className="keeper__title">
                    <h3 className="keeper__name">
                      <button type="button">{artisan.name}</button>
                    </h3>
                    <p>{workshop?.name}</p>
                  </div>
                  <span className="keeper__cue" aria-hidden="true">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                <div className="keeper__body">
                  <p className="keeper__role">
                    {artisan.role} · {artisan.yearsOfPractice} năm làm nghề
                  </p>
                  <p className="keeper__quote">“{artisan.quote}”</p>
                  <div className="keeper__actions">
                    <span className="keeper__open" aria-hidden="true">
                      Xem hồ sơ
                      <ArrowRight size={16} />
                    </span>
                    {workshop ? (
                      <button
                        type="button"
                        className="keeper__visit"
                        onClick={(event) => {
                          event.stopPropagation()
                          showOnMap(workshop.id)
                        }}
                      >
                        Ghé thăm xưởng
                      </button>
                    ) : null}
                  </div>
                </div>
              </motion.li>
            )
          })}
        </motion.ul>

        <p className="keepers__note">
          Hồ sơ minh họa: tên và câu chuyện được tạo để trình diễn. Ảnh trên thẻ
          là tác phẩm tiêu biểu của xưởng.
        </p>
      </div>
    </section>
  )
}
