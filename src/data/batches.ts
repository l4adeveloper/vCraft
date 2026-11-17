import type { Batch, BatchStep, StepKind } from './types'

/**
 * DỮ LIỆU DEMO. Nhật ký sản xuất theo lô là nội dung minh họa, chưa qua xác
 * minh của Ban quản lý làng nghề.
 */

const stepTitle: Record<StepKind, string> = {
  knead: 'Nhào đất',
  throw: 'Tạo hình',
  glaze: 'Trang trí, tráng men',
  fire: 'Nung',
  finish: 'Thành phẩm',
}

interface StepSeed {
  kind: StepKind
  period: string
  date: string
  description: string
  detail: string
  by: string
}

function steps(batchId: string, seeds: Array<StepSeed>): Array<BatchStep> {
  return seeds.map((seed) => ({
    id: `${batchId}-${seed.kind}`,
    title: stepTitle[seed.kind],
    ...seed,
  }))
}

export const batches: Array<Batch> = [
  {
    id: 'lo-bt-2611-a',
    code: 'BT-2611-A',
    workshopId: 'ws-hien-song',
    startedAt: '2026-10-12',
    finishedAt: '2026-11-06',
    pieceCount: 48,
    clay: 'Đất sét trắng, ủ 20 ngày trước khi nhào',
    glaze: 'Men trắng nền, vẽ lam dưới men',
    kiln: 'Lò gas, nung khử',
    steps: steps('lo-bt-2611-a', [
      {
        kind: 'knead',
        period: 'Ngày 1–3',
        date: '2026-10-12',
        description:
          'Đất đã ủ được lọc sạn, nhào bằng tay theo vòng xoáy cho hết bọt khí rồi chia thành từng thỏi.',
        detail: '62 kg đất cho cả mẻ',
        by: 'Thợ nhào đất của xưởng',
      },
      {
        kind: 'throw',
        period: 'Ngày 4–7',
        date: '2026-10-15',
        description:
          'Từng thỏi đất được chuốt trên bàn xoay thành bình và bát. Cốt mộc phơi trong bóng râm, sau đó tiện chân và sửa dáng.',
        detail: '48 cốt mộc, loại 3 cốt nứt khi phơi',
        by: 'Cô Lành và một thợ phụ',
      },
      {
        kind: 'glaze',
        period: 'Ngày 16–19',
        date: '2026-10-27',
        description:
          'Hoa văn cúc và lá dây được vẽ thẳng lên cốt mộc bằng men lam, rồi nhúng một lớp men trắng trong phủ ngoài.',
        detail: 'Vẽ tay toàn bộ, không dùng khuôn in',
        by: 'Cô Lành',
      },
      {
        kind: 'fire',
        period: 'Ngày 22–24',
        date: '2026-11-02',
        description:
          'Xếp lò trong một buổi sáng. Nung liên tục khoảng 16 giờ, hạ lửa chậm và để lò nguội tự nhiên thêm một ngày.',
        detail: 'Nhiệt độ đỉnh khoảng 1.250 °C',
        by: 'Thợ lò của xưởng',
      },
      {
        kind: 'finish',
        period: 'Ngày 26',
        date: '2026-11-06',
        description:
          'Dỡ lò, mài chân, kiểm từng chiếc dưới ánh sáng ngày. Mỗi tác phẩm đạt được gắn mã lô trước khi lên kệ.',
        detail: '41 tác phẩm đạt, 4 tác phẩm xếp loại hai',
        by: 'Cô Lành',
      },
    ]),
    verification: 'demo',
  },
  {
    id: 'lo-bt-2611-b',
    code: 'BT-2611-B',
    workshopId: 'ws-dat-nau',
    startedAt: '2026-10-20',
    finishedAt: '2026-11-08',
    pieceCount: 60,
    clay: 'Đất sét đỏ pha cát mịn',
    glaze: 'Không men; riêng nậm phủ men đá',
    kiln: 'Lò gas, nung oxy hóa',
    steps: steps('lo-bt-2611-b', [
      {
        kind: 'knead',
        period: 'Ngày 1–2',
        date: '2026-10-20',
        description: 'Trộn đất đỏ với cát mịn để nồi chịu được sốc nhiệt.',
        detail: '90 kg đất',
        by: 'Anh Tâm',
      },
      {
        kind: 'throw',
        period: 'Ngày 3–6',
        date: '2026-10-22',
        description:
          'Chuốt thân nồi và nắp trên bàn xoay, gắn quai khi đất còn ẩm.',
        detail: '60 cốt mộc',
        by: 'Anh Tâm và hai thợ phụ',
      },
      {
        kind: 'glaze',
        period: 'Ngày 11–12',
        date: '2026-10-30',
        description:
          'Miết bóng bề mặt nồi bằng sỏi; nậm được nhúng một lớp men đá.',
        detail: 'Không tráng men phần tiếp xúc thực phẩm',
        by: 'Thợ hoàn thiện của xưởng',
      },
      {
        kind: 'fire',
        period: 'Ngày 15–17',
        date: '2026-11-03',
        description: 'Nung chậm khoảng 14 giờ để đất chín đều.',
        detail: 'Nhiệt độ đỉnh khoảng 1.050 °C',
        by: 'Anh Tâm',
      },
      {
        kind: 'finish',
        period: 'Ngày 20',
        date: '2026-11-08',
        description: 'Ngâm nước, thử đun từng chiếc nồi trước khi giao.',
        detail: '55 sản phẩm đạt',
        by: 'Anh Tâm',
      },
    ]),
    verification: 'demo',
  },
  {
    id: 'lo-bt-2610-c',
    code: 'BT-2610-C',
    workshopId: 'ws-lo-bau',
    startedAt: '2026-09-28',
    finishedAt: '2026-10-30',
    pieceCount: 30,
    clay: 'Đất sét trắng pha sạn',
    glaze: 'Men rạn và men tro trấu',
    kiln: 'Lò gas, hạ lửa chậm',
    steps: steps('lo-bt-2610-c', [
      {
        kind: 'knead',
        period: 'Ngày 1–3',
        date: '2026-09-28',
        description: 'Nhào đất pha sạn để cốt gốm co ít hơn lớp men.',
        detail: '45 kg đất',
        by: 'Thợ phụ của xưởng',
      },
      {
        kind: 'throw',
        period: 'Ngày 4–9',
        date: '2026-10-01',
        description: 'Chuốt hũ và bát, phơi chậm trong nhà suốt một tuần.',
        detail: '30 cốt mộc',
        by: 'Ông Khiêm',
      },
      {
        kind: 'glaze',
        period: 'Ngày 18–20',
        date: '2026-10-15',
        description:
          'Tráng men rạn hai lớp; phần bát phủ men tro và để men tự chảy.',
        detail: 'Men pha từ tro trấu',
        by: 'Ông Khiêm',
      },
      {
        kind: 'fire',
        period: 'Ngày 25–28',
        date: '2026-10-22',
        description:
          'Nung khoảng 18 giờ, sau đó hạ lửa rất chậm để vết rạn hình thành.',
        detail: 'Nhiệt độ đỉnh khoảng 1.230 °C',
        by: 'Ông Khiêm',
      },
      {
        kind: 'finish',
        period: 'Ngày 33',
        date: '2026-10-30',
        description: 'Dỡ lò, lau vết rạn bằng nước chè cho sẫm màu.',
        detail: '24 tác phẩm đạt',
        by: 'Ông Khiêm',
      },
    ]),
    verification: 'demo',
  },
  {
    id: 'lo-bt-2611-d',
    code: 'BT-2611-D',
    workshopId: 'ws-nha-tra',
    startedAt: '2026-10-18',
    finishedAt: '2026-11-10',
    pieceCount: 120,
    clay: 'Đất sét pha cao lanh',
    glaze: 'Men tro, đốm sắt tự nhiên',
    kiln: 'Lò gas, nung khử',
    steps: steps('lo-bt-2611-d', [
      {
        kind: 'knead',
        period: 'Ngày 1–2',
        date: '2026-10-18',
        description: 'Nhào đất pha cao lanh cho thân ấm mỏng mà chắc.',
        detail: '38 kg đất',
        by: 'Chị Ngân',
      },
      {
        kind: 'throw',
        period: 'Ngày 3–8',
        date: '2026-10-20',
        description:
          'Chuốt thân, nắp, vòi và quai riêng rồi ráp lại khi đất se mặt.',
        detail: '20 ấm, 100 chén',
        by: 'Chị Ngân và một thợ phụ',
      },
      {
        kind: 'glaze',
        period: 'Ngày 14–15',
        date: '2026-10-31',
        description: 'Nhúng men tro một lần, lau sạch men ở vành nắp.',
        detail: 'Không vẽ, để lửa tạo đốm',
        by: 'Chị Ngân',
      },
      {
        kind: 'fire',
        period: 'Ngày 19–21',
        date: '2026-11-05',
        description: 'Nung khử khoảng 15 giờ để sắt trong đất nổi thành đốm.',
        detail: 'Nhiệt độ đỉnh khoảng 1.240 °C',
        by: 'Thợ lò thuê theo mẻ',
      },
      {
        kind: 'finish',
        period: 'Ngày 24',
        date: '2026-11-10',
        description: 'Thử rót từng chiếc ấm, loại những chiếc rớt nước.',
        detail: '17 ấm và 92 chén đạt',
        by: 'Chị Ngân',
      },
    ]),
    verification: 'demo',
  },
]

/** Lô được kể chi tiết ở phần "Hành trình của một mẻ gốm". */
export const featuredBatchId = 'lo-bt-2611-a'
