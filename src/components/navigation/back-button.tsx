"use client";

import { Icon } from "@/components/shared/icon";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export function BackButton({
	fallbackHref,
	label,
}: Readonly<{ fallbackHref: string; label: string }>) {
	const router = useRouter();

	function goBack() {
		if (window.history.length > 1) {
			router.back();
			return;
		}

		router.replace(fallbackHref);
	}

	return (
		<button
			type="button"
			onClick={goBack}
			className={clsx(
				"group inline-flex h-11 items-center gap-2 rounded-full",
				"bg-black/35 backdrop-blur-sm",
				"border border-white/10",
				"text-sm font-medium text-white",
				"px-4",
				"transition-[background-color,border-color,transform] duration-200 ease-out hover:border-white/20 hover:bg-black/60 motion-safe:hover:-translate-x-0.5 motion-safe:active:translate-x-0 motion-safe:active:scale-[.98]",
			)}
		>
			<Icon
				name="arrow-left"
				className="size-5 transition-transform duration-200 ease-out motion-safe:group-hover:-translate-x-0.5"
			/>
			{label}
		</button>
	);
}
