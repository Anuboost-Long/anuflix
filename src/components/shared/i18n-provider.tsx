"use client";

import { createI18n } from "@/i18n/i18n";
import type { AppLocale } from "@/types/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";

export function I18nProvider({
	children,
	locale,
}: Readonly<{ children: ReactNode; locale: AppLocale }>) {
	const [i18n] = useState(() => createI18n(locale));

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
