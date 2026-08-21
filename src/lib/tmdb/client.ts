const TMDB_BASE_URL = "https://api.themoviedb.org/3"

export class TmdbError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "TmdbError"
  }
}

export async function tmdb<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  revalidate = 1800,
): Promise<T> {
  const token = process.env.TMDB_API_READ_TOKEN

  if (!token) {
    throw new TmdbError("TMDB_API_READ_TOKEN is not configured.", 500)
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`)
  url.searchParams.set("language", "en-US")

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate },
  })

  if (!response.ok) {
    throw new TmdbError(`TMDB request failed with status ${response.status}.`, response.status)
  }

  return response.json() as Promise<T>
}
