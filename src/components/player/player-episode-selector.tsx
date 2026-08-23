"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Icon } from "@/components/shared/icon";
import { tmdbImage } from "@/lib/tmdb/images";
import type { TmdbSeason, TmdbSeasonSummary } from "@/lib/tmdb/types";

export function PlayerEpisodeSelector({
  mediaId,
  currentSeason,
  currentEpisode,
  seasons,
  episodes
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
  const term = query.trim().toLowerCase();
  const filteredEpisodes = term
    ? episodes.filter(
        ({ name, episode_number }) =>
          name.toLowerCase().includes(term) || String(episode_number).includes(term)
      )
    : episodes;

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    search.current?.focus();
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

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
          "fixed bottom-[max(.55rem,env(safe-area-inset-bottom))] left-[27%] z-30 inline-flex h-12 items-center gap-2 px-2 lg:right-[clamp(13.25rem,18.5vw,23.5rem)] lg:left-auto",
          "bg-transparent",
          "text-base font-semibold text-white",
          "transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        )}
      >
        <Icon name="film" className={clsx("size-7")} />
        <span className={clsx("hidden sm:inline")}>Episodes</span>
      </button>

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Episodes"
        aria-hidden={!open}
        inert={!open}
        className={clsx(
          "fixed inset-0 z-40 overflow-y-auto overscroll-contain",
          "bg-black/[.96] backdrop-blur-sm",
          "transition-[opacity,visibility] duration-200 ease-out",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div
          className={clsx(
            "sticky top-0 z-10 flex items-center gap-2 bg-black/90 px-4 py-4 backdrop-blur-xl",
            "border-b border-white/10",
            "sm:px-6 lg:justify-center lg:gap-4 lg:py-6"
          )}
        >
          <div className={clsx("relative shrink-0")}>
            <button
              type="button"
              aria-expanded={seasonMenu}
              onClick={() => setSeasonMenu((visible) => !visible)}
              className={clsx(
                "inline-flex h-12 items-center gap-2 rounded-xl px-3 sm:px-5",
                "bg-brand-primary/15",
                "text-sm font-bold text-brand-light sm:text-base",
                "transition-colors hover:bg-brand-primary/25 focus-visible:outline-2 focus-visible:outline-white"
              )}
            >
              Season {currentSeason}
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
                seasonMenu
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
              )}
            >
              {seasons.map(({ season_number }) => (
                <button
                  key={season_number}
                  type="button"
                  disabled={season_number === currentSeason}
                  onClick={() => navigate(season_number, 1)}
                  className={clsx(
                    "block h-10 w-full whitespace-nowrap rounded-lg px-3 text-left text-sm font-semibold",
                    season_number === currentSeason
                      ? "bg-brand-primary text-white"
                      : "text-text-secondary hover:bg-white/8 hover:text-white"
                  )}
                >
                  Season {season_number}
                </button>
              ))}
            </div>
          </div>

          <label
            className={clsx(
              "flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full px-3",
              "border border-white/10 bg-white/5",
              "text-text-secondary",
              "sm:max-w-md sm:px-4"
            )}
          >
            <Icon name="search" className={clsx("size-5 shrink-0")} />
            <input
              ref={search}
              type="search"
              aria-label="Search episodes"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search episodes"
              className={clsx(
                "min-w-0 flex-1 bg-transparent outline-none",
                "text-sm text-white placeholder:text-text-muted sm:text-base"
              )}
            />
          </label>

          <button
            type="button"
            aria-label="Close episodes"
            onClick={() => setOpen(false)}
            className={clsx(
              "grid size-12 shrink-0 place-items-center rounded-xl",
              "border border-white/10 bg-white/[.08]",
              "text-white",
              "transition-colors hover:bg-white/[.15] focus-visible:outline-2 focus-visible:outline-white"
            )}
          >
            <Icon name="close" className={clsx("size-5")} />
          </button>
        </div>

        <div className={clsx("mx-auto w-full max-w-3xl px-4 pt-14 pb-24 sm:px-8 sm:pt-20")}>
          <header className={clsx("mb-8 text-center")}>
            <h2 className={clsx("text-3xl font-black text-white sm:text-4xl")}>
              Season {currentSeason}
            </h2>
            <p
              className={clsx(
                "mt-2 text-xs font-bold tracking-[.18em] text-text-secondary uppercase"
              )}
            >
              <span className={clsx("text-brand-light")}>•</span> {episodes.length} episodes
            </p>
          </header>

          <div className={clsx("space-y-4 sm:space-y-5")}>
            {filteredEpisodes.map((item) => {
              const selected = item.episode_number === currentEpisode;
              const still = tmdbImage.still(item.still_path ?? undefined, "w780");

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  onClick={() => navigate(currentSeason, item.episode_number)}
                  className={clsx(
                    "group relative block aspect-video w-full overflow-hidden rounded-2xl text-left",
                    "bg-background-secondary",
                    selected ? "ring-2 ring-white" : "ring-1 ring-white/[.08]",
                    "transition-transform duration-300 hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  )}
                >
                  {still && (
                    <Image
                      src={still}
                      alt=""
                      fill
                      sizes="(max-width: 768px) calc(100vw - 2rem), 48rem"
                      className={clsx(
                        "object-cover",
                        "transition-transform duration-500 group-hover:scale-[1.025]"
                      )}
                    />
                  )}
                  <span
                    className={clsx(
                      "absolute inset-0",
                      "bg-gradient-to-t from-black via-black/25 to-transparent"
                    )}
                  />
                  <span className={clsx("absolute right-0 bottom-0 left-0 block p-4 sm:p-6")}>
                    <span className={clsx("flex flex-wrap items-center gap-2")}>
                      {selected && (
                        <span
                          className={clsx(
                            "rounded-md bg-brand-primary px-2 py-1",
                            "text-[10px] font-black tracking-wide text-white uppercase sm:text-xs"
                          )}
                        >
                          Watching
                        </span>
                      )}
                      <strong className={clsx("text-lg font-black text-white sm:text-2xl")}>
                        {item.episode_number}. {item.name}
                      </strong>
                    </span>
                    {item.runtime && (
                      <span
                        className={clsx("mt-1 block text-sm font-semibold text-text-secondary")}
                      >
                        {item.runtime} min
                      </span>
                    )}
                    {item.overview && (
                      <span
                        className={clsx(
                          "mt-2 hidden line-clamp-2 text-sm leading-6 text-white/80 sm:block sm:text-base"
                        )}
                      >
                        {item.overview}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredEpisodes.length === 0 && (
            <p className={clsx("py-20 text-center text-sm text-text-secondary")}>
              No episodes found.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
