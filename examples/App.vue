<template>
  <vxe-layout-container vertical>
    <vxe-layout-header @click="collapsed = !collapsed">22222222</vxe-layout-header>
    <vxe-layout-container>
      <vxe-layout-aside :collapsed="collapsed">
        <RouterLink class="nav" to="/">首页</RouterLink>
        <RouterLink v-for="(item, index) in navList" class="nav" :key="index" :to="{name: item.name}">{{ item.name }}</RouterLink>
      </vxe-layout-aside>
      <vxe-layout-container vertical>
        <vxe-layout-body>
          <RouterView />
        </vxe-layout-body>
        <vxe-layout-footer fixed>11111</vxe-layout-footer>
      </vxe-layout-container>
    </vxe-layout-container>
  </vxe-layout-container>
  <!-- <vxe-layout-container>
    <vxe-layout-aside width="200px">
        <div style="height: 300px;">111</div>
        <div style="height: 300px;">111</div>
        <div style="height: 300px;">111</div>
        <div style="height: 300px;">111</div>
        <div style="height: 300px;">111</div>
      </vxe-layout-aside>
    <vxe-layout-container vertical>
      <vxe-layout-header fixed>22222222</vxe-layout-header>
      <vxe-layout-body>
        <RouterView />
      </vxe-layout-body>
      <vxe-layout-footer fixed>11111</vxe-layout-footer>
    </vxe-layout-container>
  </vxe-layout-container> -->
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const collapsed = ref(false)

const navList = ref([
  { name: 'ContainerTest' },
  { name: 'LayoutTest' },
  { name: 'IconTest' },
  { name: 'ButtonTest' },
  { name: 'AnchorTest' }
])
</script>

<style lang="scss" scoped>
.nav {
  display: block;
}
.vxe-layout-body {
  padding: 16px;
}
</style>
