import { Link, createFileRoute } from '@tanstack/react-router'
import { formatPrice } from '#/lib/format'
import { listPublishedProducts } from '#/server/artisan'
import './artisan-catalog.css'

export const Route = createFileRoute('/san-pham')({
  loader: () => listPublishedProducts(),
  head: () => ({ meta: [{ title: 'Sản phẩm làng nghề — vCraft' }] }),
  component: ArtisanCatalog,
})

function ArtisanCatalog() {
  const products = Route.useLoaderData()
  return (
    <div className="artisan-catalog shell">
      <header className="artisan-catalog__heading">
        <Link to="/home" hash="trien-lam">
          Triển lãm
        </Link>
        <h1>Sản phẩm làng nghề</h1>
      </header>
      {products.length ? (
        <ul className="artisan-catalog__grid">
          {products.map((product) => (
            <li key={product.id}>
              <Link to="/san-pham/$id" params={{ id: product.id }}>
                <img
                  src={product.photoUrl}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2>{product.name}</h2>
                  <p>{product.workshopName}</p>
                  <strong>{formatPrice(product.price)}</strong>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="notice">Chưa có sản phẩm nào được đăng.</p>
      )}
    </div>
  )
}
