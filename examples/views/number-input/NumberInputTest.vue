<template>
  <div>
    <p>
      <vxe-number-input v-model="demo1.value100" placeholder="默认尺寸"></vxe-number-input>
      <vxe-number-input v-model="demo1.value101" placeholder="中等尺寸" size="medium"></vxe-number-input>
      <vxe-number-input v-model="demo1.value102" placeholder="小型尺寸" size="small"></vxe-number-input>
      <vxe-number-input v-model="demo1.value103" placeholder="超小尺寸" size="mini"></vxe-number-input>
    </p>

    <p>
      <vxe-number-input v-model="demo1.value500" placeholder="数值类型" type="number"></vxe-number-input>
      <vxe-number-input v-model="demo1.value501" placeholder="数值间隔 1.4" type="number" step="1.4" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value502" placeholder="数值范围限制 0-10" type="number" min="0" max="10" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value503" placeholder="小数类型" type="float"></vxe-number-input>
      <vxe-number-input v-model="demo1.value504" placeholder="小数间隔 2.3" type="float" step="2.3" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value505" placeholder="小数范围限制 0-50" type="float" min="0" max="50" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value506" placeholder="整数类型" type="integer"></vxe-number-input>
      <vxe-number-input v-model="demo1.value507" placeholder="整数间隔 5" type="integer" step="5" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value508" placeholder="整数范围限制 0-100" type="integer" min="0" max="100" clearable></vxe-number-input>
      <vxe-number-input v-model="demo1.value509" placeholder="允许输入科学计数" type="number" exponential clearable></vxe-number-input>
    </p>

    <p>
      <vxe-number-input v-model="demo1.value600" placeholder="自定义前缀图标">
        <template #prefix>
          <i class="fa fa-search my-red"></i>
        </template>
      </vxe-number-input>
      <vxe-number-input v-model="demo1.value601" placeholder="自定义后缀图标">
        <template #suffix>
          <i class="fa fa-search my-green"></i>
        </template>
      </vxe-number-input>
      <vxe-number-input v-model="demo1.value602" class="my-domain" placeholder="自定义前缀模板">
        <template #prefix>
          <span>Http://</span>
        </template>
      </vxe-number-input>
      <vxe-number-input v-model="demo1.value603" class="my-search" placeholder="自定义后缀模板">
        <template #suffix>
          <i class="fa fa-search"></i>
        </template>
      </vxe-number-input>
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
  value200: '',
  value201: '',
  value202: '',
  value203: '',
  value300: '',
  value301: '',
  value302: '',
  value303: '',
  value400: '',
  value401: '',
  value402: '',
  value403: '',
  value404: '',
  value405: '',
  value406: '',
  value407: '',
  value408: '2020-10-01',
  value409: '2020-10-01',
  value500: '22',
  value501: '',
  value502: '',
  value503: '33.33',
  value504: '',
  value505: '',
  value506: '44',
  value507: '',
  value508: '',
  value509: '1e+2',
  value600: '',
  value601: '',
  value602: '',
  value603: '',
  value701: '2017-12-18',
  value702: '2017-12-18',
  value703: '2017-12-18',
  value704: '2017-12-18',
  value705: '2017-12-18',
  value706: '2017-12-18',
  value707: '2017-12-18',
  value800: '',
  value801: '',
  value802: '',
  value803: '',
  value804: '',
  value805: ''
})
</script>

<style lang="scss" scoped>
.my-red {
  color: red;
}
.my-green {
  color: green;
}
.my-domain.vxe-input {
  height: 34px;
  width: 300px;
}
.my-domain.vxe-input:deep() .vxe-input--prefix {
  width: 60px;
  height: 32px;
  top: 1px;
  text-align: center;
  border-right: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}
.my-domain.vxe-input:deep() .vxe-input--inner {
  padding-left: 72px;
  border: 1px solid #dcdfe6;
}
.my-search.vxe-input {
  height: 34px;
  width: 300px;
}
.my-search.vxe-input:deep() .vxe-input--suffix {
  width: 60px;
  height: 32px;
  top: 1px;
  text-align: center;
  border-left: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  cursor: pointer;
}
.my-search.vxe-input:deep() .vxe-input--inner {
  padding-right: 72px;
  border: 1px solid #dcdfe6;
}
</style>
