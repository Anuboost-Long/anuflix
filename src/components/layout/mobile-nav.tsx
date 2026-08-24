"use client";

import { Icon, type IconName } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const links: Array<[string, string, IconName]> = [
	[translation.Navigation.Home, "/", "home"],
	[translation.Navigation.Movies, "/movies", "film"],
	[translation.Navigation.Tv, "/tv", "tv"],
	[translation.Navigation.Anime, "/anime", "spark"],
	[translation.Navigation.Live, "/live", "radio"],
	[translation.Navigation.MyList, "/my-list", "bookmark"],
];

export function MobileNav() {
	const { t } = useTranslation();
	const pathname = usePathname();
	return (
		<nav
			className={clsx(
				"fixed inset-x-0 bottom-0 z-40 grid h-18 grid-cols-6 backdrop-blur-xl md:hidden",
				"bg-background-secondary/95",
				"border-t border-border",
				"px-2 pb-[env(safe-area-inset-bottom)]",
			)}
			aria-label={t(translation.Navigation.Mobile)}
		>
			{links.map(([label, href, icon]) => (
				<Link
					key={href}
					href={href}
					className={clsx(
						"flex min-w-0 items-center justify-center gap-1.5 px-0.5",
						"text-[10px] font-medium text-text-muted",
						"transition-[color,transform] duration-200 active:scale-95",
						pathname === href && "text-brand-light",
					)}
				>
					<Icon name={icon} className={clsx("size-[18px] shrink-0")} />
					<span className="whitespace-nowrap">{t(label)}</span>
				</Link>
			))}
		</nav>
	);
}
