"use client";

import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { watchPath } from "@/lib/playback/routes";
import { progressStorage, type WatchProgress } from "@/lib/progress/storage";
import { tmdbImage } from "@/lib/tmdb/images";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function ContinueWatching() {
	const [items, setItems] = useState<WatchProgress[]>([]);
	const { t } = useTranslation();

	useEffect(() => {
		const load = () => setItems(progressStorage.getActive());
		load();
		window.addEventListener("anuflix:progress", load);
		return () => window.removeEventListener("anuflix:progress", load);
	}, []);

	if (!items.length) return null;

	return (
		<section className={clsx("min-w-0 max-w-full overflow-hidden")} aria-labelledby="continue-title">
			<div className="mb-5 px-[clamp(1.25rem,4vw,4.5rem)]">
				<span className="text-[10px] font-semibold tracking-[.16em] text-brand-light uppercase">
					{t(translation.Catalog.ContinueEyebrow)}
				</span>
				<h2
					id="continue-title"
					className="mt-1 text-xl font-bold tracking-[-.02em] text-text-primary sm:text-2xl"
				>
					{t(translation.Catalog.ContinueTitle)}
				</h2>
			</div>
			<div
				className={clsx(
					"hide-scrollbar flex w-full min-w-0 max-w-full gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,4.5rem)] pb-5",
				)}
			>
				{items.slice(0, 10).map((item) => {
					const image =
						tmdbImage.backdrop(item.media.backdropPath) ?? tmdbImage.poster(item.media.posterPath);
					const href = watchPath(item.media, item.season, item.episode);
					const detail =
						item.media.mediaType === "anime" && item.media.animeFormat !== "movie"
							? t(translation.Common.Episode, { number: item.episode })
							: t(translation.Catalog.Watched, { count: Math.round(item.percentage) });
					return (
						<div
							key={`${item.media.mediaType}-${item.media.id}-${item.season}-${item.episode}`}
							className={clsx(
								"group relative w-[76vw] min-w-0 shrink-0",
								"sm:w-[45vw] md:w-[34vw] lg:w-[26vw] xl:w-[22vw]",
							)}
						>
							<Link href={href} className="block">
								<span className="relative block aspect-video overflow-hidden rounded-lg bg-surface">
									{image ? (
										<Image
											src={image}
											alt=""
											fill
											sizes="320px"
											className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
										/>
									) : (
										<span className="flex size-full items-center justify-center text-text-muted">
											<Icon name="film" className="size-7" />
										</span>
									)}
									<span className="absolute inset-0 grid place-items-center bg-black/15">
										<span className="grid size-11 place-items-center rounded-full bg-brand-primary/90 text-white backdrop-blur">
											<Icon name="play" className="size-4" />
										</span>
									</span>
									<span className="absolute right-0 bottom-0 left-0 h-1 bg-white/15">
										<span
											className="block h-full bg-[linear-gradient(90deg,#2563eb,#22d3ee)]"
											style={{ width: `${item.percentage}%` }}
										/>
									</span>
								</span>
								<strong className="mt-3 block truncate text-sm text-text-primary">
									{item.media.title}
								</strong>
								<span className="mt-1 block text-xs text-text-muted">
									{item.media.mediaType === "tv"
										? `${t(translation.Common.Season, { number: item.season })} · ${t(translation.Common.Episode, { number: item.episode })}`
										: detail}
								</span>
							</Link>
							<Link
								href={`/${item.media.mediaType}/${item.media.id}`}
								aria-label={t(translation.Catalog.ViewDetails, { title: item.media.title })}
								className={clsx(
									"absolute top-2.5 right-2.5 z-10 grid size-8 place-items-center rounded-full after:absolute after:-inset-1.5",
									"border border-white/10 bg-black/35 text-white/70 backdrop-blur-sm",
									"transition-colors hover:border-white/20 hover:bg-black/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
								)}
							>
								<Icon name="info" className="size-4" />
							</Link>
						</div>
					);
				})}
			</div>
		</section>
	);
}
