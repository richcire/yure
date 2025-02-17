import { ITranslations } from "@/types/supabase-table";
import { SongCard } from "./song-card";

interface SongGridProps {
  songs: ITranslations[];
}

export function SongGrid({ songs }: SongGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}
