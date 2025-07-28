"use client";

import { ITranslations } from "@/types/supabase-table";
import { motion } from "motion/react";
import Image from "next/image";
import squareLogo from "@/public/assets/logos/square_high.jpeg";

export default function VideoTape({
  translation,
}: {
  translation: ITranslations;
}) {
  return (
    <motion.div
      className="w-32 h-[640px] bg-background rounded-lg relative overflow-hidden border border-muted"
      key={translation.id}
      whileHover={{ y: -20 }}
    >
      {/* Thumbnail section with overlaid title */}
      <div className="absolute top-0 left-0 w-full h-[calc(640px-4rem)]">
        <Image
          src={translation.thumbnail_url || squareLogo}
          alt={translation.title}
          fill
          className="object-cover opacity-70"
        />
        {/* Title overlaid on thumbnail */}
        <div className="absolute inset-0 flex items-start justify-end p-4">
          <div className="writing-vertical text-sm font-medium line-clamp-2 bg-background/80 px-2 py-4 rounded">
            {translation.title}
          </div>
        </div>
      </div>

      {/* Bottom section with singer name */}
      <div className="absolute bottom-0 left-0 w-full h-16 p-2 flex items-center justify-center border-t border-muted">
        <div className=" text-sm text-foreground font-semibold text-center">
          {translation.artist}
        </div>
      </div>
    </motion.div>
  );
}
