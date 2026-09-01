import { AppShell } from "@/components/navigation/app-shell";
import { I18nProvider } from "@/components/shared/i18n-provider";
import { translation } from "@/constants/translation";
import { getServerLocale, getServerTranslation } from "@/i18n/server";
import { Analytics } from "@vercel/analytics/next";
import clsx from "clsx";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const geist = localFont({
	src: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
	variable: "--font-geist",
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getServerTranslation();
	return {
		title: {
			default: t(translation.Metadata.DefaultTitle),
			template: "%s | Anuflix",
		},
		description: t(translation.Metadata.Description),
	};
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const locale = await getServerLocale();

	return (
		<html lang={locale === "kh" ? "km" : locale}>
			<body className={clsx("p-0 m-0", geist.variable)}>
				<I18nProvider locale={locale}>
					<AppShell>{children}</AppShell>
				</I18nProvider>
				<Analytics />
			</body>
		</html>
	);
}
