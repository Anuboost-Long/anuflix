import type { MediaType } from "@/lib/tmdb/types"

export interface PlaybackRequest {
  tmdbId: number
  mediaType: MediaType
  season?: number
  episode?: number
  startTime?: number
  autoplay?: boolean
}

export interface PlaybackProvider {
  buildPlayerUrl(request: PlaybackRequest): string
}
