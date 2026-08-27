"use client";

import { MediaCard } from "@/components/media/media-card";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export function TopTenRow({ items }: Readonly<{ items: MediaItem[] }>) {
	const rail = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();

	return (
		<section className={clsx("min-w-0 max-w-full overflow-hidden")} aria-labelledby="top-ten-title">
			<div
				className={clsx("flex items-end justify-between gap-5", "mb-5 px-[clamp(1.25rem,4vw,4.5rem)]")}
			>
				<div>
					<span
						className={clsx("text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase")}
					>
						{t(translation.Catalog.TopTenEyebrow)}
					</span>
					<h2
						id="top-ten-title"
						className={clsx("text-xl font-bold tracking-[-.02em] text-text-primary sm:text-2xl", "mt-1")}
					>
						{t(translation.Catalog.TopTenTitle)}
					</h2>
				</div>
				<div className={clsx("hidden gap-2 sm:flex")}>
					<button
						type="button"
						aria-label={t(translation.Catalog.ScrollLeft, { title: t(translation.Catalog.TopTenTitle) })}
						onClick={() => rail.current?.scrollBy({ left: -900, behavior: "smooth" })}
						className={clsx(
							"grid size-9 place-items-center rounded-full",
							"bg-surface/70",
							"border border-border",
							"text-text-secondary",
							"hover:bg-surface-hover hover:text-white",
						)}
					>
						<Icon name="arrow-left" className={clsx("size-4")} />
					</button>
					<button
						type="button"
						aria-label={t(translation.Catalog.ScrollRight, { title: t(translation.Catalog.TopTenTitle) })}
						onClick={() => rail.current?.scrollBy({ left: 900, behavior: "smooth" })}
						className={clsx(
							"grid size-9 place-items-center rounded-full",
							"bg-surface/70",
							"border border-border",
							"text-text-secondary",
							"hover:bg-surface-hover hover:text-white",
						)}
					>
						<Icon name="arrow-right" className={clsx("size-4")} />
					</button>
				</div>
			</div>
			<div
				ref={rail}
				className={clsx(
					"hide-scrollbar grid w-full min-w-0 max-w-full auto-cols-[67vw] grid-flow-col gap-2 overflow-x-auto overflow-y-hidden",
					"px-[clamp(1.25rem,4vw,4.5rem)] pb-6",
					"sm:auto-cols-[40vw] md:auto-cols-[31vw] lg:auto-cols-[25vw] xl:auto-cols-[21vw]",
				)}
			>
				{items.slice(0, 10).map((media, index) => (
					<div key={`${media.mediaType}-${media.id}`} className={clsx("relative min-w-0 pl-[42%]")}>
						<span
							className={clsx(
								"absolute bottom-0 left-0 z-0 w-[46%] whitespace-nowrap",
								"text-right text-[clamp(7rem,12vw,11rem)] leading-[.72] font-black -tracking-widest text-transparent [-webkit-text-stroke:2px_rgba(96,165,250,.45)]",
								"-mr-4",
							)}
						>
							{index + 1}
						</span>
						<div className={clsx("relative z-10 min-w-0")}>
							<MediaCard media={media} showInfo={false} />
						</div>
						<span className={clsx("sr-only")}>
							{index + 1}. {media.title}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}
