"use server";

import { getEpisodePage, getSeason } from "@/lib/tmdb/queries";

function validateSeason(mediaId: number, season: number) {
	if (!Number.isInteger(mediaId) || mediaId < 1 || !Number.isInteger(season) || season < 1) {
		throw new Error("Invalid TV season.");
	}
}

export async function handleServeGetEpisodePage({
	mediaId,
	season,
	page,
}: Readonly<{ mediaId: number; season: number; page: number }>) {
	validateSeason(mediaId, season);
	if (!Number.isInteger(page) || page < 1) throw new Error("Invalid episode page.");
	const result = await getEpisodePage({ id: mediaId, season, page });
	if (!result) throw new Error("TV season not found.");
	return result;
}

export async function handleServeGetSeason({
	mediaId,
	season,
}: Readonly<{ mediaId: number; season: number }>) {
	validateSeason(mediaId, season);
	return getSeason(mediaId, season);
}
