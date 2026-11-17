import { image } from './images'
import type { ImageAsset } from './types'

export interface StoryChapter {
  id: string
  word: string
  text: string
  image: ImageAsset
}

/** Bốn chất liệu kể chuyện của phần "Câu chuyện làng nghề". */
export const storyChapters: Array<StoryChapter> = [
  {
    id: 'dat',
    word: 'Đất',
    text: 'Đất được ủ, lọc sạn và nhào cho đến khi mịn dẻo dưới lòng bàn tay. Mọi dáng gốm bắt đầu ở đây, trước cả khi có hình.',
    image: image(
      'story/dat',
      880,
      550,
      'Cận cảnh bề mặt đất nung màu nâu cam, còn thấy hạt đất li ti',
      'Bề mặt đất nung, chưa phủ men',
    ),
  },
  {
    id: 'ban-tay',
    word: 'Bàn tay',
    text: 'Không có hai nét vẽ nào trùng nhau. Bàn tay người thợ nhớ độ dày của thành bình, độ nghiêng của ngọn bút, và biết lúc nào nên dừng.',
    image: image(
      'story/ban-tay',
      1100,
      688,
      'Đôi bàn tay người thợ ôm lấy thân bình đất đang xoay trên bàn xoay',
      'Bàn tay chuốt dáng trên bàn xoay',
    ),
  },
  {
    id: 'lua',
    word: 'Lửa',
    text: 'Lửa quyết định phần còn lại. Qua một đêm lò, đất hóa sành, sắt trong men nổi thành đốm nâu – thứ dấu vết không ai sắp đặt được.',
    image: image(
      'story/lua',
      800,
      500,
      'Cận cảnh lớp men bóng màu kem với những đốm sắt nâu nổi lên sau khi nung',
      'Đốm sắt nổi lên sau khi nung',
    ),
  },
  {
    id: 'men',
    word: 'Men',
    text: 'Men giữ lại ánh sáng. Men rạn, men tro hay men lam đều là cách người làng ghi một mùa lửa lên bề mặt gốm.',
    image: image(
      'story/men',
      704,
      440,
      'Cận cảnh cổ bình men trắng rạn nhẹ, viền miệng nâu và hoa văn lam',
      'Men rạn quanh cổ bình',
    ),
  },
]

export const panorama = image(
  'places/ban-trung-bay',
  2170,
  725,
  'Bảy món gốm gồm bình men lam, bát, nậm, nồi đất và hũ men rạn xếp hàng trên bàn phủ vải lanh trong nắng xiên',
  'Bàn trưng bày chung của các xưởng',
)
