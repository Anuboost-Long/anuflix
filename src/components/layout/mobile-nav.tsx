"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { Icon, type IconName } from "@/components/shared/icon"

const links: Array<[string, string, IconName]> = [
  ["Home", "/", "home"],
  ["Movies", "/movies", "film"],
  ["TV", "/tv", "tv"],
  ["Live", "/live", "radio"],
  ["Search", "/search", "search"],
  ["My List", "/my-list", "bookmark"],
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[4.5rem] grid-cols-6 border-t border-border bg-background-secondary/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
      {links.map(([label, href, icon]) => (
        <Link key={href} href={href} className={clsx(
          "flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-text-muted transition-colors",
          pathname === href && "text-brand-light",
        )}>
          <Icon name={icon} className="size-5" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
