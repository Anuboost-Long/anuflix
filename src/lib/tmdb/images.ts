const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

function image(path: string | undefined, size: string) {
  if (!path) return undefined;
  return path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${TMDB_IMAGE_URL}/${size}${path}`;
}

export const tmdbImage = {
  poster: (path?: string, size = "w500") => image(path, size),
  backdrop: (path?: string, size = "w1280") => image(path, size),
  profile: (path?: string, size = "w185") => image(path, size),
  still: (path?: string, size = "w500") => image(path, size),
  original: (path?: string) => image(path, "original")
};
