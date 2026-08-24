"use client";

import { MediaCard } from "@/components/media/media-card";
import { translation } from "@/constants/translation";
import type { MediaItem } from "@/lib/tmdb/types";
import { useTranslation } from "react-i18next";

export function MediaGrid({ items }: Readonly<{ items: MediaItem[] }>) {
	const { t } = useTranslation();
	if (!items.length)
		return (
			<div className="py-20 text-center">
				<h2 className="text-2xl font-bold text-text-primary">{t(translation.Catalog.EmptyTitle)}</h2>
				<p className="mt-2 text-sm text-text-secondary">{t(translation.Catalog.EmptyDescription)}</p>
			</div>
		);
	return (
		<div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
			{items.map((media) => (
				<MediaCard key={`${media.mediaType}-${media.id}`} media={media} />
			))}
		</div>
	);
}
