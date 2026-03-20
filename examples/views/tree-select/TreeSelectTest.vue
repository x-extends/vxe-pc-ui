<template>
  <div>
    <vxe-tree-select v-model="val1" v-bind="treeSelectOptions1"></vxe-tree-select>

    <vxe-tree-select v-model="val2" v-bind="treeSelectOptions2"></vxe-tree-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeTreeSelectProps } from 'vxe-pc-ui'

interface NodeVO {
  name: string
  id: string
  parentId?: string | null
}

const val1 = ref()
const treeSelectOptions1 = reactive({
  multiple: true,
  filterable: true,
  optionProps: {
    label: 'title',
    value: 'id'
  },
  treeConfig: {
    transform: true,
    keyField: 'id',
    parentField: 'parentId'
  },
  options: [
    { title: 'Node22', id: '2', parentId: null },
    { title: 'Node23', id: '3', parentId: null },
    { title: 'Node23-1', id: '31', parentId: '3' },
    { title: 'Node23-2', id: '32', parentId: '3' },
    { title: 'Node23-2-1', id: '321', parentId: '32' },
    { title: 'Node23-2-2', id: '322', parentId: '32' },
    { title: 'Node23-3', id: '33', parentId: '3' },
    { title: 'Node23-3-1', id: '331', parentId: '33' },
    { title: 'Node23-3-2', id: '332', parentId: '33' },
    { title: 'Node23-3-3', id: '333', parentId: '33' },
    { title: 'Node23-4', id: '34', parentId: '3' },
    { title: '节点4', id: '4', parentId: null },
    { title: '节点4-1', id: '41', parentId: '4' },
    { title: '节点4-1-1', id: '411', parentId: '42' },
    { title: '节点4-1-2', id: '412', parentId: '42' },
    { title: '节点4-2', id: '42', parentId: '4' },
    { title: '节点4-3', id: '43', parentId: '4' },
    { title: '节点4-3-1', id: '431', parentId: '43' },
    { title: '节点4-3-2', id: '432', parentId: '43' },
    { title: '节点5', id: '5', parentId: null }
  ]
})

const val2 = ref()
const treeSelectOptions2 = reactive<VxeTreeSelectProps<NodeVO>>({
  multiple: true,
  filterable: true,
  showTotalButoon: true,
  showCheckedButoon: true,
  showClearButton: true,
  showExpandButton: true,
  optionProps: {
    label: 'name',
    value: 'id'
  },
  treeConfig: {
    transform: true,
    keyField: 'id',
    parentField: 'parentId',
    checkboxConfig: {
      showIcon: true
    }
  },
  options: []
})

const loadList = () => {
  treeSelectOptions2.loading = true
  fetch('https://vxeui.com/resource/json/provinces_list.json').then(res => res.json()).then((data: NodeVO[]) => {
    treeSelectOptions2.loading = false
    treeSelectOptions2.options = data
  })
}

loadList()
</script>
