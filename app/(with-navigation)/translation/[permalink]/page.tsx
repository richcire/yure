"use client";

import { createClient } from "@/utils/supabase/client";
import { ITranslations } from "@/types/supabase-table";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { ImageExtension } from "@/components/Tiptap/extensions/ImageExtension";
import { YouTubeExtension } from "@/components/Tiptap/extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { use } from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{
    permalink: string;
  }>;
}

export default function TranslationPage({ params }: Props) {
  const [translation, setTranslation] = useState<ITranslations | null>(null);
  const router = useRouter();
  const { permalink } = use(params);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph", "youtube"],
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      YouTubeExtension.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800",
        },
      }),
    ],
    editable: false,
    content: "",
  });

  useEffect(() => {
    const fetchTranslation = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("translations")
        .select("*, categories(*)")
        .eq("permalink", permalink)
        .single<ITranslations>();
      if (error || !data) {
        router.push("/404");
        return;
      }

      setTranslation(data);

      setTimeout(() => {
        editor?.commands.setContent(data.content);
      });
    };

    fetchTranslation();
  }, [permalink, editor, router]);

  if (!translation || !editor) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#214E34] backdrop-blur-sm shadow-sm p-4 rounded-md mb-8">
          <h1 className="text-3xl text-[#E4E0D5] font-bold mb-2">
            {translation.title}
          </h1>
          <h2 className="text-xl text-[#E4E0D5] text-muted-foreground mb-8">
            {translation.artist}
          </h2>
          <div className=" w-full flex justify-between">
            <Badge>{translation.categories.name}</Badge>
            <h3 className="text-[#E4E0D5]">
              발매일: {translation.release_date}
            </h3>
          </div>
        </div>
        <EditorContent
          editor={editor}
          className="prose dark:prose-invert max-w-none "
        />
      </div>
    </div>
  );
}
