import { Player } from "@/components/player/player";
import { PlayerBackButton } from "@/components/player/player-back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getMediaDetails, getSeason } from "@/lib/tmdb/queries";
import clsx from "clsx";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WatchEpisodePage({
	params,
}: Readonly<{ params: Promise<{ id: string; season: string; episode: string }> }>) {
	const values = await params;
	const t = await getServerTranslation();
	const id = Number(values.id);
	const seasonNumber = Number(values.season);
	const episodeNumber = Number(values.episode);
	if (![id, seasonNumber, episodeNumber].every(Number.isInteger)) notFound();
	const [{ media, raw }, season] = await Promise.all([
		getMediaDetails("tv", id),
		getSeason(id, seasonNumber),
	]);
	const hasEpisode = season.episodes.some((item) => item.episode_number === episodeNumber);
	if (!media || !hasEpisode) notFound();

	return (
		<div className={clsx("relative h-dvh w-full overflow-hidden bg-player")}>
			<PlayerBackButton
				href={`/tv/${id}?season=${seasonNumber}`}
				label={t(translation.Common.BackToEpisodes)}
			/>
			<Player
				media={media}
				season={seasonNumber}
				episode={episodeNumber}
				seasons={raw.seasons?.filter(({ season_number }) => season_number > 0)}
				episodes={season.episodes}
			/>
		</div>
	);
}
