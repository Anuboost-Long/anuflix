import type { Metadata } from "next"
import type { ReactNode } from "react"
import localFont from "next/font/local"
import { AppShell } from "@/components/navigation/app-shell"
import { I18nProvider } from "@/components/shared/i18n-provider"
import "./globals.css"

const geist = localFont({
  src: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  title: {
    default: "Anuflix — Find your next story",
    template: "%s | Anuflix",
  },
  description: "Discover movies and TV shows, build your list, and continue watching across Anuflix.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  )
}
