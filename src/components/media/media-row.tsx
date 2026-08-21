"use client"

import { useRef } from "react"
import clsx from "clsx"
import { Icon } from "@/components/shared/icon"
import { MediaCard } from "@/components/media/media-card"
import type { MediaItem } from "@/lib/tmdb/types"

export function MediaRow({
  title,
  eyebrow,
  items,
  priority = false,
}: Readonly<{
  title: string
  eyebrow?: string
  items: MediaItem[]
  priority?: boolean
}>) {
  const rail = useRef<HTMLDivElement>(null)

  function scroll(direction: -1 | 1) {
    rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: "smooth" })
  }

  if (!items.length) return null

  return (
    <section className="min-w-0" aria-labelledby={`row-${title.replaceAll(" ", "-").toLowerCase()}`}>
      <div className="mb-5 flex items-end justify-between gap-5 px-[clamp(1.25rem,4vw,4.5rem)]">
        <div>
          {eyebrow && <span className="text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase">{eyebrow}</span>}
          <h2 id={`row-${title.replaceAll(" ", "-").toLowerCase()}`} className="mt-1 text-xl font-bold tracking-[-.02em] text-text-primary sm:text-2xl">{title}</h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={`Scroll ${title} ${direction === -1 ? "left" : "right"}`}
              onClick={() => scroll(direction)}
              className="grid size-9 place-items-center rounded-full border border-border bg-surface/70 text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-white"
            >
              <Icon name={direction === -1 ? "arrow-left" : "arrow-right"} className="size-4" />
            </button>
          ))}
        </div>
      </div>
      <div ref={rail} className={clsx(
        "grid auto-cols-[42vw] grid-flow-col gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,4.5rem)] pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "sm:auto-cols-[27vw] md:auto-cols-[21vw] lg:auto-cols-[16.5vw] xl:auto-cols-[14.2vw] 2xl:auto-cols-[12.5vw]",
        priority && "scroll-smooth",
      )} tabIndex={0}>
        {items.slice(0, 20).map((media, index) => (
          <MediaCard key={`${media.mediaType}-${media.id}`} media={media} priority={priority && index < 6} />
        ))}
      </div>
    </section>
  )
}
