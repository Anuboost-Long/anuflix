import type { MediaItem } from "@/lib/tmdb/types";

const PROGRESS_KEY = "anuflix_progress";

export interface WatchProgress {
  media: MediaItem;
  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  percentage: number;
  updatedAt: number;
}

function key(media: Pick<MediaItem, "id" | "mediaType">, season?: number, episode?: number) {
  switch (media.mediaType) {
    case "movie":
      return `movie:${media.id}`;
    case "tv":
      return `tv:${media.id}:${season}:${episode}`;
    case "anime":
      return `anime:${media.id}:${episode ?? 1}`;
  }
}

function read(): Record<string, WatchProgress> {
  if (typeof window === "undefined") return {};
  try {
    const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

export const progressStorage = {
  get(media: Pick<MediaItem, "id" | "mediaType">, season?: number, episode?: number) {
    return read()[key(media, season, episode)];
  },
  getActive() {
    return Object.values(read())
      .filter(({ percentage }) => percentage > 2 && percentage < 95)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
  save(progress: WatchProgress) {
    const records = read();
    records[key(progress.media, progress.season, progress.episode)] = progress;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event("anuflix:progress"));
  }
};
