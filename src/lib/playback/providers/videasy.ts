import type { PlaybackProvider, PlaybackRequest } from "@/lib/playback/types";

function buildPlayerUrl(request: PlaybackRequest) {
  const base = process.env.NEXT_PUBLIC_VIDEASY_BASE_URL ?? "https://player.videasy.to";
  const color = process.env.NEXT_PUBLIC_PLAYER_COLOR ?? "1D8FFF";
  let path: string;

  switch (request.mediaType) {
    case "movie":
      path = `/movie/${request.mediaId}`;
      break;
    case "tv":
      path = `/tv/${request.mediaId}/${request.season ?? 1}/${request.episode ?? 1}`;
      break;
    case "anime":
      path = `/anime/${request.mediaId}${request.animeMovie ? "" : `/${request.episode ?? 1}`}`;
      break;
  }
  const params = new URLSearchParams({
    color,
    overlay: "true"
  });

  if (request.mediaType === "tv" || (request.mediaType === "anime" && !request.animeMovie)) {
    params.set("nextEpisode", "true");
  }

  if (request.mediaType === "anime" && !request.animeMovie) {
    params.set("episodeSelector", "true");
  }

  if (request.startTime && request.startTime > 0) {
    params.set("progress", String(Math.floor(request.startTime)));
  }

  return `${base}${path}?${params}`;
}

export const videasyProvider: PlaybackProvider = { buildPlayerUrl };
