import { cx } from '#/lib/format'

/** Họa tiết vòng bàn xoay: các đường tròn đồng tâm, dùng làm nền trang trí. */
export function WheelMark({
  className,
  spin,
}: {
  className?: string
  spin?: boolean
}) {
  return (
    <svg
      className={cx('wheel', spin && 'wheel--spin', className)}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="98" strokeWidth="0.5" />
      <circle
        cx="100"
        cy="100"
        r="80"
        strokeWidth="0.5"
        strokeDasharray="1 5"
      />
      <circle cx="100" cy="100" r="61" strokeWidth="0.5" />
      <circle
        cx="100"
        cy="100"
        r="38"
        strokeWidth="0.5"
        strokeDasharray="1 4"
      />
      <path d="M100 2v10M100 188v10M2 100h10M188 100h10" strokeWidth="0.75" />
    </svg>
  )
}
