"use client";

import { MediaGrid } from "@/components/media/media-grid";
import { translation } from "@/constants/translation";
import type { WatchlistItem } from "@/lib/watchlist/storage";
import { watchlistStorage } from "@/lib/watchlist/storage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function MyListGrid() {
	const [items, setItems] = useState<WatchlistItem[]>([]);
	const [ready, setReady] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		const load = () => {
			setItems(watchlistStorage.getAll());
			setReady(true);
		};
		load();
		window.addEventListener("anuflix:watchlist", load);
		return () => window.removeEventListener("anuflix:watchlist", load);
	}, []);

	if (!ready)
		return (
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
				{Array.from({ length: 6 }, (_, index) => (
					<span key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />
				))}
			</div>
		);
	if (!items.length)
		return (
			<div className="border-y border-border py-20 text-center">
				<h2 className="text-2xl font-bold text-text-primary">
					{t(translation.Catalog.MyListEmptyTitle)}
				</h2>
				<p className="mt-2 text-sm text-text-secondary">
					{t(translation.Catalog.MyListEmptyDescription)}
				</p>
			</div>
		);
	return <MediaGrid items={items} />;
}
