"use client";

import { handleServeSearchMedia } from "@/api/services/search/serve-action";
import { MediaCard } from "@/components/media/media-card";
import { Icon } from "@/components/shared/icon";
import { translation } from "@/constants/translation";
import type { MediaItem } from "@/lib/tmdb/types";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const TRANSITION_MS = 300;

export function SearchDialog({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
	const { t } = useTranslation();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<MediaItem[]>([]);
	const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
	const [mounted, setMounted] = useState(open);
	const [visible, setVisible] = useState(false);
	const dialog = useRef<HTMLDialogElement>(null);
	const input = useRef<HTMLInputElement>(null);
	const searchRequest = useRef(0);

	useEffect(() => {
		let firstFrame = 0;
		let secondFrame = 0;
		const update = window.setTimeout(() => {
			if (open) {
				setMounted(true);
				firstFrame = window.requestAnimationFrame(() => {
					secondFrame = window.requestAnimationFrame(() => setVisible(true));
				});
			} else {
				setVisible(false);
			}
		}, 0);
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const detach = open
			? 0
			: window.setTimeout(() => setMounted(false), reducedMotion ? 0 : TRANSITION_MS);

		return () => {
			window.clearTimeout(update);
			if (detach) window.clearTimeout(detach);
			if (firstFrame) window.cancelAnimationFrame(firstFrame);
			if (secondFrame) window.cancelAnimationFrame(secondFrame);
		};
	}, [open]);

	useEffect(() => {
		if (!mounted || !dialog.current) return;
		const element = dialog.current;
		if (!element.open) element.showModal();

		return () => {
			if (element.open) element.close();
		};
	}, [mounted]);

	useEffect(() => {
		if (open && mounted) input.current?.focus();
	}, [mounted, open]);

	useEffect(() => {
		if (!mounted) return;
		const previousRootOverflow = document.documentElement.style.overflow;
		const previousBodyOverflow = document.body.style.overflow;
		document.documentElement.style.overflow = "hidden";
		document.body.style.overflow = "hidden";
		return () => {
			document.documentElement.style.overflow = previousRootOverflow;
			document.body.style.overflow = previousBodyOverflow;
		};
	}, [mounted]);

	useEffect(() => {
		const trimmed = query.trim();
		if (trimmed.length < 2) {
			return;
		}

		const request = ++searchRequest.current;
		let cancelled = false;
		const timeout = window.setTimeout(async () => {
			setState("loading");
			try {
				const result = await handleServeSearchMedia(trimmed);
				if (cancelled || request !== searchRequest.current) return;
				setResults(result);
				setState("ready");
			} catch {
				if (!cancelled && request === searchRequest.current) setState("error");
			}
		}, 300);

		return () => {
			cancelled = true;
			window.clearTimeout(timeout);
		};
	}, [query]);

	if (!mounted) return null;

	return (
		<dialog
			ref={dialog}
			className={clsx(
				"fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-start justify-center overscroll-none p-0 backdrop:bg-transparent",
				"border-0 bg-transparent text-inherit",
				"px-3 pt-16 sm:px-8 sm:pt-8",
				!visible && "pointer-events-none",
			)}
			aria-label={t(translation.Search.Label)}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<button
				type="button"
				className={clsx(
					"absolute inset-0 cursor-default",
					"bg-transparent backdrop-blur-md",
					"transition-opacity duration-250 ease-out motion-reduce:transition-none",
					visible ? "opacity-100" : "opacity-0",
				)}
				aria-label={t(translation.Search.Close)}
				onClick={onClose}
			/>
			<div
				className={clsx(
					"relative flex h-[min(36rem,calc(100dvh-5rem))] w-full max-w-6xl origin-center flex-col overflow-hidden sm:h-[calc(100vh-4rem)]",
					"transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
					visible ? "scale-100 opacity-100" : "scale-90 opacity-0",
				)}
			>
				<div className="m-4 flex shrink-0 items-center gap-2 sm:m-6">
					<div
						className={clsx(
							"flex h-14 min-w-0 flex-1 items-center gap-3 rounded-xl",
							"bg-transparent backdrop-blur-xl",
							"border border-border",
							"px-4",
							"focus-within:border-brand-bright focus-within:shadow-[0_0_0_3px_rgba(59,130,246,.15)]",
							state === "loading" && "after:h-0.5 after:w-10 after:animate-pulse after:bg-brand-electric",
						)}
					>
						<Icon name="search" className={clsx("size-5 shrink-0", "text-text-muted")} />
						<input
							ref={input}
							value={query}
							onChange={(event) => {
								const value = event.target.value;
								setQuery(value);
								if (value.trim().length < 2) {
									setResults([]);
									setState("idle");
								}
							}}
							placeholder={t(translation.Search.Placeholder)}
							aria-label={t(translation.Search.Label)}
							className={clsx(
								"h-full min-w-0 flex-1 outline-none",
								"bg-transparent",
								"text-base text-text-primary placeholder:text-text-subtle",
							)}
						/>
						{query && (
							<button
								type="button"
								className="h-9 rounded-md px-2 text-xs font-medium text-text-muted hover:bg-surface-hover hover:text-white"
								onClick={() => {
									setQuery("");
									setResults([]);
									setState("idle");
								}}
							>
								{t(translation.Search.Clear)}
							</button>
						)}
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label={t(translation.Search.Close)}
						className="grid size-14 shrink-0 place-items-center rounded-xl border border-border bg-transparent text-text-muted backdrop-blur-xl transition-[color,background-color,border-color,transform] hover:border-border-strong hover:bg-surface-hover hover:text-white motion-safe:hover:scale-[1.03] active:scale-[.97]"
					>
						<Icon name="close" className="size-5" />
					</button>
				</div>

				<div
					className={clsx(
						"mx-4 mb-4 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl sm:mx-6 sm:mb-6",
						"bg-background-secondary/60 backdrop-blur-xl",
						"border border-border",
						"px-4 py-5 sm:px-6",
					)}
					aria-live="polite"
				>
					{state === "idle" && (
						<div className={clsx("grid min-h-72 place-items-center", "text-center")}>
							<div>
								<span
									className={clsx(
										"mx-auto grid size-14 place-items-center rounded-full",
										"bg-surface",
										"border border-border-strong",
										"text-xl font-semibold text-brand-light",
									)}
								>
									/
								</span>
								<p className={clsx("text-sm text-text-secondary", "mt-4")}>{t(translation.Search.Hint)}</p>
							</div>
						</div>
					)}
					{state === "loading" && (
						<div
							className={clsx("grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6")}
							aria-label={t(translation.Search.Searching)}
						>
							{Array.from({ length: 8 }, (_, index) => (
								<span key={index} className={clsx("aspect-2/3 animate-pulse rounded-lg", "bg-surface")} />
							))}
						</div>
					)}
					{state === "error" && (
						<div className={clsx("text-center", "py-24")}>
							<h2 className={clsx("text-2xl font-bold text-text-primary")}>
								{t(translation.Search.UnavailableTitle)}
							</h2>
							<p className={clsx("text-sm text-text-secondary", "mt-2")}>
								{t(translation.Search.UnavailableDescription)}
							</p>
						</div>
					)}
					{state === "ready" && !results.length && (
						<div className={clsx("text-center", "py-24")}>
							<h2 className={clsx("text-2xl font-bold text-text-primary")}>
								{t(translation.Search.EmptyTitle)}
							</h2>
							<p className={clsx("text-sm text-text-secondary", "mt-2")}>
								{t(translation.Search.EmptyDescription)}
							</p>
						</div>
					)}
					{state === "ready" && results.length > 0 && (
						<>
							<div className={clsx("flex items-end justify-between gap-3", "mb-5")}>
								<h2 className={clsx("text-xl font-bold text-text-primary")}>
									{t(translation.SearchResults.Title, { query: query.trim() })}
								</h2>
								<span className={clsx("text-xs text-text-muted")}>
									{t(translation.Common.Titles, { count: results.length })}
								</span>
							</div>
							<div className={clsx("grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 lg:grid-cols-6")}>
								{results.map((media) => (
									<MediaCard key={`${media.mediaType}-${media.id}`} media={media} onSelect={onClose} />
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</dialog>
	);
}
