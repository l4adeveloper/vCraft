import { ArrowRight } from '#/components/ui/Icon'
import { Reveal } from '#/components/ui/Reveal'
import { SectionTitle } from '#/components/ui/SectionTitle'
import { WheelMark } from '#/components/ui/WheelMark'
import { formatDate, formatNumber } from '#/lib/format'
import { clearQuoteRequests, useQuoteRequests } from '#/lib/storage'
import { useExplore } from '#/state/explore'

const NEEDS = [
  {
    title: 'Mua số lượng lớn',
    text: 'Bát đĩa, cốc chén cho nhà hàng, khách sạn, cửa hàng.',
  },
  {
    title: 'Quà tặng doanh nghiệp',
    text: 'Bộ quà theo dịp, đóng hộp và kèm thiệp kể chuyện xưởng.',
  },
  {
    title: 'In logo, làm dáng riêng',
    text: 'In hoặc khắc logo, chọn men và dáng theo bản vẽ của bạn.',
  },
]

export function CustomOrder() {
  const { open } = useExplore()
  const requests = useQuoteRequests()

  return (
    <section className="custom" id="dat-hang" aria-labelledby="custom-title">
      <WheelMark className="custom__wheel" />
      <div className="shell custom__grid">
        <div className="custom__copy">
          <SectionTitle
            id="custom-title"
            eyebrow="Đặt một câu chuyện riêng"
            lines={[
              <>Một đơn hàng lớn,</>,
              <>
                <em>nhiều đôi tay cùng làm.</em>
              </>,
            ]}
          />
          <Reveal delay={0.1}>
            <p className="lead">
              Bạn gửi nhu cầu. Ban quản lý làng nghề tiếp nhận, chia phần việc
              cho những hộ phù hợp và theo dõi tiến độ đến ngày giao.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="custom__needs">
              {NEEDS.map((need) => (
                <li key={need.title}>
                  <h3>{need.title}</h3>
                  <p>{need.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="custom__brief" delay={0.1}>
          <p className="eyebrow">Ví dụ một yêu cầu</p>
          <p className="custom__example">
            “5.000 chiếc cốc in logo Trường Đại học Công nghệ, giao trong một
            tháng.”
          </p>
          <dl className="custom__facts">
            <div>
              <dt>Sản phẩm</dt>
              <dd>Cốc in logo</dd>
            </div>
            <div>
              <dt>Số lượng</dt>
              <dd>5.000 chiếc</dd>
            </div>
            <div>
              <dt>Hạn giao</dt>
              <dd>30 ngày</dd>
            </div>
          </dl>
          <div className="custom__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => open({ type: 'quote' })}
            >
              Gửi yêu cầu báo giá
              <ArrowRight />
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => open({ type: 'quote', preset: 'example' })}
            >
              Điền thử theo ví dụ
            </button>
          </div>

          {requests.length > 0 ? (
            <div className="custom__saved">
              <div className="custom__saved-head">
                <h3>Yêu cầu trên thiết bị này</h3>
                <button
                  type="button"
                  className="text-button"
                  onClick={clearQuoteRequests}
                >
                  Xóa lịch sử trên thiết bị
                </button>
              </div>
              <ul>
                {requests.slice(0, 3).map((request) => (
                  <li key={request.id}>
                    <span className="custom__saved-code">{request.code}</span>
                    <span>
                      {formatNumber(request.quantity)} × {request.productType}
                    </span>
                    <span>
                      giao trước {formatDate(request.deadline)}
                      {request.status === 'saved-locally'
                        ? ' · Bản demo chưa gửi'
                        : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
