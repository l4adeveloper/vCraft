import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { SignOutButton } from '#/components/account/SignOutButton'
import { QuoteReplies } from '#/components/artisan/QuoteReplies'
import { ArtisanQuotation } from '#/components/quotation/QuotationCards'
import {
  ProductForm,
  ProfileForm,
  ReplyForm,
} from '#/components/artisan/WorkspaceForms'
import { QUOTE_STATUSES } from '#/data/types'
import { accountPage } from '#/lib/account'
import { formatDate, formatNumber, formatPrice } from '#/lib/format'
import { getArtisanDashboard } from '#/server/artisan'
import type { ArtisanQuote } from '#/lib/artisan'
import './artisan.css'

export const Route = createFileRoute('/artisan')({
  loader: async () => {
    const dashboard = await getArtisanDashboard()
    if (dashboard.role !== 'artisan') {
      throw redirect({
        to: dashboard.role ? accountPage(dashboard.role) : '/login',
        replace: true,
      })
    }
    return dashboard
  },
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: () => ({
    meta: [
      { title: 'Xưởng của tôi — vCraft' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: ArtisanWorkspace,
})

function ArtisanWorkspace() {
  const { account, profile, products, quotes, invitations } =
    Route.useLoaderData()
  const activeInvitations = invitations.filter((quote) => !quote.hidden)
  const hiddenInvitations = invitations.filter((quote) => quote.hidden)
  return (
    <div className="artisan-workspace shell">
      <header className="admin-toolbar">
        <Link className="wordmark" to="/home">
          vCraft
        </Link>
        <div className="admin-toolbar__actions">
          <Link to="/san-pham">Cửa hàng làng nghề</Link>
          <Link to="/tin-cong-dong">Tin cộng đồng</Link>
          <SignOutButton />
        </div>
      </header>
      <div className="artisan-banner">
        <h1>Xưởng của tôi</h1>
        <p>{profile?.name ?? account.displayName ?? account.email}</p>
      </div>
      {account.artisanStatus !== 'approved' ? (
        <section className="artisan-panel" aria-labelledby="approval-heading">
          <h2 id="approval-heading">
            {account.artisanStatus === 'rejected'
              ? 'Tài khoản chưa được chấp thuận'
              : 'Đang chờ duyệt tài khoản'}
          </h2>
          <p>
            {account.artisanStatus === 'rejected'
              ? 'Liên hệ Hội làng nghề nếu bạn cần xác minh lại thông tin hộ gia đình.'
              : 'Hội làng nghề sẽ xác minh thông tin hộ gia đình trước khi bạn có thể quản lý xưởng và đăng sản phẩm.'}
          </p>
        </section>
      ) : (
        <div className="artisan-layout">
          <nav className="artisan-nav" aria-label="Quản lý xưởng">
            <a href="#ho-so">Hồ sơ xưởng</a>
            <a href="#san-pham">
              Sản phẩm <span>{formatNumber(products.length)}</span>
            </a>
            <a href="#bao-gia">
              Yêu cầu báo giá{' '}
              <span>
                {formatNumber(quotes.length + activeInvitations.length)}
              </span>
            </a>
          </nav>
          <div className="artisan-sections">
            <section
              className="artisan-panel"
              id="ho-so"
              aria-labelledby="profile-title"
            >
              <header>
                <h2 id="profile-title">Hồ sơ xưởng</h2>
                <p>Thông tin xưởng sẽ hiển thị cùng sản phẩm đã đăng.</p>
              </header>
              <ProfileForm profile={profile} />
            </section>
            <section
              className="artisan-panel"
              id="san-pham"
              aria-labelledby="products-title"
            >
              <header>
                <h2 id="products-title">Sản phẩm</h2>
              </header>
              {products.length > 0 && (
                <div className="admin-quotes">
                  {products.map((product) => (
                    <details className="admin-quote" key={product.id}>
                      <summary>
                        <span>
                          <strong>{product.name}</strong>
                          <span>{formatPrice(product.price)}</span>
                        </span>
                        <span className="admin-status admin-status--completed">
                          Đã đăng
                        </span>
                      </summary>
                      <div className="admin-quote__body">
                        <p>
                          <Link to="/san-pham/$id" params={{ id: product.id }}>
                            Xem trang sản phẩm
                          </Link>
                        </p>
                        <ProductForm product={product} />
                      </div>
                    </details>
                  ))}
                </div>
              )}
              {profile ? (
                <details className="admin-quote" open={products.length === 0}>
                  <summary>
                    <span>
                      <strong>Đăng sản phẩm mới</strong>
                    </span>
                  </summary>
                  <div className="admin-quote__body">
                    <ProductForm />
                  </div>
                </details>
              ) : (
                <p className="notice">Lưu hồ sơ xưởng để đăng sản phẩm.</p>
              )}
            </section>
            <section
              className="artisan-panel"
              id="bao-gia"
              aria-labelledby="quotes-title"
            >
              <header>
                <h2 id="quotes-title">Yêu cầu báo giá</h2>
                <p>Xem yêu cầu từ khách và gửi chào giá kèm ngày hoàn thành.</p>
              </header>
              {quotes.length || activeInvitations.length ? (
                <div className="admin-quotes">
                  {activeInvitations.map((quote) => (
                    <ArtisanQuotation key={quote.id} quote={quote} />
                  ))}
                  {quotes.map((quote) => (
                    <AssignedQuote key={quote.id} quote={quote} />
                  ))}
                </div>
              ) : (
                <p className="notice">Chưa có yêu cầu báo giá mới.</p>
              )}
              {hiddenInvitations.length > 0 && (
                <details className="admin-quote">
                  <summary>
                    <span>
                      <strong>
                        Yêu cầu đã ẩn ({hiddenInvitations.length})
                      </strong>
                    </span>
                  </summary>
                  <div className="admin-quote__body admin-quotes">
                    {hiddenInvitations.map((quote) => (
                      <ArtisanQuotation key={quote.id} quote={quote} />
                    ))}
                  </div>
                </details>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

function AssignedQuote({ quote }: { quote: ArtisanQuote }) {
  return (
    <details className="admin-quote">
      <summary>
        <span>
          <strong>{quote.productName ?? quote.productType}</strong>
          <span>
            {formatNumber(quote.allocatedQuantity)} sản phẩm được phân bổ · Hạn
            giao {formatDate(quote.deadline)}
          </span>
        </span>
        <span className={`admin-status admin-status--${quote.status}`}>
          {quote.status === 'completed'
            ? QUOTE_STATUSES.completed
            : quote.reply
              ? 'Đã phản hồi'
              : 'Chờ phản hồi'}
        </span>
      </summary>
      <div className="admin-quote__body">
        <dl className="admin-facts">
          <div>
            <dt>Mã yêu cầu</dt>
            <dd>{quote.code}</dd>
          </div>
          <div>
            <dt>Tổng số lượng khách cần</dt>
            <dd>{formatNumber(quote.quantity)}</dd>
          </div>
          <div>
            <dt>Ngân sách dự kiến</dt>
            <dd>{quote.budget}</dd>
          </div>
          {quote.customization && (
            <div className="admin-facts__wide">
              <dt>Yêu cầu riêng</dt>
              <dd>{quote.customization}</dd>
            </div>
          )}
        </dl>
        {quote.reply && <QuoteReplies replies={[quote.reply]} />}
        {quote.status !== 'completed' && <ReplyForm quote={quote} />}
      </div>
    </details>
  )
}
