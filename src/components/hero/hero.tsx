"use client";

import { WatchlistButton } from "@/components/media/watchlist-button";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { watchPath } from "@/lib/playback/routes";
import { tmdbImage } from "@/lib/tmdb/images";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function Hero({
	items,
	eyebrow,
}: Readonly<{
	items: MediaItem[];
	eyebrow: string;
}>) {
	const slides = items.slice(0, 5);
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const media = slides[activeIndex];

	useEffect(() => {
		if (slides.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
			return;

		const interval = window.setInterval(() => {
			setActiveIndex((index) => (index + 1) % slides.length);
		}, 7000);

		return () => window.clearInterval(interval);
	}, [paused, slides.length]);

	if (!media) return null;

	const watchHref = watchPath(media);

	return (
		<section
			className={clsx("relative min-h-[66vh] overflow-hidden sm:min-h-[76vh]")}
			aria-label={eyebrow}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
			}}
		>
			{slides.map((slide, index) => {
				const backdrop = tmdbImage.backdrop(slide.backdropPath);

				return (
					<div
						key={`${slide.mediaType}-${slide.id}`}
						className={clsx(
							"absolute inset-0 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]",
							index === activeIndex
								? "scale-100 opacity-100"
								: "pointer-events-none scale-[1.025] opacity-0",
						)}
						aria-hidden={index !== activeIndex}
					>
						{backdrop ? (
							<Image
								src={backdrop}
								alt=""
								fill
								priority={index === 0}
								sizes="100vw"
								className={clsx("object-cover object-[64%_center] sm:object-center")}
							/>
						) : null}
					</div>
				);
			})}

			<div
				className={clsx(
					"absolute inset-0",
					"bg-[linear-gradient(to_right,rgba(5,9,20,.98)_0%,rgba(5,9,20,.72)_38%,transparent_72%),linear-gradient(to_bottom,rgba(5,9,20,.35)_0%,transparent_36%,#050914_100%)]",
				)}
			/>

			<div
				key={`${media.mediaType}-${media.id}`}
				className={clsx(
					"relative flex min-h-[66vh] max-w-3xl flex-col justify-end sm:min-h-[76vh]",
					"px-[clamp(1.25rem,4vw,4.5rem)] pt-28 pb-24 sm:pb-28",
				)}
			>
				<span
					className={clsx(
						"inline-flex w-fit items-center gap-2 rounded-full",
						"bg-background/45 backdrop-blur-md",
						"border border-border-strong",
						"text-[10px] font-bold tracking-[.15em] text-brand-light uppercase",
						"mb-4 px-3 py-1.5",
					)}
				>
					<Icon name="spark" className={clsx("size-3.5")} />
					{eyebrow}
				</span>
				<h1
					className={clsx(
						"max-w-[12ch] text-4xl leading-[.92] font-black tracking-[-.055em] text-text-primary sm:text-6xl lg:text-[5.5rem]",
					)}
				>
					{media.title}
				</h1>
				<div
					className={clsx(
						"flex flex-wrap items-center gap-3",
						"text-xs font-medium text-text-secondary sm:text-sm",
						"mt-5",
					)}
				>
					{media.year ? <span>{media.year}</span> : null}
					<span className={clsx("text-brand-light")}>★ {media.voteAverage.toFixed(1)}</span>
					<span>
						{media.mediaType === "movie" || media.animeFormat === "movie"
							? t(translation.Common.Film)
							: t(translation.Common.Series)}
					</span>
					<span
						className={clsx("border border-border-strong", "text-[10px] text-white", "px-1.5 py-0.5")}
					>
						4K
					</span>
				</div>
				<p
					className={clsx(
						"line-clamp-3 max-w-2xl",
						"text-sm leading-6 text-text-secondary sm:text-base sm:leading-7",
						"mt-4",
					)}
				>
					{media.overview}
				</p>
				<div className={clsx("mt-7 flex flex-wrap items-center gap-3")}>
					<Link
						href={watchHref}
						className={clsx(
							"inline-flex h-12 items-center gap-2 rounded-lg",
							"bg-brand-primary",
							"text-sm font-semibold text-white",
							"px-6",
							"shadow-[0_0_28px_rgba(37,99,235,.25)]",
							"transition-colors hover:bg-brand-bright",
						)}
					>
						<Icon name="play" className={clsx("size-5")} />
						{t(translation.Common.PlayNow)}
					</Link>
					<WatchlistButton media={media} />
					<Link
						href={`/${media.mediaType}/${media.id}`}
						className={clsx(
							"grid size-12 place-items-center rounded-full",
							"bg-surface/70 backdrop-blur-md",
							"border border-border",
							"text-text-secondary",
							"transition-colors hover:bg-surface-hover hover:text-white",
						)}
						aria-label={t(translation.Hero.MoreInformation, { title: media.title })}
					>
						<Icon name="info" className={clsx("size-5")} />
					</Link>
				</div>
			</div>

			{slides.length > 1 ? (
				<div
					className={clsx(
						"absolute right-[clamp(1.25rem,4vw,4.5rem)] bottom-7 z-10 flex items-center gap-2 sm:bottom-10",
					)}
					aria-label={t(translation.Hero.Recommendations)}
				>
					<span
						className={clsx("mr-1 text-[10px] font-semibold tracking-[.18em] text-text-secondary")}
						aria-hidden="true"
					>
						{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
					</span>
					{slides.map((slide, index) => (
						<button
							key={`${slide.mediaType}-${slide.id}`}
							type="button"
							onClick={() => setActiveIndex(index)}
							aria-label={t(translation.Hero.ShowSlide, { title: slide.title })}
							aria-current={index === activeIndex ? "true" : undefined}
							className={clsx("group w-7 py-3 sm:w-9", "focus-visible:outline-none")}
						>
							<span
								className={clsx(
									"block h-0.5 rounded-full",
									"transition-[background-color,transform] duration-300",
									index === activeIndex
										? "scale-x-100 bg-brand-light"
										: "scale-x-75 bg-white/30 group-hover:scale-x-100 group-hover:bg-white/65",
								)}
							/>
						</button>
					))}
				</div>
			) : null}
		</section>
	);
}
