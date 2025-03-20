import { use, Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import { CommentSection } from "@/components/comments/comment-section";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { SideVerticalDisplayAdWrapper } from "@/components/google-adsense/side-vertical-display-ad-wrapper";
import { createClient } from "@/utils/supabase/server";
import { IComments } from "@/types/supabase-table";
import { TipTapContentSkeleton } from "@/components/Tiptap/TipTapContentSkeleton";
import ArticleContentWrapper from "@/components/article/article-content-wrapper";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("title, thumbnail_url")
    .eq("slug", slug)
    .single();

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

export default function ArticlePage({ params }: Props) {
  const { slug } = use(params);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<ArticleTitleSkeleton />}>
          <ArticleTitle slug={slug} />
        </Suspense>
        <Suspense fallback={<TipTapContentSkeleton />}>
          <ArticleContentWrapper slug={slug} />
        </Suspense>
        <BottomDisplayAdWrapper />
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection
            getComments={getComments}
            addComment={addComment}
            deleteComment={deleteComment}
          />
        </Suspense>
      </div>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
