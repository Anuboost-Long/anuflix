import type { Metadata } from "next"
import { LiveCatalog } from "@/components/live/live-catalog"
import { Icon } from "@/components/shared/icon"
import { getLiveCatalog } from "@/lib/live/client"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Live sports",
  description: "Browse live and upcoming sports matches on Anuflix.",
}

export default async function LivePage() {
  const { sports, matches, liveIds, liveCount, total, hasMore } = await getLiveCatalog()

  return (
    <div className="min-h-screen pb-16 pt-20">
      <section className="relative overflow-hidden px-[clamp(1.25rem,4vw,4.5rem)] py-14 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,.16),transparent_32%)]" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] text-brand-light uppercase"><Icon name="radio" className="size-4" /> Live on Anuflix</span>
          <h1 className="mt-3 text-4xl leading-[.95] font-black tracking-[-.045em] text-text-primary sm:text-6xl">Every match.<br />One place.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">Browse live and upcoming events across football, basketball, motorsports, combat sports, and more.</p>
          <div className="mt-7 flex flex-wrap gap-5 text-sm text-text-secondary"><span><strong className="text-text-primary">{liveCount}</strong> live now</span><span><strong className="text-text-primary">{total}</strong> available matches</span><span><strong className="text-text-primary">{sports.length}</strong> sports</span></div>
        </div>
      </section>
      <LiveCatalog matches={matches} sports={sports} liveIds={liveIds} total={total} hasMore={hasMore} />
    </div>
  )
}
