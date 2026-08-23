import { notFound } from "next/navigation";
import clsx from "clsx";
import { Player } from "@/components/player/player";
import { PlayerBackButton } from "@/components/player/player-back-button";
import { getMediaDetails, getSeason } from "@/lib/tmdb/queries";

export const dynamic = "force-dynamic";

export default async function WatchEpisodePage({
  params
}: Readonly<{ params: Promise<{ id: string; season: string; episode: string }> }>) {
  const values = await params;
  const id = Number(values.id);
  const seasonNumber = Number(values.season);
  const episodeNumber = Number(values.episode);
  if (![id, seasonNumber, episodeNumber].every(Number.isInteger)) notFound();
  const [{ media, raw }, season] = await Promise.all([
    getMediaDetails("tv", id),
    getSeason(id, seasonNumber)
  ]);
  const episode = season.episodes.find((item) => item.episode_number === episodeNumber);
  if (!media || !episode) notFound();

  return (
    <div className={clsx("relative h-dvh w-full overflow-hidden bg-player")}>
      <PlayerBackButton href={`/tv/${id}?season=${seasonNumber}`} label="Back to episodes" />
      <Player
        media={media}
        season={seasonNumber}
        episode={episodeNumber}
        seasons={raw.seasons?.filter(({ season_number }) => season_number > 0)}
        episodes={season.episodes}
      />
    </div>
  );
}
