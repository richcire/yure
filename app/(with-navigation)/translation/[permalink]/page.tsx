import { Suspense } from "react";
import {
  TranslationTitle,
  TranslationTitleSkeleton,
} from "@/components/translation/translation-title";
import TranslationContent from "@/components/translation/translation-content";
import { CommentSection } from "@/components/comments/comment-section";
import { createClient } from "@/utils/supabase/server";
import { SideVerticalDisplayAd } from "@/components/google-adsense/side-veritcal-display-ad";
import { BottomDisplayAdWrapper } from "@/components/google-adsense/bottom-display-ad-wrapper";
import { IComments } from "@/types/supabase-table";

export async function generateMetadata({ params }: Props) {
  const { permalink } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("title, artist")
    .eq("permalink", permalink)
    .single();

  return {
    title: `${data?.artist} - ${data?.title} [가사해석/발음] • 유레 揺れ`,
    description: `${data?.title} J-POP 번역은 유레`,
  };
}

// export async function generateStaticParams() {
//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from("translations")
//     .select("permalink")
//     .returns<string[]>();

//   if (error) {
//     console.error(error);
//     return [];
//   }
//   return data ?? [];
// }

interface Props {
  params: Promise<{
    permalink: string;
  }>;
}

export default async function TranslationPage({ params }: Props) {
  const { permalink } = await params;
  const supabase = await createClient();

  // Fetch translation ID for the comment section
  const { data: translation } = await supabase
    .from("translations")
    .select("id")
    .eq("permalink", permalink)
    .single();

  const getComments = async () => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("get_translation_comments", {
        p_link: decodeURIComponent(permalink),
      })
      .returns<IComments[]>();
    return { data, error };
  };

  const addComment = async (new_content: string, parent_id?: string) => {
    "use server";
    const supabase = await createClient();
    const { data, error } = await supabase
      .rpc("add_translation_comment", {
        p_link: decodeURIComponent(permalink),
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
      .from("translation_comments")
      .delete()
      .eq("id", commentId)
      .select()
      .returns<IComments[]>();
    return { data, error };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<TranslationTitleSkeleton />}>
          <TranslationTitle permalink={permalink} />
        </Suspense>
        <TranslationContent permalink={permalink} />

        <BottomDisplayAdWrapper />
        {translation && (
          <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
            <CommentSection
              getComments={getComments}
              addComment={addComment}
              deleteComment={deleteComment}
            />
          </Suspense>
        )}
      </div>
      <div className="sticky-side-ad">
        <SideVerticalDisplayAd />
      </div>
    </div>
  );
}
