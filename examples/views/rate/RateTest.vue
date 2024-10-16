<template>
  <div>
    <vxe-rate v-model="val1"></vxe-rate>
    <vxe-rate v-model="val2"></vxe-rate>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(0)
const val2 = ref(3)
</script>
