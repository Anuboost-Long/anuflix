import { EpisodeBrowser } from "@/components/details/episode-browser";
import { MediaRow } from "@/components/media/media-row";
import { WatchlistButton } from "@/components/media/watchlist-button";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { watchPath } from "@/lib/playback/routes";
import { tmdbImage } from "@/lib/tmdb/images";
import type { MediaItem, TmdbDetails, TmdbEpisodePage } from "@/lib/tmdb/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export async function MediaDetails({
	media,
	details,
	recommendations,
	episodePage,
}: Readonly<{
	media: MediaItem;
	details: TmdbDetails;
	recommendations: MediaItem[];
	episodePage?: TmdbEpisodePage;
}>) {
	const t = await getServerTranslation();
	const backdrop = tmdbImage.backdrop(media.backdropPath);
	const cast = (details.credits ?? details.aggregate_credits)?.cast.slice(0, 10) ?? [];
	const runtime = details.runtime ?? details.episode_run_time?.[0];
	const playHref = watchPath(media);

	return (
		<>
			<section className="relative min-h-[76vh] overflow-hidden" aria-labelledby="media-title">
				{backdrop && (
					<Image
						src={backdrop}
						alt=""
						fill
						priority
						sizes="100vw"
						className="object-cover object-center"
					/>
				)}
				<div
					className={clsx(
						"absolute inset-0",
						"bg-[linear-gradient(to_right,rgba(5,9,20,.98)_0%,rgba(5,9,20,.76)_42%,rgba(5,9,20,.2)_75%),linear-gradient(to_bottom,rgba(5,9,20,.2)_20%,#050914_100%)]",
					)}
				/>
				<div
					className={clsx(
						"relative flex min-h-[76vh] max-w-3xl flex-col justify-end",
						"px-[clamp(1.25rem,4vw,4.5rem)] pb-16 pt-48 md:pb-24",
					)}
				>
					{details.tagline && (
						<span className="mb-4 text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
							{details.tagline}
						</span>
					)}
					<h1
						id="media-title"
						className="text-4xl leading-[.95] font-black tracking-[-.045em] text-text-primary sm:text-6xl lg:text-7xl"
					>
						{media.title}
					</h1>
					<div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-medium text-text-secondary">
						{media.year && <span>{media.year}</span>}
						<span className="text-brand-light">★ {media.voteAverage.toFixed(1)}</span>
						{runtime && <span>{t(translation.Common.Minutes, { count: runtime })}</span>}
						{details.number_of_seasons && (
							<span>{t(translation.Common.Seasons, { count: details.number_of_seasons })}</span>
						)}
						{details.status && <span>{details.status}</span>}
						<span className="border border-border-strong px-1.5 py-0.5 text-[11px] text-text-primary">
							HD
						</span>
					</div>
					<p className="mt-5 line-clamp-3 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
						{media.overview}
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-3">
						<Link
							href={playHref}
							className={clsx(
								"inline-flex h-12 items-center gap-2 rounded-lg bg-brand-primary px-6",
								"text-sm font-semibold text-text-primary shadow-[0_0_28px_rgba(37,99,235,.25)]",
								"transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light",
							)}
						>
							<Icon name="play" className="size-5" /> {t(translation.Common.PlayNow)}
						</Link>
						<WatchlistButton media={media} />
					</div>
				</div>
			</section>

			<div className="space-y-16 px-[clamp(1.25rem,4vw,4.5rem)] pb-16">
				{details.genres && (
					<div className="flex flex-wrap gap-2">
						{details.genres.map((genre) => (
							<span
								key={genre.id}
								className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary"
							>
								{genre.name}
							</span>
						))}
					</div>
				)}

				{media.mediaType === "tv" && details.seasons && episodePage ? (
					<EpisodeBrowser
						mediaId={media.id}
						seasons={details.seasons.filter(({ season_number }) => season_number > 0)}
						initialPage={episodePage}
					/>
				) : null}

				{cast.length > 0 && (
					<section aria-labelledby="cast-title">
						<span className="text-[11px] font-semibold tracking-[.16em] text-brand-light uppercase">
							{t(translation.Details.PeopleBehindIt)}
						</span>
						<h2 id="cast-title" className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
							{t(translation.Details.Cast)}
						</h2>
						<div className="mt-6 flex gap-5 overflow-x-auto pb-3">
							{cast.map((person) => {
								const profile = tmdbImage.profile(person.profile_path ?? undefined);
								return (
									<article key={person.id} className="w-24 shrink-0 text-center">
										<span className="relative mx-auto block size-20 overflow-hidden rounded-full bg-surface">
											{profile ? (
												<Image src={profile} alt="" fill sizes="80px" className="object-cover" />
											) : (
												<span className="flex size-full items-center justify-center text-xl text-text-muted">
													{person.name[0]}
												</span>
											)}
										</span>
										<strong className="mt-2 block text-xs text-text-primary">{person.name}</strong>
										<span className="mt-1 block text-[11px] text-text-muted">{person.character}</span>
									</article>
								);
							})}
						</div>
					</section>
				)}

				<MediaRow
					title={t(translation.Details.MoreLikeThis)}
					eyebrow={t(translation.Details.KeepExploring)}
					items={recommendations}
					gutter={false}
				/>
			</div>
		</>
	);
}
