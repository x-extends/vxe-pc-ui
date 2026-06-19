<template>
  <div>
    <vxe-cascader v-model="val1" :options="treeList" filterable clearable></vxe-cascader>
    <vxe-cascader v-model="val2" :options="treeList" :popup-config="{transfer: true}" multiple clearable></vxe-cascader>

    <vxe-cascader v-model="val3" v-bind="cascaderOptions3"></vxe-cascader>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeCascaderProps } from '../../../types'

interface NodeVO {
  label: string
  value: string
  children?: NodeVO[]
}

const val1 = ref('331')
const val2 = ref(['331'])

const treeList = ref<NodeVO[]>([
  { label: '节点2', value: '2' },
  {
    label: '节点3',
    value: '3',
    children: [
      { label: '节点3-1', value: '31' },
      { label: '节点3-2', value: '32' },
      {
        label: '节点3-3',
        value: '33',
        children: [
          { label: '节点3-3-1', value: '331' },
          { label: '节点3-3-2', value: '332' },
          { label: '节点3-3-3', value: '333' }
        ]
      },
      { label: '节点3-4', value: '34' }
    ]
  },
  {
    label: '节点4',
    value: '4',
    children: [
      { label: '节点4-1', value: '41' },
      { label: '节点4-2', value: '42' },
      {
        label: '节点4-3',
        value: '43',
        children: [
          { label: '节点4-3-1', value: '431' },
          { label: '节点4-3-2', value: '432' }
        ]
      }
    ]
  },
  { label: '节点5', value: '5' }
])

const val3 = ref()
const cascaderOptions3 = reactive<VxeCascaderProps>({
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
</script>
