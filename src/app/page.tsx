import { Hero } from "@/components/hero/hero";
import { ContinueWatching } from "@/components/media/continue-watching";
import { MediaRow } from "@/components/media/media-row";
import { TopTenRow } from "@/components/media/top-ten-row";
import { getHomeContent } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getHomeContent();
  const featured = content.trending
    .filter(({ backdropPath, overview }) => backdropPath && overview)
    .slice(0, 5);

  if (!featured.length) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-6 text-center">
        <div>
          <h1 className="text-3xl font-black text-text-primary">Nothing to feature yet</h1>
          <p className="mt-2 text-text-secondary">Refresh in a moment to explore today’s lineup.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Hero items={featured} />
      <div className="space-y-14 pb-14 sm:space-y-16">
        <ContinueWatching />
        <TopTenRow items={content.trending} />
        <MediaRow
          title="Trending movies"
          eyebrow="Fresh momentum"
          items={content.trendingMovies}
          priority
        />
        <MediaRow title="Popular movies" eyebrow="Crowd favorites" items={content.popularMovies} />
        <MediaRow
          title="Popular series"
          eyebrow="Stories worth staying for"
          items={content.popularTv}
        />
        <MediaRow
          title="Top rated films"
          eyebrow="Critically acclaimed"
          items={content.topRatedMovies}
        />
        <MediaRow title="Binge-worthy TV" eyebrow="The highest rated" items={content.topRatedTv} />
      </div>
    </>
  );
}
