"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"
import { Icon } from "@/components/shared/icon"
import type { MediaItem } from "@/lib/tmdb/types"
import { watchlistStorage } from "@/lib/watchlist/storage"

export function WatchlistButton({
  media,
  compact = false,
}: Readonly<{ media: MediaItem; compact?: boolean }>) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSaved(watchlistStorage.has(media.id, media.mediaType))
    })
    return () => cancelAnimationFrame(frame)
  }, [media.id, media.mediaType])

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface/75 px-5 backdrop-blur-md",
        "text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light",
        compact && "size-10 h-10 p-0",
      )}
      aria-label={saved ? `Remove ${media.title} from My List` : `Add ${media.title} to My List`}
      onClick={() => setSaved(watchlistStorage.toggle(media))}
    >
      <Icon name={saved ? "check" : "bookmark"} className="size-4" />
      {!compact && (saved ? "In My List" : "My List")}
    </button>
  )
}
