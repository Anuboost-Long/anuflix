export const appLocales = ["en", "kh"] as const
export const appThemes = ["light", "dark"] as const

export type AppLocale = (typeof appLocales)[number]
export type AppTheme = (typeof appThemes)[number]
export type AdminWorkspace = "overview" | "dashboard" | "settings"
