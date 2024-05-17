<template>
  <div>
    <vxe-form-design :height="600" :widgets="widgets"></vxe-form-design>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const widgets = ref([
  // {
  //   title: '布局控件',
  //   children: [
  //     'input'
  //   ]
  // },
  // {
  //   title: '基础控件',
  //   children: [
  //     'textarea'
  //   ]
  // }
])
</script>
