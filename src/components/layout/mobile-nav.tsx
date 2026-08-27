"use client";

import { Icon, type IconName } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const links: Array<[string, string, IconName]> = [
	[translation.Navigation.Home, "/", "home"],
	[translation.Navigation.Live, "/live", "radio"],
];

const catalogLinks: Array<[string, string, IconName]> = [
	[translation.Navigation.Movies, "/movies", "film"],
	[translation.Navigation.TvShows, "/tv", "tv"],
	[translation.Navigation.Anime, "/anime", "spark"],
];

const discoverLink: [string, string, IconName] = [
	translation.Navigation.Discover,
	"/discover",
	"compass",
];

const personalLinks: Array<[string, string, IconName]> = [
	[translation.Navigation.MyList, "/my-list", "bookmark"],
	[translation.Navigation.Settings, "/settings", "settings"],
];

export function MobileNav() {
	const { t } = useTranslation();
	const pathname = usePathname();
	const [exploreOpen, setExploreOpen] = useState(false);
	const exploreMenu = useRef<HTMLElement>(null);
	const exploreButton = useRef<HTMLButtonElement>(null);

	function isActive(href: string) {
		return href === "/movies"
			? pathname === href || pathname.startsWith("/movie/")
			: pathname === href || pathname.startsWith(`${href}/`);
	}

	const exploreActive = [...catalogLinks, discoverLink, ...personalLinks].some(([, href]) =>
		isActive(href),
	);

	useEffect(() => {
		if (!exploreOpen) return;

		function closeExplore(event: PointerEvent) {
			if (!exploreMenu.current?.contains(event.target as Node)) setExploreOpen(false);
		}

		function closeExploreWithKeyboard(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setExploreOpen(false);
				exploreButton.current?.focus();
			}
		}

		window.addEventListener("pointerdown", closeExplore);
		window.addEventListener("keydown", closeExploreWithKeyboard);
		return () => {
			window.removeEventListener("pointerdown", closeExplore);
			window.removeEventListener("keydown", closeExploreWithKeyboard);
		};
	}, [exploreOpen]);

	return (
		<nav
			ref={exploreMenu}
			className={clsx(
				"fixed bottom-[max(.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 grid h-18 w-[min(17rem,calc(100%-1.5rem))] -translate-x-1/2 grid-cols-3 rounded-3xl shadow-xl backdrop-blur-xl md:hidden",
				"bg-background-secondary/95 shadow-black/40",
				"border border-border-strong",
				"px-3 py-2",
			)}
			aria-label={t(translation.Navigation.Mobile)}
		>
			{links.slice(0, 1).map(([label, href, icon]) => (
				<Link
					key={href}
					href={href}
					onClick={() => setExploreOpen(false)}
					className={clsx(
						"group relative mx-auto flex size-14 items-start justify-center",
						"text-text-muted",
						"transition-[color,transform] duration-200 hover:text-text-primary active:scale-95",
						pathname === href && "text-brand-light",
					)}
				>
					<span className="grid size-12 place-items-center rounded-2xl border border-border bg-background/90 transition-colors group-hover:border-border-strong">
						<Icon name={icon} className="size-6" />
					</span>
					<span className="sr-only">{t(label)}</span>
					{pathname === href ? (
						<span className="absolute bottom-0 size-1.5 rounded-full bg-brand-bright" />
					) : null}
				</Link>
			))}

			<button
				ref={exploreButton}
				type="button"
				onClick={() => setExploreOpen((open) => !open)}
				aria-expanded={exploreOpen}
				aria-controls="mobile-explore-menu"
				className={clsx(
					"group relative mx-auto flex size-14 items-start justify-center",
					"text-text-muted",
					"transition-[color,transform] duration-200 hover:text-text-primary active:scale-95",
					(exploreActive || exploreOpen) && "text-brand-light",
				)}
			>
				<span className="grid size-12 place-items-center rounded-2xl border border-border bg-background/90 transition-colors group-hover:border-border-strong">
					<Icon name="compass" className="size-6" />
				</span>
				<span className="sr-only">{t(translation.Navigation.Explore)}</span>
				{exploreActive || exploreOpen ? (
					<span className="absolute bottom-0 size-1.5 rounded-full bg-brand-bright" />
				) : null}
			</button>

			{exploreOpen ? (
				<div
					id="mobile-explore-menu"
					className={clsx(
						"absolute bottom-[calc(100%+.75rem)] left-1/2 w-[min(24rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl",
						"bg-background-secondary/95 shadow-black/50 backdrop-blur-xl",
						"border border-border-strong",
					)}
					aria-label={t(translation.Navigation.Explore)}
				>
					<div className="flex h-12 items-center border-b border-border px-4">
						<strong className="text-sm font-semibold text-text-primary">
							{t(translation.Navigation.Explore)}
						</strong>
					</div>
					<div className="p-3">
						<span className="px-1 text-[10px] font-semibold tracking-[.16em] text-text-muted uppercase">
							{t(translation.Navigation.Catalog)}
						</span>
						<div className="mt-2 grid grid-cols-3 gap-2">
							{catalogLinks.map(([label, href, icon]) => (
								<Link
									key={href}
									href={href}
									onClick={() => setExploreOpen(false)}
									className={clsx(
										"flex h-20 min-w-0 flex-col items-center justify-center gap-2 rounded-lg px-2",
										"border border-border",
										"text-xs text-text-secondary",
										"transition-colors duration-200 active:bg-surface",
										isActive(href) && "bg-surface text-brand-light",
									)}
								>
									<Icon name={icon} className="size-5 shrink-0" />
									<span className="max-w-full truncate">{t(label)}</span>
								</Link>
							))}
						</div>

						<span className="mt-4 block px-1 text-[10px] font-semibold tracking-[.16em] text-text-muted uppercase">
							{t(translation.Navigation.Explore)}
						</span>
						<Link
							href={discoverLink[1]}
							onClick={() => setExploreOpen(false)}
							className={clsx(
								"mt-2 flex h-14 items-center gap-3 rounded-lg px-3",
								"border border-border",
								"text-sm text-text-secondary",
								"transition-colors duration-200 active:bg-surface",
								isActive(discoverLink[1]) && "bg-surface text-brand-light",
							)}
						>
							<Icon name={discoverLink[2]} className="size-4.5 shrink-0" />
							<span>
								<strong className="block font-medium text-text-primary">{t(discoverLink[0])}</strong>
								<span className="mt-0.5 block text-xs text-text-muted">
									{t(translation.Navigation.DiscoverHint)}
								</span>
							</span>
						</Link>

						<span className="mt-4 block px-1 text-[10px] font-semibold tracking-[.16em] text-text-muted uppercase">
							{t(translation.Navigation.Personal)}
						</span>
						<div className="mt-2 grid grid-cols-2 gap-2">
							{personalLinks.map(([label, href, icon]) => (
								<Link
									key={href}
									href={href}
									onClick={() => setExploreOpen(false)}
									className={clsx(
										"flex h-14 items-center gap-3 rounded-lg px-3",
										"border border-border",
										"text-sm text-text-secondary",
										"transition-colors duration-200 active:bg-surface",
										pathname === href && "bg-surface text-brand-light",
									)}
								>
									<Icon name={icon} className="size-4.5 shrink-0" />
									<span className="truncate">{t(label)}</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			) : null}

			{links.slice(1).map(([label, href, icon]) => (
				<Link
					key={href}
					href={href}
					onClick={() => setExploreOpen(false)}
					className={clsx(
						"group relative mx-auto flex size-14 items-start justify-center",
						"text-text-muted",
						"transition-[color,transform] duration-200 hover:text-text-primary active:scale-95",
						(pathname === href || pathname.startsWith(`${href}/`)) && "text-brand-light",
					)}
				>
					<span className="grid size-12 place-items-center rounded-2xl border border-border bg-background/90 transition-colors group-hover:border-border-strong">
						<Icon name={icon} className="size-6" />
					</span>
					<span className="sr-only">{t(label)}</span>
					{pathname === href || pathname.startsWith(`${href}/`) ? (
						<span className="absolute bottom-0 size-1.5 rounded-full bg-brand-bright" />
					) : null}
				</Link>
			))}
		</nav>
	);
}
