"use client"

import { useEffect, useState } from "react"
import { MediaGrid } from "@/components/media/media-grid"
import type { WatchlistItem } from "@/lib/watchlist/storage"
import { watchlistStorage } from "@/lib/watchlist/storage"

export function MyListGrid() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const load = () => { setItems(watchlistStorage.getAll()); setReady(true) }
    load()
    window.addEventListener("anuflix:watchlist", load)
    return () => window.removeEventListener("anuflix:watchlist", load)
  }, [])

  if (!ready) return <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 6 }, (_, index) => <span key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />)}</div>
  if (!items.length) return <div className="border-y border-border py-20 text-center"><h2 className="text-2xl font-bold text-text-primary">Your list is ready for a first title</h2><p className="mt-2 text-sm text-text-secondary">Use My List on any movie or series to keep it here.</p></div>
  return <MediaGrid items={items} />
}
