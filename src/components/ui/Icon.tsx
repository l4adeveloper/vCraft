interface IconProps {
  size?: number
}

function Svg({ size = 20, d }: IconProps & { d: string }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export const ArrowRight = (props: IconProps) => (
  <Svg {...props} d="M4 12h15m-6-6 6 6-6 6" />
)
export const ArrowLeft = (props: IconProps) => (
  <Svg {...props} d="M20 12H5m6 6-6-6 6-6" />
)
export const ArrowUpRight = (props: IconProps) => (
  <Svg {...props} d="M7 17 17 7M8 7h9v9" />
)
export const Close = (props: IconProps) => (
  <Svg {...props} d="m6 6 12 12M6 18 18 6" />
)
export const Check = (props: IconProps) => (
  <Svg {...props} d="m5 12.5 4.5 4.5L19 7.5" />
)
export const Pause = (props: IconProps) => (
  <Svg {...props} d="M9 6v12M15 6v12" />
)
export const Play = (props: IconProps) => (
  <Svg {...props} d="M8 5.5v13l10-6.5z" />
)
