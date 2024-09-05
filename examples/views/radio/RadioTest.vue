<template>
  <div>
    <p>
      <vxe-radio name="n1" v-model="demo1.value1" label="1" content="默认尺寸"></vxe-radio>
      <vxe-radio name="n1" v-model="demo1.value1" label="2" content="中等尺寸" size="medium"></vxe-radio>
      <vxe-radio name="n1" v-model="demo1.value1" label="3" content="小型尺寸" size="small"></vxe-radio>
      <vxe-radio name="n1" v-model="demo1.value1" label="4" content="超小尺寸" size="mini"></vxe-radio>
    </p>

    <p>
      <vxe-radio name="n2" v-model="demo1.value2" label="1" content="单选1"></vxe-radio>
      <vxe-radio name="n2" v-model="demo1.value2" label="2" content="禁用2" disabled></vxe-radio>
      <vxe-radio name="n2" v-model="demo1.value2" label="3" content="单选3"></vxe-radio>
    </p>

    <p>
      <vxe-radio-group v-model="demo1.value3">
        <vxe-radio label="1" content="HTML"></vxe-radio>
        <vxe-radio label="2" content="CSS"></vxe-radio>
        <vxe-radio label="3" content="Javascript"></vxe-radio>
        <vxe-radio label="4" content="SASS"></vxe-radio>
        <vxe-radio label="5" content="LESS"></vxe-radio>
      </vxe-radio-group>
      <vxe-radio-group v-model="demo1.value3" :options="demo1.opts1" ></vxe-radio-group>
    </p>

    <p>
      <vxe-radio-group v-model="demo1.value9" :strict="false">
        <vxe-radio label="1" content="HTML"></vxe-radio>
        <vxe-radio label="2" content="CSS"></vxe-radio>
        <vxe-radio label="3" content="Javascript"></vxe-radio>
        <vxe-radio label="4" content="SASS"></vxe-radio>
        <vxe-radio label="5" content="LESS"></vxe-radio>
      </vxe-radio-group>
    </p>

    <p>
      <vxe-radio-group v-model="demo1.value4">
        <vxe-radio-button label="1" content="按钮1"></vxe-radio-button>
        <vxe-radio-button label="2" content="按钮2"></vxe-radio-button>
        <vxe-radio-button label="3" content="按钮3"></vxe-radio-button>
      </vxe-radio-group>
      <vxe-radio-group v-model="demo1.value5" size="medium">
        <vxe-radio-button label="1" content="按钮1"></vxe-radio-button>
        <vxe-radio-button label="2" content="按钮2"></vxe-radio-button>
        <vxe-radio-button label="3" content="按钮3"></vxe-radio-button>
      </vxe-radio-group>
      <vxe-radio-group v-model="demo1.value6" size="small" :strict="false">
        <vxe-radio-button label="1" content="按钮1"></vxe-radio-button>
        <vxe-radio-button label="2" content="按钮2"></vxe-radio-button>
        <vxe-radio-button label="3" content="按钮3"></vxe-radio-button>
      </vxe-radio-group>
      <vxe-radio-group v-model="demo1.value7" size="mini" :strict="false">
        <vxe-radio-button label="1" content="按钮1"></vxe-radio-button>
        <vxe-radio-button label="2" content="按钮2"></vxe-radio-button>
        <vxe-radio-button label="3" content="按钮3"></vxe-radio-button>
      </vxe-radio-group>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      demo1: {
        value1: null,
        value2: '2',
        value3: '3',
        value4: null,
        value5: null,
        value6: '1',
        value7: '1',
        value9: '',
        opts1: [
          { value: '1', label: 'HTML' },
          { value: '2', label: 'CSS' },
          { value: '3', label: 'Javascript' },
          { value: '4', label: 'SASS' },
          { value: '5', label: 'LESS' }
        ]
      }
    }
  }
})
</script>
