<template>
  <div>
    <p>
      <vxe-date-picker v-model="demo1.value100" placeholder="默认尺寸"></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value101" placeholder="中等尺寸" size="medium"></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value102" placeholder="小型尺寸" size="small"></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value103" placeholder="超小尺寸" size="mini"></vxe-date-picker>
    </p>

    <p>
      <vxe-date-picker v-model="demo1.value400" placeholder="日期选择" type="date" parse-format="yyyy-dd-MM"></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value401" placeholder="周选择" type="week" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value402" placeholder="月选择" type="month" valueFormat="yyyy-MM-dd"></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value403" placeholder="季选择" type="quarter" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value404" placeholder="年选择" type="year" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value405" placeholder="时间选择" type="time" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value406" placeholder="日期和时间选择" type="datetime" transfer></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value407" placeholder="禁用日期" type="date" :disabled-method="disabledDateMethod" transfer></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value408" placeholder="小圆点" type="date" :festival-method="festivalNoticeMethod" transfer></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value409" placeholder="农历节日" type="date" :festival-method="festivalCalendarMethod" transfer></vxe-date-picker>
    </p>

    <p>
      <vxe-date-picker v-model="demo1.value800" placeholder="日期多选" type="date" multiple></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value801" placeholder="日期多选" type="month" multiple></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value802" placeholder="日期多选" type="quarter" multiple></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value803" placeholder="日期多选" type="year" multiple></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value804" placeholder="日期多选" type="week" multiple></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value805" placeholder="日期多选" type="datetime" multiple></vxe-date-picker>
    </p>

    <p>
      <vxe-date-picker v-model="demo1.value701" placeholder="周选择" type="week" :start-day="0" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value702" placeholder="周选择" type="week" :start-day="1" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value703" placeholder="周选择" type="week" :start-day="2" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value704" placeholder="周选择" type="week" :start-day="3" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value705" placeholder="周选择" type="week" :start-day="4" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value706" placeholder="周选择" type="week" :start-day="5" clearable></vxe-date-picker>
      <vxe-date-picker v-model="demo1.value707" placeholder="周选择" type="week" :start-day="6" clearable></vxe-date-picker>
    </p>

    <p>
      <vxe-date-picker v-model="demo1.value600" placeholder="自定义前缀图标">
        <template #prefix>
          <i class="fa fa-search my-red"></i>
        </template>
      </vxe-date-picker>
      <vxe-date-picker v-model="demo1.value601" placeholder="自定义后缀图标">
        <template #suffix>
          <i class="fa fa-search my-green"></i>
        </template>
      </vxe-date-picker>
      <vxe-date-picker v-model="demo1.value602" class="my-domain" placeholder="自定义前缀模板">
        <template #prefix>
          <span>Http://</span>
        </template>
      </vxe-date-picker>
      <vxe-date-picker v-model="demo1.value603" class="my-search" placeholder="自定义后缀模板">
        <template #suffix>
          <i class="fa fa-search"></i>
        </template>
      </vxe-date-picker>
    </p>
    <p>
      <vxe-date-picker v-model="demo1.value900" readonly></vxe-date-picker>
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
  value900: '2017-12-18'
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
