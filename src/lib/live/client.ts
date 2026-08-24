import { ApiRequestError, ApiServiceServer } from "@/api/api-helper";
import type {
	LiveMatch,
	LiveMatchesPage,
	LiveSource,
	LiveSport,
	LiveStream,
} from "@/lib/live/types";

const STREAMED_URL = "https://streamed.pk";
const STREAMED_EMBED_HOSTS = new Set(["embed.st"]);

export class StreamedError extends Error {
	constructor(
		message: string,
		readonly status: number,
	) {
		super(message);
		this.name = "StreamedError";
	}
}

async function streamed<T>(path: string, revalidate: number | false): Promise<T> {
	try {
		return await ApiServiceServer<T>({
			url: `${STREAMED_URL}${path}`,
			method: "GET",
			headers: { Accept: "application/json" },
			revalidate,
		});
	} catch (error) {
		if (error instanceof ApiRequestError) {
			throw new StreamedError(`Streamed request failed with status ${error.status}.`, error.status);
		}
		throw error;
	}
}

export async function getLiveCatalog() {
	const [sports, page] = await Promise.all([
		streamed<LiveSport[]>("/api/sports", 86400),
		getLiveMatchesPage(),
	]);

	return { sports, ...page };
}

export async function getLiveMatchesPage({
	category = "all",
	query = "",
	page = 1,
	pageSize = 48,
}: {
	category?: string;
	query?: string;
	page?: number;
	pageSize?: number;
} = {}): Promise<LiveMatchesPage> {
	const [matches, live] = await Promise.all([
		streamed<LiveMatch[]>("/api/matches/all", 300),
		streamed<LiveMatch[]>("/api/matches/live", 60),
	]);
	const liveIds = new Set(live.map(({ id }) => id));
	const normalizedQuery = query.trim().toLowerCase();
	const filtered = matches
		.filter((match) => category === "all" || match.category === category)
		.filter(
			(match) =>
				!normalizedQuery ||
				[
					match.title,
					match.category.replaceAll("-", " "),
					match.teams?.home?.name,
					match.teams?.away?.name,
				].some((value) => value?.toLowerCase().includes(normalizedQuery)),
		)
		.sort((left, right) => {
			const liveDifference = Number(liveIds.has(right.id)) - Number(liveIds.has(left.id));
			return liveDifference || left.date - right.date;
		});
	const start = (page - 1) * pageSize;

	return {
		matches: filtered.slice(start, start + pageSize),
		liveIds: live.map(({ id }) => id),
		liveCount: live.length,
		total: filtered.length,
		page,
		hasMore: start + pageSize < filtered.length,
	};
}

export async function getLiveMatch(id: string) {
	const matches = await streamed<LiveMatch[]>("/api/matches/all", 60);
	return matches.find((match) => match.id === id);
}

async function getSourceStreams(source: LiveSource) {
	return streamed<LiveStream[]>(
		`/api/stream/${encodeURIComponent(source.source)}/${encodeURIComponent(source.id)}`,
		false,
	);
}

export async function getMatchStreams(sources: LiveSource[]) {
	const results = await Promise.allSettled(sources.map(getSourceStreams));
	return results
		.flatMap((result) => (result.status === "fulfilled" ? result.value : []))
		.filter(({ embedUrl }) => {
			try {
				const url = new URL(embedUrl);
				return url.protocol === "https:" && STREAMED_EMBED_HOSTS.has(url.hostname);
			} catch {
				return false;
			}
		});
}
