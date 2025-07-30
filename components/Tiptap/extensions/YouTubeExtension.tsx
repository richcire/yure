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
      },
      aspectRatio: {
        default: "16/9",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return {};

          return {
            src: element.getAttribute("src"),
            width: element.getAttribute("width"),
            aspectRatio: element.dataset.aspectRatio || "16/9",
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
      "data-aspect-ratio": HTMLAttributes.aspectRatio,
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
