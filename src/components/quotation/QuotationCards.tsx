import { useState } from 'react'
import { useHydrated, useRouter } from '@tanstack/react-router'
import { QuoteReplies } from '#/components/artisan/QuoteReplies'
import { QUOTE_STATUSES } from '#/data/types'
import { MAX_UNIT_PRICE } from '#/lib/artisan'
import { formatDate, formatNumber, formatPrice } from '#/lib/format'
import { isoDate } from '#/lib/quote'
import { canBid, QUOTATION_STATES } from '#/lib/quotation'
import { removeQuoteRequestReceipt } from '#/lib/storage'
import type {
  ArtisanInvitation,
  DirectQuote,
  QuotationAction,
} from '#/lib/quotation'
import type { QuoteReceipt, QuoteStatus } from '#/data/types'
import type { QuoteReply } from '#/lib/artisan'
import type { FormEvent } from 'react'

function useQuotationAction() {
  const hydrated = useHydrated()
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function send(action: QuotationAction) {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      })
      if (response.status === 401) {
        window.location.replace('/login')
      } else if (response.ok) {
        if (action.action === 'delete') removeQuoteRequestReceipt(action.id)
        await router.invalidate()
      } else if (response.status === 409 || response.status === 404) {
        await router.invalidate()
        setError(
          'Yêu cầu hoặc chào giá đã thay đổi. Kiểm tra thông tin mới nhất.',
        )
      } else {
        setError('Chưa lưu được thay đổi. Kiểm tra thông tin hoặc thử lại.')
      }
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setBusy(false)
    }
  }

  return { send, disabled: !hydrated || busy, error }
}

export function BuyerQuotation({
  quote,
}: {
  quote: QuoteReceipt & {
    direct: DirectQuote | null
    status: QuoteStatus
    replies: Array<QuoteReply>
  }
}) {
  const { direct } = quote
  const { disabled, error, send } = useQuotationAction()
  const deleteButton = (
    <button
      type="button"
      className="text-button"
      disabled={disabled}
      onClick={() => {
        if (
          window.confirm(
            `Xóa yêu cầu ${quote.code} và các chào giá đã nhận? Bạn không thể hoàn tác.`,
          )
        ) {
          void send({ action: 'delete', id: quote.id })
        }
      }}
    >
      Xóa yêu cầu
    </button>
  )
  const actionError = error && (
    <p className="form-alert" role="alert">
      {error}
    </p>
  )

  if (!direct) {
    return (
      <details className="admin-quote">
        <summary>
          <span>
            <strong>
              {formatNumber(quote.quantity)} × {quote.productType}
            </strong>
            <span>Hạn giao {formatDate(quote.deadline)}</span>
          </span>
        </summary>
        <div className="admin-quote__body">
          <p className={`admin-status admin-status--${quote.status}`}>
            {QUOTE_STATUSES[quote.status]}
          </p>
          <p>
            Mã yêu cầu{' '}
            <strong className="account-quote-code">{quote.code}</strong>
          </p>
          {quote.replies.length ? (
            <QuoteReplies replies={quote.replies} />
          ) : (
            <p>Chưa có phản hồi từ xưởng.</p>
          )}
          {quote.status === 'new' && deleteButton}
          {actionError}
        </div>
      </details>
    )
  }

  const open = canBid(direct.state)
  const visibleOffers = open
    ? direct.offers
    : direct.offers.filter(
        ({ invitationId }) => invitationId === direct.acceptedInvitationId,
      )
  return (
    <article className="quotation-card">
      <header className="quotation-card__heading">
        <div>
          <h3>
            {formatNumber(quote.quantity)} × {quote.productType}
          </h3>
          <p>Hạn giao đề xuất {formatDate(quote.deadline)}</p>
        </div>
        <span className="admin-status admin-status--in-progress">
          {QUOTATION_STATES[direct.state]}
        </span>
      </header>
      <p className="quotation-card__meta">
        <strong>{quote.code}</strong>
        {' · '}
        {formatNumber(direct.sentCount)} nghệ nhân nhận yêu cầu
        {direct.declinedCount > 0 &&
          ` · ${formatNumber(direct.declinedCount)} từ chối`}
      </p>
      {visibleOffers.length > 0 ? (
        <ul className="quotation-offers" aria-label="Chào giá từ xưởng">
          {visibleOffers.map((offer) => (
            <li key={offer.invitationId}>
              <div>
                <strong>{offer.artisanName}</strong>
                <p>
                  {formatPrice(offer.unitPrice)} / sản phẩm · Tổng{' '}
                  {formatPrice(offer.unitPrice * quote.quantity)}
                </p>
                <p>
                  Ngày hoàn thành{' '}
                  <time dateTime={offer.completionDate}>
                    {formatDate(offer.completionDate)}
                  </time>
                </p>
              </div>
              {open ? (
                offer.available ? (
                  <button
                    type="button"
                    className="btn btn--primary btn--small"
                    disabled={disabled}
                    onClick={() =>
                      void send({
                        action: 'choose',
                        id: quote.id,
                        invitationId: offer.invitationId,
                        version: offer.version,
                      })
                    }
                  >
                    Chấp nhận chào giá
                  </button>
                ) : (
                  <span className="admin-status">Không còn hiệu lực</span>
                )
              ) : (
                <span className="admin-status admin-status--completed">
                  Đã chọn
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {direct.sentCount > 0 && direct.declinedCount === direct.sentCount
            ? 'Tất cả xưởng đã từ chối yêu cầu.'
            : 'Chưa có chào giá từ xưởng.'}
        </p>
      )}
      {open && deleteButton}
      {actionError}
    </article>
  )
}

export function ArtisanQuotation({ quote }: { quote: ArtisanInvitation }) {
  const { disabled, error, send } = useQuotationAction()
  const open = canBid(quote.state)
  const { id, version } = quote

  function offer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    void send({
      action: 'offer',
      id,
      version,
      unitPrice: Number(fields.get('price')),
      completionDate: String(fields.get('completionDate') ?? ''),
    })
  }

  return (
    <article className="quotation-card">
      <header className="quotation-card__heading">
        <div>
          <h3>
            {formatNumber(quote.quantity)} ×{' '}
            {quote.productName ?? quote.productType}
          </h3>
          {open && (
            <p>
              Đề xuất {formatPrice(quote.targetUnitPrice)} / sản phẩm · Hạn giao{' '}
              {formatDate(quote.deadline)}
            </p>
          )}
        </div>
        <span className="admin-status">
          {!open
            ? quote.selected
              ? QUOTATION_STATES[quote.state]
              : 'Khách đã chọn nghệ nhân khác'
            : quote.response === 'declined'
              ? 'Đã từ chối'
              : quote.response === 'offered'
                ? 'Đã chào giá'
                : 'Chờ phản hồi'}
        </span>
      </header>
      <p className="quotation-card__meta">
        <strong>{quote.code}</strong>
      </p>
      {quote.customization && (
        <p className="quotation-card__notes">{quote.customization}</p>
      )}
      {open && quote.response !== 'declined' && (
        <form
          className="artisan-form quotation-form"
          method="post"
          onSubmit={offer}
          key={quote.version}
        >
          <fieldset disabled={disabled}>
            <div className="artisan-form__pair">
              <label className="field">
                Đơn giá (₫/sản phẩm)
                <input
                  name="price"
                  type="number"
                  min={1}
                  max={MAX_UNIT_PRICE}
                  step={1}
                  required
                  defaultValue={quote.unitPrice ?? quote.targetUnitPrice}
                />
              </label>
              <label className="field">
                Ngày hoàn thành
                <input
                  name="completionDate"
                  type="date"
                  min={isoDate(0)}
                  required
                  defaultValue={quote.completionDate ?? quote.deadline}
                />
              </label>
            </div>
            <div className="governance-actions">
              <button className="btn btn--primary btn--small" type="submit">
                {quote.response === 'offered'
                  ? 'Cập nhật chào giá'
                  : 'Chấp nhận và gửi chào giá'}
              </button>
              <button
                className="btn btn--ghost btn--small"
                type="button"
                onClick={() => void send({ action: 'decline', id, version })}
              >
                Từ chối
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {quote.response === 'declined' && (
        <div className="governance-actions">
          {open && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              disabled={disabled}
              onClick={() => void send({ action: 'restore', id, version })}
            >
              {quote.hidden ? 'Khôi phục và xem lại' : 'Bỏ từ chối'}
            </button>
          )}
          {!quote.hidden && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              disabled={disabled}
              aria-label="Ẩn yêu cầu đã từ chối"
              onClick={() => void send({ action: 'hide', id, version })}
            >
              ×
            </button>
          )}
        </div>
      )}
      {quote.selected && quote.unitPrice !== null && quote.completionDate && (
        <p className="quotation-award">
          {formatPrice(quote.unitPrice)} / sản phẩm · Hoàn thành{' '}
          {formatDate(quote.completionDate)}
        </p>
      )}
      {quote.selected &&
        (quote.state === 'accepted' || quote.state === 'in-production') && (
          <button
            type="button"
            className="btn btn--primary btn--small"
            disabled={disabled}
            onClick={() =>
              void send({
                action: quote.state === 'accepted' ? 'start' : 'deliver',
                id,
              })
            }
          >
            {quote.state === 'accepted'
              ? 'Bắt đầu sản xuất'
              : 'Đánh dấu đã giao hàng'}
          </button>
        )}
      {error && (
        <p className="form-alert" role="alert">
          {error}
        </p>
      )}
    </article>
  )
}
