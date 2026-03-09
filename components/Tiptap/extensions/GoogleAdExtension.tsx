import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import GoogleAd from "../nodes/GoogleAd";

export interface GoogleAdOptions {
  HTMLAttributes: Record<string, any>;
}

export const GoogleAdExtension = Node.create<GoogleAdOptions>({
  name: "googleAd",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",
  draggable: true,

  addAttributes() {
    return {
      client: {
        default: "ca-pub-4738868818137222",
      },
      slot: {
        default: "2891582134",
      },
      layout: {
        default: "in-article",
      },
      format: {
        default: "fluid",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="google-ad"]',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return {};

          return {
            client: element.getAttribute("data-ad-client"),
            slot: element.getAttribute("data-ad-slot"),
            layout: element.getAttribute("data-ad-layout"),
            format: element.getAttribute("data-ad-format"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-type": "google-ad",
        class: "adsbygoogle",
        style: "display:block; text-align:center;",
        "data-ad-layout": HTMLAttributes.layout,
        "data-ad-format": HTMLAttributes.format,
        "data-ad-client": HTMLAttributes.client,
        "data-ad-slot": HTMLAttributes.slot,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GoogleAd);
  },
});
