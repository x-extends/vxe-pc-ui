<template>
  <div>
    <vxe-button @click="isCollapsed = !isCollapsed">切换</vxe-button>
    <div style="display: inline-flex;">
      <vxe-menu v-model="selectNav" :collapsed="isCollapsed" :options="navList" @click="clickEvent"></vxe-menu>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeMenuPropTypes, VxeMenuEvents } from '../../../types'

const selectNav = ref('user')
const isCollapsed = ref(false)
const navList = ref<VxeMenuPropTypes.Options>([
  { name: 'home', title: '首页', icon: 'vxe-icon-home' },
  {
    name: 'user',
    title: '个人中心',
    icon: 'vxe-icon-user',
    children: [
      { name: 'changePassword', icon: 'vxe-icon-lock', title: '修改密码' }
    ]
  },
  {
    name: 'system',
    title: '系统设置',
    icon: 'vxe-icon-setting',
    children: [
      { name: 'menu', icon: 'vxe-icon-menu', title: '菜单配置' },
      { name: 'permission', icon: 'vxe-icon-user', title: '权限配置' }
    ]
  }
])

const clickEvent: VxeMenuEvents.Click = ({ menu }) => {
  console.log(menu.name)
}
</script>
