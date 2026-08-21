import Link from "next/link"
import { Brand } from "@/components/shared/brand"

export function Footer() {
  return (
    <footer className="mx-[clamp(1.25rem,4vw,4.5rem)] mb-20 grid gap-6 border-t border-border py-10 text-sm text-text-muted md:mb-0 md:grid-cols-[1fr_auto] md:items-start">
      <Brand />
      <p className="max-w-lg md:col-start-1">Explore movies and series. Playback availability may vary by title and region.</p>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-text-secondary md:col-start-2 md:row-start-1">
        <Link href="/live">Live sports</Link>
        <Link href="/discover">Discover</Link>
        <Link href="/my-list">My List</Link>
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a>
      </nav>
      <small className="text-[11px] md:col-span-2">This product uses the TMDB API but is not endorsed or certified by TMDB.</small>
    </footer>
  )
}
