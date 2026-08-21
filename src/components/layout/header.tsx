"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { SearchDialog } from "@/components/search/search-dialog"
import { Brand } from "@/components/shared/brand"
import { Icon } from "@/components/shared/icon"

const links = [
  ["Home", "/"],
  ["Movies", "/movies"],
  ["TV Shows", "/tv"],
  ["Live", "/live"],
  ["Discover", "/discover"],
  ["My List", "/my-list"],
] as const

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", openSearch)
    return () => window.removeEventListener("keydown", openSearch)
  }, [])

  return (
    <>
      <header className={clsx(
        "fixed inset-x-0 top-0 z-40 flex h-20 items-center gap-9 px-[clamp(1.25rem,4vw,4.5rem)]",
        "border-b border-transparent bg-gradient-to-b from-background/90 to-transparent transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled && "border-border bg-background-secondary/88 backdrop-blur-xl",
      )}>
        <Brand />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className={clsx(
              "relative py-2 text-sm font-medium text-text-secondary transition-colors hover:text-white",
              "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand-bright after:transition-transform",
              pathname === href && "text-white after:scale-x-100",
            )}>{label}</Link>
          ))}
        </nav>
        <button type="button" className={clsx(
          "ml-auto inline-flex h-10 items-center gap-2.5 rounded-full border border-border bg-surface/55 px-3.5",
          "text-sm text-text-secondary backdrop-blur-md transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-white",
        )} onClick={() => setSearchOpen(true)}>
          <Icon name="search" className="size-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">/</kbd>
        </button>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
