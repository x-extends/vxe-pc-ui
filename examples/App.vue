<template>
  <vxe-layout-container vertical>
    <vxe-layout-header>
      <vxe-button @click="collapsed = !collapsed">折叠</vxe-button>
      <vxe-switch v-model="theme" close-value="default" open-value="dark" @click="changeTheme">主题切换</vxe-switch>
      <vxe-radio-group v-model="language" :options="langOptions" @change="changeLanguage"></vxe-radio-group>
    </vxe-layout-header>
    <vxe-layout-container>
      <vxe-layout-aside class="page-layout-aside" :collapsed="collapsed">
        <VxeMenu :options="navList" />
      </vxe-layout-aside>
      <vxe-layout-container vertical>
        <vxe-layout-body padding>
          <RouterView />
        </vxe-layout-body>
        <vxe-layout-footer fixed>11111</vxe-layout-footer>
      </vxe-layout-container>
    </vxe-layout-container>
  </vxe-layout-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeUI } from '../packages'

const collapsed = ref(false)

const navList = ref([
  { name: 'Home', icon: 'vxe-icon-user-fill', routerLink: { path: '/' } },
  { name: 'TagTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'TagTest' } },
  { name: 'TextTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'TextTest' } },
  {
    title: 'xx',
    icon: 'vxe-icon-user-fill',
    children: [
      { name: 'ContainerTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'ContainerTest' } },
      { name: 'LayoutTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'LayoutTest' } },
      { name: 'MenuTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'MenuTest' } },
      { name: 'BreadcrumbTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'BreadcrumbTest' } },
      { name: 'LinkTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'LinkTest' } },
      { name: 'TipsTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'TipsTest' } },
      { name: 'AlertTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'AlertTest' } },
      { name: 'ButtonTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'ButtonTest' } },
      { name: 'AnchorTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'AnchorTest' } },
      { name: 'LoadingTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'LoadingTest' } },
      { name: 'TooltipTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'TooltipTest' } },
      { name: 'IconTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'IconTest' } }
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
  { name: 'NumberInputTest', routerLink: { name: 'NumberInputTest' } },
  { name: 'PasswordInputTest', routerLink: { name: 'PasswordInputTest' } },
  { name: 'DatePickerTest', routerLink: { name: 'DatePickerTest' } },
  { name: 'TextareaTest', routerLink: { name: 'TextareaTest' } },
  { name: 'SwitchTest', routerLink: { name: 'SwitchTest' } },
  { name: 'SelectTest', routerLink: { name: 'SelectTest' } },
  { name: 'PulldownTest', routerLink: { name: 'PulldownTest' } },
  { name: 'CheckboxTest', routerLink: { name: 'CheckboxTest' } },
  { name: 'RadioTest', routerLink: { name: 'RadioTest' } },
  { name: 'PagerTest', routerLink: { name: 'PagerTest' } },
  { name: 'PrintTest', routerLink: { name: 'PrintTest' } },
  { name: 'UploadTest', routerLink: { name: 'UploadTest' } },
  { name: 'ImageTest', routerLink: { name: 'ImageTest' } },
  { name: 'TreeTest', routerLink: { name: 'TreeTest' } },
  { name: 'CardTest', routerLink: { name: 'CardTest' } }
])

const theme = ref((localStorage.getItem('VXE_THEME') as 'default' | 'dark') || 'default')
VxeUI.setTheme(theme.value)
const changeTheme = () => {
  const themeName = VxeUI.getTheme() === 'dark' ? 'default' : 'dark'
  theme.value = themeName
  VxeUI.setTheme(themeName)
  localStorage.setItem('VXE_THEME', themeName)
}

const language = ref((localStorage.getItem('VXE_LANGUAGE') as 'zh-CN' | 'en-US') || 'zh-CN')
const langOptions = ref([
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: '英文' }
])
const changeLanguage = () => {
  VxeUI.setLanguage(language.value)
  localStorage.setItem('VXE_LANGUAGE', language.value)
}
</script>

<style lang="scss" scoped>
.nav {
  display: block;
}
.page-layout-aside {
  overflow-y: scroll;
}
</style>
