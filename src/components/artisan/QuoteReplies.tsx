import { formatNumber, formatPrice } from '#/lib/format'
import type { QuoteReply } from '#/lib/artisan'

export function QuoteReplies({ replies }: { replies: Array<QuoteReply> }) {
  if (!replies.length) return null

  return (
    <div className="quote-replies">
      <h3>Phản hồi từ xưởng</h3>
      <ul>
        {replies.map(
          ({ workshopId, workshopName, message, unitPrice, quantity }) => (
            <li key={workshopId}>
              <strong>{workshopName}</strong>
              {' · '}
              {formatNumber(quantity)} sản phẩm
              {unitPrice !== null && ` · ${formatPrice(unitPrice)} / sản phẩm`}
              <p>{message}</p>
            </li>
          ),
        )}
      </ul>
    </div>
  )
}
