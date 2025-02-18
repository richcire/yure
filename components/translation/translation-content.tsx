"use client";

import { useEffect } from "react";
import { ITranslations } from "@/types/supabase-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { EditorContent, useEditor } from "@tiptap/react";
import { ImageExtension } from "../Tiptap/extensions/ImageExtension";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { YouTubeExtension } from "../Tiptap/extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";

export default function TranslationContent({
  permalink,
}: {
  permalink: string;
}) {
  const router = useRouter();
  const [translation, setTranslation] = useState<ITranslations | null>(null);

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
        .select("*")
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
  }, [permalink, router, editor]);

  if (!editor || !translation) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="prose dark:prose-invert max-w-none"
    />
  );
}
