"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Icon } from "@/components/shared/icon";
import type { TmdbSeasonSummary } from "@/lib/tmdb/types";

export function SeasonSelector({
  mediaId,
  seasons,
  currentSeason
}: Readonly<{
  mediaId: number;
  seasons: ReadonlyArray<TmdbSeasonSummary>;
  currentSeason: number;
}>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = useRef<HTMLButtonElement>(null);
  const current =
    seasons.find(({ season_number }) => season_number === currentSeason) ?? seasons[0];

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => selected.current?.focus());

    function closeOnPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    }

    document.addEventListener("pointerdown", closeOnPointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", closeOnPointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function selectSeason(season: number) {
    if (!seasons.some(({ season_number }) => season_number === season)) return;
    setOpen(false);
    router.push(`/tv/${mediaId}?season=${season}`, { scroll: false });
  }

  function moveFocus(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const options = root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
    if (!options?.length) return;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
    options[next]?.focus();
  }

  return (
    <div className={clsx("max-w-[60vw]")}>
      {seasons.length <= 4 ? (
        <div
          className={clsx(
            "gap-2 overflow-x-auto pb-1",
            seasons.length > 2 ? "hidden sm:flex" : "flex"
          )}
        >
          {seasons.map((season) => (
            <Link
              key={season.id}
              href={`/tv/${mediaId}?season=${season.season_number}`}
              scroll={false}
              className={clsx(
                "shrink-0 rounded-lg",
                "border",
                "text-xs font-semibold",
                "px-3 py-2",
                "transition-colors",
                currentSeason === season.season_number
                  ? "border-brand-bright bg-brand-primary text-white"
                  : "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-hover"
              )}
            >
              Season {season.season_number}
            </Link>
          ))}
        </div>
      ) : null}

      {seasons.length > 2 ? (
        <div ref={root} className={clsx("relative z-20 w-44", seasons.length <= 4 && "sm:hidden")}>
          <button
            ref={trigger}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`season-options-${mediaId}`}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            className={clsx(
              "flex h-10 w-full items-center justify-between gap-3 rounded-lg",
              "bg-surface",
              "border border-border",
              "text-xs font-semibold text-text-primary",
              "px-3 text-left",
              "transition-colors hover:border-border-strong focus-visible:border-brand-bright focus-visible:outline-none"
            )}
          >
            <span>{current ? `Season ${current.season_number}` : "Choose a season"}</span>
            <Icon
              name="arrow-right"
              className={clsx(
                "size-4 shrink-0",
                "text-text-muted",
                "transition-transform duration-200",
                open ? "-rotate-90" : "rotate-90"
              )}
            />
          </button>

          {open ? (
            <div
              id={`season-options-${mediaId}`}
              role="listbox"
              aria-label="Choose a season"
              className={clsx(
                "absolute top-full right-0 mt-2 max-h-64 w-full overflow-y-auto rounded-lg",
                "bg-background-secondary",
                "border border-border shadow-[0_18px_48px_rgba(0,0,0,.5)]",
                "p-1.5"
              )}
            >
              {seasons.map((season, index) => {
                const active = currentSeason === season.season_number;

                return (
                  <button
                    key={season.id}
                    ref={active ? selected : undefined}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => selectSeason(season.season_number)}
                    onKeyDown={(event) => moveFocus(event, index)}
                    className={clsx(
                      "flex w-full items-center justify-between gap-3 rounded-md",
                      "text-xs font-semibold",
                      "px-3 py-2.5 text-left",
                      "transition-colors focus-visible:outline-none",
                      active
                        ? "bg-brand-primary text-white"
                        : "text-text-secondary hover:bg-surface-hover hover:text-white focus-visible:bg-surface-hover focus-visible:text-white"
                    )}
                  >
                    <span>Season {season.season_number}</span>
                    {active ? <Icon name="check" className={clsx("size-4")} /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
