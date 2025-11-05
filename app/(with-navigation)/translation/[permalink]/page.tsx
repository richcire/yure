import { Suspense } from "react";
import {
  TranslationTitle,
  TranslationTitleSkeleton,
} from "@/components/translation/translation-title";
import { createPublicClient } from "@/utils/supabase/public";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import TranslationContentWrapper from "@/components/translation/translation-content-wrapper";
import { TipTapContentSkeleton } from "@/components/Tiptap/TipTapContentSkeleton";
import TranslationRelatedPosts from "@/components/translation/translation-related-posts";
import ViewCounter from "@/components/translation/ViewCounter";
import TranslationRelatedPostsSkeleton from "@/components/translation/translation-related-posts-skeleton";
import squareLogo from "@/public/assets/logos/square_high.jpeg";
import { TranslationCommentSection } from "@/components/translation/translation-comment-section";
import { notFound } from "next/navigation";
import Image from "next/image";
import TranslationContent from "@/components/translation/translation-content";
import { ICategories } from "@/types/supabase-table";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";

export async function generateMetadata({ params }: Props) {
  const { permalink } = await params;
  const supabase = await createPublicClient();
  const { data, error } = await supabase
    .from("translations")
    .select("title, artist, thumbnail_url")
    .eq("permalink", permalink)
    .single();

  return {
    title: `${data?.artist} - ${data?.title} [가사해석/발음] • 유레 揺れ`,
    description: `${data?.title} J-POP 번역은 유레`,
    openGraph: {
      title: `${data?.artist} - ${data?.title} [가사해석/발음] • 유레 揺れ`,
      description: `${data?.title} - J-POP 번역은 유레`,
      images: [
        {
          url: data?.thumbnail_url,
          width: 1200,
          height: 630,
          alt: `${data?.artist} - ${data?.title}`,
        },
        {
          url: squareLogo.src,
          width: 1200,
          height: 630,
          alt: `${data?.artist} - ${data?.title}`,
        },
      ],
      locale: "ko_KR",
      type: "article",
      siteName: "유레 揺れ",
    },
  };
}

interface Props {
  params: Promise<{
    permalink: string;
  }>;
}

export default async function TranslationPage({ params }: Props) {
  const { permalink } = await params;

  const supabase = createPublicClient();
  const { data: translation } = await supabase
    .from("translations")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `
    )
    .eq("permalink", permalink)
    .single();

  if (!translation) {
    notFound();
  }
  return (
    <div className="relative">
      <ViewCounter permalink={permalink} />
      {/* 고정 배경: iOS의 background-attachment: fixed 제한을 피하기 위해 'position:fixed' 레이어 사용 */}
      <div
        aria-hidden
        className="fixed inset-0 h-screen w-screen -z-10 pointer-events-none"
      >
        <Image
          src={translation.thumbnail_url}
          alt=""
          fill
          priority
          className="object-cover"
        />
        {/* 가독성 보정용 오버레이 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      {/* 히어로: 화면 한 장 꽉 채움 */}
      <section className="relative flex h-screen w-full items-center justify-center px-6">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur">
            {!translation.categories?.length ? (
              <span className="text-xs">J-POP 가사해석 by YURE</span>
            ) : (
              translation.categories.map((t: ICategories) => (
                <span key={t.id} className="text-xs">
                  {t.name}
                </span>
              ))
            )}
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            {translation.title}
          </h1>
          <p className="mt-3 text-base/relaxed text-white/85 md:text-lg">
            {translation.artist}
          </p>
          {/* 하단 스크롤 힌트 */}
          <div className="mt-12 flex justify-center">
            <a
              href="#content"
              className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs md:text-sm ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
            >
              아래로 스크롤
              <svg
                className="size-4 transition group-hover:translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 본문 컨테이너: 스크롤 시 배경 위를 덮으며 올라옴 */}
      <section
        id="content"
        className="relative pb-24 max-w-4xl w-screen p-4 rounded-2xl bg-gradient-to-b from-[#F5F5F5] to-[#E4E0D5]"
      >
        <p className="absolute -top-24 right-4 text-sm md:text-base text-white/85 text-right">
          {new Date(translation.release_date).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5 md:p-10">
          <div className="mb-8 flex items-center justify-end text-sm text-gray-500">
            <div>2023년 08월 02일</div>
          </div>

        </div> */}
        <TranslationContent content={translation.content} />
        <BottomDisplayAdWrapper />

        {/* 추가 섹션(추천/댓글 등) */}
        <Suspense fallback={<TranslationRelatedPostsSkeleton />}>
          <TranslationRelatedPosts permalink={permalink} />
        </Suspense>
        <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
          <TranslationCommentSection permalink={permalink} />
        </Suspense>
      </section>
      <SideVerticalDisplayAdWrapper />
    </div>

    // <div className="container mx-auto px-4 py-32">
    //   <ViewCounter permalink={permalink} />
    //   <div className="max-w-4xl mx-auto">
    //     <Suspense fallback={<TranslationTitleSkeleton />}>
    //       <TranslationTitle translation={translation} />
    //     </Suspense>
    //     <Suspense fallback={<TipTapContentSkeleton />}>
    //       <TranslationContentWrapper translation={translation} />
    //     </Suspense>

    //     <Suspense fallback={<TranslationRelatedPostsSkeleton />}>
    //       <TranslationRelatedPosts permalink={permalink} />
    //     </Suspense>

    //     <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
    //       <TranslationCommentSection permalink={permalink} />
    //     </Suspense>
    //   </div>
    //   <SideVerticalDisplayAdWrapper />
    // </div>
  );
}
