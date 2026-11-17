/**
 * Mô hình dữ liệu của vCraft.
 * Mọi bản ghi liên kết với nhau bằng ID để sau này thay bằng dữ liệu từ backend.
 */

export type WorkshopId = string
export type ArtisanId = string
export type ProductId = string
export type BatchId = string

/** Ảnh trong `assets/photos/<key>.webp`. Thiếu tệp thì giao diện hiện khung thay thế. */
export interface ImageAsset {
  key: string
  alt: string
  width: number
  height: number
  caption?: string
}

export type VisitStatus = 'open' | 'appointment' | 'closed'

export interface Workshop {
  id: WorkshopId
  name: string
  artisanId: ArtisanId
  tagline: string
  specialties: Array<string>
  /** Địa chỉ mô tả, không phải địa chỉ thật. */
  address: string
  /** [vĩ độ, kinh độ] minh họa quanh Bát Tràng. */
  position: [number, number]
  hours: string
  visitStatus: VisitStatus
  hasExperience: boolean
  experiences: Array<string>
  image: ImageAsset
  /** Bản ghi demo: chưa qua xác minh của Ban quản lý. */
  isDemo: true
}

export interface Artisan {
  id: ArtisanId
  name: string
  role: string
  workshopId: WorkshopId
  yearsOfPractice: number
  quote: string
  story: Array<string>
  monogram: string
  tone: 'lam' | 'clay' | 'ink'
  isDemo: true
}

export type ProductCategory = 'gia-dung' | 'trang-tri' | 'bo-tra'

export interface Product {
  id: ProductId
  name: string
  category: ProductCategory
  workshopId: WorkshopId
  batchId: BatchId
  glaze: string
  material: string
  dimensions: string
  /** Giá tham khảo, đơn vị đồng. */
  price: number
  unit: string
  summary: string
  story: Array<string>
  /** Ảnh đầu là ảnh chính; ảnh thứ hai (nếu có) dùng khi rê chuột. */
  images: Array<ImageAsset>
}

export type StepKind = 'knead' | 'throw' | 'glaze' | 'fire' | 'finish'

export interface BatchStep {
  id: string
  kind: StepKind
  title: string
  /** Khoảng ngày trong tiến trình, ví dụ "Ngày 1–3". */
  period: string
  /** Ngày bắt đầu bước, dạng ISO. */
  date: string
  description: string
  detail: string
  by: string
}

export interface Batch {
  id: BatchId
  code: string
  workshopId: WorkshopId
  startedAt: string
  finishedAt: string
  pieceCount: number
  clay: string
  glaze: string
  kiln: string
  steps: Array<BatchStep>
  verification: 'demo'
}

export type QuoteStatus = 'saved-locally'

export interface QuoteRequest {
  id: string
  code: string
  createdAt: string
  productType: string
  quantity: number
  deadline: string
  budget: string
  customization: string
  name: string
  organization: string
  email: string
  phone: string
  productId?: ProductId
  status: QuoteStatus
}
