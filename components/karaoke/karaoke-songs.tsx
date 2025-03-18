"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import KaraokeAccordion from "./karaoke-accordion";
import KaraokeCardsWrapper from "./karaoke-cards-wrapper";

export default function KaraokeSongs() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile == null) {
    return <div>Loading...</div>;
  }

  if (isMobile) {
    return <KaraokeAccordion />;
  }

  return <KaraokeCardsWrapper />;
}
