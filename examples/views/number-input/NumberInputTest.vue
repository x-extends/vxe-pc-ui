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
          <i class="vxe-icon-usd my-green"></i>
        </template>
      </vxe-number-input>
      <vxe-number-input v-model="demo1.value602" class="my-domain" placeholder="自定义前缀模板">
        <template #prefix>
          <span>Http://</span>
        </template>
      </vxe-number-input>
      <vxe-number-input v-model="demo1.value603" class="my-search" placeholder="自定义后缀模板">
        <template #suffix>
          <i class="vxe-icon-rmb"></i>
        </template>
      </vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value700" readonly></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value800" type="amount"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value900" type="float" :auto-fill="false" :controls="false"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value901" type="float" :auto-fill="false" :control-config="{enabled: false}"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value902" type="float" :auto-fill="false" :control-config="{showButton: false}"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value903" type="float" :auto-fill="false" :control-config="{isWheel: false}"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value904" type="float" :control-config="{layout: 'default'}"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value904" type="float" :control-config="{layout: 'left'}"></vxe-number-input>
    </p>
    <p>
      <vxe-number-input v-model="demo1.value905" type="float" :control-config="{layout: 'right'}" next-icon="vxe-icon-arrow-up" prev-icon="vxe-icon-arrow-down"></vxe-number-input>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const demo1 = reactive({
  value100: null,
  value101: null,
  value102: null,
  value103: null,
  value500: null,
  value501: null,
  value502: null,
  value503: null,
  value504: null,
  value505: null,
  value506: null,
  value507: null,
  value508: null,
  value509: null,
  value600: 22,
  value601: null,
  value602: null,
  value603: null,
  value700: 1234,
  value800: '3.1',
  value900: '3.2',
  value901: '3.3',
  value902: '3.4',
  value903: '3.5',
  value904: '3.6',
  value905: '3.7'
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
