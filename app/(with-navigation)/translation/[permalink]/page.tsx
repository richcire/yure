import { Suspense } from "react";
import { use } from "react";
import {
  TranslationTitle,
  TranslationTitleSkeleton,
} from "@/components/translation/translation-title";
import TranslationContent from "@/components/translation/translation-content";

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
