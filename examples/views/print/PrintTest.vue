<template>
  <div>
    <vxe-button @click="printEvent1">打印</vxe-button>
    <vxe-print ref="printRef">
      <div>234234</div>
    </vxe-print>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxePrintInstance } from '../../../types'

const printRef = ref<VxePrintInstance>()

const printEvent1 = () => {
  const $print = printRef.value
  if ($print) {
    $print.print()
  }
}
</script>
