import { Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { createClient } from "@/utils/supabase/server";
import { IArticles } from "@/types/supabase-table";
import { TipTapContentSkeleton } from "@/components/Tiptap/TipTapContentSkeleton";
import ArticleContentWrapper from "@/components/article/article-content-wrapper";
import ArticleRelatedPosts from "@/components/article/article-related-posts";
import squareLogo from "@/public/assets/logos/square_high.jpeg";
import { ArticleCommentSection } from "@/components/article/article-comment-section";
import { notFound } from "next/navigation";
import Image from "next/image";
import ArticleContent from "@/components/article/article-content";

const getArticle = async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      "title, user_info(name), content, thumbnail_url, created_at, updated_at"
    )
    .eq("slug", slug)
    .single<IArticles>();
  return { data, error };
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await getArticle(decodeURIComponent(slug));

  return {
    title: `${decodeURIComponent(slug)} [유레 매거진] • 유레 揺れ`,
    description: `최신 J-POP 뉴스, 트렌드, 그리고 심층 분석을 만나보세요! J-POP 문화, 아티스트 인터뷰, 업계 소식을 유레 매거진에서 빠르게 확인하세요.`,
    openGraph: {
      title: `${decodeURIComponent(slug)} [유레 매거진] • 유레 揺れ`,
      description: `최신 J-POP 뉴스, 트렌드, 그리고 심층 분석을 만나보세요! J-POP 문화, 아티스트 인터뷰, 업계 소식을 유레 매거진에서 빠르게 확인하세요.`,
      images: [
        {
          url: data?.thumbnail_url,
          width: 1200,
          height: 630,
          alt: `${decodeURIComponent(slug)}`,
        },
        {
          url: squareLogo.src,
          width: 1200,
          height: 630,
          alt: `${decodeURIComponent(slug)}`,
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
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const { data, error } = await getArticle(decodeURIComponent(slug));
  if (error) {
    notFound();
  }

  const structuredData = data
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        image: [data.thumbnail_url],
        datePublished: data.created_at,
        dateModified: data.updated_at,
        author: {
          "@type": "Person",
          name: data.user_info.name,
          url: `https://yure.me`,
        },
      }
    : null;

  return (
    <div className="min-h-screen w-screen text-foreground">
      {/* 1. HERO 영역 (상단 사진 + 타이틀 오버레이) */}
      <section className="relative h-[340px] sm:h-[420px] lg:h-[460px]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src={data?.thumbnail_url || squareLogo}
            alt={data?.title || ""}
            fill
            className="object-cover"
            priority
          />

          {/* 어두운 그라데이션 오버레이 (위·아래 살짝 어둡게) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
        </div>

        {/* 텍스트 영역 */}
        <div className="relative z-10 h-full">
          <div className="mx-auto flex h-full max-w-3xl flex-col justify-end px-6 pb-12 lg:px-0">
            {/* 제목 */}
            <h1 className="mb-3 text-2xl md:text-3xl leading-tight font-semibold text-white">
              {data?.title}
            </h1>

            {/* 작성자/시간 */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
              <span>by {data?.user_info.name}</span>
              <span className="text-gray-400">·</span>
              <span>
                {new Date(data?.created_at || "").toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 본문 영역 */}
      <div className="bg-article-bg">
        <div className="mx-auto max-w-3xl px-6 lg:px-0 pt-10 pb-24">
          {/* 본문 */}
          <Suspense fallback={<TipTapContentSkeleton />}>
            <ArticleContent content={data?.content || ""} />
          </Suspense>

          {/* 구분선 */}
          <div className="my-10 h-px bg-gray-200" />

          <Suspense fallback={<div>관련 포스트를 불러오는 중...</div>}>
            <ArticleRelatedPosts slug={decodeURIComponent(slug)} />
          </Suspense>
          <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
            <ArticleCommentSection slug={decodeURIComponent(slug)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
