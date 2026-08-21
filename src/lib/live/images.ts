const STREAMED_URL = "https://streamed.pk"

export const liveImage = {
  poster: (path?: string | null) => path ? new URL(path, STREAMED_URL).toString() : undefined,
  badge: (id?: string) => id
    ? `${STREAMED_URL}/api/images/badge/${encodeURIComponent(id)}.webp`
    : undefined,
}
