import { createClient } from "@/utils/supabase/server";
import { IKaraokeSongs } from "@/types/supabase-table";
import { KaraokeCard } from "@/components/karaoke/karaoke-card";

export default async function FavoriteSongsList({
  userId,
}: {
  userId: string;
}) {
  const supabase = await createClient();

  const { data: favorites } = await supabase
    .from("user_favorite_songs")
    .select("song_id, created_at, karaoke_songs(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!favorites || favorites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        즐겨찾기한 노래가 없습니다.
      </p>
    );
  }

  return (
    <div>
      <div className="hidden sm:flex items-center px-4 py-2 text-sm text-muted-foreground border-b">
        <div className="w-[35%]">곡명</div>
        <div className="w-[35%]">가수</div>
        <div className="w-[10%] text-center">TJ</div>
        <div className="w-[10%] text-center">KY</div>
        <div className="w-[10%] text-center">JOY</div>
      </div>
      {favorites.map((fav) => {
        const song = fav.karaoke_songs as unknown as IKaraokeSongs;
        if (!song) return null;
        return (
          <KaraokeCard
            key={song.id}
            title={song.song_title}
            artist={song.singer}
            tjNumber={song.tj || undefined}
            kyNumber={song.ky || undefined}
            joyNumber={song.js || undefined}
          />
        );
      })}
    </div>
  );
}
