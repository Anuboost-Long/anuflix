"use client";

import { MediaCard } from "@/components/media/media-card";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export function MediaRow({
	title,
	eyebrow,
	items,
	priority = false,
	gutter = true,
}: Readonly<{
	title: string;
	eyebrow?: string;
	items: MediaItem[];
	priority?: boolean;
	gutter?: boolean;
}>) {
	const rail = useRef<HTMLDivElement>(null);
	const { t } = useTranslation();

	function scroll(direction: -1 | 1) {
		rail.current?.scrollBy({
			left: direction * rail.current.clientWidth * 0.8,
			behavior: "smooth",
		});
	}

	if (!items.length) return null;

	return (
		<section
			className={clsx("min-w-0 max-w-full overflow-hidden")}
			aria-labelledby={`row-${title.replaceAll(" ", "-").toLowerCase()}`}
		>
			<div
				className={clsx(
					"flex items-end justify-between gap-5",
					"mb-5",
					gutter && "px-[clamp(1.25rem,4vw,4.5rem)]",
				)}
			>
				<div>
					{eyebrow && (
						<span
							className={clsx("text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase")}
						>
							{eyebrow}
						</span>
					)}
					<h2
						id={`row-${title.replaceAll(" ", "-").toLowerCase()}`}
						className={clsx("text-xl font-bold tracking-[-.02em] text-text-primary sm:text-2xl", "mt-1")}
					>
						{title}
					</h2>
				</div>
				<div className={clsx("hidden items-center gap-2 sm:flex")}>
					{([-1, 1] as const).map((direction) => (
						<button
							key={direction}
							type="button"
							aria-label={t(
								direction === -1 ? translation.Catalog.ScrollLeft : translation.Catalog.ScrollRight,
								{ title },
							)}
							onClick={() => scroll(direction)}
							className={clsx(
								"grid size-9 place-items-center rounded-full",
								"bg-surface/70",
								"border border-border",
								"text-text-secondary",
								"transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-white",
							)}
						>
							<Icon name={direction === -1 ? "arrow-left" : "arrow-right"} className={clsx("size-4")} />
						</button>
					))}
				</div>
			</div>
			<div
				ref={rail}
				className={clsx(
					"hide-scrollbar flex w-full min-w-0 max-w-full gap-3 overflow-x-auto pb-5",
					gutter && "px-[clamp(1.25rem,4vw,4.5rem)]",
					priority && "scroll-smooth",
				)}
			>
				{items.slice(0, 20).map((media, index) => (
					<div
						key={`${media.mediaType}-${media.id}`}
						className={clsx(
							"w-[42vw] shrink-0",
							"sm:w-[27vw] md:w-[21vw] lg:w-[16.5vw] xl:w-[14.2vw] 2xl:w-[12.5vw]",
						)}
					>
						<MediaCard media={media} priority={priority && index < 6} />
					</div>
				))}
			</div>
		</section>
	);
}
