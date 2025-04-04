import Search from "../../../components/karaoke/search";
import { Metadata } from "next";
import KaraokeSongs from "@/components/karaoke/karaoke-songs";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";

export const metadata: Metadata = {
  title: "JPOP 일본 노래 노래방 번호 검색기 • 유레 揺れ",
  description:
    "부르고 싶은 노래의 노래방 번호를 찾아보세요! J-POP 노래부터 애니메이션 노래, 보컬로이드 노래까지 다양한 노래를 한곳에서 쉽게 찾을 수 있습니다.",
  openGraph: {
    title: "JPOP 일본 노래 노래방 번호 검색기 • 유레 揺れ",
    description:
      "부르고 싶은 노래의 노래방 번호를 찾아보세요! J-POP 노래부터 애니메이션 노래, 보컬로이드 노래까지 다양한 노래를 한곳에서 쉽게 찾을 수 있습니다.",
    images: [
      {
        url: "/assets/logos/square_high.jpeg",
        width: 1200,
        height: 630,
        alt: "유레 揺れ",
      },
    ],
    locale: "ko_KR",
    type: "website",
    siteName: "유레 揺れ",
  },
};

interface Props {
  searchParams: Promise<{
    search?: string; // 검색 키워드
    page?: string;
  }>;
}

export default async function KaraokePage({ searchParams }: Props) {
  throw new Error("test");
  const params = await searchParams;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          🔍 JPOP 노래방 검색기
        </h1>
        <p className="text-gray-600 mt-2">
          부르고 싶은 노래의 노래방 번호를 찾아보세요!
        </p>
      </div>

      <div className="mb-8">
        <Search defaultValue={params.search} />
      </div>

      <KaraokeSongs />
      <SideVerticalDisplayAdWrapper />
      <BottomDisplayAdWrapper />
    </div>
  );
}
