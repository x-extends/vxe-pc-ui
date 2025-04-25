import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, eqEmptyValue } from '../../ui/src/utils'
import { hasClass, getAbsolutePos, getEventTargetNode, hasControlKey } from '../../ui/src/dom'
import { toStringTimeDate, getDateQuarter } from '../../date-picker/src/util'
import { handleNumber, toFloatValueFixed } from '../../number-input/src/util'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeInputConstructor, VxeInputEmits, InputInternalData, InputReactData, ValueOf, VxeInputPropTypes, VxeComponentStyleType, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, VxeComponentSizeType, VxeDrawerConstructor, VxeDrawerMethods, VxeModalConstructor, VxeModalMethods, VxeDatePickerDefines, VxeSelectConstructor, VxeSelectMethods, VxeTreeSelectConstructor, VxeTreeSelectMethods } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeInput',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Date] as PropType<VxeInputPropTypes.ModelValue>,
    immediate: {
      type: Boolean as PropType<VxeInputPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeInputPropTypes.Name>,
    type: {
      type: String as PropType<VxeInputPropTypes.Type>,
      default: 'text'
    },
    clearable: {
      type: Boolean as PropType<VxeInputPropTypes.Clearable>,
      default: () => getConfig().input.clearable
    },
    readonly: {
      type: Boolean as PropType<VxeInputPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeInputPropTypes.Disabled>,
      default: null
    },
    placeholder: {
      type: String as PropType<VxeInputPropTypes.Placeholder>,
      default: null
    },
    maxLength: {
      type: [String, Number] as PropType<VxeInputPropTypes.MaxLength>,
      default: () => getConfig().input.maxLength
    },
    autoComplete: {
      type: String as PropType<VxeInputPropTypes.AutoComplete>,
      default: 'off'
    },
    autoFocus: {
      type: Boolean as PropType<VxeInputPropTypes.AutoFocus>,
      default: null
    },
    align: String as PropType<VxeInputPropTypes.Align>,
    form: String as PropType<VxeInputPropTypes.Form>,
    className: String as PropType<VxeInputPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeInputPropTypes.Size>,
      default: () => getConfig().input.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeInputPropTypes.Multiple>,

    // text
    showWordCount: Boolean as PropType<VxeInputPropTypes.ShowWordCount>,
    countMethod: Function as PropType<VxeInputPropTypes.CountMethod>,

    // number、integer、float
    min: {
      type: [String, Number] as PropType<VxeInputPropTypes.Min>,
      default: null
    },
    max: {
      type: [String, Number] as PropType<VxeInputPropTypes.Max>,
      default: null
    },
    step: [String, Number] as PropType<VxeInputPropTypes.Step>,
    trim: {
      type: Boolean as PropType<VxeInputPropTypes.Trim>,
      default: () => getConfig().input.trim
    },
    exponential: {
      type: Boolean as PropType<VxeInputPropTypes.Exponential>,
      default: () => getConfig().input.exponential
    },

    // number、integer、float、password
    controls: {
      type: Boolean as PropType<VxeInputPropTypes.Controls>,
      default: () => getConfig().input.controls
    },

    // float
    digits: {
      type: [String, Number] as PropType<VxeInputPropTypes.Digits>,
      default: () => getConfig().input.digits
    },

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeInputPropTypes.MinDate>,
      default: () => getConfig().input.startDate
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeInputPropTypes.MaxDate>,
      default: () => getConfig().input.endDate
    },
    minDate: [String, Number, Date] as PropType<VxeInputPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeInputPropTypes.MaxDate>,
    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeInputPropTypes.StartDay>,
    startDay: {
      type: [String, Number] as PropType<VxeInputPropTypes.StartDay>,
      default: () => getConfig().input.startDay
    },
    labelFormat: String as PropType<VxeInputPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeInputPropTypes.ValueFormat>,
    editable: {
      type: Boolean as PropType<VxeInputPropTypes.Editable>,
      default: true
    },
    festivalMethod: {
      type: Function as PropType<VxeInputPropTypes.FestivalMethod>,
      default: () => getConfig().input.festivalMethod
    },
    disabledMethod: {
      type: Function as PropType<VxeInputPropTypes.DisabledMethod>,
      default: () => getConfig().input.disabledMethod
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeInputPropTypes.SelectDay>,
      default: () => getConfig().input.selectDay
    },

    prefixIcon: String as PropType<VxeInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeInputPropTypes.SuffixIcon>,
    placement: String as PropType<VxeInputPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeInputPropTypes.Transfer>,
      default: null
    },

    // 已废弃
    maxlength: [String, Number] as PropType<VxeInputPropTypes.Maxlength>,
    // 已废弃
    autocomplete: String as PropType<VxeInputPropTypes.Autocomplete>
  },
  inject: {
    $xeSelect: {
      default: null
    },
    $xeTreeSelect: {
      default: null
    },

    $xeModal: {
      default: null
    },
    $xeDrawer: {
      default: null
    },
    $xeTable: {
      default: null
    },
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: InputReactData = {
      initialized: false,
      panelIndex: 0,
      showPwd: false,
      visiblePanel: false,
      isAniVisible: false,
      panelStyle: {},
      panelPlacement: '',
      isActivated: false,
      inputValue: '',
      datetimePanelValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    }
    const internalData: InputInternalData = {
      yearSize: 12,
      monthSize: 20,
      quarterSize: 8,
      hpTimeout: undefined,
      dnTimeout: undefined
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeSelect(): (VxeSelectConstructor & VxeSelectMethods) | null
      $xeTreeSelect(): (VxeTreeSelectConstructor & VxeTreeSelectMethods) | null
      $xeModal(): (VxeModalConstructor & VxeModalMethods) | null
      $xeDrawer(): (VxeDrawerConstructor & VxeDrawerMethods) | null
      $xeTable(): (VxeTableConstructor & VxeTablePrivateMethods) | null
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeBtnTransfer () {
      const $xeInput = this
      const props = $xeInput
      const $xeTable = $xeInput.$xeTable
      const $xeModal = $xeInput.$xeModal
      const $xeDrawer = $xeInput.$xeDrawer
      const $xeForm = $xeInput.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().input.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    },
    computeFormReadonly () {
      const $xeInput = this
      const $xeForm = $xeInput.$xeForm

      if ($xeForm) {
        return $xeForm.readonly
      }
      return false
    },
    computeIsReadonly () {
      const $xeInput = this
      const props = $xeInput

      const { readonly } = props
      return readonly
    },
    computeIsDisabled () {
      const $xeInput = this
      const props = $xeInput
      const $xeForm = $xeInput.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeInpMaxLength () {
      const $xeInput = this
      const props = $xeInput

      const { maxLength, maxlength } = props
      const maxLen = maxLength || maxlength
      const isNumType = $xeInput.computeIsNumType
      // 数值最大长度限制 16 位，包含小数
      if (isNumType) {
        if (!XEUtils.toNumber(maxLen)) {
          return 16
        }
      }
      return maxLen
    },
    computeIsDateTimeType () {
      const $xeInput = this
      const props = $xeInput

      const { type } = props
      return type === 'time' || type === 'datetime'
    },
    computeIsNumType () {
      const $xeInput = this
      const props = $xeInput

      return ['number', 'integer', 'float'].indexOf(props.type) > -1
    },
    computeInputCount (this: any) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      return XEUtils.getSize(reactData.inputValue)
    },
    computeIsCountError () {
      const $xeInput = this

      const inputCount = $xeInput.computeInputCount as number
      const inpMaxLength = $xeInput.computeInpMaxLength
      return inpMaxLength && inputCount > XEUtils.toNumber(inpMaxLength)
    },
    computeIsDatePickerType () {
      const $xeInput = this
      const props = $xeInput

      const isDateTimeType = $xeInput.computeIsDateTimeType as boolean
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeIsPawdType () {
      const $xeInput = this
      const props = $xeInput

      return props.type === 'password'
    },
    computeIsSearchType () {
      const $xeInput = this
      const props = $xeInput

      return props.type === 'search'
    },
    computeDigitsValue () {
      const $xeInput = this
      const props = $xeInput

      return XEUtils.toInteger(props.digits) || 1
    },
    computeStepValue () {
      const $xeInput = this
      const props = $xeInput

      const { type } = props
      const digitsValue = $xeInput.computeDigitsValue as number
      const step = props.step
      if (type === 'integer') {
        return XEUtils.toInteger(step) || 1
      } else if (type === 'float') {
        return XEUtils.toNumber(step) || (1 / Math.pow(10, digitsValue))
      }
      return XEUtils.toNumber(step) || 1
    },
    computeIsClearable () {
      const $xeInput = this
      const props = $xeInput

      const { type } = props
      const isNumType = $xeInput.computeIsNumType as boolean
      const isDatePickerType = $xeInput.computeIsDatePickerType as boolean
      const isPawdType = $xeInput.computeIsPawdType
      return props.clearable && (isPawdType || isNumType || isDatePickerType || type === 'text' || type === 'search')
    },
    computeDateStartTime () {
      const $xeInput = this
      const props = $xeInput

      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    },
    computeDateEndTime () {
      const $xeInput = this
      const props = $xeInput

      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    },
    computeSupportMultiples () {
      const $xeInput = this
      const props = $xeInput

      return ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeDateListValue (this: any) {
      const $xeInput = this
      const props = $xeInput

      const { value, multiple } = props
      const isDatePickerType = $xeInput.computeIsDatePickerType as boolean
      const dateValueFormat = $xeInput.computeDateValueFormat
      if (multiple && value && isDatePickerType) {
        return XEUtils.toValueString(value).split(',').map(item => {
          const date = $xeInput.parseDate(item, dateValueFormat)
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return date
        }) as Date[]
      }
      return []
    },
    computeDateMultipleValue () {
      const $xeInput = this

      const dateListValue = $xeInput.computeDateListValue as Date[]
      const dateValueFormat = $xeInput.computeDateValueFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    },
    computeDateMultipleLabel () {
      const $xeInput = this

      const dateListValue = $xeInput.computeDateListValue as Date[]
      const dateLabelFormat = $xeInput.computeDateLabelFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateLabelFormat)).join(', ')
    },
    computeDateValueFormat () {
      const $xeInput = this
      const props = $xeInput

      const { type, valueFormat } = props
      if (valueFormat) {
        return valueFormat
      }
      if (type === 'time') {
        return 'HH:mm:ss'
      }
      if (type === 'datetime') {
        return 'yyyy-MM-dd HH:mm:ss'
      }
      return 'yyyy-MM-dd'
    },
    computeDateValue (this: any) {
      const $xeInput = this
      const props = $xeInput

      const { value } = props
      const isDatePickerType = $xeInput.computeIsDatePickerType as boolean
      const dateValueFormat = $xeInput.computeDateValueFormat as string
      let val = null
      if (value && isDatePickerType) {
        const date = $xeInput.parseDate(value, dateValueFormat)
        if (XEUtils.isValidDate(date)) {
          val = date
        }
      }
      return val
    },
    computeIsDisabledPrevDateBtn (this: any) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const dateStartTime = $xeInput.computeDateStartTime as Date | null
      const { selectMonth } = reactData
      if (selectMonth && dateStartTime) {
        return selectMonth <= dateStartTime
      }
      return false
    },
    computeIsDisabledNextDateBtn (this: any) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const dateEndTime = $xeInput.computeDateEndTime as Date | null
      const { selectMonth } = reactData
      if (selectMonth && dateEndTime) {
        return selectMonth >= dateEndTime
      }
      return false
    },
    computeDateTimeLabel (this: any) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { datetimePanelValue } = reactData
      const hasTimeSecond = $xeInput.computeHasTimeSecond as boolean
      if (datetimePanelValue) {
        return XEUtils.toDateString(datetimePanelValue, hasTimeSecond ? 'HH:mm:ss' : 'HH:mm')
      }
      return ''
    },
    computeDateHMSTime () {
      const $xeInput = this

      const dateValue = $xeInput.computeDateValue
      const isDateTimeType = $xeInput.computeIsDateTimeType as boolean
      return dateValue && isDateTimeType ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0
    },
    computeDateLabelFormat () {
      const $xeInput = this
      const props = $xeInput

      const { labelFormat } = props
      const isDatePickerType = $xeInput.computeIsDatePickerType as boolean
      if (isDatePickerType) {
        return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
      }
      return ''
    },
    computeYearList () {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { selectMonth, currentDate } = reactData
      const { yearSize } = internalData
      const years: VxeDatePickerDefines.DateYearItem[] = []
      if (selectMonth && currentDate) {
        const currFullYear = currentDate.getFullYear()
        const selectFullYear = selectMonth.getFullYear()
        const startYearDate = new Date(selectFullYear - selectFullYear % yearSize, 0, 1)
        for (let index = -4; index < yearSize + 4; index++) {
          const date = XEUtils.getWhatYear(startYearDate, index, 'first')
          const itemFullYear = date.getFullYear()
          years.push({
            date,
            isCurrent: true,
            isPrev: index < 0,
            isNow: currFullYear === itemFullYear,
            isNext: index >= yearSize,
            year: itemFullYear
          })
        }
      }
      return years
    },
    computeSelectDatePanelObj () {
      const $xeInput = (this as any)
      const reactData = $xeInput.reactData

      const isDatePickerType = $xeInput.computeIsDatePickerType
      let y = ''
      let m = ''
      if (isDatePickerType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = $xeInput.computeYearList
        let year = ''
        let month
        if (selectMonth) {
          year = selectMonth.getFullYear()
          month = selectMonth.getMonth() + 1
        }
        if (datePanelType === 'quarter' || datePanelType === 'month') {
          y = getI18n('vxe.datePicker.yearTitle', [year])
        } else if (datePanelType === 'year') {
          y = yearList.length ? `${yearList[0].year} - ${yearList[yearList.length - 1].year}` : ''
        } else {
          y = getI18n('vxe.datePicker.yearTitle', [year])
          m = month ? getI18n(`vxe.input.date.m${month}`) : '-'
        }
      }
      return {
        y,
        m
      }
    },
    computeFirstDayOfWeek () {
      const $xeInput = this
      const props = $xeInput

      const { startDay, startWeek } = props
      return XEUtils.toNumber(XEUtils.isNumber(startDay) || XEUtils.isString(startDay) ? startDay : startWeek) as VxeInputPropTypes.StartDay
    },
    computeWeekDatas () {
      const $xeInput = this

      const weeks = []
      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (isDatePickerType) {
        let sWeek = $xeInput.computeFirstDayOfWeek as VxeInputPropTypes.StartDay
        weeks.push(sWeek)
        for (let index = 0; index < 6; index++) {
          if (sWeek >= 6) {
            sWeek = 0
          } else {
            sWeek++
          }
          weeks.push(sWeek)
        }
      }
      return weeks
    },
    computeDateHeaders () {
      const $xeInput = this

      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (isDatePickerType) {
        const weekDatas = $xeInput.computeWeekDatas as number[]
        return weekDatas.map((day) => {
          return {
            value: day,
            label: getI18n(`vxe.input.date.weeks.w${day}`)
          }
        })
      }
      return []
    },
    computeWeekHeaders () {
      const $xeInput = this

      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (isDatePickerType) {
        const dateHeaders = $xeInput.computeDateHeaders as {
          value: number;
          label: string;
        }[]
        return [{ label: getI18n('vxe.input.date.weeks.w') }].concat(dateHeaders)
      }
      return []
    },
    computeYearDatas () {
      const $xeInput = this

      const yearList = $xeInput.computeYearList as VxeDatePickerDefines.DateYearItem[]
      return XEUtils.chunk(yearList, 4)
    },
    computeQuarterList () {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { selectMonth, currentDate } = reactData
      const { quarterSize } = internalData
      const quarters: VxeDatePickerDefines.DateQuarterItem[] = []
      if (selectMonth && currentDate) {
        const currFullYear = currentDate.getFullYear()
        const currQuarter = getDateQuarter(currentDate)
        const firstYear = XEUtils.getWhatYear(selectMonth, 0, 'first')
        const selFullYear = firstYear.getFullYear()
        for (let index = -2; index < quarterSize - 2; index++) {
          const date = XEUtils.getWhatQuarter(firstYear, index)
          const itemFullYear = date.getFullYear()
          const itemQuarter = getDateQuarter(date)
          const isPrev = itemFullYear < selFullYear
          quarters.push({
            date,
            isPrev,
            isCurrent: itemFullYear === selFullYear,
            isNow: itemFullYear === currFullYear && itemQuarter === currQuarter,
            isNext: !isPrev && itemFullYear > selFullYear,
            quarter: itemQuarter
          })
        }
      }
      return quarters
    },
    computeQuarterDatas () {
      const $xeInput = this

      const quarterList = $xeInput.computeQuarterList as VxeDatePickerDefines.DateQuarterItem[]
      return XEUtils.chunk(quarterList, 2)
    },
    computeMonthList () {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { selectMonth, currentDate } = reactData
      const { monthSize } = internalData
      const months: VxeDatePickerDefines.DateMonthItem[] = []
      if (selectMonth && currentDate) {
        const currFullYear = currentDate.getFullYear()
        const currMonth = currentDate.getMonth()
        const selFullYear = XEUtils.getWhatYear(selectMonth, 0, 'first').getFullYear()
        for (let index = -4; index < monthSize - 4; index++) {
          const date = XEUtils.getWhatYear(selectMonth, 0, index)
          const itemFullYear = date.getFullYear()
          const itemMonth = date.getMonth()
          const isPrev = itemFullYear < selFullYear
          months.push({
            date,
            isPrev,
            isCurrent: itemFullYear === selFullYear,
            isNow: itemFullYear === currFullYear && itemMonth === currMonth,
            isNext: !isPrev && itemFullYear > selFullYear,
            month: itemMonth
          })
        }
      }
      return months
    },
    computeMonthDatas () {
      const $xeInput = this

      const monthList = $xeInput.computeMonthList as VxeDatePickerDefines.DateMonthItem[]
      return XEUtils.chunk(monthList, 4)
    },
    computeDayList () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { selectMonth, currentDate } = reactData
      const days: VxeDatePickerDefines.DateDayItem[] = []
      if (selectMonth && currentDate) {
        const dateHMSTime = $xeInput.computeDateHMSTime
        const weekDatas = $xeInput.computeWeekDatas
        const currFullYear = currentDate.getFullYear()
        const currMonth = currentDate.getMonth()
        const currDate = currentDate.getDate()
        const selFullYear = selectMonth.getFullYear()
        const selMonth = selectMonth.getMonth()
        const selDay = selectMonth.getDay()
        const prevOffsetDate = -weekDatas.indexOf(selDay)
        const startDayDate = new Date(XEUtils.getWhatDay(selectMonth, prevOffsetDate).getTime() + dateHMSTime)
        for (let index = 0; index < 42; index++) {
          const date = XEUtils.getWhatDay(startDayDate, index)
          const itemFullYear = date.getFullYear()
          const itemMonth = date.getMonth()
          const itemDate = date.getDate()
          const isPrev = date < selectMonth
          days.push({
            date,
            isPrev,
            isCurrent: itemFullYear === selFullYear && itemMonth === selMonth,
            isNow: itemFullYear === currFullYear && itemMonth === currMonth && itemDate === currDate,
            isNext: !isPrev && selMonth !== itemMonth,
            label: itemDate
          })
        }
      }
      return days
    },
    computeDayDatas () {
      const $xeInput = this

      const dayList = $xeInput.computeDayList as VxeDatePickerDefines.DateDayItem[]
      return XEUtils.chunk(dayList, 7)
    },
    computeWeekDates () {
      const $xeInput = this

      const dayDatas = $xeInput.computeDayDatas as VxeDatePickerDefines.DateDayItem[][]
      const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
      return dayDatas.map((list) => {
        const firstItem = list[0]
        const item: VxeDatePickerDefines.DateDayItem = {
          date: firstItem.date,
          isWeekNumber: true,
          isPrev: false,
          isCurrent: false,
          isNow: false,
          isNext: false,
          label: XEUtils.getYearWeek(firstItem.date, firstDayOfWeek)
        }
        return [item].concat(list)
      })
    },
    computeHourList () {
      const $xeInput = this

      const list: VxeDatePickerDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeInput.computeIsDateTimeType
      if (isDateTimeType) {
        for (let index = 0; index < 24; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, '0')
          })
        }
      }
      return list
    },
    computeMinuteList () {
      const $xeInput = this

      const list: VxeDatePickerDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeInput.computeIsDateTimeType
      if (isDateTimeType) {
        for (let index = 0; index < 60; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, '0')
          })
        }
      }
      return list
    },
    computeHasTimeMinute () {
      const $xeInput = this

      const dateValueFormat = $xeInput.computeDateValueFormat as string
      return !/HH/.test(dateValueFormat) || /mm/.test(dateValueFormat)
    },
    computeHasTimeSecond () {
      const $xeInput = this

      const dateValueFormat = $xeInput.computeDateValueFormat as string
      return !/HH/.test(dateValueFormat) || /ss/.test(dateValueFormat)
    },
    computeSecondList () {
      const $xeInput = this

      const minuteList = $xeInput.computeMinuteList as VxeDatePickerDefines.DateHourMinuteSecondItem[]
      return minuteList
    },
    computeInputReadonly () {
      const $xeInput = this
      const props = $xeInput

      const { type, editable, multiple } = props
      const isReadonly = $xeInput.computeIsReadonly
      return isReadonly || multiple || !editable || type === 'week' || type === 'quarter'
    },
    computeInputType (this: any) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const { showPwd } = reactData
      const isNumType = $xeInput.computeIsNumType as boolean
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const isPawdType = $xeInput.computeIsPawdType as boolean
      if (isDatePickerType || isNumType || (isPawdType && showPwd) || type === 'number') {
        return 'text'
      }
      return type
    },
    computeInpPlaceholder () {
      const $xeInput = this
      const props = $xeInput

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      if (XEUtils.eqNull(placeholder)) {
        const globalPlaceholder = getConfig().input.placeholder
        if (globalPlaceholder) {
          return getFuncText(globalPlaceholder)
        }
        return getI18n('vxe.base.pleaseInput')
      }
      return placeholder
    },
    computeInpImmediate () {
      const $xeInput = this
      const props = $xeInput

      const { type, immediate } = props
      return immediate || !(type === 'text' || type === 'number' || type === 'integer' || type === 'float')
    },
    computeNumValue (this: any) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const { inputValue } = reactData
      const isNumType = $xeInput.computeIsNumType as boolean
      if (isNumType) {
        return type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      }
      return 0
    },
    computeIsDisabledSubtractNumber (this: any) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { min } = props
      const { inputValue } = reactData
      const isNumType = $xeInput.computeIsNumType as boolean
      const numValue = $xeInput.computeNumValue as number
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && min !== null) {
        return numValue <= XEUtils.toNumber(min)
      }
      return false
    },
    computeIsDisabledAddNumber (this: any) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { max } = props
      const { inputValue } = reactData
      const isNumType = $xeInput.computeIsNumType as boolean
      const numValue = $xeInput.computeNumValue as number
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && max !== null) {
        return numValue >= XEUtils.toNumber(max)
      }
      return false
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeInputEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeInput = this
      $xeInput.$emit(type, createEvent(evnt, { $input: $xeInput }, params))
    },
    emitModel (value: any) {
      const $xeInput = this
      const props = $xeInput

      const { trim } = props
      const { _events } = $xeInput as any
      if (_events && _events.modelValue) {
        $xeInput.$emit('modelValue', trim ? `${value || ''}`.trim() : value)
      } else {
        $xeInput.$emit('model-value', trim ? `${value || ''}`.trim() : value)
      }
    },
    focus () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const inputElem = $xeInput.$refs.refInputTarget as HTMLInputElement
      reactData.isActivated = true
      inputElem.focus()
      return $xeInput.$nextTick()
    },
    blur () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const inputElem = $xeInput.$refs.refInputTarget as HTMLInputElement
      inputElem.blur()
      reactData.isActivated = false
      return $xeInput.$nextTick()
    },
    select () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const inputElem = $xeInput.$refs.refInputTarget as HTMLInputElement
      inputElem.select()
      reactData.isActivated = false
      return $xeInput.$nextTick()
    },
    parseDate  (value: VxeInputPropTypes.ModelValue, format: string) {
      const $xeInput = this
      const props = $xeInput

      const { type } = props
      if (type === 'time') {
        return toStringTimeDate(value)
      }
      return XEUtils.toStringDate(value, format)
    },
    getNumberValue  (val: any) {
      const $xeInput = this
      const props = $xeInput

      const { type, exponential } = props
      const inpMaxLength = $xeInput.computeInpMaxLength
      const digitsValue = $xeInput.computeDigitsValue
      const restVal = (type === 'float' ? toFloatValueFixed(val, digitsValue) : XEUtils.toValueString(val))
      if (exponential && (val === restVal || XEUtils.toValueString(val).toLowerCase() === XEUtils.toNumber(restVal).toExponential())) {
        return val
      }
      return restVal.slice(0, inpMaxLength)
    },
    triggerEvent (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { inputValue } = reactData
      $xeInput.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    },
    handleChange  (value: string, evnt: Event | { type: string }) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData
      const $xeForm = $xeInput.$xeForm
      const formItemInfo = $xeInput.formItemInfo
      const $xeSelect = $xeInput.$xeSelect
      const $xeTreeSelect = $xeInput.$xeTreeSelect

      if (props.trim) {
        value = `${value || ''}`.trim()
      }
      reactData.inputValue = value
      $xeInput.emitModel(value)
      $xeInput.dispatchEvent('input', { value }, evnt as any)
      if (XEUtils.toValueString(props.value) !== value) {
        $xeInput.dispatchEvent('change', { value }, evnt as any)
        if (!$xeSelect && !$xeTreeSelect) {
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    },
    emitInputEvent (value: any, evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const isDatePickerType = $xeInput.computeIsDatePickerType
      const inpImmediate = $xeInput.computeInpImmediate
      reactData.inputValue = value
      if (!isDatePickerType) {
        if (inpImmediate) {
          $xeInput.handleChange(value, evnt)
        } else {
          $xeInput.dispatchEvent('input', { value }, evnt)
        }
      }
    },
    inputEvent (evnt: Event & { type: 'input' }) {
      const $xeInput = this

      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      $xeInput.emitInputEvent(value, evnt)
    },
    changeEvent  (evnt: Event & { type: 'change' }) {
      const $xeInput = this

      const inpImmediate = $xeInput.computeInpImmediate
      if (!inpImmediate) {
        $xeInput.triggerEvent(evnt)
      }
    },
    blurEvent  (evnt: Event & { type: 'blur' }) {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const $xeForm = $xeInput.$xeForm
      const formItemInfo = $xeInput.formItemInfo
      const $xeSelect = $xeInput.$xeSelect
      const $xeTreeSelect = $xeInput.$xeTreeSelect

      const { inputValue } = reactData
      const value = inputValue
      const inpImmediate = $xeInput.computeInpImmediate
      if (!inpImmediate) {
        $xeInput.handleChange(value, evnt)
      }
      $xeInput.afterCheckValue()
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      $xeInput.dispatchEvent('blur', { value }, evnt)
      if (!$xeSelect && !$xeTreeSelect) {
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    focusEvent  (evnt: Event & { type: 'focus' }) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { inputValue } = reactData
      const isNumType = $xeInput.computeIsNumType
      const isDatePickerType = $xeInput.computeIsDatePickerType
      reactData.isActivated = true
      if (isNumType) {
        reactData.inputValue = eqEmptyValue(inputValue) ? '' : `${XEUtils.toNumber(inputValue)}`
      } else if (isDatePickerType) {
        $xeInput.datePickerOpenEvent(evnt)
      }
      $xeInput.triggerEvent(evnt)
    },
    clickPrefixEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const isDisabled = $xeInput.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeInput.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    },
    hidePanel () {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      return new Promise<void>(resolve => {
        reactData.visiblePanel = false
        internalData.hpTimeout = setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    },
    clearValueEvent (evnt: Event, value: VxeInputPropTypes.ModelValue) {
      const $xeInput = this
      const props = $xeInput

      const { type, autoFocus } = props
      const isNumType = $xeInput.computeIsNumType
      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (isDatePickerType) {
        $xeInput.hidePanel()
      }
      if (autoFocus || autoFocus === null) {
        if (isNumType || ['text', 'search', 'password'].indexOf(type) > -1) {
          $xeInput.focus()
        }
      }
      $xeInput.handleChange('', evnt)
      $xeInput.dispatchEvent('clear', { value }, evnt)
    },
    clickSuffixEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const isDisabled = $xeInput.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeInput.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    },
    dateParseValue (value?: VxeInputPropTypes.ModelValue) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const dateLabelFormat = $xeInput.computeDateLabelFormat
      const dateValueFormat = $xeInput.computeDateValueFormat
      const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
      let dValue: Date | null = null
      let dLabel = ''
      if (value) {
        dValue = $xeInput.parseDate(value, dateValueFormat)
      }
      if (XEUtils.isValidDate(dValue)) {
        dLabel = XEUtils.toDateString(dValue, dateLabelFormat, { firstDay: firstDayOfWeek })
        // 周选择器，由于年份和第几周是冲突的行为，所以需要特殊处理，判断是否跨年，例如
        // '2024-12-31' 'yyyy-MM-dd W' >> '2024-12-31 1'
        // '2025-01-01' 'yyyy-MM-dd W' >> '2025-01-01 1'
        if (dateLabelFormat && type === 'week') {
          const weekNum = XEUtils.getYearWeek(dValue, firstDayOfWeek)
          const weekDate = XEUtils.getWhatWeek(dValue, 0, weekNum === 1 ? ((6 + firstDayOfWeek) % 7) as VxeInputPropTypes.StartDay : firstDayOfWeek, firstDayOfWeek)
          const weekFullYear = weekDate.getFullYear()
          if (weekFullYear !== dValue.getFullYear()) {
            const yyIndex = dateLabelFormat.indexOf('yyyy')
            if (yyIndex > -1) {
              const yyNum = Number(dLabel.substring(yyIndex, yyIndex + 4))
              if (yyNum && !isNaN(yyNum)) {
                dLabel = dLabel.replace(`${yyNum}`, `${weekFullYear}`)
              }
            }
          }
        }
      } else {
        dValue = null
      }
      reactData.datePanelValue = dValue
      reactData.datePanelLabel = dLabel
    },
    /**
     * 值变化时处理
     */
    changeValue  () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const isDatePickerType = $xeInput.computeIsDatePickerType
      const { inputValue } = reactData
      if (isDatePickerType) {
        $xeInput.dateParseValue(inputValue)
        reactData.inputValue = props.multiple ? $xeInput.computeDateMultipleLabel : reactData.datePanelLabel
      }
    },
    /**
     * 检查初始值
     */
    initValue  () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const { inputValue } = reactData
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const digitsValue = $xeInput.computeDigitsValue
      if (isDatePickerType) {
        $xeInput.changeValue()
      } else if (type === 'float') {
        if (inputValue) {
          const validValue = toFloatValueFixed(inputValue, digitsValue)
          if (inputValue !== validValue) {
            $xeInput.handleChange(validValue, { type: 'init' })
          }
        }
      }
    },
    validMaxNum  (num: number | string) {
      const $xeInput = this
      const props = $xeInput

      return props.max === null || XEUtils.toNumber(num) <= XEUtils.toNumber(props.max)
    },
    validMinNum (num: number | string) {
      const $xeInput = this
      const props = $xeInput

      return props.min === null || XEUtils.toNumber(num) >= XEUtils.toNumber(props.min)
    },
    dateRevert () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      reactData.inputValue = props.multiple ? $xeInput.computeDateMultipleLabel : reactData.datePanelLabel
    },
    dateCheckMonth (date: Date) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
      const weekNum = XEUtils.getYearWeek(date, firstDayOfWeek)
      const weekStartDate = XEUtils.getWhatWeek(date, 0, firstDayOfWeek, firstDayOfWeek)
      const month = XEUtils.getWhatMonth(weekNum === 1 ? XEUtils.getWhatDay(weekStartDate, 6) : date, 0, 'first')
      if (!XEUtils.isEqual(month, reactData.selectMonth)) {
        reactData.selectMonth = month
      }
    },
    dateChange (date: Date) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datetimePanelValue } = reactData
      const isDateTimeType = $xeInput.computeIsDateTimeType
      const dateValueFormat = $xeInput.computeDateValueFormat
      const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeInputPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      } else if (isDateTimeType) {
        date.setHours(datetimePanelValue.getHours())
        date.setMinutes(datetimePanelValue.getMinutes())
        date.setSeconds(datetimePanelValue.getSeconds())
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      $xeInput.dateCheckMonth(date)
      if (multiple) {
        // 如果为多选
        const dateMultipleValue = $xeInput.computeDateMultipleValue
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = [...$xeInput.computeDateListValue]
          const datetimeRest: Date[] = []
          const eqIndex = XEUtils.findIndexOf(dateListValue, val => XEUtils.isDateSame(date, val, 'yyyyMMdd'))
          if (eqIndex === -1) {
            dateListValue.push(date)
          } else {
            dateListValue.splice(eqIndex, 1)
          }
          dateListValue.forEach(item => {
            if (item) {
              item.setHours(datetimePanelValue.getHours())
              item.setMinutes(datetimePanelValue.getMinutes())
              item.setSeconds(datetimePanelValue.getSeconds())
              datetimeRest.push(item)
            }
          })
          $xeInput.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            $xeInput.handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            $xeInput.handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(props.value, inpVal)) {
          $xeInput.handleChange(inpVal, { type: 'update' })
        }
      }
    },
    afterCheckValue () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type, min, max, exponential } = props
      const { inputValue, datetimePanelValue } = reactData
      const isNumType = $xeInput.computeIsNumType
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const dateLabelFormat = $xeInput.computeDateLabelFormat
      const inputReadonly = $xeInput.computeInputReadonly
      if (!inputReadonly) {
        if (isNumType) {
          if (inputValue) {
            const inpVal = `${handleNumber(inputValue)}`
            if (inpVal) {
              let inpNumVal: number | string = type === 'integer' ? XEUtils.toInteger(inpVal) : XEUtils.toNumber(inpVal)
              if (!$xeInput.validMinNum(inpNumVal)) {
                inpNumVal = min
              } else if (!$xeInput.validMaxNum(inpNumVal)) {
                inpNumVal = max
              }
              if (exponential) {
                const inpStringVal = XEUtils.toValueString(inputValue).toLowerCase()
                if (inpStringVal === XEUtils.toNumber(inpNumVal).toExponential()) {
                  inpNumVal = inpStringVal
                }
              }
              $xeInput.handleChange($xeInput.getNumberValue(inpNumVal), { type: 'check' })
            } else {
              // 输入错误字符，清空
              let inpValue = ''
              if (min || min === 0) {
                inpValue = `${min}`
              }
              $xeInput.handleChange(inpValue, { type: 'check' })
            }
          }
        } else if (isDatePickerType) {
          if (inputValue) {
            let inpDateVal: VxeInputPropTypes.ModelValue = $xeInput.parseDate(inputValue, dateLabelFormat as string)
            if (XEUtils.isValidDate(inpDateVal)) {
              if (type === 'time') {
                inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
                if (inputValue !== inpDateVal) {
                  $xeInput.handleChange(inpDateVal, { type: 'check' })
                }
                reactData.inputValue = inpDateVal
              } else {
                let isChange = false
                const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
                if (type === 'datetime') {
                  const dateValue = $xeInput.computeDateValue
                  if (inputValue !== XEUtils.toDateString(dateValue, dateLabelFormat) || inputValue !== XEUtils.toDateString(inpDateVal, dateLabelFormat)) {
                    isChange = true
                    datetimePanelValue.setHours(inpDateVal.getHours())
                    datetimePanelValue.setMinutes(inpDateVal.getMinutes())
                    datetimePanelValue.setSeconds(inpDateVal.getSeconds())
                  }
                } else {
                  isChange = true
                }
                reactData.inputValue = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
                if (isChange) {
                  $xeInput.dateChange(inpDateVal)
                }
              }
            } else {
              $xeInput.dateRevert()
            }
          } else {
            $xeInput.handleChange('', { type: 'check' })
          }
        }
      }
    },
    // 密码
    passwordToggleEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { showPwd } = reactData
      const isDisabled = $xeInput.computeIsDisabled
      const isReadonly = $xeInput.computeIsReadonly
      if (!isDisabled && !isReadonly) {
        reactData.showPwd = !showPwd
      }
      $xeInput.dispatchEvent('toggle-visible', { visible: reactData.showPwd }, evnt)
    },
    // 搜索
    searchEvent  (evnt: Event) {
      const $xeInput = this

      $xeInput.dispatchEvent('search-click', {}, evnt)
    },
    // 数值
    numberChange (isPlus: boolean, evnt: Event) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { min, max, type } = props
      const { inputValue } = reactData
      const stepValue = $xeInput.computeStepValue
      const numValue = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      const newValue = isPlus ? XEUtils.add(numValue, stepValue) : XEUtils.subtract(numValue, stepValue)
      let restNum: number | string
      if (!$xeInput.validMinNum(newValue)) {
        restNum = min
      } else if (!$xeInput.validMaxNum(newValue)) {
        restNum = max
      } else {
        restNum = newValue
      }
      $xeInput.emitInputEvent($xeInput.getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    },
    numberNextEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const isDisabled = $xeInput.computeIsDisabled
      const isReadonly = $xeInput.computeIsReadonly
      const isDisabledSubtractNumber = $xeInput.computeIsDisabledSubtractNumber
      $xeInput.numberStopDown()
      if (!isDisabled && !isReadonly && !isDisabledSubtractNumber) {
        $xeInput.numberChange(false, evnt)
      }
      $xeInput.dispatchEvent('next-number', { value: reactData.inputValue }, evnt)
    },
    numberDownNextEvent (evnt: Event) {
      const $xeInput = this
      const internalData = $xeInput.internalData

      internalData.dnTimeout = setTimeout(() => {
        $xeInput.numberNextEvent(evnt)
        $xeInput.numberDownNextEvent(evnt)
      }, 60)
    },
    numberPrevEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const isDisabled = $xeInput.computeIsDisabled
      const isReadonly = $xeInput.computeIsReadonly
      const isDisabledAddNumber = $xeInput.computeIsDisabledAddNumber
      $xeInput.numberStopDown()
      if (!isDisabled && !isReadonly && !isDisabledAddNumber) {
        $xeInput.numberChange(true, evnt)
      }
      $xeInput.dispatchEvent('prev-number', { value: reactData.inputValue }, evnt)
    },
    numberKeydownEvent (evnt: KeyboardEvent) {
      const $xeInput = this

      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (isUpArrow || isDwArrow) {
        evnt.preventDefault()
        if (isUpArrow) {
          $xeInput.numberPrevEvent(evnt)
        } else {
          $xeInput.numberNextEvent(evnt)
        }
      }
    },
    keydownEvent  (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeInput = this
      const props = $xeInput

      const { type, exponential, controls } = props
      const isNumType = $xeInput.computeIsNumType
      if (isNumType) {
        const isControlKey = hasControlKey(evnt)
        const isShiftKey = evnt.shiftKey
        const isAltKey = evnt.altKey
        const keyCode = evnt.keyCode
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
        if (!isControlKey && !isShiftKey && !isAltKey) {
          if (globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR) || (type === 'integer' && keyCode === 110) || ((!exponential || keyCode !== 69) && (keyCode >= 65 && keyCode <= 90)) || (keyCode >= 186 && keyCode <= 188) || keyCode >= 191) {
            evnt.preventDefault()
          }
        }
        if (isEsc) {
          $xeInput.afterCheckValue()
        } else if (isUpArrow || isDwArrow) {
          if (controls) {
            $xeInput.numberKeydownEvent(evnt)
          }
        }
      }
      $xeInput.triggerEvent(evnt)
    },
    keyupEvent  (evnt: KeyboardEvent & { type: 'keyup' }) {
      const $xeInput = this

      $xeInput.triggerEvent(evnt)
    },
    // 数值
    numberStopDown  () {
      const $xeInput = this
      const internalData = $xeInput.internalData

      const { dnTimeout } = internalData
      if (dnTimeout) {
        clearTimeout(dnTimeout)
        internalData.dnTimeout = undefined
      }
    },
    numberDownPrevEvent  (evnt: Event) {
      const $xeInput = this
      const internalData = $xeInput.internalData

      internalData.dnTimeout = setTimeout(() => {
        $xeInput.numberPrevEvent(evnt)
        $xeInput.numberDownPrevEvent(evnt)
      }, 60)
    },
    numberMousedownEvent  (evnt: MouseEvent) {
      const $xeInput = this
      const internalData = $xeInput.internalData

      $xeInput.numberStopDown()
      if (evnt.button === 0) {
        const isPrevNumber = hasClass(evnt.currentTarget, 'is--prev')
        if (isPrevNumber) {
          $xeInput.numberPrevEvent(evnt)
        } else {
          $xeInput.numberNextEvent(evnt)
        }
        internalData.dnTimeout = setTimeout(() => {
          if (isPrevNumber) {
            $xeInput.numberDownPrevEvent(evnt)
          } else {
            $xeInput.numberDownNextEvent(evnt)
          }
        }, 500)
      }
    },
    wheelEvent  (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const isNumType = $xeInput.computeIsNumType
      if (isNumType && props.controls) {
        if (reactData.isActivated) {
          const delta = evnt.deltaY
          if (delta > 0) {
            $xeInput.numberNextEvent(evnt)
          } else if (delta < 0) {
            $xeInput.numberPrevEvent(evnt)
          }
          evnt.preventDefault()
        }
      }
      $xeInput.triggerEvent(evnt)
    },
    // 日期
    dateMonthHandle  (date: Date, offsetMonth: number) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
      const weekNum = XEUtils.getYearWeek(date, firstDayOfWeek)
      const weekStartDate = XEUtils.getWhatWeek(date, 0, firstDayOfWeek, firstDayOfWeek)
      const month = XEUtils.getWhatMonth(weekNum === 1 ? XEUtils.getWhatDay(weekStartDate, 6) : date, offsetMonth, 'first')
      reactData.selectMonth = month
    },
    dateNowHandle () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      reactData.currentDate = currentDate
      $xeInput.dateMonthHandle(currentDate, 0)
    },
    dateToggleYearTypeEvent () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.datePanelType = 'year'
    },
    dateToggleMonthTypeEvent () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
    },
    datePrevEvent  (evnt: Event) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { type } = props
      const { datePanelType, selectMonth, inputValue } = reactData
      const { yearSize } = internalData
      const value = inputValue
      const isDisabledPrevDateBtn = $xeInput.computeIsDisabledPrevDateBtn
      if (!isDisabledPrevDateBtn) {
        let viewDate
        if (type === 'year') {
          viewDate = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            viewDate = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
          } else {
            viewDate = XEUtils.getWhatYear(selectMonth, -1, 'first')
          }
        } else {
          if (datePanelType === 'year') {
            viewDate = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
          } else if (datePanelType === 'month') {
            viewDate = XEUtils.getWhatYear(selectMonth, -1, 'first')
          } else {
            viewDate = XEUtils.getWhatMonth(selectMonth, -1, 'first')
          }
        }
        reactData.selectMonth = viewDate
        $xeInput.dispatchEvent('date-prev', { viewType: datePanelType, viewDate, value, type }, evnt)
      }
    },
    dateTodayMonthEvent  (evnt: Event) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      $xeInput.dateNowHandle()
      if (!props.multiple) {
        $xeInput.dateChange(reactData.currentDate)
        $xeInput.hidePanel()
      }
      $xeInput.dispatchEvent('date-today', { type: props.type }, evnt)
    },
    dateNextEvent  (evnt: Event) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { type } = props
      const { datePanelType, selectMonth, inputValue } = reactData
      const { yearSize } = internalData
      const value = inputValue
      const isDisabledNextDateBtn = $xeInput.computeIsDisabledNextDateBtn
      if (!isDisabledNextDateBtn) {
        let viewDate
        if (type === 'year') {
          viewDate = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            viewDate = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
          } else {
            viewDate = XEUtils.getWhatYear(selectMonth, 1, 'first')
          }
        } else {
          if (datePanelType === 'year') {
            viewDate = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
          } else if (datePanelType === 'month') {
            viewDate = XEUtils.getWhatYear(selectMonth, 1, 'first')
          } else {
            viewDate = XEUtils.getWhatMonth(selectMonth, 1, 'first')
          }
        }
        reactData.selectMonth = viewDate
        $xeInput.dispatchEvent('date-next', { viewType: datePanelType, viewDate, value, type }, evnt)
      }
    },
    isDateDisabled (item: { date: Date }) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { disabledMethod } = props
      const { datePanelType } = reactData
      const dateStartTime = $xeInput.computeDateStartTime
      const dateEndTime = $xeInput.computeDateEndTime
      const { date } = item
      if (dateStartTime && dateStartTime.getTime() > date.getTime()) {
        return true
      }
      if (dateEndTime && dateEndTime.getTime() < date.getTime()) {
        return true
      }
      if (disabledMethod) {
        return disabledMethod({ type: datePanelType, viewType: datePanelType, date, $input: $xeInput as VxeInputConstructor })
      }
      return false
    },
    dateSelectItem (date: Date) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type, multiple } = props
      const { datePanelType } = reactData
      if (type === 'month') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeInput.dateCheckMonth(date)
        } else {
          $xeInput.dateChange(date)
          if (!multiple) {
            $xeInput.hidePanel()
          }
        }
      } else if (type === 'year') {
        $xeInput.dateChange(date)
        if (!multiple) {
          $xeInput.hidePanel()
        }
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          $xeInput.dateCheckMonth(date)
        } else {
          $xeInput.dateChange(date)
          if (!multiple) {
            $xeInput.hidePanel()
          }
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          $xeInput.dateCheckMonth(date)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeInput.dateCheckMonth(date)
        } else {
          $xeInput.dateChange(date)
          if (type === 'datetime') {
            // 日期带时间
          } else {
            if (!multiple) {
              $xeInput.hidePanel()
            }
          }
        }
      }
    },
    dateSelectEvent  (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeInput = this

      if (!$xeInput.isDateDisabled(item)) {
        $xeInput.dateSelectItem(item.date)
      }
    },
    dateMoveDay  (offsetDay: Date) {
      const $xeInput = this

      if (!$xeInput.isDateDisabled({ date: offsetDay })) {
        const dayList = $xeInput.computeDayList
        if (!dayList.some((item) => XEUtils.isDateSame(item.date, offsetDay, 'yyyyMMdd'))) {
          $xeInput.dateCheckMonth(offsetDay)
        }
        $xeInput.dateParseValue(offsetDay)
      }
    },
    dateMoveYear  (offsetYear: Date) {
      const $xeInput = this

      if (!$xeInput.isDateDisabled({ date: offsetYear })) {
        const yearList = $xeInput.computeYearList
        if (!yearList.some((item) => XEUtils.isDateSame(item.date, offsetYear, 'yyyy'))) {
          $xeInput.dateCheckMonth(offsetYear)
        }
        $xeInput.dateParseValue(offsetYear)
      }
    },
    dateMoveQuarter  (offsetQuarter: Date) {
      const $xeInput = this

      if (!$xeInput.isDateDisabled({ date: offsetQuarter })) {
        const quarterList = $xeInput.computeQuarterList
        if (!quarterList.some((item) => XEUtils.isDateSame(item.date, offsetQuarter, 'yyyyq'))) {
          $xeInput.dateCheckMonth(offsetQuarter)
        }
        $xeInput.dateParseValue(offsetQuarter)
      }
    },
    dateMoveMonth  (offsetMonth: Date) {
      const $xeInput = this

      if (!$xeInput.isDateDisabled({ date: offsetMonth })) {
        const monthList = $xeInput.computeMonthList
        if (!monthList.some((item) => XEUtils.isDateSame(item.date, offsetMonth, 'yyyyMM'))) {
          $xeInput.dateCheckMonth(offsetMonth)
        }
        $xeInput.dateParseValue(offsetMonth)
      }
    },
    dateMouseenterEvent  (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      if (!$xeInput.isDateDisabled(item)) {
        const { datePanelType } = reactData
        if (datePanelType === 'month') {
          $xeInput.dateMoveMonth(item.date)
        } else if (datePanelType === 'quarter') {
          $xeInput.dateMoveQuarter(item.date)
        } else if (datePanelType === 'year') {
          $xeInput.dateMoveYear(item.date)
        } else {
          $xeInput.dateMoveDay(item.date)
        }
      }
    },
    updateTimePos (liElem: Element) {
      if (liElem) {
        const height = (liElem as HTMLElement).offsetHeight
        const ulElem = liElem.parentNode as HTMLElement
        ulElem.scrollTop = (liElem as HTMLElement).offsetTop - height * 4
      }
    },
    dateTimeChangeEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.datetimePanelValue = new Date(reactData.datetimePanelValue.getTime())
      $xeInput.updateTimePos(evnt.currentTarget as HTMLLIElement)
    },
    dateHourEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.datetimePanelValue.setHours(item.value)
      $xeInput.dateTimeChangeEvent(evnt)
    },
    dateConfirmEvent () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datetimePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const isDateTimeType = $xeInput.computeIsDateTimeType
      if (isDateTimeType) {
        const dateValueFormat = $xeInput.computeDateValueFormat
        if (multiple) {
          // 如果为多选
          const dateMultipleValue = $xeInput.computeDateMultipleValue
          if (isDateTimeType) {
            // 如果是datetime特殊类型
            const dateListValue = [...$xeInput.computeDateListValue]
            const datetimeRest: Date[] = []
            dateListValue.forEach(item => {
              if (item) {
                item.setHours(datetimePanelValue.getHours())
                item.setMinutes(datetimePanelValue.getMinutes())
                item.setSeconds(datetimePanelValue.getSeconds())
                datetimeRest.push(item)
              }
            })
            $xeInput.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
          } else {
            // 如果是日期类型
            $xeInput.handleChange(dateMultipleValue.join(','), { type: 'update' })
          }
        } else {
          $xeInput.dateChange(dateValue || reactData.currentDate)
        }
      }
      $xeInput.hidePanel()
    },
    dateMinuteEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.datetimePanelValue.setMinutes(item.value)
      $xeInput.dateTimeChangeEvent(evnt)
    },
    dateSecondEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.datetimePanelValue.setSeconds(item.value)
      $xeInput.dateTimeChangeEvent(evnt)
    },
    dateOffsetEvent  (evnt: KeyboardEvent) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { isActivated, datePanelValue, datePanelType } = reactData
      if (isActivated) {
        evnt.preventDefault()
        const isLeftArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isRightArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
        const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
        if (datePanelType === 'year') {
          let offsetYear = XEUtils.getWhatYear(datePanelValue || Date.now(), 0, 'first')
          if (isLeftArrow) {
            offsetYear = XEUtils.getWhatYear(offsetYear, -1)
          } else if (isUpArrow) {
            offsetYear = XEUtils.getWhatYear(offsetYear, -4)
          } else if (isRightArrow) {
            offsetYear = XEUtils.getWhatYear(offsetYear, 1)
          } else if (isDwArrow) {
            offsetYear = XEUtils.getWhatYear(offsetYear, 4)
          }
          $xeInput.dateMoveYear(offsetYear)
        } else if (datePanelType === 'quarter') {
          let offsetQuarter = XEUtils.getWhatQuarter(datePanelValue || Date.now(), 0, 'first')
          if (isLeftArrow) {
            offsetQuarter = XEUtils.getWhatQuarter(offsetQuarter, -1)
          } else if (isUpArrow) {
            offsetQuarter = XEUtils.getWhatQuarter(offsetQuarter, -2)
          } else if (isRightArrow) {
            offsetQuarter = XEUtils.getWhatQuarter(offsetQuarter, 1)
          } else if (isDwArrow) {
            offsetQuarter = XEUtils.getWhatQuarter(offsetQuarter, 2)
          }
          $xeInput.dateMoveQuarter(offsetQuarter)
        } else if (datePanelType === 'month') {
          let offsetMonth = XEUtils.getWhatMonth(datePanelValue || Date.now(), 0, 'first')
          if (isLeftArrow) {
            offsetMonth = XEUtils.getWhatMonth(offsetMonth, -1)
          } else if (isUpArrow) {
            offsetMonth = XEUtils.getWhatMonth(offsetMonth, -4)
          } else if (isRightArrow) {
            offsetMonth = XEUtils.getWhatMonth(offsetMonth, 1)
          } else if (isDwArrow) {
            offsetMonth = XEUtils.getWhatMonth(offsetMonth, 4)
          }
          $xeInput.dateMoveMonth(offsetMonth)
        } else {
          let offsetDay = datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
          const firstDayOfWeek = $xeInput.computeFirstDayOfWeek
          if (isLeftArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, -1)
          } else if (isUpArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, -1, firstDayOfWeek)
          } else if (isRightArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, 1)
          } else if (isDwArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, 1, firstDayOfWeek)
          }
          $xeInput.dateMoveDay(offsetDay)
        }
      }
    },
    datePgOffsetEvent  (evnt: KeyboardEvent) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { isActivated } = reactData
      if (isActivated) {
        const isPgUp = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.PAGE_UP)
        evnt.preventDefault()
        if (isPgUp) {
          $xeInput.datePrevEvent(evnt)
        } else {
          $xeInput.dateNextEvent(evnt)
        }
      }
    },
    dateOpenPanel  () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const isDateTimeType = $xeInput.computeIsDateTimeType
      const dateValue = $xeInput.computeDateValue
      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        reactData.datePanelType = type as 'year' | 'quarter' | 'month' | 'week'
      } else {
        reactData.datePanelType = 'day'
      }
      reactData.currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      if (dateValue) {
        $xeInput.dateMonthHandle(dateValue, 0)
        $xeInput.dateParseValue(dateValue)
      } else {
        $xeInput.dateNowHandle()
      }
      if (isDateTimeType) {
        reactData.datetimePanelValue = reactData.datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
        $xeInput.$nextTick(() => {
          const timeBodyElem = $xeInput.$refs.refInputTimeBody as HTMLDivElement
          XEUtils.arrayEach(timeBodyElem.querySelectorAll('li.is--selected'), (elem) => {
            $xeInput.updateTimePos(elem)
          })
        })
      }
    },
    // 弹出面板
    updateZindex  () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      return $xeInput.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const targetElem = $xeInput.$refs.refInputTarget as HTMLInputElement
        const panelElem = $xeInput.$refs.refInputPanel as HTMLDivElement
        const btnTransfer = $xeInput.computeBtnTransfer
        if (targetElem && panelElem) {
          const targetHeight = targetElem.offsetHeight
          const targetWidth = targetElem.offsetWidth
          const panelHeight = panelElem.offsetHeight
          const panelWidth = panelElem.offsetWidth
          const marginSize = 5
          const panelStyle: VxeComponentStyleType = {
            zIndex: panelIndex
          }
          const { boundingTop, boundingLeft, visibleHeight, visibleWidth } = getAbsolutePos(targetElem)
          let panelPlacement: VxeInputPropTypes.Placement = 'bottom'
          if (btnTransfer) {
            let left = boundingLeft
            let top = boundingTop + targetHeight
            if (placement === 'top') {
              panelPlacement = 'top'
              top = boundingTop - panelHeight
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (top + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top'
                top = boundingTop - panelHeight
              }
              // 如果上面不够放，则向下（优先）
              if (top < marginSize) {
                panelPlacement = 'bottom'
                top = boundingTop + targetHeight
              }
            }
            // 如果溢出右边
            if (left + panelWidth + marginSize > visibleWidth) {
              left -= left + panelWidth + marginSize - visibleWidth
            }
            // 如果溢出左边
            if (left < marginSize) {
              left = marginSize
            }
            Object.assign(panelStyle, {
              left: `${left}px`,
              top: `${top}px`,
              minWidth: `${targetWidth}px`
            })
          } else {
            if (placement === 'top') {
              panelPlacement = 'top'
              panelStyle.bottom = `${targetHeight}px`
            } else if (!placement) {
              // 如果下面不够放，则向上
              panelStyle.top = `${targetHeight}px`
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top'
                  panelStyle.top = ''
                  panelStyle.bottom = `${targetHeight}px`
                }
              }
            }
          }
          reactData.panelStyle = panelStyle
          reactData.panelPlacement = panelPlacement
          return $xeInput.$nextTick()
        }
      })
    },
    showPanel  () {
      const $xeInput = this
      const reactData = $xeInput.reactData
      const internalData = $xeInput.internalData

      const { visiblePanel } = reactData
      const { hpTimeout } = internalData
      const isDisabled = $xeInput.computeIsDisabled
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const btnTransfer = $xeInput.computeBtnTransfer
      if (!isDisabled && !visiblePanel) {
        const panelElem = $xeInput.$refs.refInputPanel as HTMLElement
        if (!reactData.initialized) {
          reactData.initialized = true
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        if (hpTimeout) {
          clearTimeout(hpTimeout)
          internalData.hpTimeout = undefined
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (isDatePickerType) {
          $xeInput.dateOpenPanel()
        }
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        $xeInput.updateZindex()
        return $xeInput.updatePlacement()
      }
      return $xeInput.$nextTick()
    },
    datePickerOpenEvent  (evnt: Event) {
      const $xeInput = this

      const isReadonly = $xeInput.computeIsReadonly
      if (!isReadonly) {
        evnt.preventDefault()
        $xeInput.showPanel()
      }
    },
    clickEvent (evnt: Event & { type: 'click' }) {
      const $xeInput = this

      $xeInput.triggerEvent(evnt)
    },
    handleGlobalMousedownEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { visiblePanel, isActivated } = reactData
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const el = $xeInput.$refs.refElem as HTMLDivElement
      const panelWrapperElem = $xeInput.$refs.refPanelWrapper as HTMLDivElement
      const isDisabled = $xeInput.computeIsDisabled
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          // 如果是日期类型
          if (isDatePickerType) {
            if (visiblePanel) {
              $xeInput.hidePanel()
              $xeInput.afterCheckValue()
            }
          } else {
            $xeInput.afterCheckValue()
          }
        }
      }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { clearable } = props
      const { visiblePanel } = reactData
      const isDisabled = $xeInput.computeIsDisabled
      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isDel = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
        const isLeftArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
        const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
        const isRightArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
        const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
        const isPgUp = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.PAGE_UP)
        const isPgDn = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.PAGE_DOWN)
        const operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow
        let isActivated = reactData.isActivated
        if (isTab) {
          if (isActivated) {
            $xeInput.afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        } else if (operArrow) {
          if (isDatePickerType) {
            if (isActivated) {
              if (visiblePanel) {
                $xeInput.dateOffsetEvent(evnt)
              } else if (isUpArrow || isDwArrow) {
                $xeInput.datePickerOpenEvent(evnt)
              }
            }
          }
        } else if (isEnter) {
          if (isDatePickerType) {
            if (visiblePanel) {
              if (reactData.datePanelValue) {
                $xeInput.dateSelectItem(reactData.datePanelValue)
              } else {
                $xeInput.hidePanel()
              }
            } else if (isActivated) {
              $xeInput.datePickerOpenEvent(evnt)
            }
          }
        } else if (isPgUp || isPgDn) {
          if (isDatePickerType) {
            if (isActivated) {
              $xeInput.datePgOffsetEvent(evnt)
            }
          }
        }
        if (isTab || isEsc) {
          if (visiblePanel) {
            $xeInput.hidePanel()
          }
        } else if (isDel && clearable) {
          if (isActivated) {
            $xeInput.clearValueEvent(evnt, null)
          }
        }
      }
    },
    handleGlobalMousewheelEvent  (evnt: Event) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeInput.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelWrapperElem = $xeInput.$refs.refPanelWrapper as HTMLDivElement
          if (getEventTargetNode(evnt, panelWrapperElem).flag) {
            $xeInput.updatePlacement()
          } else {
            $xeInput.hidePanel()
            $xeInput.afterCheckValue()
          }
        }
      }
    },
    handleGlobalBlurEvent  () {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        $xeInput.hidePanel()
        $xeInput.afterCheckValue()
      } else if (isActivated) {
        $xeInput.afterCheckValue()
      }
    },

    //
    // Render
    //
    renderDateLabel (h: CreateElement, item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem, label: string | number) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { festivalMethod } = props
      if (festivalMethod) {
        const { datePanelType } = reactData
        const festivalRest = festivalMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $input: $xeInput as VxeInputConstructor })
        const festivalItem = festivalRest ? (XEUtils.isString(festivalRest) ? { label: festivalRest } : festivalRest) : {}
        const extraItem = festivalItem.extra ? (XEUtils.isString(festivalItem.extra) ? { label: festivalItem.extra } : festivalItem.extra) : null
        const labels = [
          h('span', {
            class: ['vxe-input--date-label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('span', `${label || ''}`),
                h('span', {
                  class: ['vxe-input--date-label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
                  style: extraItem.style
                }, XEUtils.toValueString(extraItem.label))
              ]
            : [`${label || ''}`])
        ]
        const festivalLabel = festivalItem.label
        if (festivalLabel) {
          // 默认最多支持3个节日重叠
          const festivalLabels = XEUtils.toValueString(festivalLabel).split(',')
          labels.push(
            h('span', {
              class: ['vxe-input--date-festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
              style: festivalItem.style
            }, [
              festivalLabels.length > 1
                ? h('span', {
                  class: ['vxe-input--date-festival--overlap', `overlap--${festivalLabels.length}`]
                }, festivalLabels.map(label => h('span', label.substring(0, 3))))
                : h('span', {
                  class: 'vxe-input--date-festival--label'
                }, festivalLabels[0].substring(0, 3))
            ])
          )
        }
        return labels
      }
      return [`${label || ''}`]
    },
    renderDateDayTable (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const dateHeaders = $xeInput.computeDateHeaders
      const dayDatas = $xeInput.computeDayDatas
      const dateListValue = $xeInput.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-input--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('thead', [
            h('tr', dateHeaders.map((item) => {
              return h('th', item.label)
            }))
          ]),
          h('tbody', dayDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeInput.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeInput.dateSelectEvent(item),
                  mouseenter: () => $xeInput.dateMouseenterEvent(item)
                }
              }, $xeInput.renderDateLabel(h, item, item.label))
            }))
          }))
        ])
      ]
    },
    renderDateWeekTable  (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const weekHeaders = $xeInput.computeWeekHeaders
      const weekDates = $xeInput.computeWeekDates
      const dateListValue = $xeInput.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-input--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('thead', [
            h('tr', weekHeaders.map((item) => {
              return h('th', item.label)
            }))
          ]),
          h('tbody', weekDates.map((rows) => {
            const isSelected = multiple ? rows.some((item) => dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat))) : rows.some((item) => XEUtils.isDateSame(dateValue, item.date, matchFormat))
            const isHover = rows.some((item) => XEUtils.isDateSame(datePanelValue, item.date, matchFormat))
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeInput.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': isHover
                },
                on: {
                  click: () => $xeInput.dateSelectEvent(item),
                  mouseenter: () => $xeInput.dateMouseenterEvent(item)
                }
              }, $xeInput.renderDateLabel(h, item, item.label))
            }))
          }))
        ])
      ]
    },
    renderDateMonthTable (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const monthDatas = $xeInput.computeMonthDatas
      const dateListValue = $xeInput.computeDateListValue
      const matchFormat = 'yyyyMM'
      return [
        h('table', {
          class: `vxe-input--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', monthDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeInput.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeInput.dateSelectEvent(item),
                  mouseenter: () => $xeInput.dateMouseenterEvent(item)
                }
              }, $xeInput.renderDateLabel(h, item, getI18n(`vxe.input.date.months.m${item.month}`)))
            }))
          }))
        ])
      ]
    },
    renderDateQuarterTable (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const quarterDatas = $xeInput.computeQuarterDatas
      const dateListValue = $xeInput.computeDateListValue
      const matchFormat = 'yyyyq'
      return [
        h('table', {
          class: `vxe-input--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', quarterDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeInput.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeInput.dateSelectEvent(item),
                  mouseenter: () => $xeInput.dateMouseenterEvent(item)
                }
              }, $xeInput.renderDateLabel(h, item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
            }))
          }))
        ])
      ]
    },
    renderDateYearTable  (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeInput.computeDateValue
      const yearDatas = $xeInput.computeYearDatas
      const dateListValue = $xeInput.computeDateListValue
      const matchFormat = 'yyyy'
      return [
        h('table', {
          class: `vxe-input--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', yearDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeInput.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeInput.dateSelectEvent(item),
                  mouseenter: () => $xeInput.dateMouseenterEvent(item)
                }
              }, $xeInput.renderDateLabel(h, item, item.year))
            }))
          }))
        ])
      ]
    },
    renderDateTable  (h: CreateElement) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { datePanelType } = reactData
      switch (datePanelType) {
        case 'week' :
          return $xeInput.renderDateWeekTable(h)
        case 'month' :
          return $xeInput.renderDateMonthTable(h)
        case 'quarter' :
          return $xeInput.renderDateQuarterTable(h)
        case 'year' :
          return $xeInput.renderDateYearTable(h)
      }
      return $xeInput.renderDateDayTable(h)
    },
    renderDatePanel  (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { multiple } = props
      const { datePanelType } = reactData
      const isDisabledPrevDateBtn = $xeInput.computeIsDisabledPrevDateBtn
      const isDisabledNextDateBtn = $xeInput.computeIsDisabledNextDateBtn
      const selectDatePanelObj = $xeInput.computeSelectDatePanelObj
      return [
        h('div', {
          class: 'vxe-input--date-picker-header'
        }, [
          h('div', {
            class: 'vxe-input--date-picker-type-wrapper'
          }, [
            datePanelType === 'year'
              ? h('span', {
                class: 'vxe-input--date-picker-label'
              }, selectDatePanelObj.y)
              : h('span', {
                class: 'vxe-input--date-picker-btns'
              }, [
                h('span', {
                  class: 'vxe-input--date-picker-btn',
                  on: {
                    click: $xeInput.dateToggleYearTypeEvent
                  }
                }, selectDatePanelObj.y),
                selectDatePanelObj.m
                  ? h('span', {
                    class: 'vxe-input--date-picker-btn',
                    on: {
                      click: $xeInput.dateToggleMonthTypeEvent
                    }
                  }, selectDatePanelObj.m)
                  : renderEmptyElement($xeInput)
              ])
          ]),
          h('div', {
            class: 'vxe-input--date-picker-btn-wrapper'
          }, [
            h('span', {
              class: ['vxe-input--date-picker-btn vxe-input--date-picker-prev-btn', {
                'is--disabled': isDisabledPrevDateBtn
              }],
              on: {
                click: $xeInput.datePrevEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-left'
              })
            ]),
            h('span', {
              class: 'vxe-input--date-picker-btn vxe-input--date-picker-current-btn',
              on: {
                click: $xeInput.dateTodayMonthEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-dot'
              })
            ]),
            h('span', {
              class: ['vxe-input--date-picker-btn vxe-input--date-picker-next-btn', {
                'is--disabled': isDisabledNextDateBtn
              }],
              on: {
                click: $xeInput.dateNextEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-right'
              })
            ]),
            multiple && $xeInput.computeSupportMultiples
              ? h('span', {
                class: 'vxe-input--date-picker-btn vxe-input--date-picker-confirm-btn'
              }, [
                h('button', {
                  class: 'vxe-input--date-picker-confirm',
                  attrs: {
                    type: 'button'
                  },
                  on: {
                    click: $xeInput.dateConfirmEvent
                  }
                }, getI18n('vxe.button.confirm'))
              ])
              : null
          ])
        ]),
        h('div', {
          class: 'vxe-input--date-picker-body'
        }, $xeInput.renderDateTable(h))
      ]
    },
    renderTimePanel  (h: CreateElement) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { datetimePanelValue } = reactData
      const dateTimeLabel = $xeInput.computeDateTimeLabel
      const hourList = $xeInput.computeHourList
      const hasTimeMinute = $xeInput.computeHasTimeMinute
      const minuteList = $xeInput.computeMinuteList
      const hasTimeSecond = $xeInput.computeHasTimeSecond
      const secondList = $xeInput.computeSecondList
      return [
        h('div', {
          class: 'vxe-input--time-picker-header'
        }, [
          hasTimeMinute
            ? h('span', {
              class: 'vxe-input--time-picker-title'
            }, dateTimeLabel)
            : renderEmptyElement($xeInput),
          h('div', {
            class: 'vxe-input--time-picker-btn'
          }, [
            h('button', {
              class: 'vxe-input--time-picker-confirm',
              attrs: {
                type: 'button'
              },
              on: {
                click: $xeInput.dateConfirmEvent
              }
            }, getI18n('vxe.button.confirm'))
          ])
        ]),
        h('div', {
          ref: 'refInputTimeBody',
          class: 'vxe-input--time-picker-body'
        }, [
          h('ul', {
            class: 'vxe-input--time-picker-hour-list'
          }, hourList.map((item, index) => {
            return h('li', {
              key: index,
              class: {
                'is--selected': datetimePanelValue && datetimePanelValue.getHours() === item.value
              },
              on: {
                click: (evnt: MouseEvent) => $xeInput.dateHourEvent(evnt, item)
              }
            }, item.label)
          })),
          hasTimeMinute
            ? h('ul', {
              class: 'vxe-input--time-picker-minute-list'
            }, minuteList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getMinutes() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeInput.dateMinuteEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeInput),
          hasTimeMinute && hasTimeSecond
            ? h('ul', {
              class: 'vxe-input--time-picker-second-list'
            }, secondList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getSeconds() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeInput.dateSecondEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeInput)
        ])
      ]
    },
    renderPanel  (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { type } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle } = reactData
      const vSize = $xeInput.computeSize
      const btnTransfer = $xeInput.computeBtnTransfer
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const renders = []
      if (isDatePickerType) {
        if (type === 'datetime') {
          renders.push(
            h('div', {
              key: type,
              ref: 'refPanelWrapper',
              class: 'vxe-input--panel-layout-wrapper'
            }, [
              h('div', {
                class: 'vxe-input--panel-left-wrapper'
              }, $xeInput.renderDatePanel(h)),
              h('div', {
                class: 'vxe-input--panel-right-wrapper'
              }, $xeInput.renderTimePanel(h))
            ])
          )
        } else if (type === 'time') {
          renders.push(
            h('div', {
              key: type,
              ref: 'refPanelWrapper',
              class: 'vxe-input--panel-wrapper'
            }, $xeInput.renderTimePanel(h))
          )
        } else {
          renders.push(
            h('div', {
              key: type || 'default',
              ref: 'refPanelWrapper',
              class: 'vxe-input--panel-wrapper'
            }, $xeInput.renderDatePanel(h))
          )
        }
        return h('div', {
          ref: 'refInputPanel',
          class: ['vxe-table--ignore-clear vxe-input--panel', `type--${type}`, {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': isAniVisible,
            'ani--enter': visiblePanel
          }],
          attrs: {
            placement: panelPlacement
          },
          style: panelStyle
        }, initialized && (visiblePanel || isAniVisible) ? renders : [])
      }
      return renderEmptyElement($xeInput)
    },
    renderNumberIcon  (h: CreateElement) {
      const $xeInput = this

      const isDisabledAddNumber = $xeInput.computeIsDisabledAddNumber
      const isDisabledSubtractNumber = $xeInput.computeIsDisabledSubtractNumber
      return h('div', {
        class: 'vxe-input--control-icon'
      }, [
        h('div', {
          class: 'vxe-input--number-icon'
        }, [
          h('div', {
            class: ['vxe-input--number-btn is--prev', {
              'is--disabled': isDisabledAddNumber
            }],
            on: {

              mousedown: $xeInput.numberMousedownEvent,
              mouseup: $xeInput.numberStopDown,
              mouseleave: $xeInput.numberStopDown
            }
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_PREV_NUM
            })
          ]),
          h('div', {
            class: ['vxe-input--number-btn is--next', {
              'is--disabled': isDisabledSubtractNumber
            }],
            on: {
              mousedown: $xeInput.numberMousedownEvent,
              mouseup: $xeInput.numberStopDown,
              mouseleave: $xeInput.numberStopDown
            }
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_NEXT_NUM
            })
          ])
        ])
      ])
    },
    renderDatePickerIcon (h: CreateElement) {
      const $xeInput = this

      return h('div', {
        class: 'vxe-input--control-icon',
        on: {
          click: $xeInput.datePickerOpenEvent
        }
      }, [
        h('i', {
          class: ['vxe-input--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    },
    renderSearchIcon  (h: CreateElement) {
      const $xeInput = this

      return h('div', {
        class: 'vxe-input--control-icon',
        on: {
          click: $xeInput.searchEvent
        }
      }, [
        h('i', {
          class: ['vxe-input--search-icon', getIcon().INPUT_SEARCH]
        })
      ])
    },
    renderPasswordIcon  (h: CreateElement) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      const { showPwd } = reactData
      return h('div', {
        class: 'vxe-input--control-icon',
        on: {
          click: $xeInput.passwordToggleEvent
        }
      }, [
        h('i', {
          class: ['vxe-input--password-icon', showPwd ? getIcon().PASSWORD_INPUT_SHOW_PWD : getIcon().PASSWORD_INPUT_HIDE_PWD]
        })
      ])
    },
    renderPrefixIcon (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const slots = $xeInput.$scopedSlots

      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-input--prefix',
          on: {
            click: $xeInput.clickPrefixEvent
          }
        }, [
          h('div', {
            class: 'vxe-input--prefix-icon'
          }, prefixSlot
            ? getSlotVNs(prefixSlot({}))
            : [
                h('i', {
                  class: prefixIcon
                })
              ])
        ])
        : null
    },
    renderSuffixIcon  (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput
      const slots = $xeInput.$scopedSlots
      const reactData = $xeInput.reactData

      const { suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = $xeInput.computeIsDisabled
      const isNumType = $xeInput.computeIsNumType
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const isPawdType = $xeInput.computeIsPawdType
      const isSearchType = $xeInput.computeIsSearchType
      const isClearable = $xeInput.computeIsClearable
      const isExtraBtn = isPawdType || isNumType || isDatePickerType || isSearchType
      return isClearable || suffixSlot || suffixIcon || isExtraBtn
        ? h('div', {
          class: ['vxe-input--suffix', {
            'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
          }]
        }, [
          isClearable
            ? h('div', {
              class: 'vxe-input--clear-icon',
              on: {
                click: $xeInput.clearValueEvent
              }
            }, [
              h('i', {
                class: getIcon().INPUT_CLEAR
              })
            ])
            : renderEmptyElement($xeInput),
          isExtraBtn ? $xeInput.renderExtraSuffixIcon(h) : renderEmptyElement($xeInput),
          suffixSlot || suffixIcon
            ? h('div', {
              class: 'vxe-input--suffix-icon',
              on: {
                click: $xeInput.clickSuffixEvent
              }
            }, suffixSlot
              ? getSlotVNs(suffixSlot({}))
              : [
                  h('i', {
                    class: suffixIcon
                  })
                ])
            : renderEmptyElement($xeInput)
        ])
        : null
    },
    renderExtraSuffixIcon (h: CreateElement) {
      const $xeInput = this
      const props = $xeInput

      const { controls } = props
      const isNumType = $xeInput.computeIsNumType
      const isDatePickerType = $xeInput.computeIsDatePickerType
      const isPawdType = $xeInput.computeIsPawdType
      const isSearchType = $xeInput.computeIsSearchType
      if (isPawdType) {
        return $xeInput.renderPasswordIcon(h)
      }
      if (isNumType) {
        if (controls) {
          return $xeInput.renderNumberIcon(h)
        }
      }
      if (isDatePickerType) {
        return $xeInput.renderDatePickerIcon(h)
      }
      if (isSearchType) {
        return $xeInput.renderSearchIcon(h)
      }
      return renderEmptyElement($xeInput)
    },
    renderVN (h: CreateElement): VNode {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const { className, controls, type, align, showWordCount, countMethod, name, autoComplete, autocomplete } = props
      const { inputValue, visiblePanel, isActivated } = reactData
      const vSize = $xeInput.computeSize
      const isDisabled = $xeInput.computeIsDisabled
      const formReadonly = $xeInput.computeFormReadonly
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-input--readonly', `type--${type}`, className]
        }, inputValue)
      }
      const isCountError = $xeInput.computeIsCountError
      const inputCount = $xeInput.computeInputCount
      const inputReadonly = $xeInput.computeInputReadonly
      const inpMaxLength = $xeInput.computeInpMaxLength
      const inputType = $xeInput.computeInputType
      const inpPlaceholder = $xeInput.computeInpPlaceholder
      const isClearable = $xeInput.computeIsClearable
      const isWordCount = showWordCount && ['text', 'search'].includes(type)
      const prefix = $xeInput.renderPrefixIcon(h)
      const suffix = $xeInput.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-input', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': controls,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--visible': visiblePanel,
          'is--count': isWordCount,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        prefix || renderEmptyElement($xeInput),
        h('div', {
          class: 'vxe-input--wrapper'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-input--inner',
            domProps: {
              value: inputValue
            },
            attrs: {
              name,
              type: inputType,
              placeholder: inpPlaceholder,
              maxlength: inpMaxLength,
              readonly: inputReadonly,
              disabled: isDisabled,
              autocomplete: autoComplete || autocomplete
            },
            on: {
              keydown: $xeInput.keydownEvent,
              keyup: $xeInput.keyupEvent,
              wheel: $xeInput.wheelEvent,
              click: $xeInput.clickEvent,
              input: $xeInput.inputEvent,
              change: $xeInput.changeEvent,
              focus: $xeInput.focusEvent,
              blur: $xeInput.blurEvent
            }
          })
        ]),
        suffix || renderEmptyElement($xeInput),
        // 下拉面板
        $xeInput.renderPanel(h),
        // 字数统计
        isWordCount
          ? h('span', {
            class: ['vxe-input--count', {
              'is--error': isCountError
            }]
          }, countMethod ? `${countMethod({ value: inputValue })}` : `${inputCount}${inpMaxLength ? `/${inpMaxLength}` : ''}`)
          : renderEmptyElement($xeInput)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeInput = this
      const reactData = $xeInput.reactData

      reactData.inputValue = val
      $xeInput.changeValue()
    },
    type () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.value,
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      $xeInput.initValue()
    },
    computeDateLabelFormat () {
      const $xeInput = this
      const props = $xeInput
      const reactData = $xeInput.reactData

      const isDatePickerType = $xeInput.computeIsDatePickerType
      if (isDatePickerType) {
        $xeInput.dateParseValue(reactData.datePanelValue)
        reactData.inputValue = props.multiple ? $xeInput.computeDateMultipleLabel : reactData.datePanelLabel
      }
    }
  },
  created () {
    const $xeInput = this
    const props = $xeInput
    const reactData = $xeInput.reactData

    reactData.inputValue = props.value
    $xeInput.initValue()
  },
  mounted () {
    const $xeInput = this

    globalEvents.on($xeInput, 'mousewheel', $xeInput.handleGlobalMousewheelEvent)
    globalEvents.on($xeInput, 'mousedown', $xeInput.handleGlobalMousedownEvent)
    globalEvents.on($xeInput, 'keydown', $xeInput.handleGlobalKeydownEvent)
    globalEvents.on($xeInput, 'blur', $xeInput.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeInput = this

    const panelElem = $xeInput.$refs.refInputPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    $xeInput.numberStopDown()
    $xeInput.afterCheckValue()
    globalEvents.off($xeInput, 'mousewheel')
    globalEvents.off($xeInput, 'mousedown')
    globalEvents.off($xeInput, 'keydown')
    globalEvents.off($xeInput, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
