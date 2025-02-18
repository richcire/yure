import { use, Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import ArticleContent from "../../../../components/article/article-content";

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
      </div>
    </div>
  );
}
