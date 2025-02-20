import { Suspense } from "react";
import { use } from "react";
import {
  TranslationTitle,
  TranslationTitleSkeleton,
} from "@/components/translation/translation-title";
import TranslationContent from "@/components/translation/translation-content";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }: Props) {
  const { permalink } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select("title")
    .eq("permalink", permalink)
    .single();

  return {
    title: `${data?.title} • 유레 揺れ`,
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

export default function TranslationPage({ params }: Props) {
  const { permalink } = use(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<TranslationTitleSkeleton />}>
          <TranslationTitle permalink={permalink} />
        </Suspense>
        <TranslationContent permalink={permalink} />
      </div>
    </div>
  );
}
