import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import {
  DEMO_NOTICE,
  categoryLabel,
  getArtisan,
  getBatch,
  getProduct,
  getProductsByBatch,
  getWorkshop,
  products,
} from '#/data'
import { cx, formatDate, formatPrice, pad2 } from '#/lib/format'
import { DUR, EASE_OUT } from '#/lib/motion'
import { useExplore } from '#/state/explore'
import { MissingSheet } from './MissingSheet'

export function ProductSheet({ id }: { id: string }) {
  const { open, showOnMap } = useExplore()
  const [active, setActive] = useState(0)
  const product = getProduct(id)
  if (!product) return <MissingSheet what="tác phẩm" />

  const workshop = getWorkshop(product.workshopId)
  const artisan = workshop ? getArtisan(workshop.artisanId) : undefined
  const batch = getBatch(product.batchId)
  const siblings = getProductsByBatch(product.batchId).length - 1
  const gallery = workshop
    ? [...product.images, workshop.image]
    : product.images
  const shown = gallery[Math.min(active, gallery.length - 1)]
  const main = product.images[0]

  return (
    <article className="sheet">
      <div className="gallery">
        <div
          className="gallery__stage"
          style={{ aspectRatio: `${main.width} / ${main.height}` }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={shown.key}
              className="gallery__slide"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.swap, ease: EASE_OUT }}
            >
              <Photo image={shown} priority />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="gallery__caption">
          {shown.caption ?? product.name} · hình minh họa
        </p>
        {gallery.length > 1 ? (
          <ul className="gallery__thumbs" aria-label="Ảnh của tác phẩm">
            {gallery.map((item, index) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={cx(index === active && 'is-active')}
                  aria-label={`Ảnh ${index + 1}: ${item.caption ?? item.alt}`}
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                >
                  <Photo image={item} decorative />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <header className="sheet__head">
        <p className="eyebrow">
          N° {pad2(products.indexOf(product) + 1)} ·{' '}
          {categoryLabel[product.category]}
        </p>
        <h2 id="overlay-title" className="sheet__title">
          {product.name}
        </h2>
        <p className="sheet__summary">{product.summary}</p>
        <p className="sheet__price">
          <span>Giá tham khảo</span>
          <strong>{formatPrice(product.price)}</strong>
          <span>/ {product.unit}</span>
        </p>
      </header>

      <dl className="facts">
        <div>
          <dt>Xưởng</dt>
          <dd>{workshop?.name ?? 'Chưa có thông tin'}</dd>
        </div>
        <div>
          <dt>Loại men</dt>
          <dd>{product.glaze}</dd>
        </div>
        <div>
          <dt>Chất liệu</dt>
          <dd>{product.material}</dd>
        </div>
        <div>
          <dt>Kích thước</dt>
          <dd>{product.dimensions}</dd>
        </div>
        <div>
          <dt>Mã lô</dt>
          <dd>{batch?.code ?? 'Chưa có mã lô'}</dd>
        </div>
      </dl>

      <section className="sheet__section">
        <h3>Câu chuyện tác phẩm</h3>
        {product.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {workshop ? (
        <section className="sheet__section sheet__panel">
          <h3>{workshop.name}</h3>
          <p>
            {workshop.tagline}.
            {artisan ? ` ${artisan.name} – ${artisan.role.toLowerCase()}.` : ''}
          </p>
          <div className="sheet__links">
            {artisan ? (
              <button
                type="button"
                className="link-arrow"
                onClick={() => open({ type: 'artisan', id: artisan.id })}
              >
                Hồ sơ nghệ nhân
                <ArrowRight size={18} />
              </button>
            ) : null}
            <button
              type="button"
              className="link-arrow"
              onClick={() => showOnMap(workshop.id)}
            >
              Xem xưởng trên bản đồ
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      ) : null}

      {batch ? (
        <section className="sheet__section sheet__panel">
          <h3>Nguồn gốc theo lô {batch.code}</h3>
          <p>
            Hoàn thành ngày {formatDate(batch.finishedAt)}
            {siblings > 0
              ? `, cùng lô với ${siblings} tác phẩm khác trên triển lãm.`
              : '.'}{' '}
            Mọi tác phẩm cùng lô dùng chung một hồ sơ nguồn gốc.
          </p>
          <div className="sheet__links">
            <button
              type="button"
              className="link-arrow"
              onClick={() => open({ type: 'batch', id: batch.id })}
            >
              Xem nguồn gốc sản phẩm
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      ) : null}

      <p className="demo-note">{DEMO_NOTICE}</p>

      <div className="sheet__actions">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={() => open({ type: 'quote', productId: product.id })}
        >
          Hỏi mua sản phẩm
          <ArrowRight />
        </button>
      </div>
    </article>
  )
}
