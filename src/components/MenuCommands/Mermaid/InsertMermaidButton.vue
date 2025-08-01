<template>
  <div>
    <command-button
      :is-active="editor.isActive('mermaid')"
      :readonly="isCodeViewMode"
      :command="openDialog"
      :enable-tooltip="enableTooltip"
      :tooltip="t('editor.extensions.Link.add.tooltip')"
      icon="mind"
    />

    <MermaidDialog
      v-model:visible="addLinkDialogVisible"
      @confirm="addLink"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import {
  ElButton,
} from 'element-plus';
import { Editor } from '@tiptap/core';
import CommandButton from '../CommandButton.vue';
import MermaidDialog from './MermaidDialog.vue'

export default defineComponent({
  name: 'AddLinkCommandButton',

  components: {
    ElButton,
    CommandButton,
    MermaidDialog,
  },

  props: {
    editor: {
      type: Editor,
      required: true,
    },
  },

  setup() {
    const t = inject('t');
    const enableTooltip = inject('enableTooltip', true);
    const isCodeViewMode = inject('isCodeViewMode', true);

    return { t, enableTooltip, isCodeViewMode };
  },

  data() {
    return {
      addLinkDialogVisible: false,
    };
  },

  // watch: {
  //   addLinkDialogVisible() {
  //     this.formData = { content: `flowchart TD
  //   A[Start] --> B{Is it?};
  //   B -- Yes --> C[OK];
  //   C --> D[Rethink];
  //   D --> B;
  //   B -- No ----> E[End];` };
  //   },
  // },

  methods: {
    openDialog() {
      this.addLinkDialogVisible = true
    },
    addLink(params) {
      console.log(params);
      this.editor.commands.setMermaid(params);

      this.addLinkDialogVisible = false
    },
  },
});
</script>
