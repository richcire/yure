"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { ImageExtension } from "@/components/Tiptap/extensions/ImageExtension";
import { YouTubeExtension } from "@/components/Tiptap/extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { IArticles } from "@/types/supabase-table";
import { useRouter } from "next/navigation";

interface ArticleContentProps {
  slug: string;
}

// export function ArticleContentSkeleton() {
//   return (
//     <div className="space-y-4">
//       <Skeleton className="h-24 w-full" />
//       <Skeleton className="h-32 w-full" />
//       <Skeleton className="h-16 w-3/4" />
//       <Skeleton className="h-24 w-full" />
//       <Skeleton className="h-32 w-full" />
//     </div>
//   );
// }

export default function ArticleContent({ slug }: ArticleContentProps) {
  const router = useRouter();
  const [article, setArticle] = useState<IArticles | null>(null);

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
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none prose-p:mt-0 prose-p:mb-0 prose-headings:mt-0 prose:max-w-none prose-sm:max-w-none max-w-none w-full",
      },
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*, user_info(name)")
        .eq("slug", decodeURIComponent(slug))
        .single<IArticles>();
      if (error || !data) {
        router.push("/404");
        return;
      }
      setArticle(data);

      setTimeout(() => {
        editor?.commands.setContent(data.content);
      });
    };
    fetchArticle();
  }, [slug, editor, router]);

  if (!editor || !article) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="prose dark:prose-invert max-w-none"
    />
  );
}
