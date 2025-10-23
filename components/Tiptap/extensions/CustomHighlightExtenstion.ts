// highlight.ts
import { markInputRule, markPasteRule } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";

/** ==텍스트== 를 <mark>로 바꿔주는 규칙 */
const FIND_INLINE_HIGHLIGHT = /(?:^|\s)==([^=]+)==$/;
const FIND_PASTE_HIGHLIGHT = /==([^=]+)==/g;

export const CustomHighlight = Highlight.extend({
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight(),
    };
  },
  addInputRules() {
    return [
      markInputRule({
        find: FIND_INLINE_HIGHLIGHT,
        type: this.type,
      }),
    ];
  },
  addPasteRules() {
    return [
      markPasteRule({
        find: FIND_PASTE_HIGHLIGHT,
        type: this.type,
      }),
    ];
  },
});
