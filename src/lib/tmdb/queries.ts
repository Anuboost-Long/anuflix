import { tmdb } from "@/lib/tmdb/client"
import { normalizeList, normalizeMedia } from "@/lib/tmdb/normalize"
import type {
  MediaItem,
  MediaType,
  TmdbDetails,
  TmdbGenre,
  TmdbList,
  TmdbMedia,
  TmdbSeason,
} from "@/lib/tmdb/types"

async function mediaList(path: string, mediaType?: MediaType, revalidate = 1800) {
  const response = await tmdb<TmdbList<TmdbMedia>>(path, { include_adult: false }, revalidate)
  return normalizeList(response.results, mediaType)
}

export async function getHomeContent() {
  const [trending, trendingMovies, popularMovies, popularTv, topRatedMovies, topRatedTv] =
    await Promise.all([
      mediaList("/trending/all/day", undefined, 600),
      mediaList("/trending/movie/day", "movie", 600),
      mediaList("/movie/popular", "movie"),
      mediaList("/tv/popular", "tv"),
      mediaList("/movie/top_rated", "movie", 3600),
      mediaList("/tv/top_rated", "tv", 3600),
    ])

  return { trending, trendingMovies, popularMovies, popularTv, topRatedMovies, topRatedTv }
}

export async function getMediaDetails(mediaType: MediaType, id: number) {
  const append = mediaType === "movie"
    ? "videos,credits,recommendations"
    : "videos,aggregate_credits,recommendations"
  const details = await tmdb<TmdbDetails>(`/${mediaType}/${id}`, {
    append_to_response: append,
  }, 10800)

  return {
    raw: details,
    media: normalizeMedia(details, mediaType),
    recommendations: normalizeList(details.recommendations?.results ?? [], mediaType),
  }
}

export async function getSeason(id: number, season: number) {
  return tmdb<TmdbSeason>(`/tv/${id}/season/${season}`, {}, 10800)
}

export async function searchMedia(query: string) {
  const response = await tmdb<TmdbList<TmdbMedia>>("/search/multi", {
    query,
    include_adult: false,
  }, 60)
  return normalizeList(response.results)
}

export async function discoverMedia(
  mediaType: MediaType,
  params: Record<string, string | number | boolean | undefined>,
) {
  const response = await tmdb<TmdbList<TmdbMedia>>(`/discover/${mediaType}`, {
    include_adult: false,
    sort_by: "popularity.desc",
    ...params,
  }, 900)
  return normalizeList(response.results, mediaType)
}

export async function getGenres(mediaType: MediaType) {
  const response = await tmdb<{ genres: TmdbGenre[] }>(`/genre/${mediaType}/list`, {}, 86400)
  return response.genres
}

export async function getMediaList(path: string, mediaType: MediaType): Promise<MediaItem[]> {
  return mediaList(path, mediaType)
}
