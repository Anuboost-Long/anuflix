"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { LiveMatchCard } from "@/components/live/live-match-card";
import { Icon } from "@/components/shared/icon";
import type { LiveMatch, LiveMatchesPage, LiveSport } from "@/lib/live/types";

export function LiveCatalog({
  matches,
  sports,
  liveIds,
  total,
  hasMore
}: Readonly<{
  matches: LiveMatch[];
  sports: LiveSport[];
  liveIds: string[];
  total: number;
  hasMore: boolean;
}>) {
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
  const live = useMemo(() => new Set(liveMatchIds), [liveMatchIds]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({ category: sport, q: query, page: "1" });
        const response = await fetch(`/api/live/matches?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Live matches could not be loaded.");
        const result = (await response.json()) as LiveMatchesPage;
        setItems(result.matches);
        setLiveMatchIds(result.liveIds);
        setResultTotal(result.total);
        setPage(1);
        setMore(result.hasMore);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name !== "AbortError") {
          setError("Live matches could not be loaded. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, sport]);

  async function loadMore() {
    setLoading(true);
    setError("");

    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ category: sport, q: query, page: String(nextPage) });
      const response = await fetch(`/api/live/matches?${params}`);
      if (!response.ok) throw new Error("More live matches could not be loaded.");
      const result = (await response.json()) as LiveMatchesPage;
      setItems((current) => [...current, ...result.matches]);
      setLiveMatchIds(result.liveIds);
      setPage(nextPage);
      setMore(result.hasMore);
    } catch {
      setError("More live matches could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="sticky top-20 z-30 border-y border-border bg-background/92 px-[clamp(1.25rem,4vw,4.5rem)] py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-border bg-surface px-3 focus-within:border-brand-bright focus-within:shadow-[0_0_0_3px_rgba(59,130,246,.12)]">
            <Icon name="search" className="size-4 shrink-0 text-text-muted" />
            <span className="sr-only">Search live matches</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search teams, leagues, or events..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-subtle"
            />
          </label>
          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {[{ id: "all", name: "All sports" }, ...sports].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSport(item.id)}
                className={clsx(
                  "h-9 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors",
                  sport === item.id
                    ? "border-brand-primary bg-brand-primary text-white"
                    : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-white"
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-[clamp(1.25rem,4vw,4.5rem)] py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase">
              Updated throughout the day
            </span>
            <h2 className="mt-1 text-2xl font-bold text-text-primary">
              {sport === "all" ? "All matches" : sports.find(({ id }) => id === sport)?.name}
            </h2>
          </div>
          <span className="text-xs text-text-muted">{resultTotal} matches</span>
        </div>

        {items.length ? (
          <>
            <div
              className={clsx(
                "grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                loading && page === 1 && "opacity-45"
              )}
            >
              {items.map((match) => (
                <LiveMatchCard key={match.id} match={match} live={live.has(match.id)} />
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
                  {loading ? "Loading matches..." : "Load more matches"}
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="border-y border-border py-20 text-center">
            <h3 className="text-xl font-bold text-text-primary">
              {loading ? "Finding matches..." : "No matches found"}
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              {loading ? "Checking the latest schedule." : "Try another sport or search term."}
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
