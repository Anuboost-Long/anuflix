"use client"

import { useAtom } from "jotai"
import { useTranslation } from "react-i18next"
import { localePreferenceAtom } from "@/store/app-store"
import type { AppLocale } from "@/types/navigation"

export function LocaleSwitcher() {
  const { t } = useTranslation()
  const [locale, setLocalePreference] = useAtom(localePreferenceAtom)

  return (
    <label className="locale-switcher">
      <span>{t("LocaleSwitcher.label")}</span>
      <select
        value={locale}
        onChange={(event) => setLocalePreference(event.target.value as AppLocale)}
      >
        <option value="en">{t("LocaleSwitcher.english")}</option>
        <option value="kh">{t("LocaleSwitcher.khmer")}</option>
      </select>
    </label>
  )
}
