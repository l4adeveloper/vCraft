import { photoUrl } from '#/data/images'
import { cx } from '#/lib/format'
import type { ImageAsset } from '#/data/types'

interface PhotoProps {
  image: ImageAsset
  className?: string
  /** Ảnh ở màn hình đầu: tải ngay, ưu tiên cao. */
  priority?: boolean
  /** Ảnh trang trí đi kèm ảnh chính: ẩn khỏi trình đọc màn hình. */
  decorative?: boolean
}

/**
 * Ảnh lấy từ sổ đăng ký `assets/photos`. Luôn khai báo kích thước gốc để
 * trình duyệt giữ chỗ; thiếu tệp thì hiện khung giấy có nét vẽ thay cho ảnh vỡ.
 */
export function Photo({ image, className, priority, decorative }: PhotoProps) {
  const url = photoUrl(image.key)
  if (!url) {
    return (
      <span
        className={cx('photo photo--missing', className)}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : image.alt}
        aria-hidden={decorative || undefined}
      >
        <svg viewBox="0 0 120 150" aria-hidden="true">
          <path d="M44 14h32M48 14c0 14-22 26-22 58 0 30 14 54 34 54s34-24 34-54c0-32-22-44-22-58" />
          <path d="M34 62c16 8 36 8 52 0" />
        </svg>
      </span>
    )
  }
  return (
    <img
      className={cx('photo', className)}
      src={url}
      width={image.width}
      height={image.height}
      alt={decorative ? '' : image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'auto' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
    />
  )
}
