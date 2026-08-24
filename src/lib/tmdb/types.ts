export type MediaType = "movie" | "tv" | "anime";
export type TmdbMediaType = Exclude<MediaType, "anime">;

export interface MediaItem {
	id: number;
	mediaType: MediaType;
	animeFormat?: "movie" | "series";
	title: string;
	overview: string;
	posterPath?: string;
	backdropPath?: string;
	year?: number;
	voteAverage: number;
	voteCount: number;
	genreIds: number[];
	popularity?: number;
}

export interface TmdbMedia {
	id: number;
	media_type?: "movie" | "tv" | "person";
	title?: string;
	name?: string;
	overview?: string;
	poster_path?: string | null;
	backdrop_path?: string | null;
	release_date?: string;
	first_air_date?: string;
	vote_average?: number;
	vote_count?: number;
	genre_ids?: number[];
	genres?: TmdbGenre[];
	popularity?: number;
}

export interface TmdbGenre {
	id: number;
	name: string;
}

export interface TmdbList<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface TmdbCredits {
	cast: Array<{
		id: number;
		name: string;
		character?: string;
		profile_path?: string | null;
	}>;
	crew: Array<{
		id: number;
		name: string;
		job?: string;
	}>;
}

export interface TmdbVideo {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
}

export interface TmdbDetails extends TmdbMedia {
	runtime?: number;
	episode_run_time?: number[];
	number_of_seasons?: number;
	number_of_episodes?: number;
	status?: string;
	tagline?: string;
	seasons?: TmdbSeasonSummary[];
	credits?: TmdbCredits;
	aggregate_credits?: TmdbCredits;
	videos?: { results: TmdbVideo[] };
	recommendations?: TmdbList<TmdbMedia>;
}

export interface TmdbSeasonSummary {
	id: number;
	name: string;
	season_number: number;
	episode_count: number;
	poster_path?: string | null;
}

export interface TmdbSeason {
	id: number;
	name: string;
	overview?: string;
	season_number: number;
	episodes: Array<{
		id: number;
		name: string;
		overview?: string;
		episode_number: number;
		season_number: number;
		still_path?: string | null;
		runtime?: number | null;
		air_date?: string | null;
		vote_average?: number;
	}>;
}

export interface TmdbEpisodePage {
	season: TmdbSeasonSummary;
	episodes: TmdbSeason["episodes"];
	page: number;
	totalPages: number;
}
