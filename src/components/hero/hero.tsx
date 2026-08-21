import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { Icon } from "@/components/shared/icon"
import { WatchlistButton } from "@/components/media/watchlist-button"
import { tmdbImage } from "@/lib/tmdb/images"
import type { MediaItem } from "@/lib/tmdb/types"

export function Hero({ media }: Readonly<{ media: MediaItem }>) {
  const backdrop = tmdbImage.backdrop(media.backdropPath)

  return (
    <section className="relative min-h-[62vh] overflow-hidden sm:min-h-[74vh]" aria-labelledby="featured-title">
      {backdrop && <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover object-[64%_center] sm:object-center" />}
      <div className={clsx("absolute inset-0", "bg-[linear-gradient(to_right,rgba(5,9,20,.98)_0%,rgba(5,9,20,.72)_38%,transparent_72%),linear-gradient(to_bottom,rgba(5,9,20,.35)_0%,transparent_36%,#050914_100%)]")} />
      <div className="relative flex min-h-[62vh] max-w-3xl flex-col justify-end px-[clamp(1.25rem,4vw,4.5rem)] pb-16 pt-28 sm:min-h-[74vh] sm:pb-24">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border-strong bg-background/45 px-3 py-1.5 text-[10px] font-bold tracking-[.15em] text-brand-light uppercase backdrop-blur-md"><Icon name="spark" className="size-3.5" /> Featured today</span>
        <h1 id="featured-title" className="max-w-[12ch] text-4xl leading-[.92] font-black tracking-[-.055em] text-text-primary sm:text-6xl lg:text-[5.5rem]">{media.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-text-secondary sm:text-sm">
          {media.year && <span>{media.year}</span>}
          <span className="text-brand-light">★ {media.voteAverage.toFixed(1)}</span>
          <span>{media.mediaType === "movie" ? "Film" : "Series"}</span>
          <span className="border border-border-strong px-1.5 py-0.5 text-[10px] text-white">4K</span>
        </div>
        <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">{media.overview}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={`/watch/${media.mediaType}/${media.id}${media.mediaType === "tv" ? "/1/1" : ""}`} className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white shadow-[0_0_28px_rgba(37,99,235,.25)] transition-colors hover:bg-brand-bright"><Icon name="play" className="size-5" /> Play now</Link>
          <WatchlistButton media={media} />
          <Link href={`/${media.mediaType}/${media.id}`} className="grid size-12 place-items-center rounded-full border border-border bg-surface/70 text-text-secondary backdrop-blur-md transition-colors hover:bg-surface-hover hover:text-white" aria-label={`More information about ${media.title}`}><Icon name="info" className="size-5" /></Link>
        </div>
      </div>
      <span className="absolute right-[clamp(1.25rem,4vw,4.5rem)] bottom-9 hidden text-[10px] font-semibold tracking-[.22em] text-text-muted sm:block">ANU / 01</span>
    </section>
  )
}
