<template>
  <div>
    <p>
      <vxe-password-input v-model="demo1.value100" placeholder="默认尺寸"></vxe-password-input>
      <vxe-password-input v-model="demo1.value101" placeholder="中等尺寸" size="medium"></vxe-password-input>
      <vxe-password-input v-model="demo1.value102" placeholder="小型尺寸" size="small"></vxe-password-input>
      <vxe-password-input v-model="demo1.value103" placeholder="超小尺寸" size="mini"></vxe-password-input>
    </p>

    <p>
      <vxe-password-input v-model="demo1.value104" placeholder="密码类型" type="password"></vxe-password-input>
      <vxe-password-input v-model="demo1.value105" placeholder="可清除" type="password" clearable></vxe-password-input>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  value100: '',
  value101: '',
  value102: '',
  value103: '',
  value104: '',
  value105: ''
})
</script>
