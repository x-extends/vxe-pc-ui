<template>
  <vxe-layout-container vertical>
    <vxe-layout-header @click="collapsed = !collapsed">22222222</vxe-layout-header>
    <vxe-layout-container>
      <vxe-layout-aside class="page-layout-aside" :collapsed="collapsed">
        <VxeMenu :options="navList" />
      </vxe-layout-aside>
      <vxe-layout-container vertical>
        <vxe-layout-body>
          <RouterView />
        </vxe-layout-body>
        <vxe-layout-footer fixed>11111</vxe-layout-footer>
      </vxe-layout-container>
    </vxe-layout-container>
  </vxe-layout-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const collapsed = ref(false)

const navList = ref([
  { name: 'Home', icon: 'vxe-icon-user-fill', routerLink: { path: '/' } },
  {
    title: 'xx',
    icon: 'vxe-icon-user-fill',
    children: [
      { name: 'ContainerTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'ContainerTest' } },
      { name: 'LayoutTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'LayoutTest' } },
      {
        name: 'MenuTest',
        routerLink: { name: 'MenuTest' },
        icon: 'vxe-icon-user-fill',
        children: [
          { name: 'BreadcrumbTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'BreadcrumbTest' } },
          {
            name: 'ButtonTest',
            icon: 'vxe-icon-user-fill',
            routerLink: { name: 'ButtonTest' },
            children: [
              { name: 'AnchorTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'AnchorTest' } },
              { name: 'LoadingTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'LoadingTest' } },
              { name: 'TooltipTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'TooltipTest' } }
            ]
          },
          { name: 'IconTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'IconTest' } }
        ]
      }
    ]
  },
  { name: 'FormTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'FormTest' } },
  { name: 'ListDesignTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'ListDesignTest' } },
  { name: 'FormDesignTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'FormDesignTest' } },
  { name: 'ModalTest', routerLink: { name: 'ModalTest' } },
  { name: 'DrawerTest', routerLink: { name: 'DrawerTest' } },
  { name: 'TabsTest', routerLink: { name: 'TabsTest' } },
  { name: 'ListTest', routerLink: { name: 'ListTest' } },
  { name: 'InputTest', routerLink: { name: 'InputTest' } },
  { name: 'TextareaTest', routerLink: { name: 'TextareaTest' } },
  { name: 'SwitchTest', routerLink: { name: 'SwitchTest' } },
  { name: 'SelectTest', routerLink: { name: 'SelectTest' } },
  { name: 'PulldownTest', routerLink: { name: 'PulldownTest' } },
  { name: 'CheckboxTest', routerLink: { name: 'CheckboxTest' } },
  { name: 'RadioTest', routerLink: { name: 'RadioTest' } },
  { name: 'PagerTest', routerLink: { name: 'PagerTest' } },
  { name: 'PrintTest', routerLink: { name: 'PrintTest' } }
])
</script>

<style lang="scss" scoped>
.nav {
  display: block;
}
.page-layout-aside {
  overflow-y: scroll;
}
</style>
