import Link from "next/link"
import { notFound } from "next/navigation"
import { Player } from "@/components/player/player"
import { Icon } from "@/components/shared/icon"
import { getMediaDetails } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export default async function WatchMoviePage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const { media } = await getMediaDetails("movie", id)
  if (!media) notFound()

  return (
    <div className="min-h-screen bg-player px-[clamp(1rem,3vw,3rem)] pb-16 pt-24">
      <div className="mx-auto max-w-[1600px]">
        <Link href={`/movie/${id}`} className="mb-5 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"><Icon name="arrow-left" className="size-4" /> Back to details</Link>
        <Player media={media} />
        <div className="mt-6 border-b border-border pb-6"><span className="text-[11px] tracking-[.16em] text-brand-light uppercase">Now playing</span><h1 className="mt-1 text-2xl font-bold text-text-primary">{media.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{media.overview}</p></div>
      </div>
    </div>
  )
}
