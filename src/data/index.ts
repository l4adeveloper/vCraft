import { artisans, workshops } from './workshops'
import { batches } from './batches'
import { products } from './products'
import type {
  Artisan,
  Batch,
  BatchId,
  Product,
  ProductId,
  Workshop,
  WorkshopId,
} from './types'

export * from './types'
export { artisans, workshops, visitStatusLabel } from './workshops'
export { products, categoryFilters, categoryLabel } from './products'
export { heroSlides, tickerWords } from './showcase'
export { storyChapters, panorama } from './story'
export type { CategoryFilter } from './products'
export { batches, featuredBatchId } from './batches'
export { photoUrl, hasPhoto } from './images'

export const DEMO_NOTICE =
  'Dữ liệu minh họa: tên xưởng, nghệ nhân, câu chuyện, giá và mã lô trên trang này được tạo để trình diễn, chưa qua xác minh của Ban quản lý làng nghề.'

function index<T extends { id: string }>(items: Array<T>): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

const workshopById = index(workshops)
const artisanById = index(artisans)
const productById = index(products)
const batchById = index(batches)

export function getWorkshop(id: WorkshopId): Workshop | undefined {
  return workshopById.get(id)
}

export function getArtisan(id: string): Artisan | undefined {
  return artisanById.get(id)
}

export function getProduct(id: ProductId): Product | undefined {
  return productById.get(id)
}

export function getBatch(id: BatchId): Batch | undefined {
  return batchById.get(id)
}

export function getProductsByWorkshop(id: WorkshopId): Array<Product> {
  return products.filter((product) => product.workshopId === id)
}

export function getProductsByBatch(id: BatchId): Array<Product> {
  return products.filter((product) => product.batchId === id)
}

export function getBatchesByWorkshop(id: WorkshopId): Array<Batch> {
  return batches.filter((batch) => batch.workshopId === id)
}
