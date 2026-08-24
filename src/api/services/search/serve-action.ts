"use server";

import { searchMedia } from "@/lib/tmdb/queries";

export async function handleServeSearchMedia(query: string) {
	const value = query.trim();
	if (value.length < 2 || value.length > 100) return [];
	return (await searchMedia(value)).slice(0, 20);
}
