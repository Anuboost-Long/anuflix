"use client";

import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import type { MediaItem } from "@/lib/tmdb/types";
import { watchlistStorage } from "@/lib/watchlist/storage";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function WatchlistButton({
	media,
	compact = false,
}: Readonly<{ media: MediaItem; compact?: boolean }>) {
	const [saved, setSaved] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			setSaved(watchlistStorage.has(media.id, media.mediaType));
		});
		return () => cancelAnimationFrame(frame);
	}, [media.id, media.mediaType]);

	return (
		<button
			type="button"
			className={clsx(
				"inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface/75 px-5 backdrop-blur-md",
				"text-sm font-semibold text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light",
				compact && "size-10 h-10 p-0",
			)}
			aria-label={t(saved ? translation.Catalog.RemoveFromList : translation.Catalog.AddToList, {
				title: media.title,
			})}
			onClick={() => setSaved(watchlistStorage.toggle(media))}
		>
			<Icon name={saved ? "check" : "bookmark"} className="size-4" />
			{!compact && t(saved ? translation.Common.InMyList : translation.Common.MyList)}
		</button>
	);
}
