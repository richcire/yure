import Image from "next/image";
import Link from "next/link";
import { ITranslations } from "@/types/supabase-table";

interface CDCardProps {
  song: ITranslations;
  index?: number;
}

export function CDCard({ song, index }: CDCardProps) {
  return (
    <Link href={`/translation/${song.permalink}`} className="block">
      <div className="relative group">
        {/* Numbered circle indicator */}
        {index !== undefined && (
          <div className="absolute top-4 w-8 h-8 mx-4 rounded-full bg-[#E4E0D5] text-[#69140E] border-2 border-[#69140E] flex items-center justify-center z-20 font-bold">
            {index + 1}
          </div>
        )}

        {/* CD Container */}
        <div className="relative w-full pt-[100%] rounded-full overflow-hidden group">
          {/* CD Border - creates the outer ring effect */}
          <div className="absolute inset-0 rounded-full  border-4 border-[#69140E]/60" />

          {/* CD Image */}
          <div className="absolute inset-[3%] rounded-full overflow-hidden transition-transform duration-1000 ease-in-out group-hover:rotate-[360deg]">
            <Image
              src={song.thumbnail_url || "/assets/logos/square.jpeg"}
              alt={`${song.title} album cover`}
              fill
              className="object-cover"
              sizes="25vw"
            />
            {/* CD Center Hole */}
            <div className="absolute inset-[40%] bg-black/80 rounded-full border-4 border-white/20" />
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 ">
            {song.title}
          </h3>
          <p className="text-sm text-[#69140E]/80 line-clamp-1">
            {song.artist}
          </p>
        </div>
      </div>
    </Link>
  );
}
