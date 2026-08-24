"use client";

import { handleServeSetLocale } from "@/api/services/locale/serve-action";
import { translation } from "@/constants/translation";
import { isAppLocale } from "@/i18n/locale";
import type { AppLocale } from "@/types/navigation";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const languages: ReadonlyArray<
	Readonly<{ code: string; hint: string; label: string; value: AppLocale }>
> = [
	{
		code: "EN",
		hint: translation.LocaleSwitcher.EnglishHint,
		label: translation.LocaleSwitcher.English,
		value: "en",
	},
	{
		code: "ខ",
		hint: translation.LocaleSwitcher.KhmerHint,
		label: translation.LocaleSwitcher.Khmer,
		value: "kh",
	},
];

export function LocaleSwitcher() {
	const { i18n, t } = useTranslation();
	const locale = isAppLocale(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "en";

	async function changeLanguage(value: AppLocale) {
		await handleServeSetLocale(value);
		await i18n.changeLanguage(value);
	}

	return (
		<fieldset className={clsx("grid gap-3 border-0 p-0 sm:grid-cols-2")}>
			<legend className={clsx("sr-only")}>{t(translation.LocaleSwitcher.Label)}</legend>
			{languages.map(({ code, hint, label, value }) => (
				<label key={value} className={clsx("cursor-pointer")}>
					<input
						type="radio"
						name="language"
						value={value}
						checked={locale === value}
						onChange={() => void changeLanguage(value)}
						className={clsx("peer sr-only")}
					/>
					<span
						className={clsx(
							"flex min-h-20 items-center gap-4 rounded-xl p-4",
							"bg-background-secondary",
							"border border-border",
							"transition-colors hover:border-border-strong hover:bg-surface",
							"peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-light",
						)}
					>
						<span
							className={clsx(
								"grid size-11 shrink-0 place-items-center rounded-md",
								"border border-border-strong",
								"text-sm font-black",
								locale === value ? "bg-brand-primary text-white" : "bg-surface text-text-secondary",
							)}
						>
							{code}
						</span>
						<span>
							<strong className={clsx("block text-sm font-bold text-text-primary")}>{t(label)}</strong>
							<span className={clsx("mt-1 block text-xs text-text-muted")}>{t(hint)}</span>
						</span>
					</span>
				</label>
			))}
		</fieldset>
	);
}
