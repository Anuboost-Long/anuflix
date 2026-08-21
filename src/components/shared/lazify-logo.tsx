import Image from "next/image"

interface LazifyLogoProps {
  size?: number
  className?: string
}

export function LazifyLogo({ size = 24, className }: Readonly<LazifyLogoProps>) {
  return (
    <Image
      src="/brand/glyph-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      loading="eager"
      aria-hidden="true"
    />
  )
}

export default LazifyLogo
