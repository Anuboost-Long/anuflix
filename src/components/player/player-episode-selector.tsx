"use client";

import { Icon } from "@/components/shared/icon";
import { tmdbImage } from "@/lib/tmdb/images";
import type { TmdbSeason, TmdbSeasonSummary } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function PlayerEpisodeSelector({
	mediaId,
	currentSeason,
	currentEpisode,
	seasons,
	episodes,
}: Readonly<{
	mediaId: number;
	currentSeason: number;
	currentEpisode: number;
	seasons: TmdbSeasonSummary[];
	episodes: TmdbSeason["episodes"];
}>) {
	const search = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [seasonMenu, setSeasonMenu] = useState(false);
	const [query, setQuery] = useState("");
	const [selectedSeason, setSelectedSeason] = useState(currentSeason);
	const [seasonEpisodes, setSeasonEpisodes] = useState(episodes);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const request = useRef<AbortController>(null);
	const seasonCache = useRef(new Map<number, TmdbSeason["episodes"]>([[currentSeason, episodes]]));
	const term = query.trim().toLowerCase();
	const filteredEpisodes = term
		? seasonEpisodes.filter(
				({ name, episode_number }) =>
					name.toLowerCase().includes(term) || String(episode_number).includes(term),
			)
		: seasonEpisodes;

	useEffect(() => {
		if (!open) return;

		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setOpen(false);
		}

		document.addEventListener("keydown", closeOnEscape);
		search.current?.focus();
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [open]);

	useEffect(() => () => request.current?.abort(), []);

	async function selectSeason(season: number) {
		if (!seasons.some(({ season_number }) => season_number === season)) return;

		request.current?.abort();
		setSelectedSeason(season);
		setSeasonMenu(false);
		setQuery("");
		setError("");

		const cached = seasonCache.current.get(season);
		if (cached) {
			setSeasonEpisodes(cached);
			setLoading(false);
			return;
		}

		const controller = new AbortController();
		request.current = controller;
		setSeasonEpisodes([]);
		setLoading(true);

		try {
			const response = await fetch(`/api/tv/${mediaId}/season/${season}?full=true`, {
				signal: controller.signal,
			});
			if (!response.ok) throw new Error("Episodes could not be loaded.");
			const result = (await response.json()) as TmdbSeason;
			seasonCache.current.set(season, result.episodes);
			setSeasonEpisodes(result.episodes);
		} catch (requestError) {
			if (requestError instanceof Error && requestError.name !== "AbortError") {
				setError("Episodes could not be loaded. Choose the season again to retry.");
			}
		} finally {
			if (!controller.signal.aborted) setLoading(false);
		}
	}

	function navigate(season: number, episode: number) {
		window.location.assign(`/watch/tv/${mediaId}/${season}/${episode}`);
	}

	return (
		<>
			<button
				type="button"
				aria-label="Open episodes"
				onClick={() => setOpen(true)}
				className={clsx(
					"fixed top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] bottom-auto left-auto z-30 m-0 grid size-11 max-h-none max-w-none place-items-center rounded-full p-0",
					"bg-black/35 backdrop-blur-sm",
					"border-0",
					"text-white",
					"transition-[background-color,transform] duration-200 ease-out hover:bg-black/60 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
				)}
			>
				<Icon name="film" className={clsx("size-6")} />
			</button>

			<section
				role="dialog"
				aria-label="Episodes"
				aria-hidden={!open}
				inert={!open}
				className={clsx(
					"fixed top-[max(4.75rem,calc(env(safe-area-inset-top)+4.75rem))] right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] left-auto z-40 m-0 w-[min(26rem,calc(100vw-2rem))] max-h-none max-w-none overflow-y-auto overscroll-contain rounded-xl p-0",
					"bg-black/[.94] backdrop-blur-xl",
					"border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,.55)]",
					"transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
					open ? "visible translate-x-0 opacity-100" : "invisible translate-x-3 opacity-0",
				)}
			>
				<div
					className={clsx(
						"sticky top-0 z-10 flex items-center gap-2 bg-black/90 p-3 backdrop-blur-xl",
						"border-b border-white/10",
					)}
				>
					<div className={clsx("relative shrink-0")}>
						<button
							type="button"
							aria-expanded={seasonMenu}
							onClick={() => setSeasonMenu((visible) => !visible)}
							className={clsx(
								"inline-flex h-10 items-center gap-2 rounded-lg px-3",
								"bg-brand-primary/15",
								"text-xs font-bold text-brand-light",
								"transition-colors hover:bg-brand-primary/25 focus-visible:outline-2 focus-visible:outline-white",
							)}
						>
							Season {selectedSeason}
							<Icon
								name="arrow-right"
								className={clsx("size-4 rotate-90 transition-transform", seasonMenu && "-rotate-90")}
							/>
						</button>

						<div
							inert={!seasonMenu}
							className={clsx(
								"absolute top-[calc(100%+.5rem)] left-0 max-h-64 min-w-full overflow-y-auto rounded-xl p-1",
								"border border-white/10 bg-background-secondary/[.98]",
								"shadow-[0_18px_50px_rgba(0,0,0,.65)]",
								"transition-[opacity,transform,visibility] duration-150",
								seasonMenu ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
							)}
						>
							{seasons.map(({ season_number }) => (
								<button
									key={season_number}
									type="button"
									aria-current={season_number === selectedSeason ? "true" : undefined}
									onClick={() => selectSeason(season_number)}
									className={clsx(
										"block h-10 w-full whitespace-nowrap rounded-lg px-3 text-left text-sm font-semibold",
										season_number === selectedSeason
											? "bg-brand-primary text-white"
											: "text-text-secondary hover:bg-white/8 hover:text-white",
									)}
								>
									Season {season_number}
								</button>
							))}
						</div>
					</div>

					<label
						className={clsx(
							"flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full px-3",
							"border border-white/10 bg-white/5",
							"text-text-secondary",
						)}
					>
						<Icon name="search" className={clsx("size-4 shrink-0")} />
						<input
							ref={search}
							type="search"
							aria-label="Search episodes"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search episodes"
							className={clsx(
								"min-w-0 flex-1 bg-transparent outline-none",
								"text-sm text-white placeholder:text-text-muted",
							)}
						/>
					</label>

					<button
						type="button"
						aria-label="Close episodes"
						onClick={() => setOpen(false)}
						className={clsx(
							"grid size-10 shrink-0 place-items-center rounded-lg",
							"border border-white/10 bg-white/[.08]",
							"text-white",
							"transition-colors hover:bg-white/[.15] focus-visible:outline-2 focus-visible:outline-white",
						)}
					>
						<Icon name="close" className={clsx("size-5")} />
					</button>
				</div>

				<div aria-busy={loading} className={clsx("w-full px-3 pt-6 pb-8 sm:px-4 sm:pt-8")}>
					<header className={clsx("mb-5 text-center")}>
						<h2 className={clsx("text-2xl font-black text-white")}>Season {selectedSeason}</h2>
						<p className={clsx("mt-2 text-xs font-bold tracking-[.18em] text-text-secondary uppercase")}>
							<span className={clsx("text-brand-light")}>•</span> {seasonEpisodes.length} episodes
						</p>
					</header>

					<div className={clsx("space-y-3 transition-opacity", loading && "opacity-45")}>
						{filteredEpisodes.map((item) => {
							const selected = selectedSeason === currentSeason && item.episode_number === currentEpisode;
							const still = tmdbImage.still(item.still_path ?? undefined, "w780");

							return (
								<button
									key={item.id}
									type="button"
									aria-current={selected ? "true" : undefined}
									onClick={() => navigate(selectedSeason, item.episode_number)}
									className={clsx(
										"group relative block aspect-video w-full overflow-hidden rounded-lg text-left",
										"bg-background-secondary",
										selected ? "ring-2 ring-white" : "ring-1 ring-white/[.08]",
										"transition-transform duration-300 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
									)}
								>
									{still && (
										<Image
											src={still}
											alt=""
											fill
											sizes="(max-width: 448px) calc(100vw - 2rem), 26rem"
											className={clsx(
												"object-cover",
												"transition-transform duration-500 group-hover:scale-[1.025]",
											)}
										/>
									)}
									<span
										className={clsx(
											"absolute inset-0",
											"bg-gradient-to-t from-black via-black/25 to-transparent",
										)}
									/>
									<span className={clsx("absolute right-0 bottom-0 left-0 block p-3 sm:p-4")}>
										<span className={clsx("flex flex-wrap items-center gap-2")}>
											{selected && (
												<span
													className={clsx(
														"rounded-md bg-brand-primary px-2 py-1",
														"text-[10px] font-black tracking-wide text-white uppercase sm:text-xs",
													)}
												>
													Watching
												</span>
											)}
											<strong className={clsx("text-base font-black text-white sm:text-lg")}>
												{item.episode_number}. {item.name}
											</strong>
										</span>
										{item.runtime && (
											<span className={clsx("mt-1 block text-sm font-semibold text-text-secondary")}>
												{item.runtime} min
											</span>
										)}
										{item.overview && (
											<span
												className={clsx("mt-2 hidden line-clamp-2 text-sm leading-5 text-white/80 sm:block")}
											>
												{item.overview}
											</span>
										)}
									</span>
								</button>
							);
						})}
					</div>

					{loading ? (
						<p className={clsx("py-16 text-center text-sm text-text-secondary")}>Loading episodes…</p>
					) : null}
					{error ? (
						<p role="alert" className={clsx("py-16 text-center text-sm text-red-300")}>
							{error}
						</p>
					) : null}
					{!loading && !error && filteredEpisodes.length === 0 && (
						<p className={clsx("py-20 text-center text-sm text-text-secondary")}>No episodes found.</p>
					)}
				</div>
			</section>
		</>
	);
}
