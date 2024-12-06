<template>
  <div>
    <p>
      <vxe-button content="左侧打开" @click="demo1.value1 = true"></vxe-button>
      <vxe-drawer v-model="demo1.value1" position="left" resize>
        <template #default>
          <div>默认尺寸</div>
          <div>xxxxxxxxx</div>
          <div>xxxxxxxxxx</div>
        </template>
      </vxe-drawer>

      <vxe-button content="右侧打开" @click="demo1.value2 = true"></vxe-button>
      <vxe-drawer v-model="demo1.value2" position="right" resize>
        <template #default>
          <div>默认尺寸</div>
          <div>xxxxxxxxx</div>
          <div>xxxxxxxxxx</div>
        </template>
      </vxe-drawer>

      <vxe-button content="顶部打开" @click="demo1.value3 = true"></vxe-button>
      <vxe-drawer v-model="demo1.value3" position="top" resize>
        <template #default>
          <div>默认尺寸</div>
          <div>xxxxxxxxx</div>
          <div>xxxxxxxxxx</div>
        </template>
      </vxe-drawer>

      <vxe-button content="底部打开" @click="demo1.value4 = true"></vxe-button>
      <vxe-drawer v-model="demo1.value4" position="bottom" resize>
        <template #default>
          <div>默认尺寸</div>
          <div>xxxxxxxxx</div>
          <div>xxxxxxxxxx</div>
        </template>
      </vxe-drawer>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      demo1: {
        value1: false,
        value2: false,
        value3: false,
        value4: false
      }
    }
  }
})
</script>
