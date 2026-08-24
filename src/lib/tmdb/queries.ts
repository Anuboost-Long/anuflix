import { tmdb } from "@/lib/tmdb/client";
import { normalizeList, normalizeMedia } from "@/lib/tmdb/normalize";
import type {
	MediaItem,
	TmdbMediaType,
	TmdbDetails,
	TmdbGenre,
	TmdbList,
	TmdbMedia,
	TmdbSeason,
	TmdbSeasonSummary,
	TmdbEpisodePage,
} from "@/lib/tmdb/types";

async function mediaList(path: string, mediaType?: TmdbMediaType, revalidate = 1800) {
	const response = await tmdb<TmdbList<TmdbMedia>>(path, { include_adult: false }, revalidate);
	return normalizeList(response.results, mediaType);
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
		]);

	return { trending, trendingMovies, popularMovies, popularTv, topRatedMovies, topRatedTv };
}

export async function getAnimeContent() {
	const today = new Date();
	const year = today.getUTCFullYear();
	const seasonStartMonth = Math.floor(today.getUTCMonth() / 3) * 3;
	const seasonStart = new Date(Date.UTC(year, seasonStartMonth, 1)).toISOString().slice(0, 10);
	const seasonEnd = new Date(Date.UTC(year, seasonStartMonth + 3, 0)).toISOString().slice(0, 10);
	const filters = {
		with_genres: 16,
		with_keywords: 210024,
		certification_country: "US",
		"certification.lte": "TV-14",
	};
	const [spotlight, seasonal, popular, topRated, newReleases, mature] = await Promise.all([
		discoverMedia("tv", {
			...filters,
			"first_air_date.gte": `${year}-01-01`,
			"first_air_date.lte": `${year}-12-31`,
		}),
		discoverMedia("tv", {
			...filters,
			"air_date.gte": seasonStart,
			"air_date.lte": seasonEnd,
		}),
		discoverMedia("tv", filters),
		discoverMedia("tv", { ...filters, sort_by: "vote_average.desc", "vote_count.gte": 100 }),
		discoverMedia("tv", { ...filters, sort_by: "first_air_date.desc" }),
		discoverMedia("tv", {
			with_genres: 16,
			with_keywords: 210024,
			include_adult: true,
			certification_country: "US",
			certification: "TV-MA",
		}),
	]);

	return { spotlight, seasonal, popular, topRated, newReleases, mature };
}

export async function getMediaDetails(mediaType: TmdbMediaType, id: number) {
	const append =
		mediaType === "movie"
			? "videos,credits,recommendations"
			: "videos,aggregate_credits,recommendations";
	const details = await tmdb<TmdbDetails>(
		`/${mediaType}/${id}`,
		{
			append_to_response: append,
		},
		10800,
	);

	return {
		raw: details,
		media: normalizeMedia(details, mediaType),
		recommendations: normalizeList(details.recommendations?.results ?? [], mediaType),
	};
}

export async function getSeason(id: number, season: number) {
	return tmdb<TmdbSeason>(`/tv/${id}/season/${season}`, {}, 10800);
}

export async function getEpisodePage({
	id,
	season,
	page,
	summary,
	pageSize = 12,
}: {
	id: number;
	season: number;
	page: number;
	summary?: TmdbSeasonSummary;
	pageSize?: number;
}): Promise<TmdbEpisodePage | undefined> {
	const selected =
		summary ??
		(await tmdb<Pick<TmdbDetails, "seasons">>(`/tv/${id}`, {}, 10800)).seasons?.find(
			({ season_number }) => season_number === season,
		);

	if (!selected) return;

	const totalPages = Math.max(1, Math.ceil(selected.episode_count / pageSize));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const firstEpisode = (currentPage - 1) * pageSize + 1;
	const episodeNumbers = Array.from(
		{ length: Math.min(pageSize, selected.episode_count - firstEpisode + 1) },
		(_, index) => firstEpisode + index,
	);
	const episodes = await Promise.all(
		episodeNumbers.map((episode) =>
			tmdb<TmdbSeason["episodes"][number]>(
				`/tv/${id}/season/${selected.season_number}/episode/${episode}`,
				{},
				10800,
			),
		),
	);

	return { season: selected, episodes, page: currentPage, totalPages };
}

export async function searchMedia(query: string) {
	const response = await tmdb<TmdbList<TmdbMedia>>(
		"/search/multi",
		{
			query,
			include_adult: false,
		},
		60,
	);
	return normalizeList(response.results);
}

export async function discoverMedia(
	mediaType: TmdbMediaType,
	params: Record<string, string | number | boolean | undefined>,
) {
	const response = await tmdb<TmdbList<TmdbMedia>>(
		`/discover/${mediaType}`,
		{
			include_adult: false,
			sort_by: "popularity.desc",
			...params,
		},
		900,
	);
	return normalizeList(response.results, mediaType);
}

export async function getGenres(mediaType: TmdbMediaType) {
	const response = await tmdb<{ genres: TmdbGenre[] }>(`/genre/${mediaType}/list`, {}, 86400);
	return response.genres;
}

export async function getMediaList(path: string, mediaType: TmdbMediaType): Promise<MediaItem[]> {
	return mediaList(path, mediaType);
}
