<template>
  <div>
    <div>{{ val1 }}</div>
    <vxe-slider v-model="val1"></vxe-slider>
    <div>{{ val3 }}</div>
    <vxe-slider v-model="val3" min="20" max="180" immediate></vxe-slider>
    <div>{{ val2 }}</div>
    <vxe-slider v-model="val2" range></vxe-slider>
    <vxe-slider v-model="val4" readonly></vxe-slider>
    <vxe-slider v-model="val5" disabled></vxe-slider>
    <div>{{ val6 }}</div>
    <vxe-slider v-model="val6" range immediate></vxe-slider>
    <div>{{ startVal7 }}，{{ endVal7 }}</div>
    <vxe-slider v-model:startValue="startVal7" v-model:endValue="endVal7" range immediate></vxe-slider>
    <div>{{ startVal8 }}，{{ endVal8 }}</div>
    <vxe-slider v-model:startValue="startVal8" v-model:endValue="endVal8" range immediate></vxe-slider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(40)
const val2 = ref([30, 60])
const val3 = ref(50)
const val4 = ref(40)
const val5 = ref(40)
const val6 = ref()
const startVal7 = ref(10)
const endVal7 = ref(20)
const startVal8 = ref()
const endVal8 = ref()
</script>
