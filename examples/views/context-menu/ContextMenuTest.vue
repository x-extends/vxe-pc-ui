<template>
  <div>
    <vxe-button @click="showMenuEvent">显示</vxe-button>
    <vxe-context-menu v-model="showMenu" v-bind="contextMenuOptions"></vxe-context-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    const showMenu = false

    const contextMenuOptions = {
      x: 0,
      y: 0,
      options: [
        [
          { code: '11', name: '新增' },
          { code: '22', name: '删除', prefixIcon: 'vxe-icon-delete-fill' },
          {
            code: '33',
            name: '审批',
            children: [
              { code: '44', name: '通过', prefixIcon: 'vxe-icon-check' },
              { code: '55', name: '不通过', prefixIcon: 'vxe-icon-close' }
            ]
          },
          { code: '66', name: '查看', prefixIcon: 'vxe-icon-link' }
        ],
        [
          {
            code: '111',
            name: '更多操作',
            children: [
              { code: '113', name: '编辑', prefixIcon: 'vxe-icon-feedback' },
              { code: '114', name: '取消' }
            ]
          },
          { code: '110', name: '驳回', prefixIcon: 'vxe-icon-undo' }
        ]
      ]
    }

    return {
      showMenu,
      contextMenuOptions
    }
  },
  methods: {
    showMenuEvent ({ $event }: any) {
      this.showMenu = true
      this.contextMenuOptions.x = $event.clientX
      this.contextMenuOptions.y = $event.clientY
    }
  }
})
</script>
