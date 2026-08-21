import Link from "next/link"
import clsx from "clsx"

export function Brand() {
  return (
    <Link href="/" className={clsx("inline-flex items-center gap-2.5", "text-lg font-black tracking-[.08em] text-text-primary")} aria-label="Anuflix home">
      <span className={clsx("relative grid size-8 place-items-center overflow-hidden rounded-[9px]", "bg-[linear-gradient(135deg,#2563eb,#1d8fff_58%,#22d3ee)]", "shadow-[0_0_22px_rgba(37,99,235,.25)]")} aria-hidden="true">
        <span className="ml-0.5 block h-3.5 w-2.5 bg-white [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      </span>
      <span>ANUFLIX</span>
    </Link>
  )
}
