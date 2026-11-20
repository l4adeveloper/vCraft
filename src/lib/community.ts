export const NOTICE_CATEGORIES = {
  materials: 'Giá nguyên vật liệu',
  outage: 'Lịch cúp điện',
  policy: 'Chính sách hỗ trợ',
} as const

export interface CommunityNotice {
  id: string
  title: string
  category: keyof typeof NOTICE_CATEGORIES
  body: string
  publishedAt: string | null
  version: number
}
