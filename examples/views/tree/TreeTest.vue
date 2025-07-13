<template>
  <div>
    <p>
      <vxe-tree expand-all :data="treeList1" :checkbox-config="{checkStrictly: true}" show-checkbox show-radio></vxe-tree>
    </p>
    <p>
      <vxe-tree   :loading="loading" :data="treeList2" trigger="node" v-model:checkbox-check-row-keys="checkboxCheckRowKeys" v-model:radio-check-row-key="checkboxCheckRowKey" checkStrictly is-hover is-current show-checkbox show-radio show-line></vxe-tree>
    </p>
    <p>
      <vxe-tree
      is-hover
      lazy
      show-checkbox
      show-line
      has-child-field="hasChild"
      :load-method="loadMethod"
      :data="treeList">
    </vxe-tree>
    </p>

    <vxe-tree v-bind="treeOptions2"></vxe-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { VxeTreePropTypes } from '../../../types'

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
      {
        title: '890890',
        children: [
          { title: '3242432' },
          { title: '456577' }
        ]
      },
      { title: '456' },
      {
        title: '45667',
        children: [
          { title: '768768' },
          { title: '879797987' }
        ]
      },
      {
        title: '6788',
        children: [
          { title: '4324' },
          { title: '9808900' },
          {
            title: '678456',
            children: [
              { title: '3245234' },
              { title: '123' }
            ]
          }
        ]
      }
    ]
  },
  { title: '21343' },
  {
    title: '567',
    children: [
      { title: '67867' },
      {
        title: '0980',
        children: [
          { title: '126567' },
          {
            title: '678345',
            children: [
              { title: '67677' },
              { title: '234' }
            ]
          },
          { title: '32477' },
          {
            title: '8970876',
            children: [
              { title: '456' },
              { title: '324234' }
            ]
          }
        ]
      },
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

const treeOptions2 = reactive({
  transform: true,
  height: 200,
  virtualYConfig: {
    gt: 0
  },
  data: [
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
  ]
})

const treeList = ref<any[]>([
  { title: '节点2', id: '2', hasChild: true },
  { title: '节点3', id: '3', hasChild: true },
  { title: '节点4', id: '4', hasChild: true },
  { title: '节点5', id: '5', hasChild: false }
])

const getNodeListApi = (node: any) => {
  return new Promise<any[]>(resolve => {
    // 模拟后端接口
    setTimeout(() => {
      resolve([
        { title: `${node.title}-1`, id: `${node.id}1`, hasChild: Math.random() * 10 < 6 },
        { title: `${node.title}-2`, id: `${node.id}2`, hasChild: Math.random() * 10 < 6 }
      ])
    }, 500)
  })
}

const loadMethod: VxeTreePropTypes.LoadMethod<any> = ({ node }) => {
  return getNodeListApi(node)
}

const checkboxCheckRowKey = ref()
const checkboxCheckRowKeys = ref([])

const loading = ref(true)
setTimeout(() => {
  loading.value = false
}, 3000)
</script>
