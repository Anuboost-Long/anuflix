"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useAtomValue } from "jotai"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n/i18n"
import { localePreferenceAtom } from "@/store/app-store"

export function I18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  const locale = useAtomValue(localePreferenceAtom)

  useEffect(() => {
    if (i18n.language !== locale) {
      void i18n.changeLanguage(locale)
    }

    document.documentElement.lang = locale
  }, [locale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
