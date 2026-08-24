import { Player } from "@/components/player/player";
import { PlayerBackButton } from "@/components/player/player-back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getMediaDetails } from "@/lib/tmdb/queries";
import clsx from "clsx";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WatchMoviePage({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
	const id = Number((await params).id);
	const t = await getServerTranslation();
	if (!Number.isInteger(id)) notFound();
	const { media } = await getMediaDetails("movie", id);
	if (!media) notFound();

	return (
		<div className={clsx("relative h-dvh w-full overflow-hidden bg-player")}>
			<PlayerBackButton href={`/movie/${id}`} label={t(translation.Common.BackToDetails)} />
			<Player media={media} />
		</div>
	);
}
