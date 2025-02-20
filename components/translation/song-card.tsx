import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ITranslations } from "@/types/supabase-table";

interface SongCardProps {
  song: ITranslations;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/translation/${song.permalink}`} passHref>
      <Card className="w-full cursor-pointer relative group overflow-hidden aspect-video">
        <div className="absolute inset-0">
          <Image
            src={song.thumbnail_url || "/assets/logos/square.jpeg"}
            alt={`${song.title} album cover`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            priority={true}
          />
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 " />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end p-4">
          <CardTitle className="text-white/80 mb-2">{song.title}</CardTitle>
          <p className="text-sm text-white/80">{song.artist}</p>
        </div>
      </Card>
    </Link>
  );
}
