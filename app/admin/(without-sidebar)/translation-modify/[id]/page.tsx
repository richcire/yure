import TiptapEditor from "@/components/Tiptap/Editor";
import { use } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function TranslationModifyPage({ params }: Props) {
  const { id } = use(params);
  return <TiptapEditor id={id} />;
}
