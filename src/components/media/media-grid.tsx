import { MediaCard } from "@/components/media/media-card"
import type { MediaItem } from "@/lib/tmdb/types"

export function MediaGrid({ items }: Readonly<{ items: MediaItem[] }>) {
  if (!items.length) return <div className="py-20 text-center"><h2 className="text-2xl font-bold text-text-primary">No titles found</h2><p className="mt-2 text-sm text-text-secondary">Try changing one or more filters.</p></div>
  return <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">{items.map((media) => <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />)}</div>
}
