"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { ImageExtension } from "@/components/Tiptap/extensions/ImageExtension";
import { YouTubeExtension } from "@/components/Tiptap/extensions/YouTubeExtension";
import { Highlight } from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { InstagramExtension } from "@/components/Tiptap/extensions/InstagramExtension";
interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
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
      InstagramExtension.configure({
        HTMLAttributes: {
          class: "rounded-md",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-[#FFD966] text-[#69140E]",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false;
            }

            // disallowed protocols
            const disallowedProtocols = ["ftp", "file", "mailto"];
            const protocol = parsedUrl.protocol.replace(":", "");

            if (disallowedProtocols.includes(protocol)) {
              return false;
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );

            if (!allowedProtocols.includes(protocol)) {
              return false;
            }

            // disallowed domains
            const disallowedDomains = [
              "example-phishing.com",
              "malicious-site.net",
            ];
            const domain = parsedUrl.hostname;

            if (disallowedDomains.includes(domain)) {
              return false;
            }

            // all checks have passed
            return true;
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            // construct URL
            const parsedUrl = url.includes(":")
              ? new URL(url)
              : new URL(`https://${url}`);

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = [
              "example-no-autolink.com",
              "another-no-autolink.com",
            ];
            const domain = parsedUrl.hostname;

            return !disallowedDomains.includes(domain);
          } catch {
            return false;
          }
        },
      }),
    ],
    editable: false,
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose focus:outline-none prose-p:mt-0 prose-p:mb-0 prose-headings:mt-0 prose:max-w-none prose-sm:max-w-none max-w-none w-full",
      },
    },
  });

  if (!editor || !content) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="prose dark:prose-invert max-w-none"
    />
  );
}
