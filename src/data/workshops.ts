import { image } from './images'
import type { Artisan, VisitStatus, Workshop } from './types'

/**
 * DỮ LIỆU DEMO. Tên xưởng, tên người, câu chuyện, giờ mở cửa và tọa độ đều là
 * nội dung minh họa, không mô tả cơ sở hay cá nhân có thật ở Bát Tràng.
 */
export const workshops: Array<Workshop> = [
  {
    id: 'ws-hien-song',
    name: 'Xưởng gốm Hiên Sông',
    artisanId: 'ar-lanh',
    tagline: 'Men lam vẽ tay trên dáng bình cổ điển',
    specialties: ['Men lam vẽ tay', 'Bình hoa', 'Bát đĩa'],
    address: 'Xóm ven sông, Bát Tràng (vị trí minh họa)',
    position: [20.9768, 105.9102],
    hours: '8:00 – 17:30, thứ Ba đến Chủ nhật',
    visitStatus: 'open',
    hasExperience: true,
    experiences: ['Vẽ men lam lên đĩa mộc', 'Xem chuốt dáng trên bàn xoay'],
    image: image(
      'places/goc-cua-so',
      960,
      640,
      'Bình men lam cắm cành hoa trắng đặt cạnh cửa sổ gỗ, nắng chiếu xiên lên tường',
      'Góc trưng bày cạnh cửa sổ',
    ),
    isDemo: true,
  },
  {
    id: 'ws-lo-bau',
    name: 'Lò Bầu Nhỏ',
    artisanId: 'ar-khiem',
    tagline: 'Men rạn và men tro nung chậm',
    specialties: ['Men rạn', 'Men tro', 'Hũ, chóe'],
    address: 'Ngõ lò cũ, Bát Tràng (vị trí minh họa)',
    position: [20.9749, 105.9136],
    hours: '9:00 – 16:30, thứ Sáu đến Chủ nhật',
    visitStatus: 'appointment',
    hasExperience: false,
    experiences: ['Nghe kể chuyện lò bầu và xem xếp lò'],
    image: image(
      'places/goc-anh-chieu',
      1000,
      640,
      'Nồi đất, hũ men rạn và bát men tro xếp trên bàn phủ vải lanh dưới bóng nắng',
      'Kệ gốm men tro và men rạn',
    ),
    isDemo: true,
  },
  {
    id: 'ws-dat-nau',
    name: 'Xưởng Đất Nâu',
    artisanId: 'ar-tam',
    tagline: 'Gốm đất nung cho gian bếp',
    specialties: ['Đất nung không men', 'Nồi, niêu', 'Gốm gia dụng'],
    address: 'Đường làng giữa, Bát Tràng (vị trí minh họa)',
    position: [20.9737, 105.9109],
    hours: '7:30 – 17:00, hằng ngày',
    visitStatus: 'open',
    hasExperience: true,
    experiences: ['Nặn niêu đất bằng tay', 'Buổi nhào đất cho trẻ nhỏ'],
    image: image(
      'places/ke-dat-nung',
      1400,
      610,
      'Nồi đất nung màu nâu ấm có nắp đặt trên mặt vải thô',
      'Nồi đất vừa ra lò',
    ),
    isDemo: true,
  },
  {
    id: 'ws-nha-tra',
    name: 'Nhà Trà Bến Gốm',
    artisanId: 'ar-ngan',
    tagline: 'Ấm chén cho một tuần trà chậm',
    specialties: ['Bộ trà', 'Men tro đốm sắt', 'Chén quân'],
    address: 'Gần bến thuyền, Bát Tràng (vị trí minh họa)',
    position: [20.9779, 105.9141],
    hours: 'Tạm nghỉ đón khách đến hết tháng 11',
    visitStatus: 'closed',
    hasExperience: true,
    experiences: ['Thử trà bằng ấm vừa ra lò', 'Chuốt một chiếc chén quân'],
    image: image(
      'places/ban-tra',
      1400,
      610,
      'Ấm trà men kem đốm nâu đặt trên bàn vải lanh, nắng chiếu từ bên trái',
      'Bàn trà trong xưởng',
    ),
    isDemo: true,
  },
]

export const artisans: Array<Artisan> = [
  {
    id: 'ar-lanh',
    name: 'Cô Lành',
    role: 'Thợ vẽ men lam, chủ xưởng',
    workshopId: 'ws-hien-song',
    yearsOfPractice: 34,
    quote:
      'Vẽ một bông cúc mất chừng hai phút. Học để vẽ được hai phút ấy thì mất gần hết tuổi trẻ.',
    story: [
      'Cô Lành cầm bút vẽ từ năm mười sáu tuổi, ngồi cạnh mẹ bên hiên nhà nhìn ra sông. Những mẫu cúc, sen, lá dây trên bình của xưởng đều được vẽ thẳng lên cốt mộc, không can, không in.',
      'Xưởng nhỏ, mỗi tháng chỉ ra hai mẻ. Cô giữ lại thói quen ghi sổ từng mẻ: hôm nào nhào đất, ai chuốt dáng, lò nung bao lâu. Cuốn sổ ấy giờ thành nhật ký sản xuất trên vCraft.',
    ],
    monogram: 'L',
    tone: 'lam',
    isDemo: true,
  },
  {
    id: 'ar-khiem',
    name: 'Ông Khiêm',
    role: 'Thợ lò, người giữ men rạn',
    workshopId: 'ws-lo-bau',
    yearsOfPractice: 47,
    quote:
      'Men rạn không dạy được bằng công thức. Phải nghe tiếng men nứt lúc lò nguội mới biết mẻ ấy được hay hỏng.',
    story: [
      'Ông Khiêm theo nghề lò từ thời làng còn đốt lò bầu bằng củi. Ông giữ một góc xưởng cho men rạn và men tro – hai dòng men cần nung chậm và hạ lửa rất kiên nhẫn.',
      'Mỗi chiếc hũ ra lò có một mạng vết rạn riêng. Ông bảo đó là chữ ký của lửa, người thợ chỉ đứng tên chung.',
    ],
    monogram: 'K',
    tone: 'ink',
    isDemo: true,
  },
  {
    id: 'ar-tam',
    name: 'Anh Tâm',
    role: 'Thợ chuốt, thế hệ thứ ba',
    workshopId: 'ws-dat-nau',
    yearsOfPractice: 15,
    quote:
      'Nồi đất không cần đẹp theo kiểu trưng bày. Nó cần đứng vững trên bếp và làm cơm thơm.',
    story: [
      'Anh Tâm trở về làng sau mấy năm làm việc ở thành phố, tiếp quản bàn xoay của ông nội. Xưởng Đất Nâu chỉ làm gốm đất nung không men cho gian bếp: nồi, niêu, ấm sắc thuốc.',
      'Anh mở xưởng cho khách vào nặn thử mỗi cuối tuần, phần vì vui, phần vì muốn người thành phố biết một chiếc niêu được làm ra thế nào.',
    ],
    monogram: 'T',
    tone: 'clay',
    isDemo: true,
  },
  {
    id: 'ar-ngan',
    name: 'Chị Ngân',
    role: 'Người làm ấm chén',
    workshopId: 'ws-nha-tra',
    yearsOfPractice: 12,
    quote:
      'Một chiếc ấm tốt là chiếc ấm rót không rớt giọt nào. Phần còn lại là chuyện của trà.',
    story: [
      'Chị Ngân học gốm ở trường mỹ thuật rồi về làng xin học việc thêm sáu năm. Chị chỉ làm ấm và chén, mỗi dáng thử đi thử lại hàng chục lần cho đến khi vòi rót thật gọn.',
      'Lớp men tro đốm sắt trên ấm của Nhà Trà là thứ chị thích nhất: mỗi mẻ lửa cho ra một kiểu đốm, không mẻ nào lặp lại.',
    ],
    monogram: 'N',
    tone: 'lam',
    isDemo: true,
  },
]

export const visitStatusLabel: Record<VisitStatus, string> = {
  open: 'Đang đón khách',
  appointment: 'Đón khách theo hẹn',
  closed: 'Tạm nghỉ đón khách',
}
