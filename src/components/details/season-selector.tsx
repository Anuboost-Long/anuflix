"use client";

import { SelectInput } from "@/components/shared/select-input";
import type { TmdbSeasonSummary } from "@/lib/tmdb/types";
import clsx from "clsx";

export function SeasonSelector({
	mediaId,
	seasons,
	currentSeason,
	onSelect,
	disabled = false,
}: Readonly<{
	mediaId: number;
	seasons: ReadonlyArray<TmdbSeasonSummary>;
	currentSeason: number;
	onSelect: (season: number) => void;
	disabled?: boolean;
}>) {
	function selectSeason(season: number) {
		if (!seasons.some(({ season_number }) => season_number === season)) return;
		onSelect(season);
	}

	return (
		<div className={clsx("max-w-[60vw]")}>
			{seasons.length <= 4 ? (
				<div
					className={clsx("gap-2 overflow-x-auto pb-1", seasons.length > 2 ? "hidden sm:flex" : "flex")}
				>
					{seasons.map((season) => (
						<button
							key={season.id}
							type="button"
							disabled={disabled}
							onClick={() => selectSeason(season.season_number)}
							className={clsx(
								"shrink-0 rounded-lg",
								"border",
								"text-xs font-semibold",
								"px-3 py-2",
								"transition-colors",
								currentSeason === season.season_number
									? "border-brand-bright bg-brand-primary text-white"
									: "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-hover",
							)}
						>
							Season {season.season_number}
						</button>
					))}
				</div>
			) : null}

			{seasons.length > 2 ? (
				<SelectInput
					id={`season-options-${mediaId}`}
					ariaLabel="Choose a season"
					options={seasons.map(({ season_number }) => ({
						label: `Season ${season_number}`,
						value: String(season_number),
					}))}
					value={String(currentSeason)}
					onChange={(season) => selectSeason(Number(season))}
					disabled={disabled}
					className={clsx("w-44", seasons.length <= 4 && "sm:hidden")}
				/>
			) : null}
		</div>
	);
}
