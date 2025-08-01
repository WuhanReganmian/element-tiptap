<template>
  <el-dialog
    v-model="visible"
    :title="t('editor.extensions.Link.add.control.title')"
    :append-to-body="true"
    width="400px"
    class="el-tiptap-edit-link-dialog"
  >
    <el-form :model="formData" label-position="right" size="small">
      <el-form-item
        :label="t('editor.extensions.Link.add.control.href')"
        prop="code"
      >
        <el-input v-model="formData.code" autocomplete="off" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button size="small" round @click="closeDialog">
        {{ t('editor.extensions.Link.add.control.cancel') }}
      </el-button>

      <el-button
        type="primary"
        size="small"
        round
        @mousedown.prevent
        @click="confirm"
      >
        {{ t('editor.extensions.Link.add.control.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, inject, watch } from 'vue';
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElButton,
} from 'element-plus'

const visible = defineModel('visible', { default: false })
const props = defineProps(['node', 'updateAttrs'])
const emit = defineEmits(['confirm'])
const formData = ref(getFormData())
const t = inject('t')

watch(
  visible,
  (v: boolean) => {
    if (v) onOpen()
  }
)

function getFormData () {
  return {
    code: props?.node?.attrs?.code || `flowchart TD
    A[Start] --> B{Is it?};
    B -- Yes --> C[OK];
    C --> D[Rethink];
    D --> B;
    B -- No ----> E[End];`,
  }
}
function onOpen () {
  formData.value = getFormData()
}
function closeDialog () {
  visible.value = false
}
function confirm () {
  emit('confirm', formData.value)
}

</script>

<style lang="less" scoped>

</style>