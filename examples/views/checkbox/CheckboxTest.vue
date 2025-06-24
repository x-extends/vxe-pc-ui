<template>
  <div>
    <p>
      <vxe-checkbox v-model="demo1.value1" content="默认尺寸"></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value2" size="medium" content="中等尺寸"></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value3" size="small" content="小型尺寸"></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value4" size="mini" content="超小尺寸"></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value5" content="默认尺寸" indeterminate></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value6" size="medium" content="中等尺寸" indeterminate></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value7" size="small" content="小型尺寸" indeterminate></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value8" size="mini" content="超小尺寸" indeterminate></vxe-checkbox>
    </p>

    <p>
      <vxe-checkbox v-model="demo1.value9" content="复选1" disabled></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value10" content="复选2" disabled></vxe-checkbox>
      <vxe-checkbox v-model="demo1.value11" content="自定义值" checked-value="1" unchecked-value="0"></vxe-checkbox>
    </p>

    <p>
      <vxe-checkbox-group v-model="demo1.value12">
        <vxe-checkbox label="1" content="HTML"></vxe-checkbox>
        <vxe-checkbox label="2" content="CSS"></vxe-checkbox>
        <vxe-checkbox label="3" content="Javascript"></vxe-checkbox>
        <vxe-checkbox label="4" content="SASS"></vxe-checkbox>
        <vxe-checkbox label="5" content="LESS"></vxe-checkbox>
      </vxe-checkbox-group>
      <vxe-checkbox-group v-model="demo1.value12" :options="demo1.opts1" ></vxe-checkbox-group>
    </p>

    <p>
      <vxe-checkbox-group v-model="demo1.value20" :max="3">
        <vxe-checkbox label="1" content="HTML"></vxe-checkbox>
        <vxe-checkbox label="2" content="CSS"></vxe-checkbox>
        <vxe-checkbox label="3" content="Javascript"></vxe-checkbox>
        <vxe-checkbox label="4" content="SASS"></vxe-checkbox>
        <vxe-checkbox label="5" content="LESS"></vxe-checkbox>
      </vxe-checkbox-group>
    </p>

    <p>
      <vxe-checkbox-group v-model="demo1.value21">
        <vxe-checkbox-button label="1" content="按钮1"></vxe-checkbox-button>
        <vxe-checkbox-button label="2" content="按钮2"></vxe-checkbox-button>
        <vxe-checkbox-button label="3" content="按钮3"></vxe-checkbox-button>
      </vxe-checkbox-group>
      <vxe-checkbox-group v-model="demo1.value22" size="medium">
        <vxe-checkbox-button label="1" content="按钮1"></vxe-checkbox-button>
        <vxe-checkbox-button label="2" content="按钮2"></vxe-checkbox-button>
        <vxe-checkbox-button label="3" content="按钮3"></vxe-checkbox-button>
      </vxe-checkbox-group>
      <vxe-checkbox-group v-model="demo1.value23" size="small">
        <vxe-checkbox-button label="1" content="按钮1"></vxe-checkbox-button>
        <vxe-checkbox-button label="2" content="按钮2"></vxe-checkbox-button>
        <vxe-checkbox-button label="3" content="按钮3"></vxe-checkbox-button>
      </vxe-checkbox-group>
      <vxe-checkbox-group v-model="demo1.value24" size="mini">
        <vxe-checkbox-button label="1" content="按钮1"></vxe-checkbox-button>
        <vxe-checkbox-button label="2" content="按钮2"></vxe-checkbox-button>
        <vxe-checkbox-button label="3" content="按钮3"></vxe-checkbox-button>
      </vxe-checkbox-group>
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
  value5: false,
  value6: false,
  value7: false,
  value8: false,
  value9: false,
  value10: true,
  value11: '1',
  value12: ['3'],
  value20: [],
  value21: [],
  value22: [],
  value23: ['2'],
  value24: ['2', '3'],
  opts1: [
    { value: '1', label: 'HTML' },
    { value: '2', label: 'CSS' },
    { value: '3', label: 'Javascript' },
    { value: '4', label: 'SASS' },
    { value: '5', label: 'LESS' }
  ]
})
</script>
