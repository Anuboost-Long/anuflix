import { appLocales, type AppLocale } from "@/types/navigation";

export const LOCALE_COOKIE = "app-locale";

export function isAppLocale(value: string | undefined): value is AppLocale {
	return appLocales.some((locale) => locale === value);
}
