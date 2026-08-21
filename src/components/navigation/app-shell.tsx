"use client"

import type { ReactNode } from "react"
import clsx from "clsx"
import { useAtom, useSetAtom } from "jotai"
import { useTranslation } from "react-i18next"
import { NavLink } from "@/components/navigation/nav-link"
import { LazifyLogo } from "@/components/shared/lazify-logo"
import { LocaleSwitcher } from "@/components/shared/locale-switcher"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { activeWorkspaceAtom, sidebarOpenAtom } from "@/store/app-store"

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const setActiveWorkspace = useSetAtom(activeWorkspaceAtom)

  return (
    <div className="shell">
      <aside
        className={clsx(
          "flex flex-col gap-6 overflow-hidden bg-[var(--surface-soft)] text-[var(--text)]",
          "border-0 border-solid border-r border-[var(--border)] max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-b-[var(--border)]",
          "transition-[width,padding,opacity,max-height] duration-300 ease-in-out motion-reduce:transition-none",
          "max-[960px]:w-auto max-[960px]:overflow-y-auto",
          sidebarOpen
            ? "w-[280px] px-7 py-7 opacity-100 max-[960px]:max-h-[520px]"
            : "w-0 border-r-0 px-0 py-7 opacity-0 max-[960px]:max-h-0 max-[960px]:border-b-0 max-[960px]:py-0",
        )}
      >
        <div className="min-w-56">
          <div className="sidebar-brand">
            <span className="logo-shell">
              <LazifyLogo size={40} />
            </span>
            <div>
              <p className="sidebar-kicker">{t("Shell.brandKicker")}</p>
              <h1 className="sidebar-title">{t("Shell.brandTitle")}</h1>
            </div>
          </div>
          <p className="sidebar-copy mt-4">{t("Shell.brandDescription")}</p>
        </div>

        <nav className="sidebar-nav min-w-56" aria-label={t("Shell.navigationLabel")}>
          <NavLink href="/" onNavigate={() => setActiveWorkspace("overview")}>
            {t("Shell.links.overview")}
          </NavLink>
          <NavLink href="/dashboard" onNavigate={() => setActiveWorkspace("dashboard")}>
            {t("Shell.links.dashboard")}
          </NavLink>
          <NavLink href="/settings" onNavigate={() => setActiveWorkspace("settings")}>
            {t("Shell.links.settings")}
          </NavLink>
        </nav>
      </aside>

      <div className="shell-main">
        <header className="shell-header">
          <button
            type="button"
            className="toggle-button"
            onClick={() => setSidebarOpen((current) => !current)}
          >
            {sidebarOpen ? t("Shell.collapse") : t("Shell.expand")}
          </button>
          <div className="header-tools">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </header>
        <main className="shell-content">
          <span className="back-plate" aria-hidden="true" />
          <span className="edge-rail" aria-hidden="true" />
          {children}
        </main>
      </div>
    </div>
  )
}
