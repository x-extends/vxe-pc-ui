<template>
  <div>
    <p style="position: relative;height: 100px;">
      <vxe-loading v-model="val"></vxe-loading>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val = ref(false)
</script>
