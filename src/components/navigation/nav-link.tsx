"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavLink({
  href,
  children,
  onNavigate
}: Readonly<{
  href: string
  children: ReactNode
  onNavigate?: () => void
}>) {
  const pathname = usePathname()
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn("nav-link", active && "nav-link-active")}
    >
      {children}
    </Link>
  )
}
