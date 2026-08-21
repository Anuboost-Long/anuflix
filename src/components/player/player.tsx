"use client"

import { useEffect, useRef, useState } from "react"
import { playbackProvider } from "@/lib/playback/provider"
import { progressStorage } from "@/lib/progress/storage"
import type { MediaItem } from "@/lib/tmdb/types"

interface PlayerEvent {
  type: "PLAYER_EVENT"
  data: {
    event: "timeupdate" | "play" | "pause" | "ended" | "seeked"
    currentTime: number
    duration: number
  }
}

function isPlayerEvent(value: unknown): value is PlayerEvent {
  if (!value || typeof value !== "object") return false
  const event = value as Partial<PlayerEvent>
  return event.type === "PLAYER_EVENT"
    && !!event.data
    && typeof event.data.currentTime === "number"
    && typeof event.data.duration === "number"
    && ["timeupdate", "play", "pause", "ended", "seeked"].includes(event.data.event ?? "")
}

export function Player({ media, season, episode }: Readonly<{ media: MediaItem; season?: number; episode?: number }>) {
  const [playerUrl, setPlayerUrl] = useState<string>()
  const lastSaved = useRef(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = progressStorage.get(media, season, episode)
      setPlayerUrl(playbackProvider.buildPlayerUrl({
        tmdbId: media.id,
        mediaType: media.mediaType,
        season,
        episode,
        startTime: saved?.currentTime,
      }))
    })
    return () => cancelAnimationFrame(frame)
  }, [media, season, episode])

  useEffect(() => {
    const providerOrigin = new URL(process.env.NEXT_PUBLIC_VIDKING_BASE_URL ?? "https://www.vidking.net").origin

    function handleMessage(event: MessageEvent) {
      if (event.origin !== providerOrigin || !isPlayerEvent(event.data)) return
      const { currentTime, duration } = event.data.data
      const now = Date.now()
      const immediate = ["pause", "seeked", "ended"].includes(event.data.data.event)

      if (!immediate && now - lastSaved.current < 7000) return
      lastSaved.current = now
      progressStorage.save({
        media,
        season,
        episode,
        currentTime,
        duration,
        percentage: event.data.data.event === "ended" ? 100 : duration > 0 ? (currentTime / duration) * 100 : 0,
        updatedAt: now,
      })
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [media, season, episode])

  if (!playerUrl) return <div className="aspect-video w-full animate-pulse bg-surface" aria-label="Loading player" />

  return (
    <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_28px_80px_rgba(0,0,0,.65)]">
      <iframe
        key={`${media.mediaType}-${media.id}-${season ?? 0}-${episode ?? 0}`}
        src={playerUrl}
        title={`Watch ${media.title}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className="size-full border-0"
      />
    </div>
  )
}
