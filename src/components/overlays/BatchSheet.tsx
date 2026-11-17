import { ArrowRight } from '#/components/ui/Icon'
import { Photo } from '#/components/ui/Photo'
import { getArtisan, getBatch, getProductsByBatch, getWorkshop } from '#/data'
import { daysBetween, formatDate, formatPrice, pad2 } from '#/lib/format'
import { useExplore } from '#/state/explore'
import { MissingSheet } from './MissingSheet'

/** Hồ sơ truy xuất nguồn gốc: một lô, một hồ sơ, dùng chung cho mọi tác phẩm. */
export function BatchSheet({ id }: { id: string }) {
  const { open } = useExplore()
  const batch = getBatch(id)
  if (!batch) return <MissingSheet what="hồ sơ lô sản xuất" />

  const workshop = getWorkshop(batch.workshopId)
  const artisan = workshop ? getArtisan(workshop.artisanId) : undefined
  const pieces = getProductsByBatch(batch.id)

  return (
    <article className="sheet">
      <header className="sheet__head">
        <p className="eyebrow">Hồ sơ truy xuất nguồn gốc</p>
        <h2 id="overlay-title" className="sheet__title">
          Lô {batch.code}
        </h2>
        <p className="sheet__summary">
          {workshop?.name} · {daysBetween(batch.startedAt, batch.finishedAt)}{' '}
          ngày từ nhào đất đến thành phẩm
        </p>
      </header>

      <p className="notice">
        <strong>Dữ liệu minh họa.</strong> Nhật ký này chưa qua xác minh của Ban
        quản lý làng nghề. Khi kết nối hệ thống, mỗi mốc sẽ kèm người ghi và
        thời điểm xác nhận.
      </p>

      <dl className="facts">
        <div>
          <dt>Xưởng sản xuất</dt>
          <dd>{workshop?.name ?? 'Chưa có thông tin'}</dd>
        </div>
        <div>
          <dt>Thời gian</dt>
          <dd>
            {formatDate(batch.startedAt)} – {formatDate(batch.finishedAt)}
          </dd>
        </div>
        <div>
          <dt>Số lượng</dt>
          <dd>{batch.pieceCount} cốt mộc vào lò</dd>
        </div>
        <div>
          <dt>Đất</dt>
          <dd>{batch.clay}</dd>
        </div>
        <div>
          <dt>Men</dt>
          <dd>{batch.glaze}</dd>
        </div>
        <div>
          <dt>Lò nung</dt>
          <dd>{batch.kiln}</dd>
        </div>
      </dl>

      <section className="sheet__section">
        <h3>Nhật ký sản xuất</h3>
        <ol className="log">
          {batch.steps.map((step, index) => (
            <li key={step.id}>
              <p className="log__time">
                {formatDate(step.date)} · {step.period}
              </p>
              <h4>
                <span>{pad2(index + 1)}</span>
                {step.title}
              </h4>
              <p>{step.description}</p>
              <p className="log__detail">
                {step.detail} · Ghi bởi: {step.by}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sheet__section">
        <h3>Tác phẩm cùng lô</h3>
        {pieces.length === 0 ? (
          <p className="empty">
            Chưa có tác phẩm nào của lô này trên triển lãm.
          </p>
        ) : (
          <ul className="mini-list">
            {pieces.map((product) => (
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

      {artisan ? (
        <div className="sheet__links">
          <button
            type="button"
            className="link-arrow"
            onClick={() => open({ type: 'artisan', id: artisan.id })}
          >
            Hồ sơ {artisan.name}
            <ArrowRight size={18} />
          </button>
        </div>
      ) : null}
    </article>
  )
}
