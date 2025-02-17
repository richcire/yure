import ArticleEditor from "@/components/Tiptap/ArticleEditor";
import { use } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function TranslationModifyPage({ params }: Props) {
  const { id } = use(params);
  return <ArticleEditor id={id} />;
}
