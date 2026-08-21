import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LivePlayer } from "@/components/live/live-player"
import { Icon } from "@/components/shared/icon"
import { getLiveMatch, getMatchStreams } from "@/lib/live/client"

export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
})

export async function generateMetadata({ params }: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
  const match = await getLiveMatch((await params).id)
  return match ? {
    title: `${match.title} live`,
    description: `Watch ${match.title} live on Anuflix.`,
    robots: { index: false, follow: false },
  } : {}
}

export default async function LiveMatchPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const match = await getLiveMatch((await params).id)
  if (!match) notFound()
  const streams = await getMatchStreams(match.sources)

  return (
    <div className="min-h-screen bg-player px-[clamp(1rem,3vw,3rem)] pb-16 pt-24">
      <div className="mx-auto max-w-[1600px]">
        <Link href="/live" className="mb-5 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"><Icon name="arrow-left" className="size-4" /> Back to all matches</Link>
        <LivePlayer title={match.title} streams={streams} />
        <div className="mt-7 grid gap-6 border-b border-border pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.16em] text-brand-light uppercase"><span className="size-1.5 animate-pulse rounded-full bg-red-500" /> Live sports · {match.category.replaceAll("-", " ")}</span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{match.title}</h1>
            <time dateTime={new Date(match.date).toISOString()} className="mt-2 block text-sm text-text-secondary">{dateFormat.format(match.date)} UTC</time>
          </div>
          <p className="max-w-lg text-xs leading-5 text-text-muted">Streams are supplied by a third-party provider and may vary by event or region. Choose another source above if playback is unavailable.</p>
        </div>
      </div>
    </div>
  )
}
