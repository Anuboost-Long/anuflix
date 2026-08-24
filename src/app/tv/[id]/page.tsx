import { MediaDetails } from "@/components/details/media-details";
import { BackButton } from "@/components/navigation/back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getEpisodePage, getMediaDetails } from "@/lib/tmdb/queries";
import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
	try {
		const { media } = await getMediaDetails("tv", Number((await params).id));
		return media ? { title: `${media.title} — Anuflix`, description: media.overview } : {};
	} catch {
		return {};
	}
}

export default async function TvDetailsPage({
	params,
	searchParams,
}: Readonly<{
	params: Promise<{ id: string }>;
	searchParams: Promise<{ season?: string; page?: string }>;
}>) {
	const id = Number((await params).id);
	const t = await getServerTranslation();
	if (!Number.isInteger(id)) notFound();
	const { media, raw, recommendations } = await getMediaDetails("tv", id);
	if (!media) notFound();
	const query = await searchParams;
	const requestedSeason = Number(
		query.season ?? raw.seasons?.find(({ season_number }) => season_number > 0)?.season_number ?? 1,
	);
	const seasons = raw.seasons?.filter(({ season_number }) => season_number > 0) ?? [];
	const selectedSeason =
		seasons.find(({ season_number }) => season_number === requestedSeason) ?? seasons[0];
	const episodePage = selectedSeason
		? await getEpisodePage({
				id,
				season: selectedSeason.season_number,
				page: Math.max(1, Number(query.page) || 1),
				summary: selectedSeason,
			})
		: undefined;
	return (
		<div className={clsx("relative")}>
			<div className={clsx("absolute top-24 left-[clamp(1.25rem,4vw,4.5rem)] z-30")}>
				<BackButton fallbackHref="/tv" label={t(translation.Common.Back)} />
			</div>
			<MediaDetails
				media={media}
				details={raw}
				recommendations={recommendations}
				episodePage={episodePage}
			/>
		</div>
	);
}
