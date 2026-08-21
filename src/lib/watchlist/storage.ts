import type { MediaItem } from "@/lib/tmdb/types"

const WATCHLIST_KEY = "anuflix_watchlist"

export interface WatchlistItem extends MediaItem {
  addedAt: number
}

function read(): WatchlistItem[] {
  if (typeof window === "undefined") return []

  try {
    const value = JSON.parse(localStorage.getItem(WATCHLIST_KEY) ?? "[]")
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function write(items: WatchlistItem[]) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event("anuflix:watchlist"))
}

export const watchlistStorage = {
  getAll: read,
  has: (id: number, mediaType: MediaItem["mediaType"]) =>
    read().some((item) => item.id === id && item.mediaType === mediaType),
  toggle: (media: MediaItem) => {
    const items = read()
    const exists = items.some(
      (item) => item.id === media.id && item.mediaType === media.mediaType,
    )
    write(exists
      ? items.filter((item) => item.id !== media.id || item.mediaType !== media.mediaType)
      : [{ ...media, addedAt: Date.now() }, ...items])
    return !exists
  },
}
