"use client";

import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import { liveImage } from "@/lib/live/images";
import type { LiveMatch } from "@/lib/live/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function LiveMatchCard({ match, live }: Readonly<{ match: LiveMatch; live: boolean }>) {
	const { t, i18n } = useTranslation();
	const dateFormat = new Intl.DateTimeFormat(i18n.resolvedLanguage === "kh" ? "km-KH" : "en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZone: "UTC",
	});
	const poster = liveImage.poster(match.poster);
	const homeBadge = liveImage.badge(match.teams?.home?.badge);
	const awayBadge = liveImage.badge(match.teams?.away?.badge);
	const content = (
		<>
			<span className="relative block aspect-video overflow-hidden bg-surface">
				{poster ? (
					<Image
						src={poster}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
						className="object-cover transition-transform duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
					/>
				) : (
					<span className="absolute inset-0 flex items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_35%,#17233a,#08101f_72%)]">
						{homeBadge ? (
							<Image
								src={homeBadge}
								alt={match.teams?.home?.name ?? t(translation.LivePage.HomeTeam)}
								width={64}
								height={64}
								className="size-14 object-contain sm:size-16"
							/>
						) : (
							<span className="grid size-14 place-items-center rounded-full border border-border text-text-muted">
								<Icon name="radio" className="size-6" />
							</span>
						)}
						<span className="text-xs font-black tracking-[.16em] text-text-muted">
							{t(translation.LivePage.Versus)}
						</span>
						{awayBadge ? (
							<Image
								src={awayBadge}
								alt={match.teams?.away?.name ?? t(translation.LivePage.AwayTeam)}
								width={64}
								height={64}
								className="size-14 object-contain sm:size-16"
							/>
						) : (
							<span className="grid size-14 place-items-center rounded-full border border-border text-text-muted">
								<Icon name="radio" className="size-6" />
							</span>
						)}
					</span>
				)}
				<span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,9,20,.92),transparent_55%)]" />
				<span
					className={clsx(
						"absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
						"text-[10px] font-bold tracking-[.12em] uppercase backdrop-blur-md",
						live
							? "bg-red-500/90 text-white"
							: "border border-border bg-background/70 text-text-secondary",
					)}
				>
					{live && <span className="size-1.5 animate-pulse rounded-full bg-white" />}
					{live ? t(translation.Common.Live) : match.category.replaceAll("-", " ")}
				</span>
				{match.sources.length > 0 && (
					<span className="absolute right-3 bottom-3 grid size-10 translate-y-1 place-items-center rounded-full bg-brand-primary text-white opacity-0 shadow-[0_0_24px_rgba(37,99,235,.3)] transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
						<Icon name="play" className="size-4" />
					</span>
				)}
			</span>
			<span className="block p-4">
				<strong className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-text-primary">
					{match.title}
				</strong>
				<span className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-muted">
					<time dateTime={new Date(match.date).toISOString()}>{dateFormat.format(match.date)} UTC</time>
					<span className="shrink-0">
						{t(translation.LivePage.SourceCount, { count: match.sources.length })}
					</span>
				</span>
			</span>
		</>
	);

	if (!match.sources.length) {
		return (
			<article className="overflow-hidden rounded-lg border border-border bg-background-secondary opacity-70">
				{content}
			</article>
		);
	}

	return (
		<Link
			href={`/live/${encodeURIComponent(match.id)}`}
			className={clsx(
				"group overflow-hidden rounded-lg bg-background-secondary",
				"border border-border transition-[border-color,box-shadow] duration-300 hover:border-border-strong hover:shadow-[0_18px_50px_rgba(0,0,0,.4)]",
			)}
		>
			{content}
		</Link>
	);
}
