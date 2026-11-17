import { useState } from 'react'
import {
  Link,
  createFileRoute,
  redirect,
  useHydrated,
  useRouter,
} from '@tanstack/react-router'
import { SignOutButton } from '#/components/account/SignOutButton'
import { getProduct, workshops } from '#/data'
import { QUOTE_STATUSES } from '#/data/types'
import { formatDate, formatNumber } from '#/lib/format'
import { vietnamCalendarDate } from '#/lib/quote'
import { getAdminDashboard } from '#/server/admin'
import type { AdminQuote, QuoteStatus } from '#/data/types'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/admin')({
  validateSearch: (search: Record<string, unknown>): { page?: number } => ({
    page:
      typeof search.page === 'number' &&
      Number.isSafeInteger(search.page) &&
      search.page > 1
        ? search.page
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: async ({ deps }) => {
    const data = await getAdminDashboard({ data: deps.page })
    if (!data) throw redirect({ to: '/login', replace: true })
    return data
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: () => ({
    meta: [
      { title: 'Quản trị yêu cầu báo giá — vCraft' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminDashboard,
})

function AdminDashboard() {
  const { admin, quotes, total, page, pages } = Route.useLoaderData()
  return (
    <div className="admin-dashboard shell">
      <header className="admin-toolbar">
        <Link className="wordmark" to="/home">
          vCraft
        </Link>
        <div className="admin-toolbar__actions">
          <span>{admin.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="admin-heading">
        <h1>Yêu cầu báo giá</h1>
        <p>{formatNumber(total)} yêu cầu</p>
      </div>
      {quotes.length ? (
        <div className="admin-quotes">
          {quotes.map((quote) => (
            <QuoteDetails key={quote.id} quote={quote} />
          ))}
        </div>
      ) : (
        <p className="notice">Chưa có yêu cầu báo giá.</p>
      )}
      {pages > 1 && (
        <nav className="admin-pages" aria-label="Phân trang yêu cầu">
          {page > 1 && (
            <Link to="/admin" search={{ page: page - 1 }} preload={false}>
              Trang trước
            </Link>
          )}
          <span>
            Trang {page}/{pages}
          </span>
          {page < pages && (
            <Link to="/admin" search={{ page: page + 1 }} preload={false}>
              Trang sau
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}

function QuoteDetails({ quote }: { quote: AdminQuote }) {
  const product = quote.productId ? getProduct(quote.productId) : undefined
  const assigned = quote.allocations.reduce(
    (total, item) => total + item.quantity,
    0,
  )
  return (
    <details className="admin-quote">
      <summary>
        <span>
          <strong>
            {formatNumber(quote.quantity)} × {quote.productType}
          </strong>
          <span>
            {quote.name} · Hạn giao {formatDate(quote.deadline)}
          </span>
        </span>
        <span className={`admin-status admin-status--${quote.status}`}>
          {QUOTE_STATUSES[quote.status]}
        </span>
      </summary>
      <div className="admin-quote__body">
        <dl className="admin-facts">
          <div>
            <dt>Mã yêu cầu</dt>
            <dd>{quote.code}</dd>
          </div>
          <div>
            <dt>Ngày tiếp nhận</dt>
            <dd>
              {formatDate(vietnamCalendarDate(new Date(quote.createdAt)))}
            </dd>
          </div>
          <div>
            <dt>Ngân sách</dt>
            <dd>{quote.budget}</dd>
          </div>
          <div>
            <dt>Đã phân bổ</dt>
            <dd>
              {formatNumber(assigned)} / {formatNumber(quote.quantity)}
            </dd>
          </div>
          <div>
            <dt>Liên hệ</dt>
            <dd>
              {quote.name}
              {quote.organization && ` · ${quote.organization}`}
              <br />
              <a
                href={`mailto:${encodeURIComponent(quote.email).replace('%40', '@')}`}
              >
                {quote.email}
              </a>
              <br />
              <a href={`tel:${quote.phone.replace(/[\s.-]/g, '')}`}>
                {quote.phone}
              </a>
            </dd>
          </div>
          {product && (
            <div>
              <dt>Sản phẩm tham khảo</dt>
              <dd>{product.name}</dd>
            </div>
          )}
          {quote.customization && (
            <div className="admin-facts__wide">
              <dt>Yêu cầu riêng</dt>
              <dd>{quote.customization}</dd>
            </div>
          )}
        </dl>
        <QuoteEditor key={quote.version} quote={quote} />
      </div>
    </details>
  )
}

function QuoteEditor({ quote }: { quote: AdminQuote }) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [conflict, setConflict] = useState(false)

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    const data = new FormData(event.currentTarget)
    const status = data.get('status') as QuoteStatus
    const allocations = workshops.flatMap((workshop) => {
      const quantity = Number(data.get(workshop.id))
      return quantity > 0 ? [{ workshopId: workshop.id, quantity }] : []
    })
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/quotes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quote.id,
          version: quote.version,
          status,
          allocations,
        }),
      })
      if (response.status === 401) {
        window.location.replace('/login')
        return
      }
      if (response.ok) {
        await router.invalidate()
      } else if (response.status === 422) {
        setError('Tổng số lượng phân bổ vượt quá số lượng yêu cầu.')
      } else if (response.status === 409) {
        setConflict(true)
        setError(
          'Yêu cầu đã được cập nhật ở nơi khác. Tải dữ liệu mới trước khi lưu lại.',
        )
      } else {
        setError('Chưa lưu được thay đổi. Vui lòng thử lại.')
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="admin-editor" method="post" onSubmit={save}>
      <fieldset disabled={!hydrated || busy}>
        <div className="field admin-editor__status">
          <label htmlFor={`${quote.id}-status`}>Trạng thái</label>
          <select
            id={`${quote.id}-status`}
            name="status"
            defaultValue={quote.status}
          >
            {Object.entries(QUOTE_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="admin-workshops">
          <legend>Phân bổ số lượng theo xưởng</legend>
          <div className="admin-workshops__grid">
            {workshops.map((workshop) => (
              <div className="field" key={workshop.id}>
                <label htmlFor={`${quote.id}-${workshop.id}`}>
                  {workshop.name}
                </label>
                <input
                  id={`${quote.id}-${workshop.id}`}
                  name={workshop.id}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={quote.quantity}
                  step={1}
                  defaultValue={
                    quote.allocations.find(
                      (entry) => entry.workshopId === workshop.id,
                    )?.quantity ?? 0
                  }
                />
              </div>
            ))}
          </div>
        </fieldset>
        {error && (
          <p className="form-alert" role="alert">
            {error}
          </p>
        )}
        {conflict ? (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => window.location.reload()}
          >
            Tải lại yêu cầu
          </button>
        ) : (
          <button type="submit" className="btn btn--primary btn--small">
            {busy ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        )}
      </fieldset>
    </form>
  )
}
