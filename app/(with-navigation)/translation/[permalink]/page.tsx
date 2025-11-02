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
    <div className="container mx-auto px-4 py-32">
      <ViewCounter permalink={permalink} />
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<TranslationTitleSkeleton />}>
          <TranslationTitle translation={translation} />
        </Suspense>
        <Suspense fallback={<TipTapContentSkeleton />}>
          <TranslationContentWrapper translation={translation} />
        </Suspense>

        {/* <TipTapContentSkeleton /> */}

        <Suspense fallback={<TranslationRelatedPostsSkeleton />}>
          <TranslationRelatedPosts permalink={permalink} />
        </Suspense>

        <Suspense fallback={<div>댓글을 불러오는 중...</div>}>
          <TranslationCommentSection permalink={permalink} />
        </Suspense>
      </div>
      <SideVerticalDisplayAdWrapper />
    </div>
  );
}
