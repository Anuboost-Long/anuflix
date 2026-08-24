"use client";

import { Brand } from "@/components/shared/brand";
import { translation } from "@/constants/translation";
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
	const { t } = useTranslation();

	return (
		<footer
			className={clsx(
				"grid gap-6 md:grid-cols-[1fr_auto] md:items-start",
				"border-t border-border",
				"text-sm text-text-muted",
				"mx-[clamp(1.25rem,4vw,4.5rem)] mb-20 py-10 md:mb-0",
			)}
		>
			<Brand />
			<p className={clsx("max-w-lg md:col-start-1")}>{t(translation.Footer.Description)}</p>
			<nav
				aria-label={t(translation.Footer.Navigation)}
				className={clsx("flex flex-wrap gap-5 md:col-start-2 md:row-start-1", "text-text-secondary")}
			>
				<Link href="/anime">{t(translation.Navigation.Anime)}</Link>
				<Link href="/live">{t(translation.Navigation.LiveSports)}</Link>
				<Link href="/discover">{t(translation.Navigation.Discover)}</Link>
				<Link href="/my-list">{t(translation.Navigation.MyList)}</Link>
				<Link href="/settings">{t(translation.Navigation.Settings)}</Link>
				<a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
					TMDB
				</a>
			</nav>
			<small className={clsx("text-[11px] md:col-span-2")}>{t(translation.Footer.Disclaimer)}</small>
		</footer>
	);
}
