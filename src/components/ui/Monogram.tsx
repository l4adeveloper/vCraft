import { hasPhoto } from '#/data/images'
import { cx } from '#/lib/format'
import { Photo } from './Photo'
import { WheelMark } from './WheelMark'
import type { Artisan } from '#/data/types'

/**
 * Ô chân dung nghệ nhân. Bản demo không dùng ảnh người; khi có tệp
 * `assets/photos/artisans/<id>.webp` thì ảnh thật thay cho ký hiệu chữ.
 */
export function Monogram({
  artisan,
  className,
}: {
  artisan: Artisan
  className?: string
}) {
  const key = `artisans/${artisan.id}`
  if (hasPhoto(key)) {
    return (
      <div className={cx('monogram', className)}>
        <Photo
          image={{
            key,
            width: 800,
            height: 1000,
            alt: `Chân dung ${artisan.name}`,
          }}
        />
      </div>
    )
  }
  return (
    <div
      className={cx('monogram', `monogram--${artisan.tone}`, className)}
      aria-hidden="true"
    >
      <WheelMark className="monogram__wheel" />
      <span className="monogram__letter">{artisan.monogram}</span>
    </div>
  )
}
