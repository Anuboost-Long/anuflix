import en from "@/i18n/lang/en.json";
import kh from "@/i18n/lang/kh.json";
import type { AppLocale } from "@/types/navigation";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

export function createI18n(locale: AppLocale) {
	const i18n = createInstance();
	void i18n.use(initReactI18next).init({
		lng: locale,
		fallbackLng: "en",
		initAsync: false,
		interpolation: {
			escapeValue: false,
		},
		resources: {
			en: {
				translation: en,
			},
			kh: {
				translation: kh,
			},
		},
	});

	return i18n;
}
