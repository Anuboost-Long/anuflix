import type { MediaItem } from "@/lib/tmdb/types";

export function watchPath(
  media: Pick<MediaItem, "animeFormat" | "id" | "mediaType">,
  season = 1,
  episode = 1
) {
  switch (media.mediaType) {
    case "movie":
      return `/watch/movie/${media.id}`;
    case "tv":
      return `/watch/tv/${media.id}/${season}/${episode}`;
    case "anime":
      return `/watch/anime/${media.id}${media.animeFormat === "movie" ? "" : `/${episode}`}`;
  }
}
