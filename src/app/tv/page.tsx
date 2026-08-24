import { MediaRow } from "@/components/media/media-row";
import { BackButton } from "@/components/navigation/back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getMediaList } from "@/lib/tmdb/queries";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function TvPage() {
	const t = await getServerTranslation();
	const [popular, airing, today, topRated] = await Promise.all([
		getMediaList("/tv/popular", "tv"),
		getMediaList("/tv/on_the_air", "tv"),
		getMediaList("/tv/airing_today", "tv"),
		getMediaList("/tv/top_rated", "tv"),
	]);
	return (
		<div className={clsx("space-y-14 pb-16 pt-28")}>
			<div className={clsx("px-[clamp(1.25rem,4vw,4.5rem)]")}>
				<BackButton fallbackHref="/" label={t(translation.Common.Back)} />
				<div className={clsx("mt-8")}>
					<span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
						{t(translation.TvPage.Eyebrow)}
					</span>
					<h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">
						{t(translation.Navigation.TvShows)}
					</h1>
					<p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
						{t(translation.TvPage.Description)}
					</p>
				</div>
			</div>
			<MediaRow title={t(translation.TvPage.PopularSeries)} items={popular} priority />
			<MediaRow title={t(translation.TvPage.OnTheAir)} items={airing} />
			<MediaRow title={t(translation.TvPage.AiringToday)} items={today} />
			<MediaRow title={t(translation.TvPage.TopRated)} items={topRated} />
		</div>
	);
}
