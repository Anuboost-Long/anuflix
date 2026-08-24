import { MyListGrid } from "@/components/media/my-list-grid";
import { translation } from "@/constants/translation";
import { getServerTranslation } from "@/i18n/server";

export default async function MyListPage() {
	const t = await getServerTranslation();
	return (
		<div className="min-h-[75vh] px-[clamp(1.25rem,4vw,4.5rem)] pb-20 pt-28">
			<span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">
				{t(translation.MyListPage.Eyebrow)}
			</span>
			<h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">
				{t(translation.Common.MyList)}
			</h1>
			<p className="mb-10 mt-4 max-w-xl text-base leading-7 text-text-secondary">
				{t(translation.MyListPage.Description)}
			</p>
			<MyListGrid />
		</div>
	);
}
