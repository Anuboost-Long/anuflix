"use client";

import { PlayerEpisodeSelector } from "@/components/player/player-episode-selector";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { playbackProvider } from "@/lib/playback/provider";
import { progressStorage } from "@/lib/progress/storage";
import type { MediaItem, TmdbSeason, TmdbSeasonSummary } from "@/lib/tmdb/types";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const FULLSCREEN_HINT_KEY = "anuflix_fullscreen_hint_seen";

interface PlayerEvent {
	type: "PLAYER_EVENT";
	data: {
		event: "timeupdate" | "play" | "pause" | "ended" | "seeked";
		timestamp?: number;
		currentTime?: number;
		duration: number;
		season?: number;
		episode?: number;
	};
}

function isPlayerEvent(value: unknown): value is PlayerEvent {
	if (!value || typeof value !== "object") return false;
	const event = value as Partial<PlayerEvent>;
	return (
		event.type === "PLAYER_EVENT" &&
		!!event.data &&
		(typeof event.data.timestamp === "number" || typeof event.data.currentTime === "number") &&
		typeof event.data.duration === "number" &&
		["timeupdate", "play", "pause", "ended", "seeked"].includes(event.data.event ?? "")
	);
}

function parsePlayerEvent(value: unknown) {
	if (typeof value !== "string") return isPlayerEvent(value) ? value : undefined;

	try {
		const parsed: unknown = JSON.parse(value);
		return isPlayerEvent(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}

export function Player({
	media,
	season,
	episode,
	seasons,
	episodes,
}: Readonly<{
	media: MediaItem;
	season?: number;
	episode?: number;
	seasons?: TmdbSeasonSummary[];
	episodes?: TmdbSeason["episodes"];
}>) {
	const { t } = useTranslation();
	const playerUrl = playbackProvider.buildPlayerUrl({
		mediaId: media.id,
		mediaType: media.mediaType,
		season,
		episode,
		animeMovie: media.animeFormat === "movie",
	});
	const player = useRef<HTMLDivElement>(null);
	const lastSaved = useRef(0);
	const activeEpisode = useRef({ season, episode });
	const [fullscreen, setFullscreen] = useState(false);
	const [showFullscreenHint, setShowFullscreenHint] = useState(false);

	useEffect(() => {
		if (media.mediaType !== "tv") return;

		const frame = requestAnimationFrame(() => {
			try {
				setShowFullscreenHint(localStorage.getItem(FULLSCREEN_HINT_KEY) !== "true");
			} catch {
				setShowFullscreenHint(true);
			}
		});
		return () => cancelAnimationFrame(frame);
	}, [media.mediaType]);

	useEffect(() => {
		function syncFullscreen() {
			setFullscreen(document.fullscreenElement === player.current);
		}

		syncFullscreen();
		document.addEventListener("fullscreenchange", syncFullscreen);
		return () => document.removeEventListener("fullscreenchange", syncFullscreen);
	}, []);

	useEffect(() => {
		const providerOrigin = new URL(
			process.env.NEXT_PUBLIC_VIDEASY_BASE_URL ?? "https://player.videasy.to",
		).origin;

		function handleMessage(event: MessageEvent) {
			if (event.origin !== providerOrigin) return;
			const message = parsePlayerEvent(event.data);
			if (!message) return;
			const { duration } = message.data;
			const currentTime = message.data.timestamp ?? message.data.currentTime;
			const eventSeason = message.data.season ?? season;
			const eventEpisode = message.data.episode ?? episode;

			if (
				media.mediaType === "tv" &&
				Number.isInteger(eventSeason) &&
				Number.isInteger(eventEpisode) &&
				(activeEpisode.current.season !== eventSeason || activeEpisode.current.episode !== eventEpisode)
			) {
				activeEpisode.current = { season: eventSeason, episode: eventEpisode };
				window.history.replaceState(
					window.history.state,
					"",
					`/watch/tv/${media.id}/${eventSeason}/${eventEpisode}`,
				);
			}

			if (
				typeof currentTime !== "number" ||
				!Number.isFinite(currentTime) ||
				!Number.isFinite(duration) ||
				currentTime < 0 ||
				duration <= 0
			)
				return;
			const playerEvent = message.data.event;
			const now = Date.now();
			const immediate = ["pause", "seeked", "ended"].includes(playerEvent);

			if (!immediate && now - lastSaved.current < 7000) return;
			lastSaved.current = now;
			const played = duration > 0 ? (currentTime / duration) * 100 : 0;
			progressStorage.save({
				media,
				season: eventSeason,
				episode: eventEpisode,
				currentTime,
				duration,
				percentage: playerEvent === "ended" ? 100 : played,
				updatedAt: now,
			});
		}

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [media, season, episode]);

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			setShowFullscreenHint(false);
			try {
				localStorage.setItem(FULLSCREEN_HINT_KEY, "true");
			} catch {
				setShowFullscreenHint(false);
			}
		}

		const change = document.fullscreenElement
			? document.exitFullscreen()
			: player.current?.requestFullscreen();
		void change?.catch(() => undefined);
	}

	return (
		<div
			ref={player}
			className={clsx(
				"relative h-dvh w-full overflow-hidden",
				"bg-black",
				"shadow-[0_28px_80px_rgba(0,0,0,.65)]",
			)}
		>
			<iframe
				key={`${media.mediaType}-${media.id}-${season ?? 0}-${episode ?? 0}`}
				src={playerUrl}
				title={t(translation.Player.WatchTitle, { title: media.title })}
				allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
				allowFullScreen
				onLoad={(event) => event.currentTarget.contentWindow?.focus()}
				className={clsx("size-full border-0")}
			/>
			{showFullscreenHint && media.mediaType === "tv" && (
				<output
					id="fullscreen-hint"
					className={clsx(
						"absolute right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(max(1rem,env(safe-area-inset-bottom))+3.5rem)] z-30 hidden max-w-60 rounded-lg px-3 py-2.5 sm:block",
						"border border-white/15 bg-black/75 backdrop-blur-md",
						"text-xs leading-5 text-white",
					)}
				>
					{t(translation.Player.FullscreenHint)}
				</output>
			)}
			<button
				type="button"
				aria-label={t(
					fullscreen ? translation.Player.ExitFullscreen : translation.Player.EnterFullscreen,
				)}
				aria-describedby={showFullscreenHint ? "fullscreen-hint" : undefined}
				onClick={toggleFullscreen}
				className={clsx(
					"absolute right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 hidden size-11 place-items-center rounded-full sm:grid",
					"bg-black/50 backdrop-blur-sm",
					"text-white",
					"transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
				)}
			>
				<Icon name={fullscreen ? "fullscreen-exit" : "fullscreen"} className="size-6" />
			</button>
			{media.mediaType === "tv" &&
				season !== undefined &&
				episode !== undefined &&
				seasons &&
				episodes && (
					<PlayerEpisodeSelector
						mediaId={media.id}
						currentSeason={season}
						currentEpisode={episode}
						seasons={seasons}
						episodes={episodes}
					/>
				)}
		</div>
	);
}
