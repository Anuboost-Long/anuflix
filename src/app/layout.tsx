import type { Metadata } from "next"
import type { ReactNode } from "react"
import { AppShell } from "@/components/navigation/app-shell"
import { I18nProvider } from "@/components/shared/i18n-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "anuflix",
  description: "Admin starter scaffold with routing, translations, and global state."
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("app-theme");if(t)document.documentElement.setAttribute("data-theme",t.replace(/"/g,""))}catch(e){}})()`
          }}
        />
      </head>
      <body>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  )
}
