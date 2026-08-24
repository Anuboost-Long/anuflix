"use server";

import { getLiveMatchesPage } from "@/lib/live/client";

export async function handleServeGetLiveMatches({
	category,
	query,
	page,
}: Readonly<{ category: string; query: string; page: number }>) {
	if (!Number.isInteger(page) || page < 1) throw new Error("Invalid live match page.");
	return getLiveMatchesPage({
		category: category.slice(0, 80),
		query: query.trim().slice(0, 100),
		page,
	});
}
