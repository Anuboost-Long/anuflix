import Link from "next/link";
import clsx from "clsx";
import { Brand } from "@/components/shared/brand";

export function Footer() {
  return (
    <footer
      className={clsx(
        "grid gap-6 md:grid-cols-[1fr_auto] md:items-start",
        "border-t border-border",
        "text-sm text-text-muted",
        "mx-[clamp(1.25rem,4vw,4.5rem)] mb-20 py-10 md:mb-0"
      )}
    >
      <Brand />
      <p className={clsx("max-w-lg md:col-start-1")}>
        Explore movies and series. Playback availability may vary by title and region.
      </p>
      <nav
        aria-label="Footer navigation"
        className={clsx(
          "flex flex-wrap gap-5 md:col-start-2 md:row-start-1",
          "text-text-secondary"
        )}
      >
        <Link href="/anime">Anime</Link>
        <Link href="/live">Live sports</Link>
        <Link href="/discover">Discover</Link>
        <Link href="/my-list">My List</Link>
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
          TMDB
        </a>
      </nav>
      <small className={clsx("text-[11px] md:col-span-2")}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </small>
    </footer>
  );
}
