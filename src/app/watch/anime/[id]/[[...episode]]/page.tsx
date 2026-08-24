import { Player } from "@/components/player/player";
import { PlayerBackButton } from "@/components/player/player-back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getAnimeDetails } from "@/lib/anilist/queries";
import clsx from "clsx";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WatchAnimePage({
	params,
}: Readonly<{
	params: Promise<{ id: string; episode?: string[] }>;
}>) {
	const values = await params;
	const t = await getServerTranslation();
	const id = Number(values.id);
	const episode = Number(values.episode?.[0] ?? 1);
	if (
		!Number.isInteger(id) ||
		!Number.isInteger(episode) ||
		episode < 1 ||
		(values.episode?.length ?? 0) > 1
	)
		notFound();
	const anime = await getAnimeDetails(id);
	if (!anime) notFound();

	return (
		<div className={clsx("relative h-dvh w-full overflow-hidden bg-player")}>
			<PlayerBackButton href={`/anime/${id}`} label={t(translation.Common.BackToDetails)} />
			<Player
				media={anime.media}
				episode={anime.media.animeFormat === "movie" ? undefined : episode}
			/>
		</div>
	);
}
