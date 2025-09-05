<template>
  <div class="mind-map">
    <div id="mindMapContainer">
    </div>
    <div
      class="dropdown"
      v-show="show"
      :style="{
        left: left + 'px',
        top: top + 'px'
      }"
    >
      <div v-show="!currentNode?.isRoot" @click="operate('INSERT_NODE')">插入同级节点</div>
      <div @click="operate('INSERT_CHILD_NODE')">插入子级节点</div>
      <!-- <div v-show="!currentNode?.isRoot && currentNode?.layerIndex > 1" @clikc="operate('INSERT_PARENT_NODE')">插入父级节点</div> -->
      <div v-show="!currentNode?.isRoot" @click="operate('REMOVE_NODE')">删除节点</div>
      <div v-show="!currentNode?.isRoot" @click="operate('REMOVE_CURRENT_NODE')">仅删除当前节点</div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import MindMap from "simple-mind-map";
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import Drag from 'simple-mind-map/src/plugins/Drag.js'

const props = defineProps(['data'])
const minMapIns = shallowRef<MindMap | null>(null)
// 当前右键点击的类型
const type = ref('')
// 如果点击的节点，那么代表被点击的节点
const currentNode = shallowRef(null)
// 菜单显示的位置
const left = ref(0)
const top = ref(0)
// 是否显示菜单
const show = ref(false)
defineExpose({ getData })

// MindMap.usePlugin(Drag)

onMounted(() => {
  setTimeout(() => {
    init()
  }, 100);
})
onUnmounted(() => {
  minMapIns.value?.destroy()
})

function init() {
  let data = {
    "data": {
        "text": "根节点"
    },
    "children": []
  }
  try {
    data = mermaidToSimpleMindMap(props.data)
  } catch (error) {
    
  }
  minMapIns.value = new MindMap({
    el: document.getElementById('mindMapContainer'),
    data,
    enableFreeDrag: true,
    // enableShortcutOnlyWhenMouseInSvg: false,
    customCheckEnableShortcut: (e) => {
      console.log(e);
      return true
    }
  });
  minMapIns.value.on('data_change', (data) => {
    console.log(data);
  })
  minMapIns.value.on('node_contextmenu', (e, node) => {
    type.value = 'node'
    left.value = e.clientX + 10
    top.value = e.clientY + 10
    show.value = true
    currentNode.value = node
    console.log(e, node);
  })
  minMapIns.value.on('node_click', hide)
  minMapIns.value.on('draw_click', hide)
  minMapIns.value.on('expand_btn_click', hide)
}
function hide() {
  show.value = false
  left.value = 0
  top.value = 0
  type.value = ''
}
function operate(cmd) {
  minMapIns.value?.execCommand(cmd)
  hide()
}
function mermaidToSimpleMindMap(mermaidText) {
  const lines = mermaidText.split('\n').filter(line => line.trim() !== '')
  const nodeMap = new Map()
  const relations = []
  const childIds = new Set()

  // 解析节点和关系
  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed.startsWith('flowchart')) return

    // 处理节点定义
    const nodeMatch = trimmed.match(/^(\w+)\["(.*?)"\]/)
    if (nodeMatch) {
      const [, id, text] = nodeMatch
      nodeMap.set(id, {
        text: text.replace(/<br\/?>/g, '\n').replace(/”/g, '"')
      })
      return
    }

    // 处理关系
    const relationMatch = trimmed.match(/^(\w+) --> (\w+)/)
    if (relationMatch) {
      const [, from, to] = relationMatch
      relations.push({ from, to })
      childIds.add(to)
    }
  })

  // 生成UUID映射表
  const uidMap = new Map()
  nodeMap.forEach((_, id) => {
    uidMap.set(id, generateUUID())
  })

  // 查找根节点
  const rootId = Array.from(nodeMap.keys()).find(id => !childIds.has(id))

  // 递归构建节点树
  function buildTree(parentId) {
    const children = relations
      .filter(r => r.from === parentId)
      .map(r => {
        return {
          data: {
            text: nodeMap.get(r.to).text,
            uid: uidMap.get(r.to),
            expand: true,
            richText: false,
            isActive: false
          },
          children: buildTree(r.to)
        }
      })
    return children
  }
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
  }

  return {
    data: {
      text: nodeMap.get(rootId).text,
      expand: true,
      uid: uidMap.get(rootId),
      isActive: false
    },
    children: buildTree(rootId),
    smmVersion: "0.14.0-fix.1"
  }
}
function simpleMindMapToMermaid(data) {
  let mermaidCode = 'flowchart TB\n';
  const indent = '  ';
  
  // 特殊字符转义（处理双引号和换行）
  const escapeText = (text) => text
    .replace(/"/g, '”')    // 双引号转全角符号
    .replace(/\n/g, '<br/>'); // 保留换行

  // 递归处理节点
  function processNode(node, parentId = null) {
    // 使用唯一UID作为节点ID，替换MermaidJS不支持的连字符
    const nodeId = node.data.uid.replace(/-/g, '_');
    
    // 添加节点定义
    mermaidCode += `${indent}${nodeId}["${escapeText(node.data.text)}"]\n`;

    // 添加与父节点的连接关系
    if (parentId) {
      mermaidCode += `${indent}${parentId} --> ${nodeId}\n`;
    }

    // 递归处理子节点
    if (node.children) {
      node.children.forEach(child => {
        processNode(child, nodeId);
      });
    }
  }

  // 从根节点开始转换
  processNode(data);
  return mermaidCode;
}
function getData() {
  const data = minMapIns.value?.getData(false)
  console.log(simpleMindMapToMermaid(data));

  return {
    data,
    mermaidData: simpleMindMapToMermaid(data)
  }
}

</script>

<style lang="less" scoped>
#mindMapContainer {
  width: 100%;
  height: 400px;
  z-index: 1;
}

.dropdown {
  position: absolute;
  padding: 12px 0;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 0 10px -3px #909399;
  & > div {
    padding: 4px 16px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>