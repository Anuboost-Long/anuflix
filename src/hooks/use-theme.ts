"use client"

import { useCallback, useEffect } from "react"
import { useAtom } from "jotai"
import { themePreferenceAtom } from "@/store/app-store"

export function useTheme() {
  const [theme, setTheme] = useAtom(themePreferenceAtom)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }, [setTheme])

  return { theme, isDark: theme === "dark", setTheme, toggleTheme }
}

export default useTheme
