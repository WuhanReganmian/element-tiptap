<template>
  <NodeViewWrapper as="div" class="mermaid-container" contenteditable="false">
    
    <el-popover
      :show-arrow="false"
      placement="top"
      trigger="hover"
    >
      <MermaidBubbleButton
        :node="node"
        :updateAttrs="updateAttributes"
        :editor="editor"
      />
      <template #reference>
        <div ref="diagram"></div>
      </template>
    </el-popover>
  </NodeViewWrapper>
</template>

<script>
import { defineComponent } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import mermaid from 'mermaid';
import { ElPopover } from 'element-plus'
import MermaidBubbleButton from './MermaidBubbleButton.vue'

export default defineComponent({
  name: 'MermaidComponent',
  // props: ['node', 'updateAttributes', 'editor', 'getPos'],
  props: nodeViewProps,
  components: {
    NodeViewWrapper,
    ElPopover,
    MermaidBubbleButton
  },
  data() {
    return {
      diagramId: 'mermaid-' + Date.now(),
    };
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    async renderChart() {
      try {
        mermaid.initialize({ theme: 'neutral' });
        const { svg } = await mermaid.render(this.diagramId, this.node.attrs.code);
        this.$refs.diagram.innerHTML = svg;
      } catch (error) {
        this.$refs.diagram.innerHTML = `<div class="error">${error.message}</div>`;
      }
    },
    edit() {
      // const showDialog = this.editor.extensionManager.extensions
      //   .find(e => e.name === 'mermaidDiagram').options.showDialog;
      
      // showDialog(this.node.attrs.code, (newCode) => {
      //   this.updateAttributes({ code: newCode });
      //   this.renderChart();
      // });
    },
    updateAttrs() {}
  },
  watch: {
    'node.attrs.code': {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  }
});
</script>

<style>
.mermaid-container {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: center;
}
.error {
  color: red;
  padding: 1rem;
}
</style>
