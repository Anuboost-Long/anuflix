"use client";

import { SearchDialog } from "@/components/search/search-dialog";
import { Brand } from "@/components/shared/brand";
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

const browseLinks: Array<[string, string, IconName]> = [
	[translation.Navigation.Movies, "/movies", "film"],
	[translation.Navigation.TvShows, "/tv", "tv"],
	[translation.Navigation.Anime, "/anime", "spark"],
	[translation.Navigation.Discover, "/discover", "compass"],
];

const personalLinks: Array<[string, string, IconName]> = [
	[translation.Navigation.MyList, "/my-list", "bookmark"],
	[translation.Navigation.Settings, "/settings", "settings"],
];

function HeaderLink({
	label,
	href,
	icon,
	active,
	onClick,
}: Readonly<{
	label: string;
	href: string;
	icon: IconName;
	active: boolean;
	onClick: () => void;
}>) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={clsx(
				"flex h-10 items-center justify-center gap-2 rounded-lg px-3",
				"text-sm font-medium text-text-muted",
				"transition-[color,transform] duration-200 ease-out hover:text-text-primary motion-safe:hover:scale-[1.04] active:scale-[.98]",
				active && "text-brand-light",
			)}
		>
			<Icon name={icon} className="size-4.5" />
			<span>{label}</span>
		</Link>
	);
}

export function Header() {
	const { t } = useTranslation();
	const pathname = usePathname();
	const liveSearch = pathname === "/live";
	const [scrolled, setScrolled] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [browseOpen, setBrowseOpen] = useState(false);
	const browseMenu = useRef<HTMLDivElement>(null);
	const browseButton = useRef<HTMLButtonElement>(null);
	const browseActive = [...browseLinks, ...personalLinks].some(([, href]) =>
		href === "/movies"
			? pathname === href || pathname.startsWith("/movie/")
			: pathname === href || pathname.startsWith(`${href}/`),
	);

	function openSearch() {
		if (liveSearch) {
			document.getElementById("live-search")?.focus();
			return;
		}

		setSearchOpen(true);
	}

	useEffect(() => {
		const update = () => setScrolled(window.scrollY > 24);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	useEffect(() => {
		if (!browseOpen) return;

		function closeBrowse(event: PointerEvent) {
			if (!browseMenu.current?.contains(event.target as Node)) setBrowseOpen(false);
		}

		function closeBrowseWithKeyboard(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setBrowseOpen(false);
				browseButton.current?.focus();
			}
		}

		window.addEventListener("pointerdown", closeBrowse);
		window.addEventListener("keydown", closeBrowseWithKeyboard);
		return () => {
			window.removeEventListener("pointerdown", closeBrowse);
			window.removeEventListener("keydown", closeBrowseWithKeyboard);
		};
	}, [browseOpen]);

	useEffect(() => {
		function openSearch(event: KeyboardEvent) {
			if (event.key === "/" && !(event.target instanceof HTMLInputElement)) {
				event.preventDefault();
				if (liveSearch) {
					document.getElementById("live-search")?.focus();
				} else {
					setSearchOpen(true);
				}
			}
		}
		window.addEventListener("keydown", openSearch);
		return () => window.removeEventListener("keydown", openSearch);
	}, [liveSearch]);

	return (
		<>
			<header
				className={clsx(
					"fixed inset-x-0 top-0 z-40 flex h-20 items-center gap-9 ",
					"bg-linear-to-b from-background/90 to-transparent",
					"px-[clamp(1.25rem,4vw,4.5rem)]",
					"transition-[background-color,backdrop-filter] duration-200",
					scrolled && "bg-background-secondary/88 backdrop-blur-xl",
				)}
			>
				<Brand />
				<nav
					className="hidden items-center gap-1 md:flex"
					aria-label={t(translation.Navigation.Primary)}
				>
					{links.slice(0, 1).map(([label, href, icon]) => (
						<HeaderLink
							key={href}
							label={t(label)}
							href={href}
							icon={icon}
							active={pathname === href}
							onClick={() => setBrowseOpen(false)}
						/>
					))}
					<div ref={browseMenu} className="relative">
						<button
							ref={browseButton}
							type="button"
							onClick={() => setBrowseOpen((open) => !open)}
							aria-expanded={browseOpen}
							aria-haspopup="true"
							aria-controls="browse-menu"
							className={clsx(
								"flex h-10 items-center justify-center gap-2 rounded-lg px-3",
								"text-sm font-medium text-text-muted",
								"transition-[color,transform] duration-200 ease-out hover:text-text-primary motion-safe:hover:scale-[1.04] active:scale-[.98]",
								(browseActive || browseOpen) && "text-brand-light",
							)}
						>
							<Icon name="film" className="size-4.5" />
							<span>{t(translation.Navigation.Browse)}</span>
						</button>
						{browseOpen ? (
							<div
								id="browse-menu"
								className={clsx(
									"absolute top-[calc(100%+.5rem)] left-1/2 w-88 -translate-x-1/2 overflow-hidden rounded-xl",
									"bg-background-secondary/98 backdrop-blur-xl",
									"border border-border",
								)}
								aria-label={t(translation.Navigation.Browse)}
							>
								<div className="flex h-12 items-center justify-center border-b border-border">
									<strong className="text-sm font-semibold text-text-primary">
										{t(translation.Navigation.Browse)}
									</strong>
								</div>
								<div className="p-3">
									<span className="px-1 text-[10px] font-semibold tracking-[.16em] text-text-muted uppercase">
										{t(translation.Navigation.Catalog)}
									</span>
									<div className="mt-2 grid grid-cols-3 gap-2">
										{browseLinks.slice(0, 3).map(([label, href, icon]) => {
											const active =
												href === "/movies"
													? pathname === href || pathname.startsWith("/movie/")
													: pathname === href || pathname.startsWith(`${href}/`);

											return (
												<Link
													key={href}
													href={href}
													onClick={() => setBrowseOpen(false)}
													className={clsx(
														"group/tile flex h-24 flex-col items-center justify-center gap-2 rounded-lg",
														"border border-transparent",
														"text-xs font-medium text-text-secondary",
														"transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-border hover:bg-surface hover:text-text-primary motion-safe:hover:-translate-y-0.5",
														active && "border-border bg-surface text-text-primary",
													)}
												>
													<span className="grid size-10 place-items-center rounded-md border border-border-strong bg-background text-brand-light transition-colors group-hover/tile:border-brand-light/50 group-hover/tile:bg-brand-primary/10">
														<Icon name={icon} className="size-5" />
													</span>
													<span>{t(label)}</span>
												</Link>
											);
										})}
									</div>

									<span className="mt-4 block px-1 text-[10px] font-semibold tracking-[.16em] text-text-muted uppercase">
										{t(translation.Navigation.Explore)}
									</span>
									<Link
										href="/discover"
										onClick={() => setBrowseOpen(false)}
										className={clsx(
											"mt-2 flex h-14 items-center gap-3 rounded-lg px-3",
											"border border-border",
											"text-sm text-text-secondary",
											"transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-border-strong hover:bg-surface hover:text-text-primary motion-safe:hover:translate-x-0.5",
											pathname === "/discover" && "text-brand-light",
										)}
									>
										<span className="grid size-9 place-items-center rounded-md border border-border-strong bg-background text-brand-light">
											<Icon name="compass" className="size-4.5" />
										</span>
										<span>
											<strong className="block font-medium text-text-primary">
												{t(translation.Navigation.Discover)}
											</strong>
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
												onClick={() => setBrowseOpen(false)}
												className={clsx(
													"flex h-14 items-center gap-3 rounded-lg px-3",
													"border border-border",
													"text-sm text-text-secondary",
													"transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-border-strong hover:bg-surface hover:text-text-primary motion-safe:hover:-translate-y-0.5",
													pathname === href && "text-brand-light",
												)}
											>
												<Icon name={icon} className="size-4.5" />
												<span>{t(label)}</span>
											</Link>
										))}
									</div>
								</div>
							</div>
						) : null}
					</div>
					{links.slice(1).map(([label, href, icon]) => (
						<HeaderLink
							key={href}
							label={t(label)}
							href={href}
							icon={icon}
							active={pathname === href || pathname.startsWith(`${href}/`)}
							onClick={() => setBrowseOpen(false)}
						/>
					))}
				</nav>
				<button
					type="button"
					className={clsx(
						"ml-auto inline-flex h-10 items-center gap-2.5 rounded-full",
						"bg-surface/55 backdrop-blur-md",
						"border border-border",
						"text-sm text-text-secondary",
						"px-3.5",
						"transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-border-strong hover:bg-surface-hover hover:text-white motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98]",
					)}
					onClick={openSearch}
				>
					<Icon name="search" className={clsx("size-4")} />
					<span className={clsx("hidden sm:inline")}>
						{liveSearch ? t(translation.Navigation.SearchLive) : t(translation.Navigation.Search)}
					</span>
					<kbd
						className={clsx(
							"hidden rounded sm:inline",
							"border border-border",
							"text-[10px] text-text-muted",
							"px-1.5 py-0.5",
						)}
					>
						/
					</kbd>
				</button>
			</header>
			<SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
		</>
	);
}
