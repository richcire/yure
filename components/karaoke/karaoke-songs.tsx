"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import KaraokeAccordion from "./karaoke-accordion";
import KaraokeCardsWrapper from "./karaoke-cards-wrapper";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import MobileStickyBottomAdWrapper from "../google-adsense/mobile-sticky-bottom-ad-wrapper";
import { KaraokeCommentSection } from "./karaoke-comment-section";
export default function KaraokeSongs() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile == null) {
    return <div>Loading...</div>;
  }

  if (isMobile) {
    return (
      <>
        <KaraokeAccordion />
        <p className="mt-24 text-center">
          찾으시는 노래방 번호가 없다면 댓글로 신청해 주세요!
        </p>
        <p className="text-center">최대한 빨리 추가해드릴게요.</p>

        <KaraokeCommentSection />
        <BottomDisplayAdWrapper />
        {/* <MobileStickyBottomAdWrapper /> */}
      </>
    );
  }

  return (
    <>
      <KaraokeCardsWrapper />
      <p className="mt-24 text-center">
        찾으시는 노래방 번호가 없다면 댓글로 신청해 주세요!
      </p>
      <p className="text-center">최대한 빨리 추가해드릴게요.</p>

      <KaraokeCommentSection />
      <BottomDisplayAdWrapper />
    </>
  );
}
