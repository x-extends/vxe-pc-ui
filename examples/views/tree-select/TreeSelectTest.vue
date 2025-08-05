<template>
  <div>
    <vxe-tree-select
      style="width: 100%"
      v-model="value"
      :options="test"
      clearable
      :tree-config="{
        titleField: 'label',
        childrenField: 'children',
        valueField: 'value',
      }"
      :option-props="{ label: 'label', value: 'value' }"
    >
    </vxe-tree-select>
    value:{{ value }}
    <br />
    如果值value包含中文，则展示的label存在问题，如果不含中文则正常
  </div>
</template>

<script setup>
import { ref } from 'vue'
const test = ref([
  { id: '1754382989103', label: '新节点1754382989103', value: '测试666' },
  { id: '1754382989104', label: '新节点1754382989104', value: 'test666' }
])
const value = ref()
</script>
