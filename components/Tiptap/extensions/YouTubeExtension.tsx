import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import YouTube from "../nodes/YouTube";

export interface YouTubeOptions {
  HTMLAttributes: Record<string, any>;
}

export const YouTubeExtension = Node.create<YouTubeOptions>({
  name: "youtube",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "100%",
        renderHTML: (attributes) => ({
          width: attributes.width,
        }),
      },
      aspectRatio: {
        default: "16/9",
        renderHTML: (attributes) => ({
          style: `aspect-ratio: ${attributes.aspectRatio}`,
        }),
      },
      textAlign: {
        default: "center",
        renderHTML: (attributes) => ({
          style: `text-align: ${attributes.textAlign}`,
        }),
      },
    };
  },

  getEmbedUrl(url: string) {
    if (!url) return null;

    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube-nocookie.com/embed/${match[1]}`;
      }
    }

    return url;
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]',
        getAttrs: (element) => {
          console.log(element.getAttribute("src"));
          if (!(element instanceof HTMLElement)) return {};
          return {
            src: element.getAttribute("src"),
            height: element.getAttribute("height"),
            width: element.getAttribute("width"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    console.log(HTMLAttributes.src);
    const cleanAttrs = {
      ...this.options.HTMLAttributes,
      src: HTMLAttributes.src,
      height: HTMLAttributes.height,
      width: HTMLAttributes.width,
      frameborder: "0",
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: "true",
    };

    // Remove any undefined or null values
    Object.keys(cleanAttrs).forEach((key) =>
      cleanAttrs[key as keyof typeof cleanAttrs] === undefined ||
      cleanAttrs[key as keyof typeof cleanAttrs] === null
        ? delete cleanAttrs[key as keyof typeof cleanAttrs]
        : {}
    );

    return ["iframe", mergeAttributes(cleanAttrs)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YouTube);
  },
});
