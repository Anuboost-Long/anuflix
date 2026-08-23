import clsx from "clsx";
import { MediaGrid } from "@/components/media/media-grid";
import { discoverMedia, getGenres } from "@/lib/tmdb/queries";
import type { TmdbMediaType } from "@/lib/tmdb/types";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  searchParams
}: Readonly<{
  searchParams: Promise<{
    type?: string;
    genre?: string;
    year?: string;
    rating?: string;
    sort?: string;
  }>;
}>) {
  const filters = await searchParams;
  const mediaType: TmdbMediaType = filters.type === "tv" ? "tv" : "movie";
  const [genres, items] = await Promise.all([
    getGenres(mediaType),
    discoverMedia(mediaType, {
      with_genres: filters.genre,
      primary_release_year: mediaType === "movie" ? filters.year : undefined,
      first_air_date_year: mediaType === "tv" ? filters.year : undefined,
      "vote_average.gte": filters.rating,
      sort_by: filters.sort ?? "popularity.desc"
    })
  ]);

  return (
    <div className="px-[clamp(1.25rem,4vw,4.5rem)] pb-20 pt-28">
      <span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
        Find your next watch
      </span>
      <h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">
        Discover
      </h1>
      <form className="my-8 flex flex-wrap items-end gap-3 border-y border-border py-5">
        <label className="grid gap-2 text-xs font-semibold text-text-secondary">
          Type
          <select
            name="type"
            defaultValue={mediaType}
            className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-bright"
          >
            <option value="movie">Movies</option>
            <option value="tv">TV shows</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-text-secondary">
          Genre
          <select
            name="genre"
            defaultValue={filters.genre ?? ""}
            className="h-11 min-w-40 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-bright"
          >
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-text-secondary">
          Year
          <input
            name="year"
            type="number"
            min="1900"
            max="2030"
            defaultValue={filters.year}
            placeholder="Any year"
            className="h-11 w-28 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-subtle focus:border-brand-bright"
          />
        </label>
        <label className="grid gap-2 text-xs font-semibold text-text-secondary">
          Rating
          <select
            name="rating"
            defaultValue={filters.rating ?? ""}
            className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-bright"
          >
            <option value="">Any rating</option>
            <option value="6">6+</option>
            <option value="7">7+</option>
            <option value="8">8+</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-semibold text-text-secondary">
          Sort
          <select
            name="sort"
            defaultValue={filters.sort ?? "popularity.desc"}
            className="h-11 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-bright"
          >
            <option value="popularity.desc">Most popular</option>
            <option value="vote_average.desc">Highest rated</option>
            <option
              value={mediaType === "movie" ? "primary_release_date.desc" : "first_air_date.desc"}
            >
              Newest
            </option>
          </select>
        </label>
        <button
          className={clsx(
            "h-11 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white",
            "transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          )}
        >
          Apply filters
        </button>
      </form>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <span className="text-[11px] tracking-[.16em] text-text-muted uppercase">
            Curated from TMDB
          </span>
          <h2 className="mt-1 text-2xl font-bold text-text-primary">
            {genres.find(({ id }) => String(id) === filters.genre)?.name ?? "Popular"}{" "}
            {mediaType === "movie" ? "movies" : "series"}
          </h2>
        </div>
        <span className="text-xs text-text-muted">{items.length} titles</span>
      </div>
      <MediaGrid items={items} />
    </div>
  );
}
