"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { ImageExtension } from "@/components/Tiptap/extensions/ImageExtension";
import { YouTubeExtension } from "@/components/Tiptap/extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { InstagramExtension } from "@/components/Tiptap/extensions/InstagramExtension";
import { GoogleAdExtension } from "@/components/Tiptap/extensions/GoogleAdExtension";
import { tiptapLinkConfig } from "@/lib/tiptap-link-config";

type ContentVariant = "translation" | "article" | "news";

interface TiptapContentViewerProps {
  content: string;
  variant?: ContentVariant;
}

const EDITOR_CLASS =
  "prose focus:outline-none prose-p:mt-0 prose-p:mb-0 prose-headings:mt-0 prose:max-w-none prose-sm:max-w-none max-w-none w-full";

/**
 * Convert legacy `<ins class="adsbygoogle">` tags to `<div data-type="google-ad">`
 * so ProseMirror can parse them as block nodes.
 */
function convertLegacyAdTags(html: string): string {
  return html
    .replace(/<ins\s+([^>]*class="[^"]*adsbygoogle[^"]*"[^>]*)><\/ins>/g, (_, attrs) => {
      const withType = attrs.includes('data-type=')
        ? attrs
        : `data-type="google-ad" ${attrs}`;
      return `<div ${withType}></div>`;
    });
}

export default function TiptapContentViewer({
  content,
  variant = "article",
}: TiptapContentViewerProps) {
  const includesGoogleAd = variant === "translation";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph", "youtube"],
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "rounded-md max-w-full" },
      }),
      YouTubeExtension.configure({
        HTMLAttributes: { class: "rounded-md" },
      }),
      InstagramExtension.configure({
        HTMLAttributes: { class: "rounded-md" },
      }),
      ...(includesGoogleAd
        ? [GoogleAdExtension.configure({ HTMLAttributes: { class: "rounded-md" } })]
        : []),
      Highlight.configure({
        HTMLAttributes: { class: "bg-lyric-mark text-primary" },
      }),
      Link.configure(tiptapLinkConfig),
    ],
    editable: false,
    content: includesGoogleAd ? convertLegacyAdTags(content) : content,
    editorProps: {
      attributes: { class: EDITOR_CLASS },
    },
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
  );
}
