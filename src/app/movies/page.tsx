import { MediaRow } from "@/components/media/media-row";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getMediaList } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
	const t = await getServerTranslation();
	const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
		getMediaList("/movie/popular", "movie"),
		getMediaList("/movie/now_playing", "movie"),
		getMediaList("/movie/top_rated", "movie"),
		getMediaList("/movie/upcoming", "movie"),
	]);
	return (
		<div className="space-y-14 px-0 pb-16 pt-28">
			<div className="px-[clamp(1.25rem,4vw,4.5rem)]">
				<span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
					{t(translation.MoviesPage.Eyebrow)}
				</span>
				<h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">
					{t(translation.Navigation.Movies)}
				</h1>
				<p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
					{t(translation.MoviesPage.Description)}
				</p>
			</div>
			<MediaRow title={t(translation.MoviesPage.PopularNow)} items={popular} priority />
			<MediaRow title={t(translation.MoviesPage.NowPlaying)} items={nowPlaying} />
			<MediaRow title={t(translation.MoviesPage.TopRated)} items={topRated} />
			<MediaRow title={t(translation.MoviesPage.ComingSoon)} items={upcoming} />
		</div>
	);
}
