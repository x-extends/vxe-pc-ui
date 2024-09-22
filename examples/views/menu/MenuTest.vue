<template>
  <div>
    <vxe-button @click="isCollapsed = !isCollapsed">切换</vxe-button>
    <div style="display: inline-flex;">
      <vxe-menu v-model="selectNav" :collapsed="isCollapsed" :options="navList" @click="clickEvent"></vxe-menu>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      selectNav: 'user',
      isCollapsed: false,
      navList: [
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
      ]
    }
  },
  methods: {
    clickEvent ({ menu }: any) {
      console.log(menu.name)
    }
  }
})
</script>
