import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { PRODUCTION_STAGES } from '#/lib/artisan'
import { formatDate, formatPrice } from '#/lib/format'
import { readPublishedProduct } from '#/server/artisan'
import { useExplore } from '#/state/explore'
import { useSessionRole } from '#/state/session'
import './artisan-catalog.css'

export const Route = createFileRoute('/san-pham_/$id')({
  loader: async ({ params }) => {
    const product = await readPublishedProduct({ data: params.id })
    if (!product) throw notFound()
    return product
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} — vCraft`
          : 'Sản phẩm làng nghề — vCraft',
      },
    ],
  }),
  component: PublishedProduct,
})

function PublishedProduct() {
  const product = Route.useLoaderData()
  const { workshop } = product
  const { open } = useExplore()
  const isBuyer = useSessionRole() === 'customer'

  return (
    <article className="artisan-catalog shell">
      <header className="artisan-catalog__heading">
        <Link to="/san-pham">Sản phẩm làng nghề</Link>
      </header>
      <div className="published-product">
        <img
          className="published-product__photo"
          src={product.photoUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
        />
        <div className="published-product__intro">
          <p>{workshop.name}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>
            <strong>{formatPrice(product.price)}</strong> / sản phẩm
          </p>
          {isBuyer && (
            <button
              className="btn btn--primary"
              type="button"
              onClick={() =>
                open({
                  type: 'quote',
                  productId: product.id,
                  publishedProductName: product.name,
                })
              }
            >
              Yêu cầu báo giá mua sỉ
            </button>
          )}
        </div>
      </div>
      <div className="published-product__details">
        <section className="published-product__panel">
          <h2>Nhật ký sản xuất</h2>
          <p className="published-product__note">Nhật ký do xưởng cung cấp.</p>
          <ol className="published-product__timeline">
            {product.journal.map((entry, index) => (
              <li key={PRODUCTION_STAGES[index]}>
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <h3>{PRODUCTION_STAGES[index]}</h3>
                {entry.note && <p>{entry.note}</p>}
              </li>
            ))}
          </ol>
        </section>
        <section className="published-product__panel">
          <h2>Hồ sơ {workshop.name}</h2>
          <h3>Lịch sử gia đình và nghề</h3>
          <p>{workshop.history}</p>
          {workshop.photoUrls.length > 0 && (
            <div className="published-product__workshop-photos">
              {workshop.photoUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Ảnh xưởng ${workshop.name} (${index + 1})`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          )}
          {workshop.certificates && (
            <>
              <h3>Chứng nhận chất lượng</h3>
              <p className="published-product__note">
                Thông tin chứng nhận do xưởng cung cấp.
              </p>
              <p>{workshop.certificates}</p>
            </>
          )}
        </section>
      </div>
    </article>
  )
}
