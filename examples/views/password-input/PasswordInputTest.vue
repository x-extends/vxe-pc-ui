<template>
  <div>
    <p>
      <vxe-password-input v-model="demo1.value100" placeholder="默认尺寸"></vxe-password-input>
      <vxe-password-input v-model="demo1.value101" placeholder="中等尺寸" size="medium"></vxe-password-input>
      <vxe-password-input v-model="demo1.value102" placeholder="小型尺寸" size="small"></vxe-password-input>
      <vxe-password-input v-model="demo1.value103" placeholder="超小尺寸" size="mini"></vxe-password-input>
    </p>

    <p>
      <vxe-password-input v-model="demo1.value302" placeholder="密码类型" type="password"></vxe-password-input>
      <vxe-password-input v-model="demo1.value303" placeholder="可清除" type="password" clearable></vxe-password-input>
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
