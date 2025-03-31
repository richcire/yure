import { use, Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import { CommentSection } from "@/components/comments/comment-section";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { createClient } from "@/utils/supabase/server";
import { IArticles, IComments } from "@/types/supabase-table";
import { TipTapContentSkeleton } from "@/components/Tiptap/TipTapContentSkeleton";
import ArticleContentWrapper from "@/components/article/article-content-wrapper";
import ArticleRelatedPosts from "@/components/article/article-related-posts";
const getArticle = async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("title, user_info(name), thumbnail_url, created_at, updated_at")
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
          url: "/assets/logos/square_high.jpeg",
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
    return <div>Error: {error.message}</div>;
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

  const getComments = async () => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_article_comments", {
        s_input: decodeURIComponent(slug),
      })
      .returns<IComments[]>();
    return { data, error };
  };

  const addComment = async (new_content: string, parent_id?: string) => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("add_article_comment", {
        s_input: decodeURIComponent(slug),
        new_content,
        parent_id,
      })
      .returns<IComments[]>();
    return { data, error };
  };

  const deleteComment = async (commentId: string) => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("article_comments")
      .delete()
      .eq("id", commentId)
      .select()
      .returns<IComments[]>();
    return { data, error };
  };

  return (
    <>
      <section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<ArticleTitleSkeleton />}>
            <ArticleTitle slug={slug} />
          </Suspense>
          <Suspense fallback={<TipTapContentSkeleton />}>
            <ArticleContentWrapper slug={slug} />
          </Suspense>
          <BottomDisplayAdWrapper />
          <Suspense fallback={<div>관련 포스트를 불러오는 중...</div>}>
            <ArticleRelatedPosts slug={slug} />
          </Suspense>
          <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
            <CommentSection
              getComments={getComments}
              addComment={addComment}
              deleteComment={deleteComment}
            />
          </Suspense>
        </div>
        <SideVerticalDisplayAdWrapper />
      </div>
    </>
  );
}
