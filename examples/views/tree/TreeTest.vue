<template>
  <div>
    <p>
      <vxe-tree :data="treeList1" :checkbox-config="{checkStrictly: true}" show-checkbox show-radio></vxe-tree>
    </p>
    <p>
      <vxe-tree :data="treeList2" trigger="row" v-model:checkbox-check-row-keys="checkboxCheckRowKeys" v-model:radio-check-row-key="checkboxCheckRowKey" checkStrictly is-hover is-current show-checkbox show-radio show-line></vxe-tree>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const treeList1 = ref([
  { title: '22' },
  {
    title: '333',
    children: [
      { title: '345' },
      { title: '456' },
      {
        title: '6788',
        children: [
          { title: '4324' },
          { title: '9808900' }
        ]
      }
    ]
  },
  { title: '21343' },
  {
    title: '567',
    children: [
      { title: '67867' },
      { title: '789789' },
      {
        title: '890980890',
        children: [
          { title: '435435' },
          { title: '56765' }
        ]
      }
    ]
  },
  { title: '10567' },
  { title: '8003425' }
])

const treeList2 = ref([
  { title: '22' },
  {
    title: '333',
    children: [
      { title: '345' },
      { title: '456' },
      {
        title: '6788',
        children: [
          { title: '4324' },
          { title: '9808900' }
        ]
      }
    ]
  },
  { title: '21343' },
  {
    title: '567',
    children: [
      { title: '67867' },
      { title: '789789' },
      {
        title: '890980890',
        children: [
          { title: '435435' },
          { title: '56765' }
        ]
      }
    ]
  },
  { title: '10567' },
  { title: '8003425' }
])

const checkboxCheckRowKey = ref()
const checkboxCheckRowKeys = ref([])
</script>
