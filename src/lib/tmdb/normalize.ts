import type { MediaItem, MediaType, TmdbMedia } from "@/lib/tmdb/types"

export function normalizeMedia(item: TmdbMedia, fallbackType?: MediaType): MediaItem | null {
  const mediaType = item.media_type === "movie" || item.media_type === "tv"
    ? item.media_type
    : fallbackType
  const title = item.title ?? item.name

  if (!mediaType || !title) {
    return null
  }

  const date = item.release_date ?? item.first_air_date

  return {
    id: item.id,
    mediaType,
    title,
    overview: item.overview ?? "",
    posterPath: item.poster_path ?? undefined,
    backdropPath: item.backdrop_path ?? undefined,
    year: date ? Number(date.slice(0, 4)) : undefined,
    voteAverage: item.vote_average ?? 0,
    voteCount: item.vote_count ?? 0,
    genreIds: item.genre_ids ?? item.genres?.map(({ id }) => id) ?? [],
    popularity: item.popularity,
  }
}

export function normalizeList(items: TmdbMedia[], fallbackType?: MediaType) {
  return items
    .map((item) => normalizeMedia(item, fallbackType))
    .filter((item): item is MediaItem => item !== null)
}
