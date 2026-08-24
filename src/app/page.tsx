import { Hero } from "@/components/hero/hero";
import { ContinueWatching } from "@/components/media/continue-watching";
import { MediaRow } from "@/components/media/media-row";
import { TopTenRow } from "@/components/media/top-ten-row";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getHomeContent } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const t = await getServerTranslation();
	const content = await getHomeContent();
	const featured = content.trending
		.filter(({ backdropPath, overview }) => backdropPath && overview)
		.slice(0, 5);

	if (!featured.length) {
		return (
			<div className="flex min-h-[75vh] items-center justify-center px-6 text-center">
				<div>
					<h1 className="text-3xl font-black text-text-primary">{t(translation.Home.EmptyTitle)}</h1>
					<p className="mt-2 text-text-secondary">{t(translation.Home.EmptyDescription)}</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<Hero items={featured} eyebrow={t(translation.Hero.FeaturedToday)} />
			<div className="space-y-14 pb-14 sm:space-y-16">
				<ContinueWatching />
				<TopTenRow items={content.trending} />
				<MediaRow
					title={t(translation.Home.TrendingMovies)}
					eyebrow={t(translation.Home.FreshMomentum)}
					items={content.trendingMovies}
					priority
				/>
				<MediaRow
					title={t(translation.Home.PopularMovies)}
					eyebrow={t(translation.Home.CrowdFavorites)}
					items={content.popularMovies}
				/>
				<MediaRow
					title={t(translation.Home.PopularSeries)}
					eyebrow={t(translation.Home.StoriesWorthStayingFor)}
					items={content.popularTv}
				/>
				<MediaRow
					title={t(translation.Home.TopRatedFilms)}
					eyebrow={t(translation.Home.CriticallyAcclaimed)}
					items={content.topRatedMovies}
				/>
				<MediaRow
					title={t(translation.Home.BingeWorthyTv)}
					eyebrow={t(translation.Home.HighestRated)}
					items={content.topRatedTv}
				/>
			</div>
		</>
	);
}
