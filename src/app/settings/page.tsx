"use client";

import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { translation } from "@/constants/translation";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
	const { t } = useTranslation();

	return (
		<section
			aria-labelledby="settings-title"
			className={clsx("min-h-[75vh] px-[clamp(1.25rem,4vw,4.5rem)] pt-28 pb-24")}
		>
			<div className={clsx("max-w-3xl")}>
				<span className={clsx("text-xs font-semibold tracking-[.18em] text-brand-light uppercase")}>
					{t(translation.SettingsPage.Eyebrow)}
				</span>
				<h1
					id="settings-title"
					className={clsx("mt-2 text-4xl font-black text-text-primary sm:text-5xl")}
				>
					{t(translation.SettingsPage.Title)}
				</h1>
				<p className={clsx("mt-4 max-w-xl text-base leading-7 text-text-secondary")}>
					{t(translation.SettingsPage.Description)}
				</p>

				<div className={clsx("mt-10")}>
					<section aria-labelledby="language-setting" className={clsx("max-w-2xl")}>
						<div>
							<h2 id="language-setting" className={clsx("text-base font-bold text-text-primary")}>
								{t(translation.SettingsPage.Preferences.Language.Title)}
							</h2>
							<p className={clsx("mt-1 max-w-lg text-sm leading-6 text-text-secondary")}>
								{t(translation.SettingsPage.Preferences.Language.Description)}
							</p>
						</div>
						<div className={clsx("mt-5")}>
							<LocaleSwitcher />
						</div>
					</section>
				</div>

				<p className={clsx("mt-4 text-xs text-text-muted")}>
					{t(translation.SettingsPage.SavedOnDevice)}
				</p>
			</div>
		</section>
	);
}
