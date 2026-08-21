import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MediaDetails } from "@/components/details/media-details"
import { getMediaDetails } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
  try {
    const { media } = await getMediaDetails("movie", Number((await params).id))
    return media ? { title: `${media.title}${media.year ? ` (${media.year})` : ""} — Anuflix`, description: media.overview } : {}
  } catch { return {} }
}

export default async function MovieDetailsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const { media, raw, recommendations } = await getMediaDetails("movie", id)
  if (!media) notFound()
  return <MediaDetails media={media} details={raw} recommendations={recommendations} />
}
