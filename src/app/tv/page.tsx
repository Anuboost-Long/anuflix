import { MediaRow } from "@/components/media/media-row"
import { getMediaList } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export default async function TvPage() {
  const [popular, airing, today, topRated] = await Promise.all([
    getMediaList("/tv/popular", "tv"),
    getMediaList("/tv/on_the_air", "tv"),
    getMediaList("/tv/airing_today", "tv"),
    getMediaList("/tv/top_rated", "tv"),
  ])
  return <div className="space-y-14 pb-16 pt-28"><div className="px-[clamp(1.25rem,4vw,4.5rem)]"><span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">One more episode</span><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">TV shows</h1><p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">Long-form stories, current favorites, and acclaimed series worth the time.</p></div><MediaRow title="Popular series" items={popular} priority /><MediaRow title="On the air" items={airing} /><MediaRow title="Airing today" items={today} /><MediaRow title="Top rated" items={topRated} /></div>
}
