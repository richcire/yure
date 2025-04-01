// import RelatedNews from "@/components/news/related-news";
import { createClient } from "@/utils/supabase/server";
import { INews } from "@/types/supabase-table";
import {
  NewsActions,
  NewsActionsSkeleton,
} from "@/components/news/news-actions";
import { NewsCommentSection } from "@/components/news/news-comment-section";
import { Suspense } from "react";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { TipTapContentSkeleton } from "@/components/Tiptap/TipTapContentSkeleton";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { NewsTitle, NewsTitleSkeleton } from "@/components/news/news-title";
import NewsContentWrapper from "@/components/news/news-content-wrapper";
import NewsRelatedPosts from "@/components/news/news-related-posts";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await fetchNews(slug);

  return {
    title: `${data?.title} - [J-POP 뉴스] • 유레 揺れ`,
    description: data?.summary,
  };
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

async function fetchNews(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*, user_info(name)")
    .eq("slug", decodeURIComponent(slug))
    .single<INews>();

  if (error || !data) {
    throw new Error("News not found");
  }

  return data;
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const news = await fetchNews(slug);

  // Get related news (excluding current one)
  // const related = news
  //   .filter((a) => a.id !== newsArticle.id)
  // .filter((a) => a.category === newsArticle.category || Math.random() > 0.5)
  // .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<NewsTitleSkeleton />}>
          <NewsTitle slug={slug} />
        </Suspense>
        <Suspense fallback={<TipTapContentSkeleton />}>
          <NewsContentWrapper slug={slug} />
        </Suspense>
        <Suspense fallback={<NewsActionsSkeleton />}>
          <NewsActions />
        </Suspense>
        <BottomDisplayAdWrapper />
        <Suspense fallback={<div>관련 포스트를 불러오는 중...</div>}>
          <NewsRelatedPosts slug={slug} />
        </Suspense>
        <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
          <NewsCommentSection news={news} useHideFeature={true} />
        </Suspense>
      </div>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
