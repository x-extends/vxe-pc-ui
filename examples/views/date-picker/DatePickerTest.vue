<template>
  <div>
    <vxe-date-picker v-model="val1" placeholder="可选日期限制" start-date="2000-01-01" end-date="2040-01-01"></vxe-date-picker>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref('')
</script>
