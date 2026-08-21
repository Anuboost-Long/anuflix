import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { AdminWorkspace, AppLocale, AppTheme } from "@/types/navigation"

export const sidebarOpenAtom = atom(true)
export const localePreferenceAtom = atomWithStorage<AppLocale>("app-locale", "en")
export const themePreferenceAtom = atomWithStorage<AppTheme>("app-theme", "light")
export const activeWorkspaceAtom = atom<AdminWorkspace>("overview")
