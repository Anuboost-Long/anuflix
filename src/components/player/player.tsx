"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { PlayerEpisodeSelector } from "@/components/player/player-episode-selector";
import { playbackProvider } from "@/lib/playback/provider";
import { progressStorage } from "@/lib/progress/storage";
import type { MediaItem, TmdbSeason, TmdbSeasonSummary } from "@/lib/tmdb/types";

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
  episodes
}: Readonly<{
  media: MediaItem;
  season?: number;
  episode?: number;
  seasons?: TmdbSeasonSummary[];
  episodes?: TmdbSeason["episodes"];
}>) {
  const playerUrl = playbackProvider.buildPlayerUrl({
    mediaId: media.id,
    mediaType: media.mediaType,
    season,
    episode,
    animeMovie: media.animeFormat === "movie"
  });
  const lastSaved = useRef(0);
  const activeEpisode = useRef({ season, episode });

  useEffect(() => {
    const providerOrigin = new URL(
      process.env.NEXT_PUBLIC_VIDEASY_BASE_URL ?? "https://player.videasy.to"
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
        (activeEpisode.current.season !== eventSeason ||
          activeEpisode.current.episode !== eventEpisode)
      ) {
        activeEpisode.current = { season: eventSeason, episode: eventEpisode };
        window.history.replaceState(
          window.history.state,
          "",
          `/watch/tv/${media.id}/${eventSeason}/${eventEpisode}`
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
      progressStorage.save({
        media,
        season: eventSeason,
        episode: eventEpisode,
        currentTime,
        duration,
        percentage:
          playerEvent === "ended" ? 100 : duration > 0 ? (currentTime / duration) * 100 : 0,
        updatedAt: now
      });
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [media, season, episode]);

  return (
    <div
      className={clsx(
        "relative h-dvh w-full overflow-hidden",
        "bg-black",
        "shadow-[0_28px_80px_rgba(0,0,0,.65)]"
      )}
    >
      <iframe
        key={`${media.mediaType}-${media.id}-${season ?? 0}-${episode ?? 0}`}
        src={playerUrl}
        title={`Watch ${media.title}`}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        onLoad={(event) => event.currentTarget.contentWindow?.focus()}
        className={clsx("size-full border-0")}
      />
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
