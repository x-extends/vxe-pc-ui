<template>
  <div>
    <vxe-date-range-picker v-model="val1" linkedPanels></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val2" default-date="2024-09-01" :auto-close="false"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val3" default-time="10:10:30"></vxe-date-range-picker>

    <vxe-date-range-picker v-model="val3" type="date"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val4" type="time"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val5" type="datetime"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val6" type="week"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val7" type="month"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val8" type="quarter"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val9" type="year"></vxe-date-range-picker>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref('2025-01-01,2025-02-03')
const val2 = ref()
const val3 = ref()
const val4 = ref()
const val5 = ref()
const val6 = ref()
const val7 = ref()
const val8 = ref()
const val9 = ref()
</script>
