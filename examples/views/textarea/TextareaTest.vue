<template>
  <div>
    <p>
      <vxe-textarea v-model="demo1.value1" placeholder="默认尺寸"></vxe-textarea>
      <vxe-textarea v-model="demo1.value2" placeholder="中等尺寸" size="medium"></vxe-textarea>
      <vxe-textarea v-model="demo1.value3" placeholder="小型尺寸" size="small"></vxe-textarea>
      <vxe-textarea v-model="demo1.value4" placeholder="超小尺寸" size="mini"></vxe-textarea>
    </p>

    <p>
      <vxe-textarea v-model="demo1.value5" placeholder="多行文本域"></vxe-textarea>
      <vxe-textarea v-model="demo1.value6" placeholder="只读的" readonly></vxe-textarea>
      <vxe-textarea v-model="demo1.value7" placeholder="禁用的" disabled></vxe-textarea>
      <vxe-textarea v-model="demo1.value8" placeholder="显示字数统计" maxlength="100" show-word-count></vxe-textarea>
      <vxe-textarea v-model="demo1.value9" placeholder="自适应文本高度" :autosize="{ minRows: 2, maxRows: 4 }"></vxe-textarea>
      <vxe-textarea v-model="demo1.value10" placeholder="默认3行与40列" rows="3" cols="40"></vxe-textarea>
      <vxe-textarea v-model="demo1.value11" placeholder="关闭调节元素" resize="none"></vxe-textarea>
      <vxe-textarea v-model="demo1.value12" placeholder="可以调节元素的高度" resize="vertical"></vxe-textarea>
      <vxe-textarea v-model="demo1.value13" placeholder="以调节元素的宽度" resize="horizontal"></vxe-textarea>
      <vxe-textarea v-model="demo1.value14" placeholder="可以调节元素的宽度和高度" resize="both"></vxe-textarea>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  value5: '',
  value6: '',
  value7: '',
  value8: '',
  value9: '',
  value10: '',
  value11: '',
  value12: '',
  value13: '',
  value14: ''
})
</script>
