<template>
  <div>
    显示连接线：<vxe-switch v-model="showLine"></vxe-switch>
    显示根节点线：<vxe-switch v-model="lineConfig.showRootLine"></vxe-switch>

    <vxe-tree :data="treeList" :show-line="showLine" :line-config="lineConfig" transform></vxe-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeTreePropTypes } from '../../../types'

const showLine = ref(true)

const lineConfig = reactive<VxeTreePropTypes.LineConfig>({
  showRootLine: true
})

const treeList = ref<VxeTreePropTypes.Data>([
  { title: '节点2', id: '2', parentId: null },
  { title: '节点3', id: '3', parentId: null },
  { title: '节点3-1', id: '31', parentId: '3' },
  { title: '节点3-2', id: '32', parentId: '3' },
  { title: '节点3-2-1', id: '321', parentId: '32' },
  { title: '节点3-2-2', id: '322', parentId: '32' },
  { title: '节点3-3', id: '33', parentId: '3' },
  { title: '节点3-3-1', id: '331', parentId: '33' },
  { title: '节点3-3-2', id: '332', parentId: '33' },
  { title: '节点3-3-3', id: '333', parentId: '33' },
  { title: '节点3-4', id: '34', parentId: '3' },
  { title: '节点4', id: '4', parentId: null },
  { title: '节点4-1', id: '41', parentId: '4' },
  { title: '节点4-1-1', id: '411', parentId: '42' },
  { title: '节点4-1-2', id: '412', parentId: '42' },
  { title: '节点4-2', id: '42', parentId: '4' },
  { title: '节点4-3', id: '43', parentId: '4' },
  { title: '节点4-3-1', id: '431', parentId: '43' },
  { title: '节点4-3-2', id: '432', parentId: '43' },
  { title: '节点5', id: '5', parentId: null }
])
</script>
