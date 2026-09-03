"use client";

import { translation } from "@/constants/translation";
import type { LiveStream } from "@/lib/live/types";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LivePlayer({ title, streams }: Readonly<{ title: string; streams: LiveStream[] }>) {
	const { t } = useTranslation();
	const [selected, setSelected] = useState(streams[0]?.embedUrl);
	const stream = streams.find(({ embedUrl }) => embedUrl === selected) ?? streams[0];

	if (!stream) {
		return (
			<div className="grid aspect-video place-items-center bg-black px-6 text-center">
				<div>
					<h2 className="text-xl font-bold text-text-primary">
						{t(translation.LivePage.UnavailableTitle)}
					</h2>
					<p className="mt-2 text-sm text-text-secondary">
						{t(translation.LivePage.UnavailableDescription)}
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="aspect-video w-full overflow-hidden bg-black shadow-[0_28px_80px_rgba(0,0,0,.65)]">
				<iframe
					src={stream.embedUrl}
					title={t(translation.LivePage.WatchLive, { title })}
					allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
					allowFullScreen
					sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
					referrerPolicy="no-referrer"
					className="size-full border-0"
				/>
			</div>
			<div className="mt-5 flex flex-wrap gap-2" aria-label={t(translation.LivePage.AvailableSources)}>
				{streams.map((item) => (
					<button
						key={`${item.source}-${item.streamNo}-${item.embedUrl}`}
						type="button"
						onClick={() => setSelected(item.embedUrl)}
						className={clsx(
							"inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-xs font-semibold transition-colors",
							item.embedUrl === stream.embedUrl
								? "border-brand-primary bg-brand-primary text-white"
								: "border-border bg-surface text-text-secondary hover:border-border-strong hover:bg-surface-hover hover:text-white",
						)}
					>
						{item.source} {item.streamNo}
						<span className="font-normal opacity-70">
							{item.language}
							{item.hd ? " · HD" : ""}
						</span>
					</button>
				))}
			</div>
		</>
	);
}
