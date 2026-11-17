import type { ImageAsset } from './types'

/**
 * Sổ đăng ký ảnh. Mọi tệp `.webp` trong `assets/photos/` được nhận tự động;
 * dữ liệu chỉ cần ghi `key` (đường dẫn không kèm đuôi tệp).
 *
 *   assets/photos/products/  ảnh sản phẩm
 *   assets/photos/details/   cận cảnh chất liệu
 *   assets/photos/places/    góc trưng bày, không gian xưởng
 *   assets/photos/hero/      ảnh ngang phủ kín hero
 *   assets/photos/story/     ảnh bốn chất liệu
 *   assets/photos/artisans/  chân dung nghệ nhân (chưa có)
 *
 * Thả thêm ảnh đúng tên vào các thư mục trên là giao diện tự dùng.
 */
const files = import.meta.glob<string>('../../assets/photos/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byKey = new Map<string, string>()
for (const [path, url] of Object.entries(files)) {
  const key = path.replace(/^.*assets\/photos\//, '').replace(/\.webp$/, '')
  byKey.set(key, url)
}

export function photoUrl(key: string): string | undefined {
  return byKey.get(key)
}

export function hasPhoto(key: string): boolean {
  return byKey.has(key)
}

export function image(
  key: string,
  width: number,
  height: number,
  alt: string,
  caption?: string,
): ImageAsset {
  return { key, width, height, alt, caption }
}
