<template>
  <div>
    <vxe-slider v-model="val1"></vxe-slider>
    <vxe-slider v-model="val3" min="20" max="180"></vxe-slider>
    <vxe-slider v-model="val2" range></vxe-slider>
    <vxe-slider v-model="val4" readonly></vxe-slider>
    <vxe-slider v-model="val5" disabled></vxe-slider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(40)
const val2 = ref([30, 60])
const val3 = ref(50)
const val4 = ref(40)
const val5 = ref(40)
</script>
