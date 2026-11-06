import { createFileRoute } from '@tanstack/react-router'
import hero from '../../../assets/plates/hero.webp'
import vase from '../../../assets/plates/vase.webp'
import teapot from '../../../assets/plates/teapot.webp'
import clayPot from '../../../assets/plates/clay-pot.webp'
import heroOriginal from '../../../assets/plates/hero.png'
import vaseOriginal from '../../../assets/plates/vase.png'
import teapotOriginal from '../../../assets/plates/teapot.png'
import clayPotOriginal from '../../../assets/plates/clay-pot.png'
import './styles.css'

export const Route = createFileRoute('/home/')({ component: Home })

const pieces = [
  {
    name: 'Bình men lam',
    image: vase,
    original: vaseOriginal,
    alt: 'Bình gốm men trắng vẽ hoa màu lam, đặt trên vải lanh',
    width: 1899,
    height: 828,
  },
  {
    name: 'Ấm gốm',
    image: teapot,
    original: teapotOriginal,
    alt: 'Ấm gốm men kem chấm nâu, có nắp và quai tròn',
    width: 1900,
    height: 828,
  },
  {
    name: 'Nồi đất',
    image: clayPot,
    original: clayPotOriginal,
    alt: 'Nồi đất nung màu nâu ấm, có nắp và hai quai',
    width: 1900,
    height: 828,
  },
]

function Home() {
  return (
    <>
      <section className="exhibition-hero" aria-labelledby="exhibition-title">
        <div className="hero-introduction page-shell">
          <h1 id="exhibition-title">Từ đất, thành câu chuyện.</h1>
          <p>
            Một không gian dành cho gốm, người làm nghề và những điều được gìn
            giữ.
          </p>
          <a className="button-primary" href="#collection">
            Khám phá bộ sưu tập
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </a>
        </div>
        <figure className="hero-photograph">
          <picture>
            <source srcSet={hero} type="image/webp" />
            <img
              src={heroOriginal}
              width="2170"
              height="725"
              fetchPriority="high"
              alt="Hình ảnh minh họa những dáng bình, bát và nồi gốm trên bàn phủ vải lanh, trong ánh sáng tự nhiên"
            />
          </picture>
          <figcaption>Hình ảnh minh họa</figcaption>
        </figure>
      </section>
      <section
        className="collection page-shell"
        id="collection"
        aria-labelledby="collection-title"
      >
        <div className="section-heading">
          <h2 id="collection-title">Những dáng gốm thân thuộc</h2>
        </div>
        <div className="product-grid">
          {pieces.map((piece) => (
            <figure className="product-card" key={piece.name}>
              <div className="product-image-frame">
                <picture>
                  <source srcSet={piece.image} type="image/webp" />
                  <img
                    src={piece.original}
                    width={piece.width}
                    height={piece.height}
                    alt={piece.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <figcaption>
                <h3>{piece.name}</h3>
                <p>Hình ảnh minh họa</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="collection-note">
          Bộ sưu tập mẫu — hình ảnh minh họa, chưa đại diện cho sản phẩm đang
          được chào bán.
        </p>
      </section>
      <section
        className="archive-notes page-shell"
        aria-label="Về không gian triển lãm"
      >
        <div id="story" className="archive-note">
          <h2>Đằng sau một dáng gốm</h2>
          <p>
            Một tác phẩm còn có câu chuyện của người làm nghề. vCraft dành không
            gian để những câu chuyện ấy được kể, bên cạnh từng dáng gốm và dấu
            vết của quá trình tạo tác.
          </p>
          <p className="content-status">
            Câu chuyện nghệ nhân sẽ được giới thiệu khi có nội dung xác thực.
          </p>
        </div>
        <div id="origin" className="archive-note">
          <h2>Từ đất đến tác phẩm</h2>
          <p>
            Nguồn gốc và quá trình làm nên một món gốm là một phần của hành
            trình khám phá. Thông tin về người làm, nguyên liệu và công đoạn sẽ
            được trình bày khi có dữ liệu.
          </p>
          <p className="content-status">
            Bộ sưu tập mẫu hiện chưa có hồ sơ truy xuất nguồn gốc.
          </p>
        </div>
      </section>
    </>
  )
}
