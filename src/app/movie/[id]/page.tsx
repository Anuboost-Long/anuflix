import { MediaDetails } from "@/components/details/media-details";
import { BackButton } from "@/components/navigation/back-button";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getMediaDetails } from "@/lib/tmdb/queries";
import clsx from "clsx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>): Promise<Metadata> {
	try {
		const { media } = await getMediaDetails("movie", Number((await params).id));
		return media
			? {
					title: `${media.title}${media.year ? ` (${media.year})` : ""} — Anuflix`,
					description: media.overview,
				}
			: {};
	} catch {
		return {};
	}
}

export default async function MovieDetailsPage({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
	const id = Number((await params).id);
	const t = await getServerTranslation();
	if (!Number.isInteger(id)) notFound();
	const { media, raw, recommendations } = await getMediaDetails("movie", id);
	if (!media) notFound();
	return (
		<div className={clsx("relative")}>
			<div className={clsx("absolute top-24 left-[clamp(1.25rem,4vw,4.5rem)] z-30")}>
				<BackButton fallbackHref="/movies" label={t(translation.Common.Back)} />
			</div>
			<MediaDetails media={media} details={raw} recommendations={recommendations} />
		</div>
	);
}
