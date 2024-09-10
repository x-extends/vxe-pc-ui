<template>
  <div>
    <p>
      <vxe-icon-picker v-model="demo1.val1"></vxe-icon-picker>
      <vxe-icon-picker v-model="demo1.val2" clearable transfer></vxe-icon-picker>
    </p>
    <p>
      <vxe-icon-picker v-model="demo1.val2" readonly></vxe-icon-picker>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  val1: '',
  val2: '',
  val3: 'vxe-icon-print'
})
</script>
