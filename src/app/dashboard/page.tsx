"use client";

import { translation } from "@/constants/translation";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
	const { t } = useTranslation();

	return (
		<section className="page">
			<span className="page-eyebrow">{t(translation.DashboardPage.Eyebrow)}</span>
			<h1 className="page-title">{t(translation.DashboardPage.Title)}</h1>
			<p className="page-copy">{t(translation.DashboardPage.Description)}</p>

			<div className="stats-grid">
				<article className="stat-card">
					<span>{t(translation.DashboardPage.Metrics.Revenue.Label)}</span>
					<strong>{t(translation.DashboardPage.Metrics.Revenue.Value)}</strong>
				</article>
				<article className="stat-card">
					<span>{t(translation.DashboardPage.Metrics.ActiveUsers.Label)}</span>
					<strong>{t(translation.DashboardPage.Metrics.ActiveUsers.Value)}</strong>
				</article>
				<article className="stat-card">
					<span>{t(translation.DashboardPage.Metrics.Conversion.Label)}</span>
					<strong>{t(translation.DashboardPage.Metrics.Conversion.Value)}</strong>
				</article>
			</div>
		</section>
	);
}
