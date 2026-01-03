<template>
  <div>
    <div>
      <vxe-cascader v-model="val1" :options="treeList1"></vxe-cascader>
      <vxe-cascader v-model="val2" :options="treeList1" multiple></vxe-cascader>
    </div>

    <div>
      <vxe-cascader v-model="val3" :options="treeList2" :option-props="{label: 'title', value: 'id'}" :tree-config="treeConfig" filterable showCheckedButoon showClearButton showExpandButton></vxe-cascader>
      <vxe-cascader v-model="val4" :options="treeList2" :option-props="{label: 'title', value: 'id'}" :tree-config="treeConfig" multiple filterable showCheckedButoon showClearButton showExpandButton></vxe-cascader>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeCascaderPropTypes } from '../../../types'

export default Vue.extend({
  data () {
    const val3 = null
    const val4: any[] = []

    const treeConfig: VxeCascaderPropTypes.TreeConfig = {
      transform: true,
      keyField: 'id',
      parentField: 'parentId'
    }

    const treeList2 = [
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

    return {
      val1: null,
      val2: [],
      treeList1: [
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
      ],
      val3,
      val4,
      treeConfig,
      treeList2
    }
  }
})
</script>
