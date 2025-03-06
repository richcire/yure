import { use, Suspense } from "react";
import {
  ArticleTitle,
  ArticleTitleSkeleton,
} from "../../../../components/article/article-title";
import ArticleContent from "../../../../components/article/article-content";
import { CommentSection } from "@/components/comments/comment-section";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { SideVerticalDisplayAd } from "@/components/google-adsense/side-veritcal-display-ad";
import { createClient } from "@/utils/supabase/server";
import { IComments } from "@/types/supabase-table";

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
        <ArticleContent slug={slug} />
        <BottomDisplayAdWrapper />
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection
            getComments={getComments}
            addComment={addComment}
            deleteComment={deleteComment}
          />
        </Suspense>
      </div>
      <div className="sticky-side-ad">
        <SideVerticalDisplayAd />
      </div>
    </div>
  );
}
