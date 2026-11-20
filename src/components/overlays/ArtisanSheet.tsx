import { ArrowRight } from '#/components/ui/Icon'
import { Monogram } from '#/components/ui/Monogram'
import { Photo } from '#/components/ui/Photo'
import {
  DEMO_NOTICE,
  getArtisan,
  getBatchesByWorkshop,
  getProductsByWorkshop,
  getWorkshop,
  visitStatusLabel,
} from '#/data'
import { cx, formatDate, formatPrice } from '#/lib/format'
import { useExplore } from '#/state/explore'
import { useSessionRole } from '#/state/session'
import { MissingSheet } from './MissingSheet'

export function ArtisanSheet({ id }: { id: string }) {
  const { open, showOnMap } = useExplore()
  const isBuyer = useSessionRole() === 'customer'
  const artisan = getArtisan(id)
  if (!artisan) return <MissingSheet what="hồ sơ nghệ nhân" />

  const workshop = getWorkshop(artisan.workshopId)
  const collection = workshop ? getProductsByWorkshop(workshop.id) : []
  const batches = workshop ? getBatchesByWorkshop(workshop.id) : []

  return (
    <article className="sheet">
      <header className="artisan-head">
        <Monogram artisan={artisan} className="artisan-head__portrait" />
        <div>
          <p className="tag">Hồ sơ minh họa</p>
          <h2 id="overlay-title" className="sheet__title">
            {artisan.name}
          </h2>
          <p className="sheet__summary">
            {artisan.role}
            <br />
            {artisan.yearsOfPractice} năm làm nghề
            {workshop ? ` · ${workshop.name}` : ''}
          </p>
        </div>
      </header>

      <blockquote className="sheet__quote">“{artisan.quote}”</blockquote>

      <section className="sheet__section">
        <h3>Câu chuyện</h3>
        {artisan.story.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      {workshop ? (
        <figure className="sheet__figure">
          <Photo image={workshop.image} />
          <figcaption>{workshop.image.caption} · hình minh họa</figcaption>
        </figure>
      ) : null}

      <section className="sheet__section">
        <h3>Bộ sưu tập</h3>
        {collection.length === 0 ? (
          <p className="empty">Xưởng chưa đưa tác phẩm nào lên triển lãm.</p>
        ) : (
          <ul className="mini-list">
            {collection.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  className="mini"
                  onClick={() => open({ type: 'product', id: product.id })}
                >
                  <span className="mini__thumb">
                    <Photo image={product.images[0]} decorative />
                  </span>
                  <span className="mini__text">
                    <span className="mini__name">{product.name}</span>
                    <span>{product.glaze}</span>
                  </span>
                  <span className="mini__price">
                    {formatPrice(product.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {workshop ? (
        <section className="sheet__section sheet__panel">
          <h3>Thông tin tham quan</h3>
          <dl className="facts facts--plain">
            <div>
              <dt>Xưởng</dt>
              <dd>{workshop.name}</dd>
            </div>
            <div>
              <dt>Địa điểm</dt>
              <dd>{workshop.address}</dd>
            </div>
            <div>
              <dt>Giờ mở cửa</dt>
              <dd>{workshop.hours}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>
                <span
                  className={cx('status', `status--${workshop.visitStatus}`)}
                >
                  {visitStatusLabel[workshop.visitStatus]}
                </span>
              </dd>
            </div>
            <div>
              <dt>Hoạt động</dt>
              <dd>
                <ul className="plain-list">
                  {workshop.experiences.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="sheet__links">
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

      {batches.length > 0 ? (
        <section className="sheet__section">
          <h3>Nhật ký sản xuất</h3>
          <ul className="mini-list">
            {batches.map((batch) => (
              <li key={batch.id}>
                <button
                  type="button"
                  className="mini mini--text"
                  onClick={() => open({ type: 'batch', id: batch.id })}
                >
                  <span className="mini__text">
                    <span className="mini__name">Lô {batch.code}</span>
                    <span>
                      {formatDate(batch.startedAt)} –{' '}
                      {formatDate(batch.finishedAt)} · {batch.pieceCount} cốt
                      mộc
                    </span>
                  </span>
                  <ArrowRight size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="demo-note">{DEMO_NOTICE}</p>

      {isBuyer && (
        <div className="sheet__actions">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => open({ type: 'quote' })}
          >
            Đặt hàng theo yêu cầu
            <ArrowRight />
          </button>
        </div>
      )}
    </article>
  )
}
