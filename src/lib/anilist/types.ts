export type AnilistFormat = "MOVIE" | "TV" | "TV_SHORT" | "ONA" | "OVA" | "SPECIAL" | "MUSIC";

export interface AnilistMedia {
  id: number;
  title: {
    english?: string | null;
    romaji?: string | null;
  };
  description?: string | null;
  format?: AnilistFormat | null;
  status?: string | null;
  startDate?: {
    year?: number | null;
  } | null;
  episodes?: number | null;
  duration?: number | null;
  averageScore?: number | null;
  popularity?: number | null;
  genres?: string[] | null;
  bannerImage?: string | null;
  coverImage?: {
    extraLarge?: string | null;
    large?: string | null;
  } | null;
  recommendations?: {
    nodes: Array<{
      mediaRecommendation?: AnilistMedia | null;
    }>;
  } | null;
}

export interface AnilistPage {
  media: AnilistMedia[];
}
