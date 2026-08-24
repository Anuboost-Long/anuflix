"use server";

import { isAppLocale, LOCALE_COOKIE } from "@/i18n/locale";
import type { AppLocale } from "@/types/navigation";
import { cookies } from "next/headers";

export async function handleServeSetLocale(locale: AppLocale) {
	if (!isAppLocale(locale)) throw new Error("Invalid locale.");
	(await cookies()).set(LOCALE_COOKIE, locale, {
		path: "/",
		maxAge: 31_536_000,
		sameSite: "lax",
	});
}
