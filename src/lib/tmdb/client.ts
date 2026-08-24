import { ApiRequestError, ApiServiceServer } from "@/api/api-helper";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export class TmdbError extends Error {
	constructor(
		message: string,
		readonly status: number,
	) {
		super(message);
		this.name = "TmdbError";
	}
}

export async function tmdb<T>(
	path: string,
	params: Record<string, string | number | boolean | undefined> = {},
	revalidate = 1800,
): Promise<T> {
	const token = process.env.TMDB_API_READ_TOKEN;

	if (!token) {
		throw new TmdbError("TMDB_API_READ_TOKEN is not configured.", 500);
	}

	try {
		return await ApiServiceServer<T>({
			url: `${TMDB_BASE_URL}${path}`,
			method: "GET",
			params: { language: "en-US", ...params },
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			revalidate,
		});
	} catch (error) {
		if (error instanceof ApiRequestError) {
			throw new TmdbError(`TMDB request failed with status ${error.status}.`, error.status);
		}
		throw error;
	}
}
