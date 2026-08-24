export const appLocales = ["en", "kh"] as const;

export type AppLocale = (typeof appLocales)[number];
export type AdminWorkspace = "overview" | "dashboard" | "settings";
