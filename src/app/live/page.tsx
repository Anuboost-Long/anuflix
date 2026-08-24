import { LiveCatalog } from "@/components/live/live-catalog";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { getLiveCatalog } from "@/lib/live/client";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	const t = await getServerTranslation();
	return {
		title: t(translation.Metadata.LiveTitle),
		description: t(translation.Metadata.LiveDescription),
	};
}

export default async function LivePage() {
	const t = await getServerTranslation();
	const { sports, matches, liveIds, liveCount, total, hasMore } = await getLiveCatalog();

	return (
		<div className="min-h-screen pb-16 pt-20">
			<section className="relative overflow-hidden px-[clamp(1.25rem,4vw,4.5rem)] py-14 sm:py-20">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,99,235,.16),transparent_32%)]" />
				<div className="relative max-w-3xl">
					<span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
						<Icon name="radio" className="size-4" /> {t(translation.LivePage.Eyebrow)}
					</span>
					<h1 className="mt-3 text-4xl leading-[.95] font-black tracking-[-.045em] text-text-primary sm:text-6xl">
						{t(translation.LivePage.Title)}
					</h1>
					<p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
						{t(translation.LivePage.Description)}
					</p>
					<div className="mt-7 flex flex-wrap gap-5 text-sm text-text-secondary">
						<span>{t(translation.LivePage.LiveNow, { count: liveCount })}</span>
						<span>{t(translation.LivePage.AvailableMatches, { count: total })}</span>
						<span>{t(translation.LivePage.SportsCount, { count: sports.length })}</span>
					</div>
				</div>
			</section>
			<LiveCatalog
				matches={matches}
				sports={sports}
				liveIds={liveIds}
				total={total}
				hasMore={hasMore}
			/>
		</div>
	);
}
