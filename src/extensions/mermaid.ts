import type { Editor } from '@tiptap/core';
import { Extension, Node, mergeAttributes } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import InsertMermaidButton from '@/components/MenuCommands/Mermaid/InsertMermaidButton.vue';
import MermaidComponent from '@/components/MenuCommands/Mermaid/MermaidComponent.vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaid: {
      setMermaid: (options: { code: string }) => ReturnType;
    };
  }
}

const Mermaid = Node.create({
  name: 'mermaid',
  group: 'block',

  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor }: { editor: Editor }) {
        return {
          component: InsertMermaidButton,
          componentProps: {
            editor,
          },
        };
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      code: {
        default: '',
        parseHTML: (element) => element.getAttribute('code'),
        renderHTML: attributes => ({ 'code': attributes.code })
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(MermaidComponent);
  },

  addCommands() {
    return {
      setMermaid: (options) => ({ commands }) => {
        console.log(options);
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
  parseHTML: () => [{ tag: 'div[data-type="mermaid"]' }],
  renderHTML: ({ HTMLAttributes, node }) => [
    'div',
    mergeAttributes(HTMLAttributes, {
      'data-type': 'mermaid',
      // 'data-code': node.attrs.code,
    })
  ],
});

export default Mermaid;
