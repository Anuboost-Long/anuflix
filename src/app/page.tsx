"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

const GUIDES = [
  {
    key: "theme",
    file: "src/app/globals.css",
    code: 'const { theme, toggleTheme } = useTheme()',
    accent: '--accent: #047857'
  },
  {
    key: "routes",
    file: "src/app/dashboard/page.tsx",
    code: 'import Link from "next/link"',
    accent: '<Link href="/dashboard" />'
  },
  {
    key: "store",
    file: "src/store/app-store.ts",
    code: "export const sidebarOpenAtom = atom(true)",
    accent: "const [open, setOpen] = useAtom(sidebarOpenAtom)"
  }
] as const

const STATS = ["themeModes", "brandReady", "blankScreens"] as const

export default function HomePage() {
  const { t } = useTranslation()
  const [activeGuide, setActiveGuide] = useState(0)
  const guide = GUIDES[activeGuide]

  return (
    <section className="page">
      <span className="page-eyebrow">{t("HomePage.eyebrow")}</span>
      <h1 className="page-title">{t("HomePage.title")}</h1>
      <p className="page-copy">{t("HomePage.description")}</p>

      <div className="showcase">
        <div className="showcase-head">
          <div>
            <p className="panel-label">{t("HomePage.showcase.label")}</p>
            <p className="panel-title">{t("HomePage.showcase.title")}</p>
          </div>
          <span className="live-badge">
            <span className="live-dot" />
            {t("HomePage.showcase.status")}
          </span>
        </div>

        <div className="pipeline" role="tablist" aria-label={t("HomePage.showcase.label")}>
          {GUIDES.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={activeGuide === index}
              onClick={() => setActiveGuide(index)}
              className={cn("pipeline-step", activeGuide === index && "pipeline-step-active")}
            >
              <span className="pipeline-index">0{index + 1}</span>
              <span className="pipeline-text">{t(`HomePage.guides.${item.key}.label`)}</span>
            </button>
          ))}
        </div>

        <div className="code-card">
          <p className="code-muted">{guide.file}</p>

          <ol className="guide-steps">
            {[0, 1, 2].map((step) => (
              <li key={step} className="guide-step">
                {t(`HomePage.guides.${guide.key}.steps.${step}`)}
              </li>
            ))}
          </ol>

          <div className="guide-divider" />

          <p className="code-line">{guide.code}</p>
          <p className="code-line code-line-accent">{guide.accent}</p>
        </div>
      </div>

      <div className="stats-grid">
        {STATS.map((stat) => (
          <article key={stat} className="stat-card">
            <strong>{t(`HomePage.stats.${stat}.value`)}</strong>
            <span>{t(`HomePage.stats.${stat}.label`)}</span>
          </article>
        ))}
      </div>

      <div className="footer-note">
        <p className="footer-note-title">{t("HomePage.footer.title")}</p>
        <p className="footer-note-text">{t("HomePage.footer.description")}</p>
      </div>
    </section>
  )
}
