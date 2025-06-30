<template>
  <div>
    <p>
      <vxe-input class="width-all" placeholder="请输入手机号码">
        <template #suffix>
          <vxe-button>发送验证码</vxe-button>
        </template>
      </vxe-input>

      <vxe-input v-model="demo1.value100" placeholder="默认尺寸" trim></vxe-input>
      <vxe-input v-model="demo1.value101" placeholder="中等尺寸" size="medium"></vxe-input>
      <vxe-input v-model="demo1.value102" placeholder="小型尺寸" size="small"></vxe-input>
      <vxe-input v-model="demo1.value103" placeholder="超小尺寸" size="mini"></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value200" placeholder="可清除" showWordCount></vxe-input>
      <vxe-input v-model="demo1.value200" placeholder="可清除" showWordCount max-length="20"></vxe-input>
      <vxe-input v-model="demo1.value200" placeholder="可清除" showWordCount clearable></vxe-input>
      <vxe-input v-model="demo1.value201" placeholder="带图标" prefix-icon="vxe-icon-search" suffix-icon="vxe-icon-time" clearable></vxe-input>
      <vxe-input v-model="demo1.value202" placeholder="只读的" suffix-icon="vxe-icon-time" readonly></vxe-input>
      <vxe-input v-model="demo1.value203" placeholder="禁用的" disabled></vxe-input>
      <vxe-input v-model="demo1.value203" placeholder="禁用的" prefix-icon="vxe-icon-time" disabled></vxe-input>
      <vxe-input v-model="demo1.value203" placeholder="禁用的" prefix-icon="vxe-icon-time" suffix-icon="vxe-icon-time" disabled></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value300" placeholder="搜索类型" type="search"></vxe-input>
      <vxe-input v-model="demo1.value301" placeholder="可清除" type="search" clearable></vxe-input>
      <vxe-input v-model="demo1.value302" placeholder="密码类型" type="password"></vxe-input>
      <vxe-input v-model="demo1.value303" placeholder="可清除" type="password" clearable></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value400" placeholder="日期选择" type="date" parse-format="yyyy-dd-MM"></vxe-input>
      <vxe-input v-model="demo1.value401" placeholder="周选择" type="week" clearable></vxe-input>
      <vxe-input v-model="demo1.value402" placeholder="月选择" type="month" valueFormat="yyyy-MM-dd"></vxe-input>
      <vxe-input v-model="demo1.value403" placeholder="季选择" type="quarter" clearable></vxe-input>
      <vxe-input v-model="demo1.value404" placeholder="年选择" type="year" clearable></vxe-input>
      <vxe-input v-model="demo1.value405" placeholder="时间选择" type="time" clearable></vxe-input>
      <vxe-input v-model="demo1.value406" placeholder="日期和时间选择" type="datetime" transfer></vxe-input>
      <vxe-input v-model="demo1.value407" placeholder="禁用日期" type="date" :disabled-method="disabledDateMethod" transfer></vxe-input>
      <vxe-input v-model="demo1.value408" placeholder="小圆点" type="date" :festival-method="festivalNoticeMethod" transfer></vxe-input>
      <vxe-input v-model="demo1.value409" placeholder="农历节日" type="date" :festival-method="festivalCalendarMethod" transfer></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value800" placeholder="日期多选" type="date" multiple></vxe-input>
      <vxe-input v-model="demo1.value801" placeholder="日期多选" type="month" multiple></vxe-input>
      <vxe-input v-model="demo1.value802" placeholder="日期多选" type="quarter" multiple></vxe-input>
      <vxe-input v-model="demo1.value803" placeholder="日期多选" type="year" multiple></vxe-input>
      <vxe-input v-model="demo1.value804" placeholder="日期多选" type="week" multiple></vxe-input>
      <vxe-input v-model="demo1.value805" placeholder="日期多选" type="datetime" multiple></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value701" placeholder="周选择" type="week" :start-day="0" clearable></vxe-input>
      <vxe-input v-model="demo1.value702" placeholder="周选择" type="week" :start-day="1" clearable></vxe-input>
      <vxe-input v-model="demo1.value703" placeholder="周选择" type="week" :start-day="2" clearable></vxe-input>
      <vxe-input v-model="demo1.value704" placeholder="周选择" type="week" :start-day="3" clearable></vxe-input>
      <vxe-input v-model="demo1.value705" placeholder="周选择" type="week" :start-day="4" clearable></vxe-input>
      <vxe-input v-model="demo1.value706" placeholder="周选择" type="week" :start-day="5" clearable></vxe-input>
      <vxe-input v-model="demo1.value707" placeholder="周选择" type="week" :start-day="6" clearable></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value500" placeholder="数值类型" type="number"></vxe-input>
      <vxe-input v-model="demo1.value501" placeholder="数值间隔 1.4" type="number" step="1.4" clearable></vxe-input>
      <vxe-input v-model="demo1.value502" placeholder="数值范围限制 0-10" type="number" min="0" max="10" clearable></vxe-input>
      <vxe-input v-model="demo1.value503" placeholder="小数类型" type="float"></vxe-input>
      <vxe-input v-model="demo1.value504" placeholder="小数间隔 2.3" type="float" step="2.3" clearable></vxe-input>
      <vxe-input v-model="demo1.value505" placeholder="小数范围限制 0-50" type="float" min="0" max="50" clearable></vxe-input>
      <vxe-input v-model="demo1.value506" placeholder="整数类型" type="integer"></vxe-input>
      <vxe-input v-model="demo1.value507" placeholder="整数间隔 5" type="integer" step="5" clearable></vxe-input>
      <vxe-input v-model="demo1.value508" placeholder="整数范围限制 0-100" type="integer" min="0" max="100" clearable></vxe-input>
      <vxe-input v-model="demo1.value509" placeholder="允许输入科学计数" type="number" exponential clearable></vxe-input>
    </p>

    <p>
      <vxe-input v-model="demo1.value600" placeholder="自定义前缀图标">
        <template #prefix>
          <i class="vxe-icon-time my-red"></i>
        </template>
      </vxe-input>
      <vxe-input v-model="demo1.value601" placeholder="自定义后缀图标">
        <template #suffix>
          <i class="vxe-icon-time my-green"></i>
        </template>
      </vxe-input>
      <vxe-input v-model="demo1.value602" placeholder="自定义前缀模板">
        <template #prefix>
          <span>Http://</span>
        </template>
      </vxe-input>
      <vxe-input v-model="demo1.value603" placeholder="自定义后缀模板">
        <template #suffix>
          <i class="vxe-icon-time"></i>
        </template>
      </vxe-input>
    </p>
    <p>
      <vxe-input v-model="demo1.value900" readonly></vxe-input>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { VxeInputPropTypes, VxeInputDefines } from '../../../types'
import XEUtils from 'xe-utils'

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
  value805: '',
  value900: '11111111'
})

const disabledDateMethod: VxeInputPropTypes.DisabledMethod = (params) => {
  const { date } = params
  const dd = date.getDate()
  return dd > 15
}

// 渲染日期小圆点
const noticeMaps: { [key: string]: VxeInputDefines.DateFestivalInfo } = {
  20200910: {
    notice: true, // 显示小圆点事件通知
    important: true, // 是否标记为重要节日
    label: '活动'
  },
  20201015: {
    notice: true,
    important: true,
    label: '聚餐'
  },
  20201108: {
    notice: true,
    label: '爬山'
  },
  20201222: {
    notice: true,
    label: '游泳'
  }
}
const festivalNoticeMethod: VxeInputPropTypes.FestivalMethod = (params) => {
  const { date, viewType } = params
  if (viewType === 'day') {
    const ymd = XEUtils.toDateString(date, 'yyyyMMdd')
    return noticeMaps[ymd] || { label: '无' }
  }
}

// 显示日期农历节假日
const calendarMaps: { [key: string]: VxeInputDefines.DateFestivalInfo } = {
  20200930: {
    label: '十四' // 显示节日名称
  },
  20201001: {
    label: '国庆节,中秋节', // 如果同一天拥有多个节日重叠，用逗号分开
    important: true, // 是否标记为重要节日
    extra: '休' // 右上角额外显示的名称
  },
  20201002: {
    label: '十六',
    extra: '休'
  },
  20201003: {
    label: '十七',
    extra: '休'
  },
  20201004: {
    label: '十八',
    extra: '休'
  },
  20201005: {
    label: '十九',
    extra: '休'
  },
  20201006: {
    label: '二十',
    extra: '休'
  },
  20201007: {
    label: '廿一',
    extra: '休'
  },
  20201008: {
    label: '寒霜',
    important: true,
    extra: '休'
  },
  20201009: {
    label: '廿三'
  },
  20201010: {
    label: '廿四',
    extra: {
      label: '班',
      important: true // 是否标记为重要节日
    }
  }
}
const festivalCalendarMethod: VxeInputPropTypes.FestivalMethod = (params) => {
  const { date, viewType } = params
  if (viewType === 'day') {
    const ymd = XEUtils.toDateString(date, 'yyyyMMdd')
    return calendarMaps[ymd] || { label: '无' }
  }
}
</script>

<style lang="scss" scoped>
.my-red {
  color: red;
}
.my-green {
  color: green;
}
</style>
