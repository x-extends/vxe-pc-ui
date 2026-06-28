<template>
  <div>
    <vxe-transfer v-model="selectVal1" :options="options1"></vxe-transfer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selectVal1 = ref([])
const options1 = ref([
  { value: 11, label: '111' },
  { value: 22, label: '131' },
  { value: 33, label: '561' },
  { value: 44, label: '467' }
])
</script>
