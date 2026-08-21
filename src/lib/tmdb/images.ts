const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p"

function image(path: string | undefined, size: string) {
  return path ? `${TMDB_IMAGE_URL}/${size}${path}` : undefined
}

export const tmdbImage = {
  poster: (path?: string, size = "w500") => image(path, size),
  backdrop: (path?: string, size = "w1280") => image(path, size),
  profile: (path?: string, size = "w185") => image(path, size),
  still: (path?: string, size = "w500") => image(path, size),
  original: (path?: string) => image(path, "original"),
}
