import Link from "next/link"
import { notFound } from "next/navigation"
import { Player } from "@/components/player/player"
import { Icon } from "@/components/shared/icon"
import { getMediaDetails, getSeason } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export default async function WatchEpisodePage({ params }: Readonly<{ params: Promise<{ id: string; season: string; episode: string }> }>) {
  const values = await params
  const id = Number(values.id)
  const seasonNumber = Number(values.season)
  const episodeNumber = Number(values.episode)
  if (![id, seasonNumber, episodeNumber].every(Number.isInteger)) notFound()
  const [{ media }, season] = await Promise.all([getMediaDetails("tv", id), getSeason(id, seasonNumber)])
  const episode = season.episodes.find((item) => item.episode_number === episodeNumber)
  if (!media || !episode) notFound()

  return (
    <div className="min-h-screen bg-player px-[clamp(1rem,3vw,3rem)] pb-16 pt-24">
      <div className="mx-auto max-w-[1600px]">
        <Link href={`/tv/${id}?season=${seasonNumber}`} className="mb-5 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"><Icon name="arrow-left" className="size-4" /> Back to episodes</Link>
        <Player media={media} season={seasonNumber} episode={episodeNumber} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6"><div><span className="text-[11px] tracking-[.16em] text-brand-light uppercase">{media.title} · S{seasonNumber} E{episodeNumber}</span><h1 className="mt-1 text-2xl font-bold text-text-primary">{episode.name}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">{episode.overview}</p></div>{season.episodes.some((item) => item.episode_number === episodeNumber + 1) && <Link href={`/watch/tv/${id}/${seasonNumber}/${episodeNumber + 1}`} className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-bright">Next episode <Icon name="arrow-right" className="size-4" /></Link>}</div>
      </div>
    </div>
  )
}
