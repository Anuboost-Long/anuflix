"use client";

import { Icon, type IconName } from "@/components/shared/icon";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: Array<[string, string, IconName]> = [
  ["Home", "/", "home"],
  ["Movies", "/movies", "film"],
  ["TV", "/tv", "tv"],
  ["Anime", "/anime", "spark"],
  ["Live", "/live", "radio"],
  ["My List", "/my-list", "bookmark"]
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 grid h-18 grid-cols-6 backdrop-blur-xl md:hidden",
        "bg-background-secondary/95",
        "border-t border-border",
        "px-2 pb-[env(safe-area-inset-bottom)]"
      )}
      aria-label="Mobile navigation"
    >
      {links.map(([label, href, icon]) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "flex flex-col items-center justify-center gap-1",
            "text-[10px] font-medium text-text-muted",
            "transition-colors",
            pathname === href && "text-brand-light"
          )}
        >
          <Icon name={icon} className={clsx("size-5")} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
