import { MediaRow } from "@/components/media/media-row"
import { getMediaList } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export default async function MoviesPage() {
  const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
    getMediaList("/movie/popular", "movie"),
    getMediaList("/movie/now_playing", "movie"),
    getMediaList("/movie/top_rated", "movie"),
    getMediaList("/movie/upcoming", "movie"),
  ])
  return <div className="space-y-14 px-0 pb-16 pt-28"><div className="px-[clamp(1.25rem,4vw,4.5rem)]"><span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">The big screen, at home</span><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">Movies</h1><p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">Fresh releases, crowd favorites, and the films people keep talking about.</p></div><MediaRow title="Popular now" items={popular} priority /><MediaRow title="Now playing" items={nowPlaying} /><MediaRow title="Top rated" items={topRated} /><MediaRow title="Coming soon" items={upcoming} /></div>
}
