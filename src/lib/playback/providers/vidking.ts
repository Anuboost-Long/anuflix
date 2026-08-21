import type { PlaybackProvider, PlaybackRequest } from "@/lib/playback/types"

function buildPlayerUrl(request: PlaybackRequest) {
  const base = process.env.NEXT_PUBLIC_VIDKING_BASE_URL ?? "https://www.vidking.net"
  const color = process.env.NEXT_PUBLIC_PLAYER_COLOR ?? "1D8FFF"
  const path = request.mediaType === "movie"
    ? `/embed/movie/${request.tmdbId}`
    : `/embed/tv/${request.tmdbId}/${request.season ?? 1}/${request.episode ?? 1}`
  const params = new URLSearchParams({
    color,
    autoPlay: String(request.autoplay ?? true),
  })

  if (request.mediaType === "tv") {
    params.set("nextEpisode", "true")
    params.set("episodeSelector", "true")
  }

  if (request.startTime && request.startTime > 0) {
    params.set("progress", String(Math.floor(request.startTime)))
  }

  return `${base}${path}?${params}`
}

export const vidkingProvider: PlaybackProvider = { buildPlayerUrl }
