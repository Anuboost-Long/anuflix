import { Hero } from "@/components/hero/hero";
import { MediaRow } from "@/components/media/media-row";
import { TopTenRow } from "@/components/media/top-ten-row";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getAnimeContent } from "@/lib/tmdb/queries";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	const t = await getServerTranslation();
	return {
		title: t(translation.Metadata.AnimeTitle),
		description: t(translation.Metadata.AnimeDescription),
	};
}

export default async function AnimePage() {
	const t = await getServerTranslation();
	const anime = await getAnimeContent();
	const featured = anime.spotlight
		.filter(({ backdropPath, overview }) => backdropPath && overview)
		.slice(0, 5);

	return (
		<>
			<Hero items={featured} eyebrow={t(translation.AnimePage.Spotlight)} />
			<div className={clsx("space-y-14 pb-16")}>
				<TopTenRow items={anime.seasonal} />
				<MediaRow
					title={t(translation.AnimePage.PopularSeries)}
					eyebrow={t(translation.AnimePage.MostWatched)}
					items={anime.popular}
					priority
				/>
				<MediaRow
					title={t(translation.AnimePage.TopRated)}
					eyebrow={t(translation.AnimePage.AudienceAcclaimed)}
					items={anime.topRated}
				/>
				<MediaRow
					title={t(translation.AnimePage.NewReleases)}
					eyebrow={t(translation.AnimePage.FreshArrivals)}
					items={anime.newReleases}
				/>
				<MediaRow title="18+" eyebrow={t(translation.AnimePage.Mature)} items={anime.mature} />
			</div>
		</>
	);
}
