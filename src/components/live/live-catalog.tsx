"use client";

import { handleServeGetLiveMatches } from "@/api/services/live/serve-action";
import { LiveMatchCard } from "@/components/live/live-match-card";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import type { LiveMatch, LiveSport } from "@/lib/live/types";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function LiveCatalog({
	matches,
	sports,
	liveIds,
	total,
	hasMore,
}: Readonly<{
	matches: LiveMatch[];
	sports: LiveSport[];
	liveIds: string[];
	total: number;
	hasMore: boolean;
}>) {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const [sport, setSport] = useState("all");
	const [items, setItems] = useState(matches);
	const [liveMatchIds, setLiveMatchIds] = useState(liveIds);
	const [resultTotal, setResultTotal] = useState(total);
	const [page, setPage] = useState(1);
	const [more, setMore] = useState(hasMore);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const initialRender = useRef(true);
	const filterRequest = useRef(0);
	const live = useMemo(() => new Set(liveMatchIds), [liveMatchIds]);
	const groupedItems = Array.from(
		items.reduce((groups, match) => {
			const matches = groups.get(match.category) ?? [];
			matches.push(match);
			groups.set(match.category, matches);
			return groups;
		}, new Map<string, LiveMatch[]>()),
	);

	useEffect(() => {
		if (initialRender.current) {
			initialRender.current = false;
			return;
		}

		const request = ++filterRequest.current;
		let cancelled = false;
		const timeout = window.setTimeout(async () => {
			setLoading(true);
			setError("");

			try {
				const result = await handleServeGetLiveMatches({ category: sport, query, page: 1 });
				if (cancelled || request !== filterRequest.current) return;
				setItems(result.matches);
				setLiveMatchIds(result.liveIds);
				setResultTotal(result.total);
				setPage(1);
				setMore(result.hasMore);
			} catch {
				if (!cancelled && request === filterRequest.current) {
					setError(t(translation.LivePage.LoadError));
				}
			} finally {
				if (!cancelled && request === filterRequest.current) setLoading(false);
			}
		}, 300);

		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
		};
	}, [query, sport, t]);

	async function loadMore() {
		setLoading(true);
		setError("");

		try {
			const nextPage = page + 1;
			const result = await handleServeGetLiveMatches({ category: sport, query, page: nextPage });
			setItems((current) => [...current, ...result.matches]);
			setLiveMatchIds(result.liveIds);
			setPage(nextPage);
			setMore(result.hasMore);
		} catch {
			setError(t(translation.LivePage.LoadError));
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="sticky top-20 z-30 border-y border-border bg-background/94 px-[clamp(1.25rem,4vw,4.5rem)] py-3 backdrop-blur-xl">
				<div className="grid gap-3 lg:grid-cols-[minmax(18rem,23rem)_minmax(0,1fr)] lg:items-center lg:gap-6">
					<div
						className={clsx(
							"flex h-10 min-w-0 items-center gap-2.5 rounded-md",
							"bg-background-secondary/80",
							"border border-border",
							"px-3",
							"transition-colors focus-within:border-brand-bright focus-within:bg-surface",
						)}
					>
						<Icon name="search" className="size-4 shrink-0 text-text-muted" />
						<input
							id="live-search"
							type="search"
							aria-label={t(translation.LivePage.Search)}
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder={t(translation.LivePage.SearchPlaceholder)}
							className={clsx(
								"h-full min-w-0 flex-1 outline-none [&::-webkit-search-cancel-button]:hidden",
								"bg-transparent",
								"text-sm text-text-primary placeholder:text-text-subtle",
							)}
						/>
						{query ? (
							<button
								type="button"
								onClick={() => setQuery("")}
								aria-label={t(translation.LivePage.ClearSearch)}
								className="grid size-7 shrink-0 place-items-center rounded text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary"
							>
								<Icon name="close" className="size-3.5" />
							</button>
						) : null}
					</div>
					<fieldset className="hide-scrollbar m-0 flex min-w-0 items-center overflow-x-auto border-x-0 border-t-0 border-b border-border p-0">
						<legend className="sr-only">{t(translation.LivePage.FilterBySport)}</legend>
						{[{ id: "all", name: t(translation.LivePage.AllSports) }, ...sports].map((item, index) => (
							<div key={item.id} className="flex shrink-0 items-center">
								{index === 1 ? <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" /> : null}
								<button
									type="button"
									onClick={() => setSport(item.id)}
									aria-pressed={sport === item.id}
									className={clsx(
										"h-10 shrink-0 whitespace-nowrap px-3",
										"border-b-2",
										"text-sm font-medium",
										"transition-colors",
										sport === item.id
											? "border-brand-bright text-text-primary"
											: "border-transparent text-text-muted hover:text-text-secondary",
									)}
								>
									{item.name}
								</button>
							</div>
						))}
					</fieldset>
				</div>
			</div>

			<div className="px-[clamp(1.25rem,4vw,4.5rem)] py-8">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div>
						<span className="text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase">
							{t(translation.LivePage.Updated)}
						</span>
						<h2 className="mt-1 text-2xl font-bold text-text-primary">
							{sport === "all"
								? t(translation.LivePage.AllMatches)
								: sports.find(({ id }) => id === sport)?.name}
						</h2>
					</div>
					<span className="text-xs text-text-muted">
						{t(translation.LivePage.Matches, { count: resultTotal })}
					</span>
				</div>

				{items.length ? (
					<>
						<div className={clsx("space-y-10 transition-opacity", loading && page === 1 && "opacity-45")}>
							{groupedItems.map(([category, categoryMatches]) => (
								<section
									key={category}
									aria-labelledby={sport === "all" ? `live-category-${category}` : undefined}
								>
									{sport === "all" ? (
										<div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
											<h3 id={`live-category-${category}`} className="text-lg font-bold text-text-primary">
												{sports.find(({ id }) => id === category)?.name ?? category.replaceAll("-", " ")}
											</h3>
											<span className="text-xs text-text-muted">
												{t(translation.LivePage.Shown, { count: categoryMatches.length })}
											</span>
										</div>
									) : null}
									<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
										{categoryMatches.map((match) => (
											<LiveMatchCard key={match.id} match={match} live={live.has(match.id)} />
										))}
									</div>
								</section>
							))}
						</div>
						{more ? (
							<div className="mt-10 flex justify-center">
								<button
									type="button"
									onClick={loadMore}
									disabled={loading}
									className="h-11 rounded-lg border border-border-strong bg-surface px-6 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover disabled:cursor-wait disabled:opacity-60"
								>
									{t(loading ? translation.LivePage.LoadingMore : translation.LivePage.LoadMore)}
								</button>
							</div>
						) : null}
					</>
				) : (
					<div className="border-y border-border py-20 text-center">
						<h3 className="text-xl font-bold text-text-primary">
							{t(loading ? translation.LivePage.Finding : translation.LivePage.NoMatches)}
						</h3>
						<p className="mt-2 text-sm text-text-secondary">
							{t(loading ? translation.LivePage.Checking : translation.LivePage.TryAnother)}
						</p>
					</div>
				)}
				{error ? (
					<p role="alert" className="mt-5 text-center text-sm text-red-300">
						{error}
					</p>
				) : null}
			</div>
		</>
	);
}
