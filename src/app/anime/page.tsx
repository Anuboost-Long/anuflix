import type { Metadata } from "next";
import clsx from "clsx";
import { Hero } from "@/components/hero/hero";
import { MediaRow } from "@/components/media/media-row";
import { TopTenRow } from "@/components/media/top-ten-row";
import { getAnimeContent } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anime",
  description: "Explore anime series and films on Anuflix."
};

export default async function AnimePage() {
  const anime = await getAnimeContent();
  const featured = anime.spotlight
    .filter(({ backdropPath, overview }) => backdropPath && overview)
    .slice(0, 5);

  return (
    <>
      <Hero items={featured} eyebrow="Anime spotlight" />
      <div className={clsx("space-y-14 pb-16")}>
        <TopTenRow items={anime.seasonal} />
        <MediaRow
          title="Popular anime series"
          eyebrow="Most watched"
          items={anime.popular}
          priority
        />
        <MediaRow
          title="Top-rated anime series"
          eyebrow="Audience acclaimed"
          items={anime.topRated}
        />
        <MediaRow title="New anime releases" eyebrow="Fresh arrivals" items={anime.newReleases} />
        <MediaRow title="18+" eyebrow="Mature anime" items={anime.mature} />
      </div>
    </>
  );
}
