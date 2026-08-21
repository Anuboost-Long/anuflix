"use client"

import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <section className="page">
      <span className="page-eyebrow">{t("DashboardPage.eyebrow")}</span>
      <h1 className="page-title">{t("DashboardPage.title")}</h1>
      <p className="page-copy">{t("DashboardPage.description")}</p>

      <div className="stats-grid">
        <article className="stat-card">
          <span>{t("DashboardPage.metrics.revenue.label")}</span>
          <strong>{t("DashboardPage.metrics.revenue.value")}</strong>
        </article>
        <article className="stat-card">
          <span>{t("DashboardPage.metrics.activeUsers.label")}</span>
          <strong>{t("DashboardPage.metrics.activeUsers.value")}</strong>
        </article>
        <article className="stat-card">
          <span>{t("DashboardPage.metrics.conversion.label")}</span>
          <strong>{t("DashboardPage.metrics.conversion.value")}</strong>
        </article>
      </div>
    </section>
  )
}
