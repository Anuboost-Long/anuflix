import { anilist } from "@/lib/anilist/client";
import type { AnilistMedia, AnilistPage } from "@/lib/anilist/types";
import type { MediaItem, TmdbDetails } from "@/lib/tmdb/types";

const MEDIA_FIELDS = `
  id
  title { english romaji }
  description(asHtml: false)
  format
  status
  startDate { year }
  episodes
  duration
  averageScore
  popularity
  genres
  bannerImage
  coverImage { extraLarge large }
`;

const ANIME_PAGE_QUERY = `
  query AnimePage {
    popularSeries: Page(page: 1, perPage: 20) {
      media(type: ANIME, format_in: [TV, TV_SHORT, ONA, OVA], isAdult: false, sort: POPULARITY_DESC) {
        ${MEDIA_FIELDS}
      }
    }
    popularMovies: Page(page: 1, perPage: 20) {
      media(type: ANIME, format: MOVIE, isAdult: false, sort: POPULARITY_DESC) {
        ${MEDIA_FIELDS}
      }
    }
    topRatedSeries: Page(page: 1, perPage: 20) {
      media(type: ANIME, format_in: [TV, TV_SHORT, ONA, OVA], isAdult: false, sort: SCORE_DESC) {
        ${MEDIA_FIELDS}
      }
    }
    topRatedMovies: Page(page: 1, perPage: 20) {
      media(type: ANIME, format: MOVIE, isAdult: false, sort: SCORE_DESC) {
        ${MEDIA_FIELDS}
      }
    }
  }
`;

const ANIME_DETAILS_QUERY = `
  query AnimeDetails($id: Int!) {
    Media(id: $id, type: ANIME) {
      ${MEDIA_FIELDS}
      recommendations(perPage: 20, sort: RATING_DESC) {
        nodes {
          mediaRecommendation {
            ${MEDIA_FIELDS}
          }
        }
      }
    }
  }
`;

function plainText(value?: string | null) {
  return (value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAnime(media: AnilistMedia): MediaItem {
  return {
    id: media.id,
    mediaType: "anime",
    animeFormat: media.format === "MOVIE" ? "movie" : "series",
    title: media.title.english ?? media.title.romaji ?? "Untitled anime",
    overview: plainText(media.description),
    posterPath: media.coverImage?.extraLarge ?? media.coverImage?.large ?? undefined,
    backdropPath: media.bannerImage ?? media.coverImage?.extraLarge ?? undefined,
    year: media.startDate?.year ?? undefined,
    voteAverage: (media.averageScore ?? 0) / 10,
    voteCount: media.popularity ?? 0,
    genreIds: [],
    popularity: media.popularity ?? undefined
  };
}

function normalizeDetails(media: AnilistMedia): TmdbDetails {
  return {
    id: media.id,
    name: media.title.english ?? media.title.romaji ?? "Untitled anime",
    overview: plainText(media.description),
    poster_path: media.coverImage?.extraLarge ?? media.coverImage?.large,
    backdrop_path: media.bannerImage ?? media.coverImage?.extraLarge,
    first_air_date: media.startDate?.year ? `${media.startDate.year}-01-01` : undefined,
    vote_average: (media.averageScore ?? 0) / 10,
    vote_count: media.popularity ?? 0,
    runtime: media.format === "MOVIE" ? (media.duration ?? undefined) : undefined,
    episode_run_time: media.format === "MOVIE" || !media.duration ? undefined : [media.duration],
    number_of_episodes: media.episodes ?? undefined,
    status: media.status
      ?.split("_")
      .map((word) => word[0] + word.slice(1).toLowerCase())
      .join(" "),
    genres: media.genres?.map((name, id) => ({ id, name })) ?? []
  };
}

export async function getAnimeContent() {
  const response = await anilist<{
    popularSeries: AnilistPage;
    popularMovies: AnilistPage;
    topRatedSeries: AnilistPage;
    topRatedMovies: AnilistPage;
  }>(ANIME_PAGE_QUERY);

  return {
    popularSeries: response.popularSeries.media.map(normalizeAnime),
    popularMovies: response.popularMovies.media.map(normalizeAnime),
    topRatedSeries: response.topRatedSeries.media.map(normalizeAnime),
    topRatedMovies: response.topRatedMovies.media.map(normalizeAnime)
  };
}

export async function getAnimeDetails(id: number) {
  const response = await anilist<{ Media: AnilistMedia | null }>(
    ANIME_DETAILS_QUERY,
    { id },
    10800
  );
  if (!response.Media) return null;

  return {
    media: normalizeAnime(response.Media),
    raw: normalizeDetails(response.Media),
    recommendations:
      response.Media.recommendations?.nodes.flatMap(({ mediaRecommendation }) =>
        mediaRecommendation ? [normalizeAnime(mediaRecommendation)] : []
      ) ?? []
  };
}
