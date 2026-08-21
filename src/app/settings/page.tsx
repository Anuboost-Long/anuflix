"use client"

import { useTranslation } from "react-i18next"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <section className="page">
      <span className="page-eyebrow">{t("SettingsPage.eyebrow")}</span>
      <h1 className="page-title">{t("SettingsPage.title")}</h1>
      <p className="page-copy">{t("SettingsPage.description")}</p>

      <div className="card-grid">
        <article className="card">
          <h2>{t("SettingsPage.preferences.language.title")}</h2>
          <p>{t("SettingsPage.preferences.language.description")}</p>
        </article>
        <article className="card">
          <h2>{t("SettingsPage.preferences.workspace.title")}</h2>
          <p>{t("SettingsPage.preferences.workspace.description")}</p>
        </article>
      </div>
    </section>
  )
}
