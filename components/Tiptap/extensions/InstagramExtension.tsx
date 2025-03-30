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
      embedCode: {
        default: null,
      },
      alignment: {
        default: "center",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-instagram-embed-code]",
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return {};

          return {
            embedCode: element.getAttribute("data-instagram-embed-code"),
            alignment:
              element.getAttribute("data-instagram-alignment") || "center",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const cleanAttrs = {
      ...this.options.HTMLAttributes,
      "data-instagram-embed-code": HTMLAttributes.embedCode,
      "data-instagram-alignment": HTMLAttributes.alignment,
    };

    // Remove any undefined or null values
    Object.keys(cleanAttrs).forEach((key) =>
      cleanAttrs[key as keyof typeof cleanAttrs] === undefined ||
      cleanAttrs[key as keyof typeof cleanAttrs] === null
        ? delete cleanAttrs[key as keyof typeof cleanAttrs]
        : {}
    );

    return [
      "div",
      mergeAttributes(cleanAttrs, { class: "instagram-embed-code" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Instagram);
  },
});
