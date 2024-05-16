<template>
  <div>
    <p>
      <vxe-switch v-model="demo1.value1"></vxe-switch>
      <vxe-switch v-model="demo1.value2" size="medium"></vxe-switch>
      <vxe-switch v-model="demo1.value3" size="small"></vxe-switch>
      <vxe-switch v-model="demo1.value4" size="mini"></vxe-switch>
    </p>

    <p>
      <vxe-switch v-model="demo1.value5" open-label="是" close-label="否"></vxe-switch>
      <vxe-switch v-model="demo1.value6" size="medium" open-label="是" close-label="否"></vxe-switch>
      <vxe-switch v-model="demo1.value7" size="small" open-label="开" close-label="关"></vxe-switch>
      <vxe-switch v-model="demo1.value8" size="mini" open-label="开" close-label="关"></vxe-switch>
    </p>

    <p>
      <vxe-switch v-model="demo1.value9" open-label="开" open-value="Y" close-label="关" close-value="N"></vxe-switch>
      <vxe-switch v-model="demo1.value10" open-label="打开" :open-value="1" close-label="关闭" :close-value="0"></vxe-switch>
      <vxe-switch v-model="demo1.value11" disabled></vxe-switch>
      <vxe-switch v-model="demo1.value12" open-label="是" close-label="否" disabled></vxe-switch>
      <vxe-switch v-model="demo1.value11" open-active-icon="vxe-icon-lock-fill" close-active-icon="vxe-icon-unlock-fill"></vxe-switch>
      <vxe-switch v-model="demo1.value12" open-active-icon="vxe-icon-lock-fill" close-active-icon="vxe-icon-unlock-fill" open-label="是" close-label="否"></vxe-switch>
    </p>

    <p>
      <vxe-switch v-model="demo1.value13" open-icon="fa fa-check" close-icon="fa fa-close"></vxe-switch>
      <vxe-switch v-model="demo1.value14" open-label="app.body.label.on" close-label="app.body.label.off" open-icon="fa fa-bell" close-icon="fa fa-bell-slash"></vxe-switch>
      <vxe-switch v-model="demo1.value15" open-label="app.body.label.on" close-label="app.body.label.off" class="my-switch1"></vxe-switch>
      <vxe-switch v-model="demo1.value16" open-label="app.body.label.on" close-label="app.body.label.off" class="my-switch2"></vxe-switch>
      <vxe-switch v-model="demo1.value17" open-label="ON" close-label="OFF" class="my-switch3"></vxe-switch>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  value1: null,
  value2: null,
  value3: null,
  value4: null,
  value5: true,
  value6: null,
  value7: null,
  value8: null,
  value9: 'Y',
  value10: 1,
  value11: false,
  value12: true,
  value13: false,
  value14: false,
  value15: true,
  value16: false,
  value17: false
})
</script>
