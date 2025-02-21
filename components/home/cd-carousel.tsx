"use client";

import useEmblaCarousel from "embla-carousel-react";
import { CDCard } from "./cd-card";
import { ITranslations } from "@/types/supabase-table";

interface CDCarouselProps {
  translations: ITranslations[];
}

export function CDCarousel({ translations }: CDCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
    align: "start",
  });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-8 md:gap-12">
        {translations.map((song, index) => (
          <div
            key={song.id}
            className="flex-[0_0_40%] min-w-0 md:flex-[0_0_25%]"
          >
            <CDCard song={song} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
