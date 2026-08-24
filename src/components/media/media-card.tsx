"use client";

import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { tmdbImage } from "@/lib/tmdb/images";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function MediaCard({
	media,
	priority = false,
	showInfo = true,
	onSelect,
}: Readonly<{
	media: MediaItem;
	priority?: boolean;
	showInfo?: boolean;
	onSelect?: () => void;
}>) {
	const poster = tmdbImage.poster(media.posterPath);
	const { t } = useTranslation();

	return (
		<article className={clsx("group min-w-0")}>
			<Link href={`/${media.mediaType}/${media.id}`} onClick={onSelect} className={clsx("block")}>
				<span
					className={clsx(
						"relative block aspect-2/3 overflow-hidden rounded-lg",
						"bg-surface",
						"border border-transparent",
						"transition-[border-color,box-shadow] duration-300 ease-out",
						"group-hover:border-border-strong group-hover:shadow-[0_14px_38px_rgba(0,0,0,.48),0_0_18px_rgba(37,99,235,.08)]",
					)}
				>
					{poster ? (
						<Image
							src={poster}
							alt={t(translation.Catalog.Poster, { title: media.title })}
							fill
							sizes="(max-width: 640px) 42vw, (max-width: 1100px) 24vw, 15vw"
							priority={priority}
							className={clsx(
								"object-cover",
								"will-change-transform transition-all duration-650 ease-[cubic-bezier(.22,1,.36,1)]",
								"group-hover:scale-[1.06] group-hover:brightness-110",
							)}
						/>
					) : (
						<span
							className={clsx(
								"flex size-full items-center justify-center",
								"bg-[linear-gradient(145deg,#0d1628,#08101f)]",
								"text-text-muted",
							)}
						>
							<Icon name="film" className={clsx("size-8")} />
						</span>
					)}
					<span
						className={clsx(
							"absolute inset-0 flex items-end justify-between opacity-0",
							"bg-[linear-gradient(to_top,rgba(5,9,20,.95),transparent_55%)]",
							"p-3",
							"transition-opacity duration-400 ease-[cubic-bezier(.22,1,.36,1)]",
							"group-hover:opacity-100 group-focus-within:opacity-100",
						)}
					>
						<span
							className={clsx(
								"grid size-9 place-items-center rounded-full",
								"bg-brand-primary",
								"shadow-[0_0_18px_rgba(37,99,235,.3)]",
								"text-white",
							)}
						>
							<Icon name="play" className={clsx("size-4")} />
						</span>
						<span className={clsx("text-[10px] font-semibold tracking-wide text-white uppercase")}>
							{media.year ?? t(translation.Common.New)} ·{" "}
							{media.mediaType === "movie" || media.animeFormat === "movie"
								? t(translation.Common.Movie)
								: t(translation.Common.Series)}
						</span>
					</span>
				</span>
				{showInfo ? (
					<>
						<span className={clsx("block truncate", "text-sm font-semibold text-text-primary", "mt-3")}>
							{media.title}
						</span>
						<span
							className={clsx(
								"flex items-center justify-between",
								"text-[11px] font-medium text-text-muted",
								"mt-1",
							)}
						>
							<span className={clsx("text-brand-light")}>
								★ {media.voteAverage ? media.voteAverage.toFixed(1) : "NR"}
							</span>
							<span>
								{media.mediaType === "anime"
									? t(translation.Common.Anime)
									: media.mediaType === "movie"
										? t(translation.Common.Film)
										: t(translation.Navigation.Tv)}
							</span>
						</span>
					</>
				) : null}
			</Link>
		</article>
	);
}
