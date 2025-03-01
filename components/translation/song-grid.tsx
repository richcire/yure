import { ITranslations } from "@/types/supabase-table";
import { SongCard } from "./song-card";
import { SideVerticalDisplayAd } from "../google-adsense/side-veritcal-display-ad";

interface SongGridProps {
  songs: ITranslations[];
}

export function SongGrid({ songs }: SongGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}
