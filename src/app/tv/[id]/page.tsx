import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MediaDetails } from "@/components/details/media-details"
import { getMediaDetails, getSeason } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
  try {
    const { media } = await getMediaDetails("tv", Number((await params).id))
    return media ? { title: `${media.title} — Anuflix`, description: media.overview } : {}
  } catch { return {} }
}

export default async function TvDetailsPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Promise<{ season?: string }>
}>) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const { media, raw, recommendations } = await getMediaDetails("tv", id)
  if (!media) notFound()
  const requestedSeason = Number((await searchParams).season ?? raw.seasons?.find(({ season_number }) => season_number > 0)?.season_number ?? 1)
  const season = await getSeason(id, requestedSeason)
  return <MediaDetails media={media} details={raw} recommendations={recommendations} season={season} />
}
