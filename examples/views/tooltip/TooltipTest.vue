<template>
  <div>
    <p>
      <vxe-tooltip content="我是提示内容">
        <a class="link">文字提示</a>
      </vxe-tooltip>
    </p>

    <p>
      <vxe-tooltip content="除了点击之外不会自动消息" trigger="click">
        <vxe-button>点击触发</vxe-button>
      </vxe-tooltip>
      <vxe-tooltip content="hover 提示内容">
        <vxe-button>Hover 触发</vxe-button>
      </vxe-tooltip>
      <vxe-tooltip content="鼠标可以进入到 tooltip 中" enterable>
        <vxe-button>设置 Enterable</vxe-button>
      </vxe-tooltip>
    </p>

    <p>
      <vxe-tooltip v-model="demo1.value1" content="自定义提示内容" trigger="manual">
        <vxe-button @mouseenter="demo1.value1 = true" @mouseleave="demo1.value1 = false">手动模式</vxe-button>
      </vxe-tooltip>
      <vxe-tooltip v-model="demo1.value2" content="自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容自定义提示内容" trigger="manual" theme="light">
        <vxe-button @mouseenter="demo1.value2 = true" @mouseleave="demo1.value2 = false">手动模式</vxe-button>
      </vxe-tooltip>
      <vxe-tooltip v-model="demo1.value3" content="自定义提示内容" trigger="manual" theme="light">
        <vxe-button @mouseenter="demo1.value3 = true" @mouseleave="demo1.value3 = false">手动模式手动模式手动模式手动模式手动模式手动模式</vxe-button>
      </vxe-tooltip>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  value1: false,
  value2: false,
  value3: false
})
</script>
