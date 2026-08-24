import en from "@/i18n/lang/en.json";
import kh from "@/i18n/lang/kh.json";
import { isAppLocale, LOCALE_COOKIE } from "@/i18n/locale";
import { cookies } from "next/headers";

type TranslationValues = Readonly<Record<string, string | number>>;

export async function getServerLocale() {
	const locale = (await cookies()).get(LOCALE_COOKIE)?.value;
	return isAppLocale(locale) ? locale : "en";
}

export async function getServerTranslation() {
	const resource = (await getServerLocale()) === "kh" ? kh : en;

	return (key: string, values: TranslationValues = {}) => {
		const text = key.split(".").reduce<unknown>((value, segment) => {
			if (!value || typeof value !== "object") return undefined;
			return (value as Record<string, unknown>)[segment];
		}, resource);

		if (typeof text !== "string") return key;

		return Object.entries(values).reduce(
			(result, [name, value]) => result.replaceAll(`{{${name}}}`, String(value)),
			text,
		);
	};
}
