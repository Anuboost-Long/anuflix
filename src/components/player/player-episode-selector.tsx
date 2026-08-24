"use client";

import { handleServeGetSeason } from "@/api/services/tv/serve-action";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { tmdbImage } from "@/lib/tmdb/images";
import type { TmdbSeason, TmdbSeasonSummary } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	const dialog = useRef<HTMLDialogElement>(null);
	const search = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [seasonMenu, setSeasonMenu] = useState(false);
	const [query, setQuery] = useState("");
	const [selectedSeason, setSelectedSeason] = useState(currentSeason);
	const [seasonEpisodes, setSeasonEpisodes] = useState(episodes);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const request = useRef(0);
	const seasonCache = useRef(new Map<number, TmdbSeason["episodes"]>([[currentSeason, episodes]]));
	const term = query.trim().toLowerCase();
	const filteredEpisodes = term
		? seasonEpisodes.filter(
				({ name, episode_number }) =>
					name.toLowerCase().includes(term) || String(episode_number).includes(term),
			)
		: seasonEpisodes;

	useEffect(() => {
		const element = dialog.current;
		if (!element) return;

		if (open) {
			if (!element.open) element.showModal();
			search.current?.focus();
		} else if (element.open) {
			element.close();
		}
	}, [open]);

	async function selectSeason(season: number) {
		if (!seasons.some(({ season_number }) => season_number === season)) return;

		const requestId = ++request.current;
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

		setSeasonEpisodes([]);
		setLoading(true);

		try {
			const result = await handleServeGetSeason({ mediaId, season });
			if (requestId !== request.current) return;
			seasonCache.current.set(season, result.episodes);
			setSeasonEpisodes(result.episodes);
		} catch {
			if (requestId === request.current) {
				setError(t(translation.Player.FailedEpisodes));
			}
		} finally {
			if (requestId === request.current) setLoading(false);
		}
	}

	function navigate(season: number, episode: number) {
		window.location.assign(`/watch/tv/${mediaId}/${season}/${episode}`);
	}

	return (
		<>
			<button
				type="button"
				aria-label={t(translation.Player.OpenEpisodes)}
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

			<dialog
				ref={dialog}
				aria-label={t(translation.Common.Episodes)}
				onCancel={() => setOpen(false)}
				className={clsx(
					"fixed top-[max(4.75rem,calc(env(safe-area-inset-top)+4.75rem))] right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] left-auto z-40 m-0 max-h-[calc(100dvh-max(4.75rem,calc(env(safe-area-inset-top)+4.75rem))-max(1rem,env(safe-area-inset-bottom)))] w-[min(26rem,calc(100vw-2rem))] max-w-none overflow-y-auto overscroll-contain rounded-xl p-0 backdrop:bg-transparent",
					"bg-black/94 backdrop-blur-xl",
					"border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,.55)]",
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
							{t(translation.Common.Season, { number: selectedSeason })}
							<Icon
								name="arrow-right"
								className={clsx("size-4 rotate-90 transition-transform", seasonMenu && "-rotate-90")}
							/>
						</button>

						<div
							inert={!seasonMenu}
							className={clsx(
								"absolute top-[calc(100%+.5rem)] left-0 max-h-64 min-w-full overflow-y-auto rounded-xl p-1",
								"border border-white/10 bg-background-secondary/98",
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
									{t(translation.Common.Season, { number: season_number })}
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
							aria-label={t(translation.Player.SearchEpisodes)}
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={t(translation.Player.SearchEpisodes)}
							className={clsx(
								"min-w-0 flex-1 bg-transparent outline-none",
								"text-sm text-white placeholder:text-text-muted",
							)}
						/>
					</label>

					<button
						type="button"
						aria-label={t(translation.Player.CloseEpisodes)}
						onClick={() => setOpen(false)}
						className={clsx(
							"grid size-10 shrink-0 place-items-center rounded-lg",
							"border border-white/10 bg-white/8",
							"text-white",
							"transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white",
						)}
					>
						<Icon name="close" className={clsx("size-5")} />
					</button>
				</div>

				<div aria-busy={loading} className={clsx("w-full px-3 pt-6 pb-8 sm:px-4 sm:pt-8")}>
					<header className={clsx("mb-5 text-center")}>
						<h2 className={clsx("text-2xl font-black text-white")}>
							{t(translation.Common.Season, { number: selectedSeason })}
						</h2>
						<p className={clsx("mt-2 text-xs font-bold tracking-[.18em] text-text-secondary uppercase")}>
							<span className={clsx("text-brand-light")}>•</span>{" "}
							{t(translation.Common.EpisodeCount, { count: seasonEpisodes.length })}
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
										selected ? "ring-2 ring-white" : "ring-1 ring-white/8",
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
													{t(translation.Player.Watching)}
												</span>
											)}
											<strong
												className={clsx(
													"line-clamp-2 min-w-0 flex-1 text-sm font-black text-white sm:text-base",
												)}
											>
												{item.episode_number}. {item.name}
											</strong>
										</span>
										{item.runtime && (
											<span className={clsx("mt-1 block text-sm font-semibold text-text-secondary")}>
												{t(translation.Common.Minutes, { count: item.runtime })}
											</span>
										)}
										{item.overview && (
											<span className={clsx("mt-2 hidden text-xs leading-4 text-white/80 sm:line-clamp-2")}>
												{item.overview}
											</span>
										)}
									</span>
								</button>
							);
						})}
					</div>

					{loading ? (
						<p className={clsx("py-16 text-center text-sm text-text-secondary")}>
							{t(translation.Player.LoadingEpisodes)}
						</p>
					) : null}
					{error ? (
						<p role="alert" className={clsx("py-16 text-center text-sm text-red-300")}>
							{error}
						</p>
					) : null}
					{!loading && !error && filteredEpisodes.length === 0 && (
						<p className={clsx("py-20 text-center text-sm text-text-secondary")}>
							{t(translation.Player.NoEpisodes)}
						</p>
					)}
				</div>
			</dialog>
		</>
	);
}
