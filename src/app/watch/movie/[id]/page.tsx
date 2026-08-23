import { notFound } from "next/navigation";
import clsx from "clsx";
import { Player } from "@/components/player/player";
import { PlayerBackButton } from "@/components/player/player-back-button";
import { getMediaDetails } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export default async function WatchMoviePage({
  params
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const { media } = await getMediaDetails("movie", id);
  if (!media) notFound();

  return (
    <div className={clsx("relative h-dvh w-full overflow-hidden bg-player")}>
      <PlayerBackButton href={`/movie/${id}`} label="Back to details" />
      <Player media={media} />
    </div>
  );
}
