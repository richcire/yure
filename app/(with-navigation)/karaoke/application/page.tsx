import { KaraokeCommentSection } from "@/components/karaoke/karaoke-comment-section";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
export default function KaraokeApplicationPage() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">🔖 노래방 번호 신청</h1>
        <p className="text-gray-600 mt-2">
          찾으시는 노래방 번호가 없다면 댓글로 신청해주세요!
        </p>
        <p className="text-gray-600">최대한 빨리 추가해드릴게요.</p>
      </div>
      <KaraokeCommentSection />
      <BottomDisplayAdWrapper />
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
