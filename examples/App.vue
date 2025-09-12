<template>
  <vxe-layout-container :size="componentsSize" vertical>
    <vxe-layout-header>
      <vxe-button @click="collapsed = !collapsed">折叠</vxe-button>
      <vxe-switch v-model="theme" close-value="light" open-value="dark" @change="changeTheme">主题切换</vxe-switch>
      <vxe-radio-group v-model="language" :options="langOptions" @change="changeLanguage"></vxe-radio-group>
      <vxe-radio-group class="switch-size" v-model="componentsSize" :options="sizeOptions" type="button" size="mini"></vxe-radio-group>
      <vxe-button @click="showLoading">loading</vxe-button>
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

<script lang="ts">
import Vue from 'vue'
import { VxeUI } from '../packages'

const theme = (localStorage.getItem('VXE_THEME') as 'light' | 'dark') || 'light'
VxeUI.setTheme(theme)

const language = (localStorage.getItem('VXE_LANGUAGE') as 'zh-CN' | 'en-US') || 'zh-CN'

export default Vue.extend({
  data () {
    return {
      collapsed: false,
      theme,
      componentsSize: '',
      sizeOptions: [
        { label: '默认', value: '' },
        { label: '中', value: 'medium' },
        { label: '小', value: 'small' },
        { label: '迷你', value: 'mini' }
      ],
      language,
      langOptions: [
        { value: 'zh-CN', label: '中文' },
        { value: 'en-US', label: '英文' }
      ],
      navList: [
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
            { name: 'IconTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'IconTest' } },
            { name: 'IconPickerTest', icon: 'vxe-icon-user-fill', routerLink: { name: 'IconPickerTest' } }
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
        { name: 'DatePanelTest', routerLink: { name: 'DatePanelTest' } },
        { name: 'DatePickerTest', routerLink: { name: 'DatePickerTest' } },
        { name: 'DateRangePickerTest', routerLink: { name: 'DateRangePickerTest' } },
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
        { name: 'CardTest', routerLink: { name: 'CardTest' } },
        { name: 'TreeSelectTest', routerLink: { name: 'TreeSelectTest' } },
        { name: 'CarouselTest', routerLink: { name: 'CarouselTest' } },
        { name: 'CalendarTest', routerLink: { name: 'CalendarTest' } },
        { name: 'CountdownTest', routerLink: { name: 'CountdownTest' } },
        { name: 'NoticeBarTest', routerLink: { name: 'NoticeBarTest' } },
        { name: 'CollapseTest', routerLink: { name: 'CollapseTest' } },
        { name: 'TextEllipsisTest', routerLink: { name: 'TextEllipsisTest' } },
        { name: 'EmptyTest', routerLink: { name: 'EmptyTest' } },
        { name: 'ResultTest', routerLink: { name: 'ResultTest' } },
        { name: 'WatermarkTest', routerLink: { name: 'WatermarkTest' } },
        { name: 'BadgeTest', routerLink: { name: 'BadgeTest' } },
        { name: 'AvatarTest', routerLink: { name: 'AvatarTest' } },
        { name: 'SliderTest', routerLink: { name: 'SliderTest' } },
        { name: 'RateTest', routerLink: { name: 'RateTest' } },
        { name: 'TableSelect', routerLink: { name: 'TableSelect' } },
        { name: 'ColorPickerTest', routerLink: { name: 'ColorPickerTest' } },
        { name: 'SplitTest', routerLink: { name: 'SplitTest' } }
      ]
    }
  },
  methods: {
    changeTheme () {
      const themeName = VxeUI.getTheme() === 'dark' ? 'light' : 'dark'
      this.theme = themeName
      VxeUI.setTheme(themeName)
      localStorage.setItem('VXE_THEME', themeName)
    },
    changeLanguage () {
      VxeUI.setLanguage(this.language)
      localStorage.setItem('VXE_LANGUAGE', this.language)
    },
    showLoading () {
      VxeUI.loading.open()
    }
  }
})
</script>

<style lang="scss" scoped>
.nav {
  display: block;
}
.page-layout-aside {
  ::v-deep(.vxe-layout-aside--inner) {
    overflow-y: scroll;
  }
}
</style>
