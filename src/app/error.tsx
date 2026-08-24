"use client";

import { translation } from "@/constants/translation";
import { useTranslation } from "react-i18next";

export default function ErrorPage({
	reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
	const { t } = useTranslation();
	return (
		<div className="flex min-h-[75vh] items-center justify-center px-6 text-center">
			<div>
				<span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
					{t(translation.ErrorPage.Eyebrow)}
				</span>
				<h1 className="mt-3 text-4xl font-black text-text-primary">{t(translation.ErrorPage.Title)}</h1>
				<p className="mt-3 text-text-secondary">{t(translation.ErrorPage.Description)}</p>
				<button
					type="button"
					onClick={reset}
					className="mt-7 h-11 rounded-lg bg-brand-primary px-5 text-sm font-semibold text-white hover:bg-brand-bright"
				>
					{t(translation.ErrorPage.Retry)}
				</button>
			</div>
		</div>
	);
}
