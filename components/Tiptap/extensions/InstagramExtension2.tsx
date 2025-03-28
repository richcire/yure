import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Instagram2 from "../nodes/Instagram2";

export interface InstagramOptions2 {
  HTMLAttributes: Record<string, any>;
}

export const InstagramExtension2 = Node.create<InstagramOptions2>({
  name: "instagram2",

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
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const cleanAttrs = {
      ...this.options.HTMLAttributes,
      "data-instagram-embed-code": HTMLAttributes.embedCode,
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
    return ReactNodeViewRenderer(Instagram2);
  },
});
