import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import Image from "../nodes/Image";

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

export const ImageExtension = Node.create<ImageOptions>({
  name: "image",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  inline: false,
  group: "block",
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: "100%" },
      textAlign: { default: "left" },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Image);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("imageDropHandler"),
        props: {
          handleDrop: (view, event) => {
            const hasFiles = event.dataTransfer?.files?.length;

            if (!hasFiles) {
              return false;
            }

            const images = Array.from(event.dataTransfer.files).filter((file) =>
              /image/i.test(file.type)
            );

            if (images.length === 0) {
              return false;
            }

            event.preventDefault();

            const { schema } = view.state;
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });

            images.forEach(async (image) => {
              const reader = new FileReader();

              reader.onload = (readerEvent) => {
                const node = schema.nodes.image.create({
                  src: readerEvent.target?.result,
                });
                const transaction = view.state.tr.insert(
                  coordinates?.pos || 0,
                  node
                );
                view.dispatch(transaction);
              };

              reader.readAsDataURL(image);
            });

            return true;
          },
        },
      }),
    ];
  },
});
