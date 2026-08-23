import type { MediaType } from "@/lib/tmdb/types";

export interface PlaybackRequest {
  mediaId: number;
  mediaType: MediaType;
  season?: number;
  episode?: number;
  startTime?: number;
  autoplay?: boolean;
  animeMovie?: boolean;
}

export interface PlaybackProvider {
  buildPlayerUrl(request: PlaybackRequest): string;
}
