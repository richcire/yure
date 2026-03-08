import { Card, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ITranslations } from "@/types/supabase-table";
import { ArrowBigUp } from "lucide-react";
import squareLogo from "@/public/assets/logos/square_high.jpeg";

interface SongCardProps {
  song: ITranslations;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/translation/${song.permalink}`} passHref>
      <Card className="w-full cursor-pointer relative group overflow-hidden aspect-video">
        <div className="absolute inset-0">
          <Image
            src={song.thumbnail_url || squareLogo}
            alt={`${song.title} album cover`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            priority={true}
          />
          <div className="absolute inset-0 bg-black/5 transition-opacity duration-300" />
        </div>
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-black/50 rounded-md px-2 py-1">
          <ArrowBigUp className="w-4 h-4 text-white" aria-hidden="true" />
          <span className="text-sm text-white">{song.views || 0}</span>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end p-4">
          <CardTitle
            className={`${song.thumbnail_url ? "text-comfortWhite" : "text-foreground"} mb-2 font-bold`}
          >
            {song.title}
          </CardTitle>
          <p
            className={`text-sm ${song.thumbnail_url ? "text-comfortWhite" : "text-foreground"} font-medium`}
          >
            {song.artist}
          </p>
        </div>
      </Card>
    </Link>
  );
}
