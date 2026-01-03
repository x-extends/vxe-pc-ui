<template>
  <div>
    <div>
      <vxe-segmented v-model="val1" :options="optList"></vxe-segmented>
      <vxe-segmented v-model="val2" :options="optList" status="primary"></vxe-segmented>
      <vxe-segmented v-model="val3" :options="optList" status="success"></vxe-segmented>
      <vxe-segmented v-model="val4" :options="optList" status="info"></vxe-segmented>
      <vxe-segmented v-model="val5" :options="optList" status="warning"></vxe-segmented>
      <vxe-segmented v-model="val6" :options="optList" status="error"></vxe-segmented>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref('1')
const val2 = ref('2')
const val3 = ref('3')
const val4 = ref('4')
const val5 = ref('5')
const val6 = ref('6')
const optList = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' },
  { label: '选项6', value: '6' },
  { label: '选项7', value: '7' }
]
</script>
