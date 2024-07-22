<template>
  <div>
    <p>
      <vxe-image src="https://vxeui.com/resource/img/fj577.jpg" :width="200"></vxe-image>
    </p>
    <p>
      <vxe-image :src="img1List" :width="200"></vxe-image>
    </p>
    <!-- <p>
      <vxe-image :src="img2List" :width="200"></vxe-image>
    </p> -->
    <p>
      <vxe-image-group :url-list="img1List" :image-style="{width: 200}"></vxe-image-group>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const img1List = ref([
  'https://vxeui.com/resource/img/fj577.jpg',
  'https://vxeui.com/resource/img/fj581.jpeg',
  'https://vxeui.com/resource/img/fj573.jpeg',
  'https://vxeui.com/resource/img/fj562.png'
])

// const img2List = ref([
//   { name: 'fj577.jpg', url: 'https://vxeui.com/resource/img/fj577.jpg' },
//   { name: 'fj581.jpeg', url: 'https://vxeui.com/resource/img/fj581.jpeg' },
//   { name: 'fj573.jpeg', url: 'https://vxeui.com/resource/img/fj573.jpeg' },
//   { name: 'fj562.png', url: 'https://vxeui.com/resource/img/fj562.png' }
// ])
</script>
