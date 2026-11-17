import { image } from './images'
import type { ImageAsset, ProductId } from './types'

export interface HeroSlide {
  id: string
  /** Ảnh ngang phủ kín hero. */
  image: ImageAsset
  /** Điểm giữ lại khi ảnh bị cắt theo màn hình (CSS object-position). */
  focus: string
  /** Tác phẩm gắn với ảnh; bỏ trống nếu ảnh kể về công đoạn. */
  productId?: ProductId
  title: string
  note: string
}

/** Các cảnh lần lượt xuất hiện ở hero. */
export const heroSlides: Array<HeroSlide> = [
  {
    id: 'ban-tay',
    image: image(
      'hero/ban-tay-ban-xoay',
      1536,
      864,
      'Đôi bàn tay người thợ ôm lấy thân bình đất đang xoay trên bàn xoay, trong xưởng tối có nắng hắt qua cửa sổ',
    ),
    focus: '62% 50%',
    title: 'Chuốt dáng trên bàn xoay',
    note: 'Công đoạn tạo hình',
  },
  {
    id: 'binh-men-lam',
    image: image(
      'hero/toan-canh-vase',
      1899,
      828,
      'Bình gốm dáng bầu men trắng vẽ hoa cúc màu lam, đặt trên vải lanh trong nắng xiên',
    ),
    focus: '50% 50%',
    productId: 'pr-binh-men-lam-cuc',
    title: 'Bình men lam vẽ cúc',
    note: 'Xưởng gốm Hiên Sông',
  },
  {
    id: 'am-men-tro',
    image: image(
      'hero/toan-canh-teapot',
      1900,
      828,
      'Ấm trà men kem đốm nâu, nắp tròn và quai vòng, đặt trên vải lanh',
    ),
    focus: '55% 50%',
    productId: 'pr-am-men-tro',
    title: 'Ấm trà men tro đốm sắt',
    note: 'Nhà Trà Bến Gốm',
  },
  {
    id: 'noi-dat-nung',
    image: image(
      'hero/toan-canh-clay-pot',
      1900,
      828,
      'Nồi đất nung màu nâu đỏ có nắp và hai quai, đặt trên vải thô',
    ),
    focus: '50% 50%',
    productId: 'pr-noi-dat-nung',
    title: 'Nồi đất nung hai quai',
    note: 'Xưởng Đất Nâu',
  },
]

/** Dải chữ chạy ngang cuối hero: tên men và kỹ thuật của làng. */
export const tickerWords = [
  'Men lam',
  'Men rạn',
  'Men tro',
  'Đất nung',
  'Men đá',
  'Hỏa biến',
  'Vẽ tay',
  'Bàn xoay',
]
