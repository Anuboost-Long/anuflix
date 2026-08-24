import { MediaDetails } from "@/components/details/media-details";
import { BackButton } from "@/components/navigation/back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getAnimeDetails } from "@/lib/anilist/queries";
import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
	try {
		const anime = await getAnimeDetails(Number((await params).id));
		return anime
			? { title: `${anime.media.title} — Anuflix`, description: anime.media.overview }
			: {};
	} catch {
		return {};
	}
}

export default async function AnimeDetailsPage({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
	const id = Number((await params).id);
	const t = await getServerTranslation();
	if (!Number.isInteger(id)) notFound();
	const anime = await getAnimeDetails(id);
	if (!anime) notFound();

	return (
		<div className={clsx("relative")}>
			<div className={clsx("absolute top-24 left-[clamp(1.25rem,4vw,4.5rem)] z-30")}>
				<BackButton fallbackHref="/anime" label={t(translation.Common.Back)} />
			</div>
			<MediaDetails media={anime.media} details={anime.raw} recommendations={anime.recommendations} />
		</div>
	);
}
