"use client";

import { SearchDialog } from "@/components/search/search-dialog";
import { Brand } from "@/components/shared/brand";
import { Icon } from "@/components/shared/icon";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["Home", "/"],
  ["Movies", "/movies"],
  ["TV Shows", "/tv"],
  ["Live", "/live"],
  ["Discover", "/discover"],
  ["My List", "/my-list"],
] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    function openSearch(event: KeyboardEvent) {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-40 flex h-20 items-center gap-9",
          "bg-linear-to-b from-background/90 to-transparent",
          "px-[clamp(1.25rem,4vw,4.5rem)]",
          "transition-[background-color,border-color,backdrop-filter] duration-200",
          scrolled && "bg-background-secondary/88 backdrop-blur-xl",
          scrolled && "border-b border-border",
        )}
      >
        <Brand />
        <nav
          className={clsx("hidden items-center gap-7 md:flex")}
          aria-label="Primary navigation"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative",
                "text-sm font-medium text-text-secondary",
                "py-2",
                "transition-colors hover:text-white",
                "after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-brand-bright after:transition-transform",
                pathname === href && "text-white after:scale-x-100",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className={clsx(
            "ml-auto inline-flex h-10 items-center gap-2.5 rounded-full",
            "bg-surface/55 backdrop-blur-md",
            "border border-border",
            "text-sm text-text-secondary",
            "px-3.5",
            "transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-white",
          )}
          onClick={() => setSearchOpen(true)}
        >
          <Icon name="search" className={clsx("size-4")} />
          <span className={clsx("hidden sm:inline")}>Search</span>
          <kbd
            className={clsx(
              "hidden rounded sm:inline",
              "border border-border",
              "text-[10px] text-text-muted",
              "px-1.5 py-0.5",
            )}
          >
            /
          </kbd>
        </button>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
