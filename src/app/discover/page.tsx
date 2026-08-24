import { MediaGrid } from "@/components/media/media-grid";
import { SelectInput } from "@/components/shared/select-input";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";
import { discoverMedia, getGenres } from "@/lib/tmdb/queries";
import type { TmdbMediaType } from "@/lib/tmdb/types";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<{
		type?: string;
		genre?: string;
		year?: string;
		rating?: string;
		sort?: string;
	}>;
}>) {
	const filters = await searchParams;
	const t = await getServerTranslation();
	const mediaType: TmdbMediaType = filters.type === "tv" ? "tv" : "movie";
	const [genres, items] = await Promise.all([
		getGenres(mediaType),
		discoverMedia(mediaType, {
			with_genres: filters.genre,
			primary_release_year: mediaType === "movie" ? filters.year : undefined,
			first_air_date_year: mediaType === "tv" ? filters.year : undefined,
			"vote_average.gte": filters.rating,
			sort_by: filters.sort ?? "popularity.desc",
		}),
	]);

	return (
		<div className="px-[clamp(1.25rem,4vw,4.5rem)] pb-20 pt-28">
			<span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
				{t(translation.DiscoverPage.Eyebrow)}
			</span>
			<h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">
				{t(translation.DiscoverPage.Title)}
			</h1>
			<form className="my-8 flex flex-wrap items-end gap-3 border-y border-border py-5">
				<div className="grid gap-2 text-xs font-semibold text-text-secondary">
					<span>{t(translation.DiscoverPage.Type)}</span>
					<SelectInput
						ariaLabel={t(translation.DiscoverPage.Type)}
						name="type"
						defaultValue={mediaType}
						options={[
							{ value: "movie", label: t(translation.Navigation.Movies) },
							{ value: "tv", label: t(translation.Navigation.TvShows) },
						]}
						size="medium"
						className="w-32"
					/>
				</div>
				<div className="grid gap-2 text-xs font-semibold text-text-secondary">
					<span>{t(translation.DiscoverPage.Genre)}</span>
					<SelectInput
						ariaLabel={t(translation.DiscoverPage.Genre)}
						name="genre"
						defaultValue={filters.genre ?? ""}
						options={[
							{ value: "", label: t(translation.DiscoverPage.AllGenres) },
							...genres.map((genre) => ({ value: String(genre.id), label: genre.name })),
						]}
						size="medium"
						className="w-40"
					/>
				</div>
				<label className="grid gap-2 text-xs font-semibold text-text-secondary">
					{t(translation.DiscoverPage.Year)}
					<input
						name="year"
						type="number"
						min="1900"
						max="2030"
						defaultValue={filters.year}
						placeholder={t(translation.DiscoverPage.AnyYear)}
						className="h-11 w-28 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none placeholder:text-text-subtle focus:border-brand-bright"
					/>
				</label>
				<div className="grid gap-2 text-xs font-semibold text-text-secondary">
					<span>{t(translation.DiscoverPage.Rating)}</span>
					<SelectInput
						ariaLabel={t(translation.DiscoverPage.Rating)}
						name="rating"
						defaultValue={filters.rating ?? ""}
						options={[
							{ value: "", label: t(translation.DiscoverPage.AnyRating) },
							{ value: "6", label: "6+" },
							{ value: "7", label: "7+" },
							{ value: "8", label: "8+" },
						]}
						size="medium"
						className="w-36"
					/>
				</div>
				<div className="grid gap-2 text-xs font-semibold text-text-secondary">
					<span>{t(translation.DiscoverPage.Sort)}</span>
					<SelectInput
						ariaLabel={t(translation.DiscoverPage.Sort)}
						name="sort"
						defaultValue={filters.sort ?? "popularity.desc"}
						options={[
							{ value: "popularity.desc", label: t(translation.DiscoverPage.MostPopular) },
							{ value: "vote_average.desc", label: t(translation.DiscoverPage.HighestRated) },
							{
								value: mediaType === "movie" ? "primary_release_date.desc" : "first_air_date.desc",
								label: t(translation.DiscoverPage.Newest),
							},
						]}
						size="medium"
						className="w-44"
					/>
				</div>
				<button
					className={clsx(
						"h-11 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white",
						"transition-colors hover:bg-brand-bright focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light",
					)}
				>
					{t(translation.DiscoverPage.ApplyFilters)}
				</button>
			</form>
			<div className="mb-6 flex items-end justify-between">
				<div>
					<span className="text-[11px] tracking-[.16em] text-text-muted uppercase">
						{t(translation.DiscoverPage.Curated)}
					</span>
					<h2 className="mt-1 text-2xl font-bold text-text-primary">
						{t(translation.DiscoverPage.Results, {
							name:
								genres.find(({ id }) => String(id) === filters.genre)?.name ??
								t(translation.DiscoverPage.Popular),
							type:
								mediaType === "movie" ? t(translation.Navigation.Movies) : t(translation.Common.Series),
						})}
					</h2>
				</div>
				<span className="text-xs text-text-muted">
					{t(translation.Common.Titles, { count: items.length })}
				</span>
			</div>
			<MediaGrid items={items} />
		</div>
	);
}
