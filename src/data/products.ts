import { image } from './images'
import type { Product, ProductCategory } from './types'

/**
 * DỮ LIỆU DEMO. Sản phẩm, giá tham khảo và câu chuyện là nội dung minh họa.
 * Thứ tự trong mảng là thứ tự trưng bày.
 */
export const products: Array<Product> = [
  {
    id: 'pr-binh-men-lam-cuc',
    name: 'Bình men lam vẽ cúc',
    category: 'trang-tri',
    workshopId: 'ws-hien-song',
    batchId: 'lo-bt-2611-a',
    glaze: 'Men lam vẽ tay, nền men trắng rạn nhẹ',
    material: 'Đất sét trắng',
    dimensions: 'Cao 32 cm · đường kính 27 cm',
    price: 2450000,
    unit: 'chiếc',
    summary: 'Dáng bình bầu, cổ loe, vẽ cúc và lá dây quanh thân.',
    story: [
      'Bông cúc lớn giữa thân bình được vẽ một lần, không sửa. Cô Lành bắt đầu từ nhụy, xoay bình chậm trên tay trái và để ngọn bút tự đi hết vòng cánh.',
      'Viền miệng và chân bình để lộ một đường đất nung nâu – chỗ men không phủ tới, cũng là chỗ dễ nhận ra cốt đất của làng.',
    ],
    images: [
      image(
        'products/binh-men-lam-cuc',
        828,
        828,
        'Bình gốm dáng bầu men trắng vẽ hoa cúc màu lam, đặt trên vải lanh',
      ),
      image(
        'details/net-ve-cuc',
        420,
        336,
        'Cận cảnh bông cúc vẽ tay bằng men lam trên nền men trắng',
        'Nét vẽ cúc',
      ),
      image(
        'details/men-ran-co-binh',
        400,
        320,
        'Cận cảnh cổ bình với viền miệng nâu và lớp men rạn nhẹ',
        'Men rạn quanh cổ bình',
      ),
    ],
  },
  {
    id: 'pr-am-men-tro',
    name: 'Ấm trà men tro đốm sắt',
    category: 'bo-tra',
    workshopId: 'ws-nha-tra',
    batchId: 'lo-bt-2611-d',
    glaze: 'Men tro, đốm sắt tự nhiên',
    material: 'Đất sét pha cao lanh',
    dimensions: 'Dung tích 450 ml · cao 13 cm',
    price: 890000,
    unit: 'chiếc',
    summary: 'Thân ấm tròn, quai vòng lớn, vòi ngắn rót gọn.',
    story: [
      'Đốm nâu trên thân ấm là sắt trong đất nổi lên khi nung. Không ai chấm từng đốm, nên không có hai chiếc ấm nào giống nhau.',
      'Quai được vuốt riêng rồi gắn vào thân khi đất còn ẩm. Chị Ngân thử độ cân bằng bằng cách treo ấm đầy nước trên một ngón tay.',
    ],
    images: [
      image(
        'products/am-men-tro',
        828,
        828,
        'Ấm trà men kem có đốm nâu, nắp tròn và quai vòng, đặt trên vải lanh',
      ),
      image(
        'details/dom-sat-tren-men',
        450,
        360,
        'Cận cảnh lớp men bóng với những đốm sắt màu nâu',
        'Đốm sắt trên men',
      ),
      image(
        'details/vanh-nap-am',
        460,
        345,
        'Cận cảnh nắp ấm và vành miệng nâu nơi men chảy mỏng',
        'Vành nắp ấm',
      ),
    ],
  },
  {
    id: 'pr-bat-men-lam',
    name: 'Bát men lam vẽ lá',
    category: 'gia-dung',
    workshopId: 'ws-hien-song',
    batchId: 'lo-bt-2611-a',
    glaze: 'Men lam vẽ tay',
    material: 'Đất sét trắng',
    dimensions: 'Đường kính 16 cm · cao 6,5 cm',
    price: 185000,
    unit: 'chiếc',
    summary: 'Bát cơm thành dày vừa, vẽ một nhành lá chạy quanh.',
    story: [
      'Cùng mẻ lửa với bình vẽ cúc. Nhành lá trên bát là bài tập đầu tiên của người học vẽ ở xưởng: ba nét cho một chiếc lá, không hơn.',
    ],
    images: [
      image(
        'products/bat-men-lam',
        720,
        720,
        'Bát gốm men trắng vẽ nhành lá màu lam đặt trên bàn phủ vải',
      ),
    ],
  },
  {
    id: 'pr-nam-ruou-men-da',
    name: 'Nậm men đá',
    category: 'trang-tri',
    workshopId: 'ws-dat-nau',
    batchId: 'lo-bt-2611-b',
    glaze: 'Men đá lốm đốm, bề mặt lì',
    material: 'Đất sét pha cát mịn',
    dimensions: 'Cao 24 cm · đường kính 15 cm',
    price: 360000,
    unit: 'chiếc',
    summary: 'Dáng nậm cổ thon, men lì như mặt đá cuội.',
    story: [
      'Lớp men đá không bóng, sờ vào thấy hạt cát li ti. Anh Tâm làm dáng nậm này để cắm một cành khô hoặc để không trên kệ.',
    ],
    images: [
      image(
        'products/nam-ruou-men-da',
        600,
        600,
        'Nậm gốm cổ thon, men màu cát lốm đốm, đặt trên bàn phủ vải lanh',
      ),
    ],
  },
  {
    id: 'pr-binh-lam-canh-dao',
    name: 'Bình men lam dáng thấp',
    category: 'trang-tri',
    workshopId: 'ws-hien-song',
    batchId: 'lo-bt-2611-a',
    glaze: 'Men lam vẽ tay',
    material: 'Đất sét trắng',
    dimensions: 'Cao 21 cm · đường kính 17 cm',
    price: 1280000,
    unit: 'chiếc',
    summary: 'Bình vai tròn, miệng rộng, hợp cắm cành dài.',
    story: [
      'Miệng bình rộng để đỡ được những cành nặng như đào, mận. Hoa văn lá dây chạy kín thân, vẽ liền một mạch từ vai xuống chân.',
    ],
    images: [
      image(
        'products/binh-lam-canh-dao',
        780,
        780,
        'Bình men lam cắm cành hoa trắng, bên cạnh là một chiếc bát men lam nhỏ',
      ),
    ],
  },
  {
    id: 'pr-noi-dat-nung',
    name: 'Nồi đất nung hai quai',
    category: 'gia-dung',
    workshopId: 'ws-dat-nau',
    batchId: 'lo-bt-2611-b',
    glaze: 'Không men, đất nung mộc',
    material: 'Đất sét đỏ',
    dimensions: 'Dung tích 2,2 lít · đường kính 24 cm',
    price: 420000,
    unit: 'chiếc',
    summary: 'Nồi thấp thành dày, nắp vừa khít, giữ nhiệt lâu.',
    story: [
      'Bề mặt nồi giữ nguyên vết miết tay và màu đất sau lửa. Thành nồi dày để cơm chín đều và ấm thêm nửa tiếng sau khi bắc khỏi bếp.',
      'Trước khi giao, mỗi chiếc nồi được ngâm nước và thử đun một lần ngay tại xưởng.',
    ],
    images: [
      image(
        'products/noi-dat-nung',
        828,
        828,
        'Nồi đất nung màu nâu đỏ có nắp và hai quai, đặt trên vải thô',
      ),
      image(
        'details/be-mat-dat-nung',
        520,
        390,
        'Cận cảnh bề mặt đất nung sần nhẹ màu nâu cam',
        'Bề mặt đất nung',
      ),
      image(
        'details/nap-noi-dat',
        500,
        375,
        'Cận cảnh nắp nồi đất với núm cầm tròn',
        'Nắp nồi',
      ),
    ],
  },
  {
    id: 'pr-hu-men-ran',
    name: 'Hũ men rạn chảy nâu',
    category: 'trang-tri',
    workshopId: 'ws-lo-bau',
    batchId: 'lo-bt-2610-c',
    glaze: 'Men rạn, vệt men nâu chảy',
    material: 'Đất sét trắng pha sạn',
    dimensions: 'Cao 26 cm · đường kính 19 cm',
    price: 1650000,
    unit: 'chiếc',
    summary: 'Hũ vai rộng, mạng rạn dày và những vệt men chảy dọc thân.',
    story: [
      'Vết rạn xuất hiện khi lò nguội: men co nhanh hơn cốt đất và nứt thành mạng. Ông Khiêm để hũ trong lò thêm một ngày cho mạng rạn kịp sẫm màu.',
    ],
    images: [
      image(
        'products/hu-men-ran',
        640,
        640,
        'Hũ gốm men rạn màu ngà với các vệt men nâu chảy dọc, cạnh một chiếc chén nhỏ',
      ),
    ],
  },
  {
    id: 'pr-chen-men-tro',
    name: 'Chén trà men tro',
    category: 'bo-tra',
    workshopId: 'ws-nha-tra',
    batchId: 'lo-bt-2611-d',
    glaze: 'Men tro viền nâu',
    material: 'Đất sét pha cao lanh',
    dimensions: 'Dung tích 90 ml · đường kính 7,5 cm',
    price: 95000,
    unit: 'chiếc',
    summary: 'Chén dáng thẳng, vừa lòng bàn tay, đi cùng ấm men tro.',
    story: [
      'Chén được chuốt mỏng ở miệng và dày dần xuống đáy để cầm không bỏng tay. Cùng lô với ấm trà men tro đốm sắt.',
    ],
    images: [
      image(
        'products/chen-men-tro',
        600,
        600,
        'Chén trà nhỏ men tro viền nâu đặt trên bàn phủ vải lanh',
      ),
    ],
  },
  {
    id: 'pr-bat-men-hoa-bien',
    name: 'Bát men tro hỏa biến',
    category: 'gia-dung',
    workshopId: 'ws-lo-bau',
    batchId: 'lo-bt-2610-c',
    glaze: 'Men tro hỏa biến',
    material: 'Đất sét trắng pha sạn',
    dimensions: 'Đường kính 19 cm · cao 7 cm',
    price: 240000,
    unit: 'chiếc',
    summary: 'Bát rộng lòng, vệt lửa nâu loang quanh chân.',
    story: [
      'Phần chân bát đặt gần họng lửa nên men chuyển nâu và loang như vết mực. Mỗi chiếc bát trong mẻ có một vệt loang khác nhau.',
    ],
    images: [
      image(
        'products/bat-men-hoa-bien',
        720,
        720,
        'Bát gốm rộng lòng men tro với vệt nâu loang quanh thân',
      ),
    ],
  },
]

export const categoryLabel: Record<ProductCategory, string> = {
  'gia-dung': 'Gốm gia dụng',
  'trang-tri': 'Gốm trang trí',
  'bo-tra': 'Bộ trà',
}

export type CategoryFilter = 'all' | ProductCategory

export const categoryFilters: Array<{ id: CategoryFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'gia-dung', label: categoryLabel['gia-dung'] },
  { id: 'trang-tri', label: categoryLabel['trang-tri'] },
  { id: 'bo-tra', label: categoryLabel['bo-tra'] },
]
