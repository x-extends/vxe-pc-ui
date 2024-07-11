<template>
  <div>
    <vxe-tree-select v-model="val1" :options="treeList1"></vxe-tree-select>
    <vxe-tree-select v-model="val2" :options="treeList1" multiple></vxe-tree-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref()
const val2 = ref([])
const treeList1 = ref([
  { label: '==22', value: 22 },
  {
    label: '=333',
    value: 333,
    children: [
      { label: '345', value: 345 },
      { label: '456', value: 456 },
      {
        label: '6788',
        value: 6788,
        children: [
          { label: '4324', value: 4324 },
          { label: '==9808900', value: 9808900 }
        ]
      }
    ]
  },
  { label: '============21343', value: 21343 },
  {
    label: '==567',
    value: 567,
    children: [
      { label: '=========67867', value: 67867 },
      { label: '789789', value: 789789 },
      {
        label: '======890980890',
        value: 890980890,
        children: [
          { label: '==435435', value: 435435 },
          { label: '56765', value: 56765 }
        ]
      }
    ]
  },
  { label: '=10567', value: 10567 },
  { label: '==8003425', value: 8003425 }
])
</script>
