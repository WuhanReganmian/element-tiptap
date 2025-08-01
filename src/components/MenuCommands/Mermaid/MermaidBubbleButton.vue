<template>
  <div class="mermaid-bubble-menu">
    <command-button
      :command="openEditDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="'编辑'"
      icon="ellipsis-h"
    />
    <!-- <command-button
      :command="removeMermaid"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Image.buttons.remove_image.tooltip')"
      icon="trash-alt"
    /> -->

    <MermaidDialog
      v-model:visible="visible"
      :node="node"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { nodeViewProps } from '@tiptap/vue-3';
import CommandButton from '../CommandButton.vue';
import MermaidDialog from './MermaidDialog.vue'

export default defineComponent({
  components: {
    CommandButton,
    MermaidDialog,
  },
  props: {
    editor: nodeViewProps['editor'],
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
  },
  data() {
    return {
      visible: false
    }
  },
  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);

    return { t, enableTooltip };
  },
  methods: {
    openEditDialog() {
      this.visible = true
    },
    handleConfirm (params) {
      this.updateAttrs(params)
      this.visible = false
    },
    removeMermaid () {
      this.editor.commands.deleteNode('mermaid')
    },
  }
});
</script>
<style scoped>
/* .mermaid-bubble-menu {
  display: flex;
} */
</style>
