import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { MaskReveal, Reveal } from '#/components/ui/Reveal'
import { SectionTitle } from '#/components/ui/SectionTitle'
import { categoryFilters, getWorkshop, products, workshops } from '#/data'
import { cx, formatPrice, pad2 } from '#/lib/format'
import { DUR, EASE_OUT } from '#/lib/motion'
import { useExplore } from '#/state/explore'
import type { CategoryFilter, Product } from '#/data'

const itemTransition = { duration: DUR.swap + 0.1, ease: EASE_OUT }

/**
 * Lưới trưng bày: mọi ô đều vuông và bằng nhau; khi xem "Tất cả", tác phẩm đầu
 * tiên chiếm ô lớn 2 × 2 làm tâm điểm.
 */
export function Exhibition() {
  const [filter, setFilter] = useState<CategoryFilter>('all')

  const visible = useMemo(
    () =>
      filter === 'all'
        ? products
        : products.filter((product) => product.category === filter),
    [filter],
  )

  const countFor = (id: CategoryFilter) =>
    id === 'all'
      ? products.length
      : products.filter((product) => product.category === id).length

  return (
    <section className="exhibit" id="trien-lam" aria-labelledby="exhibit-title">
      <div className="shell">
        <header className="exhibit__head">
          <SectionTitle
            id="exhibit-title"
            eyebrow="Triển lãm"
            lines={[
              <>Phòng trưng bày</>,
              <>
                <em>mùa lửa này.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1} className="exhibit__intro">
            <p>
              {products.length} tác phẩm mẫu từ {workshops.length} xưởng. Chọn
              một dáng gốm để xem câu chuyện, nơi làm ra nó và mã lô sản xuất.
            </p>
          </Reveal>
        </header>

        <div
          className="filters"
          role="group"
          aria-label="Lọc tác phẩm theo nhóm"
        >
          {categoryFilters.map((item) => {
            const active = item.id === filter
            return (
              <button
                key={item.id}
                type="button"
                className={cx('filter', active && 'is-active')}
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <sup>{pad2(countFor(item.id))}</sup>
                {active ? (
                  <motion.span
                    layoutId="filter-mark"
                    className="filter__mark"
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  />
                ) : null}
              </button>
            )
          })}
        </div>
        <p className="sr-only" role="status">
          Đang hiển thị {visible.length} tác phẩm.
        </p>

        {visible.length === 0 ? (
          <p className="empty">
            Chưa có tác phẩm nào trong nhóm này.{' '}
            <button
              type="button"
              className="text-button"
              onClick={() => setFilter('all')}
            >
              Xem tất cả
            </button>
          </p>
        ) : (
          <ul className="pieces">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((product, position) => (
                <motion.li
                  key={product.id}
                  layout="position"
                  className={cx(
                    'piece',
                    filter === 'all' && position === 0 && 'piece--feature',
                  )}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={itemTransition}
                >
                  <PieceCard
                    product={product}
                    number={products.indexOf(product) + 1}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        <div className="exhibit__foot">
          <p className="exhibit__note">
            Bộ sưu tập mẫu · ảnh và giá tham khảo là dữ liệu minh họa, chưa phải
            sản phẩm đang chào bán.
          </p>
          <a className="link-arrow" href="#dat-hang">
            Cần số lượng lớn hoặc in logo riêng?
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}

function PieceCard({ product, number }: { product: Product; number: number }) {
  const { open } = useExplore()
  const workshop = getWorkshop(product.workshopId)
  const [main, hover] = product.images
  const hasHover = product.images.length > 1

  return (
    <article className={cx('piece__card', hasHover && 'piece__card--swap')}>
      <div className="piece__frame">
        <MaskReveal>
          <Photo image={main} />
        </MaskReveal>
        {hasHover ? (
          <Photo image={hover} className="piece__hover" decorative />
        ) : null}
        <span className="piece__cue" aria-hidden="true">
          Xem tác phẩm
          <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="piece__meta">
        <p className="piece__no">N° {pad2(number)}</p>
        <h3 className="piece__name">
          <button
            type="button"
            className="piece__open"
            onClick={() => open({ type: 'product', id: product.id })}
          >
            {product.name}
          </button>
        </h3>
        <p className="piece__sub">
          {workshop?.name} · {product.glaze}
        </p>
        <p className="piece__price">
          <span>Giá tham khảo</span> {formatPrice(product.price)}
        </p>
      </div>
    </article>
  )
}
