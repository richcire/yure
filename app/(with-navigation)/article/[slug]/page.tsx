import { use, Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import ArticleContent from "../../../../components/article/article-content";
import { CommentSection } from "@/components/article/article-comment-section";
import { BottomDisplayAd } from "@/components/google-adsense/bottom-display-ad";
import { SideVerticalDisplayAd } from "@/components/google-adsense/side-veritcal-display-ad";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  return {
    title: `${decodeURIComponent(slug)} • 유레 揺れ`,
  };
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<ArticleTitleSkeleton />}>
          <ArticleTitle slug={slug} />
        </Suspense>
        <ArticleContent slug={slug} />
        <div className="my-12 bg-white max-w-[768px] h-40 mx-auto">
          <BottomDisplayAd />
        </div>
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection slug={slug} />
        </Suspense>
      </div>
      <div className="sticky-side-ad">
        <SideVerticalDisplayAd />
      </div>
    </div>
  );
}
