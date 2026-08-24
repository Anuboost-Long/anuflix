"use client";

import { SeasonSelector } from "@/components/details/season-selector";
import { Icon } from "@/components/shared/icon";
import { tmdbImage } from "@/lib/tmdb/images";
import type { TmdbEpisodePage, TmdbSeasonSummary } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function EpisodeBrowser({
	mediaId,
	seasons,
	initialPage,
}: Readonly<{
	mediaId: number;
	seasons: TmdbSeasonSummary[];
	initialPage: TmdbEpisodePage;
}>) {
	const [episodePage, setEpisodePage] = useState(initialPage);
	const [selectedSeason, setSelectedSeason] = useState(initialPage.season.season_number);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const request = useRef<AbortController>(null);
	const pages = useRef(
		new Map([[`${initialPage.season.season_number}:${initialPage.page}`, initialPage]]),
	);

	useEffect(() => () => request.current?.abort(), []);

	function updateUrl(page: TmdbEpisodePage) {
		const url = new URL(window.location.href);
		url.searchParams.set("season", String(page.season.season_number));
		if (page.page > 1) {
			url.searchParams.set("page", String(page.page));
		} else {
			url.searchParams.delete("page");
		}
		window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
	}

	async function showPage(season: number, page: number, scroll = false) {
		const key = `${season}:${page}`;
		const cached = pages.current.get(key);
		setSelectedSeason(season);
		setError("");

		if (cached) {
			setEpisodePage(cached);
			updateUrl(cached);
			if (scroll) document.getElementById("episodes-title")?.scrollIntoView();
			return;
		}

		request.current?.abort();
		const controller = new AbortController();
		request.current = controller;
		setLoading(true);

		try {
			const response = await fetch(`/api/tv/${mediaId}/season/${season}?page=${page}`, {
				signal: controller.signal,
			});
			if (!response.ok) throw new Error("Episodes could not be loaded.");
			const result = (await response.json()) as TmdbEpisodePage;
			pages.current.set(`${result.season.season_number}:${result.page}`, result);
			setEpisodePage(result);
			updateUrl(result);
			if (scroll) document.getElementById("episodes-title")?.scrollIntoView();
		} catch (requestError) {
			if (requestError instanceof Error && requestError.name !== "AbortError") {
				setSelectedSeason(episodePage.season.season_number);
				setError("Episodes could not be loaded. Try again.");
			}
		} finally {
			if (!controller.signal.aborted) setLoading(false);
		}
	}

	return (
		<section aria-labelledby="episodes-title">
			<div className="mb-6 flex items-end justify-between gap-4">
				<div>
					<span className="text-[11px] font-semibold tracking-[.16em] text-brand-light uppercase">
						Episodes
					</span>
					<h2
						id="episodes-title"
						className="mt-1 scroll-mt-28 text-2xl font-bold tracking-tight text-text-primary"
					>
						{seasons.find(({ season_number }) => season_number === selectedSeason)?.name ??
							`Season ${selectedSeason}`}
					</h2>
				</div>
				<SeasonSelector
					mediaId={mediaId}
					seasons={seasons}
					currentSeason={selectedSeason}
					onSelect={(season) => showPage(season, 1)}
					disabled={loading}
				/>
			</div>

			<div
				aria-busy={loading}
				className={clsx(
					"divide-y divide-border border-y border-border transition-opacity",
					loading && "opacity-45",
				)}
			>
				{episodePage.episodes.map((episode) => {
					const still = tmdbImage.still(episode.still_path ?? undefined);
					return (
						<Link
							key={episode.id}
							href={`/watch/tv/${mediaId}/${episode.season_number}/${episode.episode_number}`}
							className="group grid grid-cols-[7rem_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-surface/50 sm:grid-cols-[12rem_1fr_auto] sm:px-3"
						>
							<span className="relative aspect-video overflow-hidden rounded-md bg-surface">
								{still ? (
									<Image
										src={still}
										alt=""
										fill
										sizes="192px"
										className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
									/>
								) : (
									<span className="flex size-full items-center justify-center text-text-muted">
										<Icon name="film" className="size-6" />
									</span>
								)}
							</span>
							<span className="min-w-0">
								<span className="text-xs text-text-muted">
									Episode {episode.episode_number}
									{episode.runtime ? ` · ${episode.runtime} min` : ""}
								</span>
								<strong className="mt-1 block truncate text-sm text-text-primary sm:text-base">
									{episode.name}
								</strong>
								<span className="mt-1 hidden line-clamp-2 text-sm leading-5 text-text-secondary sm:block">
									{episode.overview || "No episode description available."}
								</span>
							</span>
							<span className="flex size-10 items-center justify-center rounded-full border border-border-strong text-brand-light transition-colors group-hover:bg-brand-primary group-hover:text-white">
								<Icon name="play" className="size-4" />
							</span>
						</Link>
					);
				})}
			</div>

			{episodePage.totalPages > 1 ? (
				<nav
					aria-label="Episode pagination"
					className="mt-6 flex items-center justify-between gap-4 border-b border-border pb-6"
				>
					<button
						type="button"
						disabled={loading || episodePage.page === 1}
						onClick={() => showPage(selectedSeason, episodePage.page - 1, true)}
						className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-text-secondary transition-[color,background-color,border-color,transform] duration-200 enabled:hover:border-border-strong enabled:hover:bg-surface enabled:hover:text-text-primary motion-safe:enabled:hover:-translate-x-0.5 disabled:border-transparent disabled:text-text-subtle"
					>
						<Icon name="arrow-left" className="size-4" /> Previous
					</button>
					<span className="text-sm text-text-muted" aria-current="page">
						Page {episodePage.page} of {episodePage.totalPages}
					</span>
					<button
						type="button"
						disabled={loading || episodePage.page === episodePage.totalPages}
						onClick={() => showPage(selectedSeason, episodePage.page + 1, true)}
						className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-text-secondary transition-[color,background-color,border-color,transform] duration-200 enabled:hover:border-border-strong enabled:hover:bg-surface enabled:hover:text-text-primary motion-safe:enabled:hover:translate-x-0.5 disabled:border-transparent disabled:text-text-subtle"
					>
						Next <Icon name="arrow-right" className="size-4" />
					</button>
				</nav>
			) : null}
			{error ? (
				<p role="alert" className="mt-4 text-sm text-red-300">
					{error}
				</p>
			) : null}
		</section>
	);
}
