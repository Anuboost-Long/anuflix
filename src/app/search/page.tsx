import { MediaGrid } from "@/components/media/media-grid"
import { Icon } from "@/components/shared/icon"
import { searchMedia } from "@/lib/tmdb/queries"

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: Readonly<{ searchParams: Promise<{ q?: string }> }>) {
  const query = (await searchParams).q?.trim() ?? ""
  const results = query.length >= 2 ? await searchMedia(query) : []

  return (
    <div className="min-h-[80vh] px-[clamp(1.25rem,4vw,4.5rem)] pb-20 pt-28">
      <span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">Across movies and TV</span>
      <h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">Search</h1>
      <form className="my-8 flex h-14 max-w-3xl items-center gap-3 rounded-xl border border-border bg-surface px-4 focus-within:border-brand-bright focus-within:shadow-[0_0_0_3px_rgba(59,130,246,.15)]">
        <Icon name="search" className="size-5 shrink-0 text-text-muted" />
        <input name="q" defaultValue={query} minLength={2} placeholder="Search movies and TV shows..." className="h-full min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-subtle" />
        <button className="h-9 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-bright">Search</button>
      </form>
      {query.length < 2 ? (
        <div className="border-y border-border py-16 text-center text-sm text-text-secondary">Enter at least two characters to find a title.</div>
      ) : (
        <><div className="mb-6 flex items-end justify-between gap-4"><h2 className="text-2xl font-bold text-text-primary">Results for “{query}”</h2><span className="text-xs text-text-muted">{results.length} titles</span></div><MediaGrid items={results} /></>
      )}
    </div>
  )
}
