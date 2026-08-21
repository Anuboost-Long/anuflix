"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "@/components/shared/icon"
import { tmdbImage } from "@/lib/tmdb/images"
import type { MediaItem } from "@/lib/tmdb/types"

export function TopTenRow({ items }: Readonly<{ items: MediaItem[] }>) {
  const rail = useRef<HTMLDivElement>(null)

  return (
    <section className="min-w-0" aria-labelledby="top-ten-title">
      <div className="mb-5 flex items-end justify-between gap-5 px-[clamp(1.25rem,4vw,4.5rem)]">
        <div>
          <span className="text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase">What everyone is watching</span>
          <h2 id="top-ten-title" className="mt-1 text-xl font-bold tracking-[-.02em] text-text-primary sm:text-2xl">Top 10 today</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button type="button" aria-label="Scroll Top 10 left" onClick={() => rail.current?.scrollBy({ left: -900, behavior: "smooth" })} className="grid size-9 place-items-center rounded-full border border-border bg-surface/70 text-text-secondary hover:bg-surface-hover hover:text-white">
            <Icon name="arrow-left" className="size-4" />
          </button>
          <button type="button" aria-label="Scroll Top 10 right" onClick={() => rail.current?.scrollBy({ left: 900, behavior: "smooth" })} className="grid size-9 place-items-center rounded-full border border-border bg-surface/70 text-text-secondary hover:bg-surface-hover hover:text-white">
            <Icon name="arrow-right" className="size-4" />
          </button>
        </div>
      </div>
      <div ref={rail} className="grid auto-cols-[67vw] grid-flow-col gap-2 overflow-x-auto px-[clamp(1.25rem,4vw,4.5rem)] pb-6 [scrollbar-width:none] sm:auto-cols-[40vw] md:auto-cols-[31vw] lg:auto-cols-[25vw] xl:auto-cols-[21vw] [&::-webkit-scrollbar]:hidden" tabIndex={0}>
        {items.slice(0, 10).map((media, index) => {
          const poster = tmdbImage.poster(media.posterPath)
          return (
            <Link key={`${media.mediaType}-${media.id}`} href={`/${media.mediaType}/${media.id}`} className="group grid grid-cols-[42%_58%] items-end overflow-hidden">
              <span className="relative z-0 -mr-4 text-right text-[clamp(7rem,12vw,11rem)] leading-[.72] font-black tracking-[-.1em] text-transparent [-webkit-text-stroke:2px_rgba(96,165,250,.45)] transition-colors group-hover:text-brand-primary/15">{index + 1}</span>
              <span className="relative z-10 block aspect-[2/3] overflow-hidden rounded-lg border border-transparent bg-surface transition-[transform,border-color] duration-200 group-hover:-translate-y-1 group-hover:border-border-strong">
                {poster ? <Image src={poster} alt={`${media.title} poster`} fill sizes="190px" className="object-cover" /> : <span className="flex size-full items-center justify-center text-text-muted"><Icon name="film" className="size-8" /></span>}
              </span>
              <span className="sr-only">{index + 1}. {media.title}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
