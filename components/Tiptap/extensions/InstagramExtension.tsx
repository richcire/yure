import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Instagram from "../nodes/Instagram";

export interface InstagramOptions {
  HTMLAttributes: Record<string, any>;
}

export const InstagramExtension = Node.create<InstagramOptions>({
  name: "instagram",

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
      },
    };
  },

  getEmbedUrl(url: string) {
    if (!url) return null;

    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/([^/?#&]+)/
    );
    if (match) {
      return `https://www.instagram.com/p/${match[1]}/embed`;
    }

    return url;
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="instagram.com"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return {};

          return {
            src: element.getAttribute("src"),
            width: element.getAttribute("width"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const cleanAttrs = {
      ...this.options.HTMLAttributes,
      src: HTMLAttributes.src,
      width: HTMLAttributes.width,
      frameborder: "0",
      allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture",
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
    return ReactNodeViewRenderer(Instagram);
  },
});
