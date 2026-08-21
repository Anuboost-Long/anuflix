"use client"

import { useTranslation } from "react-i18next"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t("ThemeToggle.label")}
      className="mode-control"
      onClick={toggleTheme}
    >
      <span className="mode-text">{isDark ? t("ThemeToggle.dark") : t("ThemeToggle.light")}</span>
      <span className="mode-track" aria-hidden="true">
        <span className="mode-thumb" />
      </span>
    </button>
  )
}
