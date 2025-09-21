"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import KaraokeAccordion from "./karaoke-accordion";
import KaraokeCardsWrapper from "./karaoke-cards-wrapper";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import MobileStickyBottomAdWrapper from "../google-adsense/mobile-sticky-bottom-ad-wrapper";
export default function KaraokeSongs() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile == null) {
    return <div>Loading...</div>;
  }

  if (isMobile) {
    return (
      <>
        <KaraokeAccordion />
        <BottomDisplayAdWrapper />
        <MobileStickyBottomAdWrapper />
      </>
    );
  }

  return (
    <>
      <KaraokeCardsWrapper />
      <BottomDisplayAdWrapper />
    </>
  );
}
