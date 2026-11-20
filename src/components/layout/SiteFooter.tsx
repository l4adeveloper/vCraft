import { Link } from '@tanstack/react-router'
import { ArrowRight } from '#/components/ui/Icon'
import { useExplore } from '#/state/explore'
import { useSessionRole } from '#/state/session'

const EXPLORE_LINKS = [
  { label: 'Câu chuyện làng nghề', hash: 'cau-chuyen' },
  { label: 'Triển lãm tác phẩm', hash: 'trien-lam' },
  { label: 'Người giữ lửa', hash: 'nghe-nhan' },
  { label: 'Bản đồ làng nghề', hash: 'ban-do' },
  { label: 'Đặt một câu chuyện riêng', hash: 'dat-hang' },
]

export function SiteFooter() {
  const { open } = useExplore()
  const isBuyer = useSessionRole() === 'customer'

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__top">
          <p className="site-footer__mark">vCraft</p>
          <p className="site-footer__line">
            Từ đất làng,
            <br />
            thành câu chuyện.
          </p>
        </div>
        <div className="site-footer__grid">
          <section aria-labelledby="footer-about">
            <h2 id="footer-about">Về vCraft</h2>
            <p>
              Triển lãm số và nơi đặt hàng của làng gốm Bát Tràng. Mỗi xưởng có
              một không gian riêng để kể chuyện nghề, trưng bày tác phẩm và công
              khai nhật ký sản xuất theo từng lô.
            </p>
          </section>
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore">Khám phá</h2>
            <ul>
              {EXPLORE_LINKS.map((item) => (
                <li key={item.hash}>
                  <Link to="/home" hash={item.hash}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/tin-cong-dong">Tin cộng đồng</Link>
              </li>
            </ul>
          </nav>
          <section aria-labelledby="footer-artisans">
            <h2 id="footer-artisans">Dành cho nghệ nhân</h2>
            <ul>
              <li>Mở không gian trưng bày riêng cho xưởng</li>
              <li>Ghi nhật ký sản xuất và mã lô cho từng mẻ gốm</li>
              <li>Nhận phần việc từ đơn hàng lớn do Ban quản lý điều phối</li>
            </ul>
            <p className="site-footer__note">
              Hội làng nghề xác minh tài khoản hộ gia đình trước khi cấp quyền
              quản lý xưởng.
            </p>
          </section>
          <section aria-labelledby="footer-contact">
            <h2 id="footer-contact">Liên hệ</h2>
            <p>
              Ban quản lý làng nghề
              <br />
              Bát Tràng, Gia Lâm, Hà Nội
            </p>
            <p className="site-footer__note">
              Thông tin liên hệ chính thức sẽ được cập nhật.
            </p>
            {isBuyer && (
              <button
                type="button"
                className="link-arrow"
                onClick={() => open({ type: 'quote' })}
              >
                Gửi yêu cầu báo giá
                <ArrowRight size={18} />
              </button>
            )}
          </section>
        </div>
        <div className="site-footer__base">
          <p>
            © 2026 vCraft · Nội dung xưởng, nghệ nhân và sản phẩm là dữ liệu
            minh họa.
          </p>
          <Link to="/admin" preload={false}>
            Quản trị
          </Link>
          <a href="#main-content">Về đầu trang ↑</a>
        </div>
      </div>
    </footer>
  )
}
