import { ApiRequestError, ApiServiceServer } from "@/api/api-helper";

const ANILIST_API_URL = "https://graphql.anilist.co";

interface AnilistResponse<T> {
	data?: T;
	errors?: Array<{ message: string }>;
}

export async function anilist<T>(
	query: string,
	variables: Record<string, unknown> = {},
	revalidate = 1800,
) {
	let result: AnilistResponse<T>;
	try {
		result = await ApiServiceServer<AnilistResponse<T>>({
			url: ANILIST_API_URL,
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			data: { query, variables },
			revalidate,
		});
	} catch (error) {
		if (error instanceof ApiRequestError) {
			throw new Error(`AniList request failed with ${error.status}`);
		}
		throw error;
	}

	if (result.errors?.length || !result.data) {
		throw new Error(result.errors?.[0]?.message ?? "AniList response did not include data.");
	}

	return result.data;
}
