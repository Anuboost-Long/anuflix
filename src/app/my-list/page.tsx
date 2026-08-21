import { MyListGrid } from "@/components/media/my-list-grid"

export default function MyListPage() {
  return <div className="min-h-[75vh] px-[clamp(1.25rem,4vw,4.5rem)] pb-20 pt-28"><span className="text-xs font-semibold tracking-[.18em] text-brand-light uppercase">Saved for later</span><h1 className="mt-2 text-4xl font-black tracking-[-.04em] text-text-primary sm:text-6xl">My List</h1><p className="mb-10 mt-4 max-w-xl text-base leading-7 text-text-secondary">A personal shelf for every movie and series you want to come back to.</p><MyListGrid /></div>
}
