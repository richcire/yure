import Image from "next/image";
import Link from "next/link";
import { ITranslations } from "@/types/supabase-table";

interface CDCardProps {
  song: ITranslations;
  index?: number;
}

export function CDCard({ song, index }: CDCardProps) {
  return (
    <Link
      href={`/translation/${song.permalink}`}
      className="block"
      aria-label={song.title}
    >
      <div className="relative group">
        {/* CD Container */}
        <div className="relative w-full pt-[100%] rounded-full overflow-hidden group">
          {/* CD Border - creates the outer ring effect */}
          <div className="absolute inset-0 rounded-full  border-2 border-border" />

          {/* CD Image */}
          <div className="absolute inset-[1%] rounded-full overflow-hidden transition-transform duration-1000 ease-in-out group-hover:rotate-[360deg]">
            <Image
              src={song.thumbnail_url || "/assets/logos/square_high.jpeg"}
              alt={`${song.title} album cover`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
            {/* CD Center Hole */}
            <div className="absolute inset-[42%] bg-background/80 rounded-full border-2 border-border" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-1 text-center">
            {song.title}
          </h3>
          <p className="text-sm font-semibold text-center text-muted-foreground">
            {song.artist}
          </p>
        </div>
      </div>
    </Link>
  );
}
