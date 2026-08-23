const ANILIST_API_URL = "https://graphql.anilist.co";

interface AnilistResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function anilist<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 1800
) {
  const response = await fetch(ANILIST_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate }
  });
  const result = (await response.json()) as AnilistResponse<T>;

  if (!response.ok || result.errors?.length || !result.data) {
    throw new Error(
      result.errors?.[0]?.message ?? `AniList request failed with ${response.status}`
    );
  }

  return result.data;
}
