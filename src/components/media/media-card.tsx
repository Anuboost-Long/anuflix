import { Icon } from "@/components/shared/icon";
import { tmdbImage } from "@/lib/tmdb/images";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export function MediaCard({
  media,
  priority = false,
}: Readonly<{ media: MediaItem; priority?: boolean }>) {
  const poster = tmdbImage.poster(media.posterPath);

  return (
    <article className="group min-w-0">
      <Link href={`/${media.mediaType}/${media.id}`} className="block">
        <span
          className={clsx(
            "relative block aspect-2/3 overflow-hidden rounded-lg bg-surface",
            "border border-transparent transition-[border-color,box-shadow] duration-300 ease-out",
            "group-hover:border-border-strong group-hover:shadow-[0_14px_38px_rgba(0,0,0,.48),0_0_18px_rgba(37,99,235,.08)]",
          )}
        >
          {poster ? (
            <Image
              src={poster}
              alt={`${media.title} poster`}
              fill
              sizes="(max-width: 640px) 42vw, (max-width: 1100px) 24vw, 15vw"
              priority={priority}
              className={clsx(
                "object-cover",
                "will-change-transform transition-all duration-650 ease-[cubic-bezier(.22,1,.36,1)]",
                "group-hover:scale-[1.06] group-hover:brightness-110",
              )}
            />
          ) : (
            <span className="flex size-full items-center justify-center bg-[linear-gradient(145deg,#0d1628,#08101f)] text-text-muted">
              <Icon name="film" className="size-8" />
            </span>
          )}
          <span
            className={clsx(
              "absolute inset-0 flex items-end justify-between p-3 opacity-0",
              "bg-[linear-gradient(to_top,rgba(5,9,20,.95),transparent_55%)] transition-opacity duration-400 ease-[cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <span className="grid size-9 place-items-center rounded-full bg-brand-primary text-white shadow-[0_0_18px_rgba(37,99,235,.3)]">
              <Icon name="play" className="size-4" />
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-white uppercase">
              {media.year ?? "New"} ·{" "}
              {media.mediaType === "movie" ? "Movie" : "Series"}
            </span>
          </span>
        </span>
        <span className="mt-3 block truncate text-sm font-semibold text-text-primary">
          {media.title}
        </span>
        <span className="mt-1 flex items-center justify-between text-[11px] font-medium text-text-muted">
          <span className="text-brand-light">
            ★ {media.voteAverage ? media.voteAverage.toFixed(1) : "NR"}
          </span>
          <span>{media.mediaType === "movie" ? "Film" : "TV"}</span>
        </span>
      </Link>
    </article>
  );
}
