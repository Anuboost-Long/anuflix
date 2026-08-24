"use client";

import { Icon } from "@/components/shared/icon";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PlayerBackButton({ href, label }: Readonly<{ href: string; label: string }>) {
	const router = useRouter();
	const [fullscreen, setFullscreen] = useState(false);

	useEffect(() => {
		function syncFullscreen() {
			setFullscreen(Boolean(document.fullscreenElement));
		}

		syncFullscreen();
		document.addEventListener("fullscreenchange", syncFullscreen);
		return () => document.removeEventListener("fullscreenchange", syncFullscreen);
	}, []);

	function goBack() {
		const detailPath = new URL(href, window.location.origin).pathname;
		const returnPath = window.history.state?.anuflixPlayerReturnPath;

		if (returnPath === detailPath && window.history.length > 1) {
			router.back();
			return;
		}

		router.replace(href);
	}

	if (fullscreen) return null;

	return (
		<button
			type="button"
			onClick={goBack}
			aria-label={label}
			className={clsx(
				"group absolute top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))] z-20 grid size-11 place-items-center rounded-full",
				"bg-black/35 backdrop-blur-sm",
				"text-white",
				"transition-[background-color,transform] duration-200 ease-out hover:bg-black/60 motion-safe:hover:-translate-x-0.5 motion-safe:active:translate-x-0 motion-safe:active:scale-95",
			)}
		>
			<Icon
				name="arrow-left"
				className="size-6 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-x-0.5"
			/>
		</button>
	);
}
