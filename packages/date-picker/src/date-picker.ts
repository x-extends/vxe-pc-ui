import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getAbsolutePos, getEventTargetNode } from '../../ui/src/dom'
import { toStringTimeDate, getDateQuarter } from './util'
import { getSlotVNs } from '../..//ui/src/vn'

import type { VxeDatePickerConstructor, DatePickerInternalData, VxeDatePickerEmits, DatePickerReactData, VxeDatePickerPropTypes, VxeComponentStyleType, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, VxeTableConstructor, VxeDrawerConstructor, VxeDrawerMethods, VxeTablePrivateMethods, VxeModalConstructor, VxeModalMethods, VxeDatePickerDefines, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeDatePicker',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Date] as PropType<VxeDatePickerPropTypes.ModelValue>,
    immediate: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeDatePickerPropTypes.Name>,
    type: {
      type: String as PropType<VxeDatePickerPropTypes.Type>,
      default: 'date'
    },
    clearable: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Clearable>,
      default: () => getConfig().datePicker.clearable
    },
    readonly: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Disabled>,
      default: null
    },
    placeholder: String as PropType<VxeDatePickerPropTypes.Placeholder>,
    maxLength: [String, Number] as PropType<VxeDatePickerPropTypes.MaxLength>,
    autoComplete: {
      type: String as PropType<VxeDatePickerPropTypes.AutoComplete>,
      default: 'off'
    },
    align: String as PropType<VxeDatePickerPropTypes.Align>,
    form: String as PropType<VxeDatePickerPropTypes.Form>,
    className: String as PropType<VxeDatePickerPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeDatePickerPropTypes.Size>,
      default: () => getConfig().datePicker.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeDatePickerPropTypes.Multiple>,

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MinDate>,
      default: () => getConfig().datePicker.startDate
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>,
      default: () => getConfig().datePicker.endDate
    },
    minDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>,
    startDay: {
      type: [String, Number] as PropType<VxeDatePickerPropTypes.StartDay>,
      default: () => getConfig().datePicker.startDay
    },
    labelFormat: String as PropType<VxeDatePickerPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeDatePickerPropTypes.ValueFormat>,
    editable: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Editable>,
      default: true
    },
    festivalMethod: {
      type: Function as PropType<VxeDatePickerPropTypes.FestivalMethod>,
      default: () => getConfig().datePicker.festivalMethod
    },
    disabledMethod: {
      type: Function as PropType<VxeDatePickerPropTypes.DisabledMethod>,
      default: () => getConfig().datePicker.disabledMethod
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeDatePickerPropTypes.SelectDay>,
      default: () => getConfig().datePicker.selectDay
    },

    prefixIcon: String as PropType<VxeDatePickerPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeDatePickerPropTypes.SuffixIcon>,
    placement: String as PropType<VxeDatePickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Transfer>,
      default: null
    },

    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeDatePickerPropTypes.StartDay>,
    // 已废弃
    maxlength: [String, Number] as PropType<VxeDatePickerPropTypes.Maxlength>,
    // 已废弃
    autocomplete: String as PropType<VxeDatePickerPropTypes.Autocomplete>
  },
  inject: {
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
    const reactData: DatePickerReactData = {
      initialized: false,
      panelIndex: 0,
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
    const internalData: DatePickerInternalData = {
      yearSize: 12,
      monthSize: 20,
      quarterSize: 8,
      hpTimeout: undefined
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
      $xeModal(): (VxeModalConstructor & VxeModalMethods) | null
      $xeDrawer(): (VxeDrawerConstructor & VxeDrawerMethods) | null
      $xeTable(): (VxeTableConstructor & VxeTablePrivateMethods) | null
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeBtnTransfer () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const $xeTable = $xeDatePicker.$xeTable
      const $xeModal = $xeDatePicker.$xeModal
      const $xeDrawer = $xeDatePicker.$xeDrawer
      const $xeForm = $xeDatePicker.$xeForm

      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().datePicker.transfer
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
      const $xeDatePicker = this
      const props = $xeDatePicker
      const $xeForm = $xeDatePicker.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const $xeForm = $xeDatePicker.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeIsDateTimeType () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { type } = props
      return type === 'time' || type === 'datetime'
    },
    computeIsDatePickerType () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeIsClearable () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.clearable
    },
    computeDateStartTime () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    },
    computeDateEndTime () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    },
    computeSupportMultiples () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeDateListValue () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { value, multiple } = props
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      if (multiple && value && isDatePickerType) {
        return XEUtils.toValueString(value).split(',').map(item => {
          const date = ($xeDatePicker as any).parseDate(item, dateValueFormat)
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return date
        }) as Date[]
      }
      return []
    },
    computeDateMultipleValue () {
      const $xeDatePicker = this

      const dateListValue = $xeDatePicker.computeDateListValue as Array<string | number | Date | null>
      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    },
    computeDateMultipleLabel () {
      const $xeDatePicker = this

      const dateListValue = $xeDatePicker.computeDateListValue as Array<string | number | Date | null>
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateLabelFormat)).join(', ')
    },
    computeDateValueFormat () {
      const $xeDatePicker = this
      const props = $xeDatePicker

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
    computeDateValue () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { value } = props
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
      let val = null
      if (value && isDatePickerType) {
        const date = ($xeDatePicker as any).parseDate(value, dateValueFormat)
        if (XEUtils.isValidDate(date)) {
          val = date
        }
      }
      return val
    },
    computeIsDisabledPrevDateBtn () {
      const $xeDatePicker = (this as any)
      const reactData = $xeDatePicker.reactData

      const dateStartTime = $xeDatePicker.computeDateStartTime
      const { selectMonth } = reactData
      if (selectMonth && dateStartTime) {
        return selectMonth <= dateStartTime
      }
      return false
    },
    computeIsDisabledNextDateBtn () {
      const $xeDatePicker = (this as any)
      const reactData = $xeDatePicker.reactData

      const dateEndTime = $xeDatePicker.computeDateEndTime
      const { selectMonth } = reactData
      if (selectMonth && dateEndTime) {
        return selectMonth >= dateEndTime
      }
      return false
    },
    computeDateTimeLabel () {
      const $xeDatePicker = (this as any)
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      const hasTimeSecond = $xeDatePicker.computeHasTimeSecond
      if (datetimePanelValue) {
        return XEUtils.toDateString(datetimePanelValue, hasTimeSecond ? 'HH:mm:ss' : 'HH:mm')
      }
      return ''
    },
    computeDateHMSTime () {
      const $xeDatePicker = this

      const dateValue = $xeDatePicker.computeDateValue as Date | null
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      return dateValue && isDateTimeType ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0
    },
    computeDateLabelFormat () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { labelFormat } = props
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
      }
      return ''
    },
    computeYearList () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { yearSize } = internalData
      const { selectMonth, currentDate } = reactData
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
    computeSelectDatePanelLabel () {
      const $xeDatePicker = (this as any)
      const reactData = $xeDatePicker.reactData

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = $xeDatePicker.computeYearList as VxeDatePickerDefines.DateYearItem[]
        let year = ''
        let month
        if (selectMonth) {
          year = selectMonth.getFullYear()
          month = selectMonth.getMonth() + 1
        }
        if (datePanelType === 'quarter') {
          return getI18n('vxe.input.date.quarterLabel', [year])
        } else if (datePanelType === 'month') {
          return getI18n('vxe.input.date.monthLabel', [year])
        } else if (datePanelType === 'year') {
          return yearList.length ? `${yearList[0].year} - ${yearList[yearList.length - 1].year}` : ''
        }
        return getI18n('vxe.input.date.dayLabel', [year, month ? getI18n(`vxe.input.date.m${month}`) : '-'])
      }
      return ''
    },
    computeFirstDayOfWeek () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { startDay, startWeek } = props
      return XEUtils.toNumber(XEUtils.isNumber(startDay) || XEUtils.isString(startDay) ? startDay : startWeek) as VxeDatePickerPropTypes.StartDay
    },
    computeWeekDatas () {
      const $xeDatePicker = this

      const weeks: number[] = []
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        let sWeek = $xeDatePicker.computeFirstDayOfWeek as VxeDatePickerPropTypes.StartDay
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
      const $xeDatePicker = this

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        const weekDatas = $xeDatePicker.computeWeekDatas as number[]
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
      const $xeDatePicker = this

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        const dateHeaders = $xeDatePicker.computeDateHeaders as {
          value: number;
          label: string;
        }[]
        return [{ label: getI18n('vxe.input.date.weeks.w') }].concat(dateHeaders)
      }
      return []
    },
    computeYearDatas () {
      const $xeDatePicker = this

      const yearList = $xeDatePicker.computeYearList as VxeDatePickerDefines.DateYearItem[]
      return XEUtils.chunk(yearList, 4)
    },
    computeQuarterList () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { quarterSize } = internalData
      const { selectMonth, currentDate } = reactData
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
      const $xeDatePicker = this

      const quarterList = $xeDatePicker.computeQuarterList as VxeDatePickerDefines.DateQuarterItem[]
      return XEUtils.chunk(quarterList, 2)
    },
    computeMonthList () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { monthSize } = internalData
      const { selectMonth, currentDate } = reactData
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
      const $xeDatePicker = this

      const monthList = $xeDatePicker.computeMonthList as VxeDatePickerDefines.DateMonthItem[]
      return XEUtils.chunk(monthList, 4)
    },
    computeDayList () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { selectMonth, currentDate } = reactData
      const days: VxeDatePickerDefines.DateDayItem[] = []
      if (selectMonth && currentDate) {
        const dateHMSTime = $xeDatePicker.computeDateHMSTime
        const weekDatas = $xeDatePicker.computeWeekDatas
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
      const $xeDatePicker = this

      const dayList = $xeDatePicker.computeDayList as VxeDatePickerDefines.DateDayItem[]
      return XEUtils.chunk(dayList, 7)
    },
    computeWeekDates () {
      const $xeDatePicker = this

      const dayDatas = $xeDatePicker.computeDayDatas as VxeDatePickerDefines.DateDayItem[][]
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
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
      const $xeDatePicker = this

      const list: VxeDatePickerDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
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
      const $xeDatePicker = this

      const list: VxeDatePickerDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
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
      const $xeDatePicker = this

      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
      return !/HH/.test(dateValueFormat) || /mm/.test(dateValueFormat)
    },
    computeHasTimeSecond () {
      const $xeDatePicker = this

      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
      return !/HH/.test(dateValueFormat) || /ss/.test(dateValueFormat)
    },
    computeSecondList () {
      const $xeDatePicker = this

      const minuteList = $xeDatePicker.computeMinuteList as VxeDatePickerDefines.DateHourMinuteSecondItem[]
      return minuteList
    },
    computeInputReadonly () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { type, editable, multiple } = props
      const formReadonly = $xeDatePicker.computeFormReadonly
      return formReadonly || multiple || !editable || type === 'week' || type === 'quarter'
    },
    computeDatePickerType () {
      return 'text'
    },
    computeInpPlaceholder () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().datePicker.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseSelect')
    },
    computeInpImmediate () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { immediate } = props
      return immediate
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDatePickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDatePicker = this
      $xeDatePicker.$emit(type, createEvent(evnt, { $datePicker: $xeDatePicker }, params))
    },
    emitModel (value: any) {
      const $xeDatePicker = this

      $xeDatePicker.$emit('modelValue', value)
    },
    focus () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const inputElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      reactData.isActivated = true
      inputElem.focus()
      return $xeDatePicker.$nextTick()
    },
    blur () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const inputElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      inputElem.blur()
      reactData.isActivated = false
      return $xeDatePicker.$nextTick()
    },
    select () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const inputElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      inputElem.select()
      reactData.isActivated = false
      return $xeDatePicker.$nextTick()
    },
    updateModelValue (modelValue: VxeDatePickerPropTypes.ModelValue | undefined) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      let val: any = ''
      if (modelValue) {
        if (XEUtils.isNumber(modelValue) && /^[0-9]{11,15}$/.test(`${modelValue}`)) {
          val = new Date(modelValue)
        } else {
          val = modelValue
        }
      }
      reactData.inputValue = val
    },
    parseDate  (value: VxeDatePickerPropTypes.ModelValue, format: string) {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { type } = props
      if (type === 'time') {
        return toStringTimeDate(value)
      }
      return XEUtils.toStringDate(value, format)
    },
    triggerEvent  (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { inputValue } = reactData
      $xeDatePicker.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    },
    handleChange (value: string, evnt: Event | { type: string }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const $xeForm = $xeDatePicker.$xeForm
      const formItemInfo = $xeDatePicker.formItemInfo

      reactData.inputValue = value
      $xeDatePicker.emitModel(value)
      if (XEUtils.toValueString(props.value) !== value) {
        $xeDatePicker.dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    inputEvent (evnt: Event & { type: 'input' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const inpImmediate = $xeDatePicker.computeInpImmediate
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      reactData.inputValue = value
      if (!isDatePickerType) {
        if (inpImmediate) {
          $xeDatePicker.handleChange(value, evnt)
        } else {
          $xeDatePicker.dispatchEvent('input', { value }, evnt)
        }
      }
    },
    changeEvent  (evnt: Event & { type: 'change' }) {
      const $xeDatePicker = this

      const inpImmediate = $xeDatePicker.computeInpImmediate
      if (!inpImmediate) {
        $xeDatePicker.triggerEvent(evnt)
      }
    },
    focusEvent  (evnt: Event & { type: 'focus' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      reactData.isActivated = true
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDatePicker.datePickerOpenEvent(evnt)
      }
      $xeDatePicker.triggerEvent(evnt)
    },
    clickPrefixEvent  (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeDatePicker.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    },
    hidePanel () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      return new Promise<void>(resolve => {
        reactData.visiblePanel = false
        internalData.hpTimeout = window.setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    },
    clearValueEvent  (evnt: Event, value: VxeDatePickerPropTypes.ModelValue) {
      const $xeDatePicker = this

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDatePicker.hidePanel()
      }
      $xeDatePicker.handleChange('', evnt)
      $xeDatePicker.dispatchEvent('clear', { value }, evnt)
    },
    clickSuffixEvent  (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeDatePicker.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    },
    dateParseValue (value?: VxeDatePickerPropTypes.ModelValue) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type } = props
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      let dValue: Date | null = null
      let dLabel = ''
      if (value) {
        dValue = $xeDatePicker.parseDate(value, dateValueFormat)
      }
      if (XEUtils.isValidDate(dValue)) {
        dLabel = XEUtils.toDateString(dValue, dateLabelFormat, { firstDay: firstDayOfWeek })
        // 由于年份和第几周是冲突的行为，所以需要特殊处理，判断是否跨年
        if (dateLabelFormat && type === 'week') {
          const firstWeekDate = XEUtils.getWhatWeek(dValue, 0, firstDayOfWeek, firstDayOfWeek)
          if (firstWeekDate.getFullYear() < dValue.getFullYear()) {
            const yyIndex = dateLabelFormat.indexOf('yyyy')
            if (yyIndex > -1) {
              const yyNum = Number(dLabel.substring(yyIndex, yyIndex + 4))
              if (yyNum && !isNaN(yyNum)) {
                dLabel = dLabel.replace(`${yyNum}`, `${yyNum - 1}`)
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
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const { inputValue } = reactData
      if (isDatePickerType) {
        $xeDatePicker.dateParseValue(inputValue)
        reactData.inputValue = props.multiple ? $xeDatePicker.computeDateMultipleLabel : reactData.datePanelLabel
      }
    },
    /**
     * 检查初始值
     */
    initValue  () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      $xeDatePicker.updateModelValue(props.value)
      if (isDatePickerType) {
        $xeDatePicker.changeValue()
      }
    },
    dateRevert () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      reactData.inputValue = props.multiple ? $xeDatePicker.computeDateMultipleLabel : reactData.datePanelLabel
    },
    dateCheckMonth  (date: Date) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const month = XEUtils.getWhatMonth(date, 0, 'first')
      if (!XEUtils.isEqual(month, reactData.selectMonth)) {
        reactData.selectMonth = month
      }
    },
    dateChange  (date: Date) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datetimePanelValue } = reactData
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeDatePickerPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      } else if (isDateTimeType) {
        if (datetimePanelValue) {
          date.setHours(datetimePanelValue.getHours())
          date.setMinutes(datetimePanelValue.getMinutes())
          date.setSeconds(datetimePanelValue.getSeconds())
        }
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      $xeDatePicker.dateCheckMonth(date)
      if (multiple) {
        // 如果为多选
        const dateMultipleValue = $xeDatePicker.computeDateMultipleValue
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = [...$xeDatePicker.computeDateListValue]
          const datetimeRest: Date[] = []
          const eqIndex = XEUtils.findIndexOf(dateListValue, val => XEUtils.isDateSame(date, val, 'yyyyMMdd'))
          if (eqIndex === -1) {
            dateListValue.push(date)
          } else {
            dateListValue.splice(eqIndex, 1)
          }
          dateListValue.forEach(item => {
            if (item) {
              if (datetimePanelValue) {
                item.setHours(datetimePanelValue.getHours())
                item.setMinutes(datetimePanelValue.getMinutes())
                item.setSeconds(datetimePanelValue.getSeconds())
              }
              datetimeRest.push(item)
            }
          })
          $xeDatePicker.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            $xeDatePicker.handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            $xeDatePicker.handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(props.value, inpVal)) {
          $xeDatePicker.handleChange(inpVal, { type: 'update' })
        }
      }
    },
    afterCheckValue  () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type } = props
      const { inputValue, datetimePanelValue } = reactData
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat
      const inputReadonly = $xeDatePicker.computeInputReadonly
      if (!inputReadonly) {
        if (inputValue) {
          let inpDateVal: VxeDatePickerPropTypes.ModelValue = $xeDatePicker.parseDate(inputValue, dateLabelFormat as string)
          if (XEUtils.isValidDate(inpDateVal)) {
            if (type === 'time') {
              inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
              if (inputValue !== inpDateVal) {
                $xeDatePicker.handleChange(inpDateVal, { type: 'check' })
              }
              reactData.inputValue = inpDateVal
            } else {
              let isChange = false
              const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
              if (type === 'datetime') {
                const dateValue = $xeDatePicker.computeDateValue
                if (inputValue !== XEUtils.toDateString(dateValue, dateLabelFormat) || inputValue !== XEUtils.toDateString(inpDateVal, dateLabelFormat)) {
                  isChange = true
                  if (datetimePanelValue) {
                    datetimePanelValue.setHours(inpDateVal.getHours())
                    datetimePanelValue.setMinutes(inpDateVal.getMinutes())
                    datetimePanelValue.setSeconds(inpDateVal.getSeconds())
                  }
                }
              } else {
                isChange = true
              }
              reactData.inputValue = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
              if (isChange) {
                $xeDatePicker.dateChange(inpDateVal)
              }
            }
          } else {
            $xeDatePicker.dateRevert()
          }
        } else {
          $xeDatePicker.handleChange('', { type: 'check' })
        }
      }
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const $xeForm = $xeDatePicker.$xeForm
      const formItemInfo = $xeDatePicker.formItemInfo

      const { inputValue } = reactData
      const inpImmediate = $xeDatePicker.computeInpImmediate
      const value = inputValue
      if (!inpImmediate) {
        $xeDatePicker.handleChange(value, evnt)
      }
      $xeDatePicker.afterCheckValue()
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      $xeDatePicker.dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    keydownEvent (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeDatePicker = this

      $xeDatePicker.triggerEvent(evnt)
    },
    keyupEvent (evnt: KeyboardEvent & { type: 'keyup' }) {
      const $xeDatePicker = this

      $xeDatePicker.triggerEvent(evnt)
    },
    wheelEvent  (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) {
      const $xeDatePicker = this

      $xeDatePicker.triggerEvent(evnt)
    },
    // 日期
    dateMonthHandle (date: Date, offsetMonth: number) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      reactData.selectMonth = XEUtils.getWhatMonth(date, offsetMonth, 'first')
    },
    dateNowHandle  () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      reactData.currentDate = currentDate
      $xeDatePicker.dateMonthHandle(currentDate, 0)
    },
    dateToggleTypeEvent  () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
    },
    datePrevEvent (evnt: Event) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const { yearSize } = internalData
      const isDisabledPrevDateBtn = $xeDatePicker.computeIsDisabledPrevDateBtn
      if (!isDisabledPrevDateBtn) {
        if (type === 'year') {
          reactData.selectMonth = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
          } else {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, -1, 'first')
          }
        } else {
          if (datePanelType === 'year') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, -yearSize, 'first')
          } else if (datePanelType === 'month') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, -1, 'first')
          } else {
            reactData.selectMonth = XEUtils.getWhatMonth(selectMonth, -1, 'first')
          }
        }
        $xeDatePicker.dispatchEvent('date-prev', { type }, evnt)
      }
    },
    dateTodayMonthEvent  (evnt: Event) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      $xeDatePicker.dateNowHandle()
      if (!props.multiple) {
        $xeDatePicker.dateChange(reactData.currentDate)
        $xeDatePicker.hidePanel()
      }
      $xeDatePicker.dispatchEvent('date-today', { type: props.type }, evnt)
    },
    dateNextEvent (evnt: Event) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const { yearSize } = internalData
      const isDisabledNextDateBtn = $xeDatePicker.computeIsDisabledNextDateBtn
      if (!isDisabledNextDateBtn) {
        if (type === 'year') {
          reactData.selectMonth = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
          } else {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, 1, 'first')
          }
        } else {
          if (datePanelType === 'year') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, yearSize, 'first')
          } else if (datePanelType === 'month') {
            reactData.selectMonth = XEUtils.getWhatYear(selectMonth, 1, 'first')
          } else {
            reactData.selectMonth = XEUtils.getWhatMonth(selectMonth, 1, 'first')
          }
        }
        $xeDatePicker.dispatchEvent('date-next', { type }, evnt)
      }
    },
    isDateDisabled  (item: { date: Date }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { disabledMethod } = props
      const { datePanelType } = reactData
      return disabledMethod && disabledMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $datePicker: $xeDatePicker as VxeDatePickerConstructor })
    },
    dateSelectItem  (date: Date) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type, multiple } = props
      const { datePanelType } = reactData
      if (type === 'month') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeDatePicker.dateCheckMonth(date)
        } else {
          $xeDatePicker.dateChange(date)
          if (!multiple) {
            $xeDatePicker.hidePanel()
          }
        }
      } else if (type === 'year') {
        $xeDatePicker.dateChange(date)
        if (!multiple) {
          $xeDatePicker.hidePanel()
        }
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          $xeDatePicker.dateCheckMonth(date)
        } else {
          $xeDatePicker.dateChange(date)
          if (!multiple) {
            $xeDatePicker.hidePanel()
          }
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          $xeDatePicker.dateCheckMonth(date)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeDatePicker.dateCheckMonth(date)
        } else {
          $xeDatePicker.dateChange(date)
          if (type === 'datetime') {
            // 日期带时间
          } else {
            if (!multiple) {
              $xeDatePicker.hidePanel()
            }
          }
        }
      }
    },
    dateSelectEvent (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeDatePicker = this

      if (!$xeDatePicker.isDateDisabled(item)) {
        $xeDatePicker.dateSelectItem(item.date)
      }
    },
    dateMoveDay (offsetDay: Date) {
      const $xeDatePicker = this

      if (!$xeDatePicker.isDateDisabled({ date: offsetDay })) {
        const dayList = $xeDatePicker.computeDayList
        if (!dayList.some((item) => XEUtils.isDateSame(item.date, offsetDay, 'yyyyMMdd'))) {
          $xeDatePicker.dateCheckMonth(offsetDay)
        }
        $xeDatePicker.dateParseValue(offsetDay)
      }
    },
    dateMoveYear (offsetYear: Date) {
      const $xeDatePicker = this

      if (!$xeDatePicker.isDateDisabled({ date: offsetYear })) {
        const yearList = $xeDatePicker.computeYearList
        if (!yearList.some((item) => XEUtils.isDateSame(item.date, offsetYear, 'yyyy'))) {
          $xeDatePicker.dateCheckMonth(offsetYear)
        }
        $xeDatePicker.dateParseValue(offsetYear)
      }
    },
    dateMoveQuarter (offsetQuarter: Date) {
      const $xeDatePicker = this

      if (!$xeDatePicker.isDateDisabled({ date: offsetQuarter })) {
        const quarterList = $xeDatePicker.computeQuarterList
        if (!quarterList.some((item) => XEUtils.isDateSame(item.date, offsetQuarter, 'yyyyq'))) {
          $xeDatePicker.dateCheckMonth(offsetQuarter)
        }
        $xeDatePicker.dateParseValue(offsetQuarter)
      }
    },
    dateMoveMonth (offsetMonth: Date) {
      const $xeDatePicker = this

      if (!$xeDatePicker.isDateDisabled({ date: offsetMonth })) {
        const monthList = $xeDatePicker.computeMonthList
        if (!monthList.some((item) => XEUtils.isDateSame(item.date, offsetMonth, 'yyyyMM'))) {
          $xeDatePicker.dateCheckMonth(offsetMonth)
        }
        $xeDatePicker.dateParseValue(offsetMonth)
      }
    },
    dateMouseenterEvent  (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      if (!$xeDatePicker.isDateDisabled(item)) {
        const { datePanelType } = reactData
        if (datePanelType === 'month') {
          $xeDatePicker.dateMoveMonth(item.date)
        } else if (datePanelType === 'quarter') {
          $xeDatePicker.dateMoveQuarter(item.date)
        } else if (datePanelType === 'year') {
          $xeDatePicker.dateMoveYear(item.date)
        } else {
          $xeDatePicker.dateMoveDay(item.date)
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
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      reactData.datetimePanelValue = datetimePanelValue ? new Date(datetimePanelValue.getTime()) : new Date()
      $xeDatePicker.updateTimePos(evnt.currentTarget as HTMLLIElement)
    },
    dateHourEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setHours(item.value)
      }
      $xeDatePicker.dateTimeChangeEvent(evnt)
    },
    dateConfirmEvent  () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datetimePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      if (isDateTimeType) {
        const dateValueFormat = $xeDatePicker.computeDateValueFormat
        if (multiple) {
          // 如果为多选
          const dateMultipleValue = $xeDatePicker.computeDateMultipleValue
          if (isDateTimeType) {
            // 如果是datetime特殊类型
            const dateListValue = [...$xeDatePicker.computeDateListValue]
            const datetimeRest: Date[] = []
            dateListValue.forEach(item => {
              if (item) {
                if (datetimePanelValue) {
                  item.setHours(datetimePanelValue.getHours())
                  item.setMinutes(datetimePanelValue.getMinutes())
                  item.setSeconds(datetimePanelValue.getSeconds())
                }
                datetimeRest.push(item)
              }
            })
            $xeDatePicker.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
          } else {
            // 如果是日期类型
            $xeDatePicker.handleChange(dateMultipleValue.join(','), { type: 'update' })
          }
        } else {
          $xeDatePicker.dateChange(dateValue || reactData.currentDate)
        }
      }
      $xeDatePicker.hidePanel()
    },
    dateMinuteEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setMinutes(item.value)
      }
      $xeDatePicker.dateTimeChangeEvent(evnt)
    },
    dateSecondEvent  (evnt: MouseEvent, item: VxeDatePickerDefines.DateHourMinuteSecondItem) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setSeconds(item.value)
      }
      $xeDatePicker.dateTimeChangeEvent(evnt)
    },
    dateOffsetEvent  (evnt: KeyboardEvent) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

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
          $xeDatePicker.dateMoveYear(offsetYear)
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
          $xeDatePicker.dateMoveQuarter(offsetQuarter)
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
          $xeDatePicker.dateMoveMonth(offsetMonth)
        } else {
          let offsetDay = datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
          const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
          if (isLeftArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, -1)
          } else if (isUpArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, -1, firstDayOfWeek)
          } else if (isRightArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, 1)
          } else if (isDwArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, 1, firstDayOfWeek)
          }
          $xeDatePicker.dateMoveDay(offsetDay)
        }
      }
    },
    datePgOffsetEvent  (evnt: KeyboardEvent) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { isActivated } = reactData
      if (isActivated) {
        const isPgUp = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.PAGE_UP)
        evnt.preventDefault()
        if (isPgUp) {
          $xeDatePicker.datePrevEvent(evnt)
        } else {
          $xeDatePicker.dateNextEvent(evnt)
        }
      }
    },
    dateOpenPanel () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type } = props
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      const dateValue = $xeDatePicker.computeDateValue
      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        reactData.datePanelType = type as 'year' | 'quarter' | 'month' | 'week'
      } else {
        reactData.datePanelType = 'day'
      }
      reactData.currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      if (dateValue) {
        $xeDatePicker.dateMonthHandle(dateValue, 0)
        $xeDatePicker.dateParseValue(dateValue)
      } else {
        $xeDatePicker.dateNowHandle()
      }
      if (isDateTimeType) {
        reactData.datetimePanelValue = reactData.datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
        $xeDatePicker.$nextTick(() => {
          const timeBodyElem = $xeDatePicker.$refs.refInputTimeBody as HTMLDivElement
          XEUtils.arrayEach(timeBodyElem.querySelectorAll('li.is--selected'), (elem) => {
            $xeDatePicker.updateTimePos(elem)
          })
        })
      }
    },
    // 弹出面板
    updateZindex () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement  () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      return $xeDatePicker.$nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLElement
        const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLElement
        const btnTransfer = $xeDatePicker.computeBtnTransfer
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
          let panelPlacement: VxeDatePickerPropTypes.Placement = 'bottom'
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
          return $xeDatePicker.$nextTick()
        }
      })
    },
    showPanel () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { visiblePanel } = reactData
      const isDisabled = $xeDatePicker.computeIsDisabled
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      if (!isDisabled && !visiblePanel) {
        const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLElement
        if (!reactData.initialized) {
          reactData.initialized = true
          if (btnTransfer) {
            if (panelElem) {
              document.body.appendChild(panelElem)
            }
          }
        }
        if (internalData.hpTimeout) {
          clearTimeout(internalData.hpTimeout)
          internalData.hpTimeout = undefined
        }
        reactData.isActivated = true
        reactData.isAniVisible = true
        if (isDatePickerType) {
          $xeDatePicker.dateOpenPanel()
        }
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        $xeDatePicker.updateZindex()
        return $xeDatePicker.updatePlacement()
      }
      return $xeDatePicker.$nextTick()
    },
    datePickerOpenEvent  (evnt: Event) {
      const $xeDatePicker = this

      const formReadonly = $xeDatePicker.computeFormReadonly
      if (!formReadonly) {
        evnt.preventDefault()
        $xeDatePicker.showPanel()
      }
    },
    clickEvent  (evnt: Event & { type: 'click' }) {
      const $xeDatePicker = this

      $xeDatePicker.triggerEvent(evnt)
    },
    // 全局事件
    handleGlobalMousedownEvent  (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { visiblePanel, isActivated } = reactData
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const el = $xeDatePicker.$refs.refElem as HTMLElement
      const panelWrapperElem = $xeDatePicker.$refs.refPanelWrapper as HTMLDivElement
      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          // 如果是日期类型
          if (isDatePickerType) {
            if (visiblePanel) {
              $xeDatePicker.hidePanel()
              $xeDatePicker.afterCheckValue()
            }
          } else {
            $xeDatePicker.afterCheckValue()
          }
        }
      }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { clearable } = props
      const { visiblePanel } = reactData
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const isDisabled = $xeDatePicker.computeIsDisabled
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
            $xeDatePicker.afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        } else if (operArrow) {
          if (isDatePickerType) {
            if (isActivated) {
              if (visiblePanel) {
                $xeDatePicker.dateOffsetEvent(evnt)
              } else if (isUpArrow || isDwArrow) {
                $xeDatePicker.datePickerOpenEvent(evnt)
              }
            }
          }
        } else if (isEnter) {
          if (isDatePickerType) {
            if (visiblePanel) {
              if (reactData.datePanelValue) {
                $xeDatePicker.dateSelectItem(reactData.datePanelValue)
              } else {
                $xeDatePicker.hidePanel()
              }
            } else if (isActivated) {
              $xeDatePicker.datePickerOpenEvent(evnt)
            }
          }
        } else if (isPgUp || isPgDn) {
          if (isDatePickerType) {
            if (isActivated) {
              $xeDatePicker.datePgOffsetEvent(evnt)
            }
          }
        }
        if (isTab || isEsc) {
          if (visiblePanel) {
            $xeDatePicker.hidePanel()
          }
        } else if (isDel && clearable) {
          if (isActivated) {
            $xeDatePicker.clearValueEvent(evnt, null)
          }
        }
      }
    },
    handleGlobalMousewheelEvent (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelWrapperElem = $xeDatePicker.$refs.refPanelWrapper as HTMLDivElement
          if (getEventTargetNode(evnt, panelWrapperElem).flag) {
            $xeDatePicker.updatePlacement()
          } else {
            $xeDatePicker.hidePanel()
            $xeDatePicker.afterCheckValue()
          }
        }
      }
    },
    handleGlobalBlurEvent  () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        $xeDatePicker.hidePanel()
        $xeDatePicker.afterCheckValue()
      } else if (isActivated) {
        $xeDatePicker.afterCheckValue()
      }
    },

    //
    // Render
    //
    renderDateLabel (h: CreateElement, item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem, label: string | number) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { festivalMethod } = props
      if (festivalMethod) {
        const { datePanelType } = reactData
        const festivalRest = festivalMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $datePicker: $xeDatePicker as VxeDatePickerConstructor })
        const festivalItem = festivalRest ? (XEUtils.isString(festivalRest) ? { label: festivalRest } : festivalRest) : {}
        const extraItem = festivalItem.extra ? (XEUtils.isString(festivalItem.extra) ? { label: festivalItem.extra } : festivalItem.extra) : null
        const labels = [
          h('span', {
            class: ['vxe-date-picker--date-label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('span', `${label}`),
                h('span', {
                  class: ['vxe-date-picker--date-label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
                  style: extraItem.style
                }, XEUtils.toValueString(extraItem.label))
              ]
            : `${label}`)
        ]
        const festivalLabel = festivalItem.label
        if (festivalLabel) {
          // 默认最多支持3个节日重叠
          const festivalLabels = XEUtils.toValueString(festivalLabel).split(',')
          labels.push(
            h('span', {
              class: ['vxe-date-picker--date-festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
              style: festivalItem.style
            }, [
              festivalLabels.length > 1
                ? h('span', {
                  class: ['vxe-date-picker--date-festival--overlap', `overlap--${festivalLabels.length}`]
                }, festivalLabels.map(label => h('span', label.substring(0, 3))))
                : h('span', {
                  class: 'vxe-date-picker--date-festival--label'
                }, festivalLabels[0].substring(0, 3))
            ])
          )
        }
        return labels
      }
      return `${label}`
    },
    renderDateDayTable  (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const dateHeaders = $xeDatePicker.computeDateHeaders
      const dayDatas = $xeDatePicker.computeDayDatas
      const dateListValue = $xeDatePicker.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
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
                  'is--disabled': $xeDatePicker.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeDatePicker.dateSelectEvent(item),
                  mouseenter: () => $xeDatePicker.dateMouseenterEvent(item)
                }
              }, $xeDatePicker.renderDateLabel(h, item, item.label))
            }))
          }))
        ])
      ]
    },
    renderDateWeekTable (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const weekHeaders = $xeDatePicker.computeWeekHeaders
      const weekDates = $xeDatePicker.computeWeekDates
      const dateListValue = $xeDatePicker.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
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
                  'is--disabled': $xeDatePicker.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': isHover
                },
                on: {
                  click: () => $xeDatePicker.dateSelectEvent(item),
                  mouseenter: () => $xeDatePicker.dateMouseenterEvent(item)
                }
              }, $xeDatePicker.renderDateLabel(h, item, item.label))
            }))
          }))
        ])
      ]
    },
    renderDateMonthTable (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const monthDatas = $xeDatePicker.computeMonthDatas
      const dateListValue = $xeDatePicker.computeDateListValue
      const matchFormat = 'yyyyMM'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
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
                  'is--disabled': $xeDatePicker.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeDatePicker.dateSelectEvent(item),
                  mouseenter: () => $xeDatePicker.dateMouseenterEvent(item)
                }
              }, $xeDatePicker.renderDateLabel(h, item, getI18n(`vxe.input.date.months.m${item.month}`)))
            }))
          }))
        ])
      ]
    },
    renderDateQuarterTable (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const quarterDatas = $xeDatePicker.computeQuarterDatas
      const dateListValue = $xeDatePicker.computeDateListValue
      const matchFormat = 'yyyyq'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
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
                  'is--disabled': $xeDatePicker.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeDatePicker.dateSelectEvent(item),
                  mouseenter: () => $xeDatePicker.dateMouseenterEvent(item)
                }
              }, $xeDatePicker.renderDateLabel(h, item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
            }))
          }))
        ])
      ]
    },
    renderDateYearTable (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePicker.computeDateValue
      const yearDatas = $xeDatePicker.computeYearDatas
      const dateListValue = $xeDatePicker.computeDateListValue
      const matchFormat = 'yyyy'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
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
                  'is--disabled': $xeDatePicker.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                on: {
                  click: () => $xeDatePicker.dateSelectEvent(item),
                  mouseenter: () => $xeDatePicker.dateMouseenterEvent(item)
                }
              }, $xeDatePicker.renderDateLabel(h, item, item.year))
            }))
          }))
        ])
      ]
    },
    renderDateTable  (h: CreateElement) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datePanelType } = reactData
      switch (datePanelType) {
        case 'week' :
          return $xeDatePicker.renderDateWeekTable(h)
        case 'month' :
          return $xeDatePicker.renderDateMonthTable(h)
        case 'quarter' :
          return $xeDatePicker.renderDateQuarterTable(h)
        case 'year' :
          return $xeDatePicker.renderDateYearTable(h)
      }
      return $xeDatePicker.renderDateDayTable(h)
    },
    renderDatePanel  (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { multiple } = props
      const { datePanelType } = reactData
      const isDisabledPrevDateBtn = $xeDatePicker.computeIsDisabledPrevDateBtn
      const isDisabledNextDateBtn = $xeDatePicker.computeIsDisabledNextDateBtn
      const selectDatePanelLabel = $xeDatePicker.computeSelectDatePanelLabel
      return [
        h('div', {
          class: 'vxe-date-picker--date-picker-header'
        }, [
          h('div', {
            class: 'vxe-date-picker--date-picker-type-wrapper'
          }, [
            datePanelType === 'year'
              ? h('span', {
                class: 'vxe-date-picker--date-picker-label'
              }, selectDatePanelLabel)
              : h('span', {
                class: 'vxe-date-picker--date-picker-btn',
                on: {
                  click: $xeDatePicker.dateToggleTypeEvent
                }
              }, selectDatePanelLabel)
          ]),
          h('div', {
            class: 'vxe-date-picker--date-picker-btn-wrapper'
          }, [
            h('span', {
              class: ['vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-prev-btn', {
                'is--disabled': isDisabledPrevDateBtn
              }],
              on: {
                click: $xeDatePicker.datePrevEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-left'
              })
            ]),
            h('span', {
              class: 'vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-current-btn',
              on: {
                click: $xeDatePicker.dateTodayMonthEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-dot'
              })
            ]),
            h('span', {
              class: ['vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-next-btn', {
                'is--disabled': isDisabledNextDateBtn
              }],
              on: {
                click: $xeDatePicker.dateNextEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-right'
              })
            ]),
            multiple && $xeDatePicker.computeSupportMultiples
              ? h('span', {
                class: 'vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-confirm-btn'
              }, [
                h('button', {
                  class: 'vxe-date-picker--date-picker-confirm',
                  attrs: {
                    type: 'button'
                  },
                  on: {
                    click: $xeDatePicker.dateConfirmEvent
                  }
                }, getI18n('vxe.button.confirm'))
              ])
              : null
          ])
        ]),
        h('div', {
          class: 'vxe-date-picker--date-picker-body'
        }, $xeDatePicker.renderDateTable(h))
      ]
    },
    renderTimePanel  (h: CreateElement) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { datetimePanelValue } = reactData
      const dateTimeLabel = $xeDatePicker.computeDateTimeLabel
      const hourList = $xeDatePicker.computeHourList
      const hasTimeMinute = $xeDatePicker.computeHasTimeMinute
      const minuteList = $xeDatePicker.computeMinuteList
      const hasTimeSecond = $xeDatePicker.computeHasTimeSecond
      const secondList = $xeDatePicker.computeSecondList
      return [
        h('div', {
          class: 'vxe-date-picker--time-picker-header'
        }, [
          hasTimeMinute
            ? h('div', {
              class: 'vxe-date-picker--time-picker-title'
            }, dateTimeLabel)
            : renderEmptyElement($xeDatePicker),
          h('div', {
            class: 'vxe-date-picker--time-picker-btn'
          }, [
            h('button', {
              class: 'vxe-date-picker--time-picker-confirm',
              attrs: {
                type: 'button'
              },
              on: {
                click: $xeDatePicker.dateConfirmEvent
              }
            }, getI18n('vxe.button.confirm'))
          ])
        ]),
        h('div', {
          ref: 'refInputTimeBody',
          class: 'vxe-date-picker--time-picker-body'
        }, [
          h('ul', {
            class: 'vxe-date-picker--time-picker-hour-list'
          }, hourList.map((item, index) => {
            return h('li', {
              key: index,
              class: {
                'is--selected': datetimePanelValue && datetimePanelValue.getHours() === item.value
              },
              on: {
                click: (evnt: MouseEvent) => $xeDatePicker.dateHourEvent(evnt, item)
              }
            }, item.label)
          })),
          hasTimeMinute
            ? h('ul', {
              class: 'vxe-date-picker--time-picker-minute-list'
            }, minuteList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getMinutes() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeDatePicker.dateMinuteEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeDatePicker),
          hasTimeMinute && hasTimeSecond
            ? h('ul', {
              class: 'vxe-date-picker--time-picker-second-list'
            }, secondList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getSeconds() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeDatePicker.dateSecondEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeDatePicker)
        ])
      ]
    },
    renderPanel (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle } = reactData
      const vSize = $xeDatePicker.computeSize
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      const renders = []
      if (isDatePickerType) {
        if (type === 'datetime') {
          renders.push(
            h('div', {
              key: type,
              ref: 'refPanelWrapper',
              class: 'vxe-date-picker--panel-layout-wrapper'
            }, [
              h('div', {
                class: 'vxe-date-picker--panel-left-wrapper'
              }, $xeDatePicker.renderDatePanel(h)),
              h('div', {
                class: 'vxe-date-picker--panel-right-wrapper'
              }, $xeDatePicker.renderTimePanel(h))
            ])
          )
        } else if (type === 'time') {
          renders.push(
            h('div', {
              key: type,
              ref: 'refPanelWrapper',
              class: 'vxe-date-picker--panel-wrapper'
            }, $xeDatePicker.renderTimePanel(h))
          )
        } else {
          renders.push(
            h('div', {
              key: type || 'default',
              ref: 'refPanelWrapper',
              class: 'vxe-date-picker--panel-wrapper'
            }, $xeDatePicker.renderDatePanel(h))
          )
        }
        return h('div', {
          ref: 'refInputPanel',
          class: ['vxe-table--ignore-clear vxe-date-picker--panel', `type--${type}`, {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': isAniVisible,
            'ani--enter': visiblePanel
          }],
          attrs: {
            placement: panelPlacement
          },
          style: panelStyle
        }, initialized ? renders : [])
      }
      return renderEmptyElement($xeDatePicker)
    },
    renderPrefixIcon (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const slots = $xeDatePicker.$scopedSlots

      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-date-picker--prefix',
          on: {
            click: $xeDatePicker.clickPrefixEvent
          }
        }, [
          h('div', {
            class: 'vxe-date-picker--prefix-icon'
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
      const $xeDatePicker = this
      const props = $xeDatePicker
      const slots = $xeDatePicker.$scopedSlots
      const reactData = $xeDatePicker.reactData

      const { suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = $xeDatePicker.computeIsDisabled
      const isClearable = $xeDatePicker.computeIsClearable
      return h('div', {
        class: ['vxe-date-picker--suffix', {
          'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }]
      }, [
        isClearable
          ? h('div', {
            class: 'vxe-date-picker--clear-icon',
            on: {
              click: $xeDatePicker.clearValueEvent
            }
          }, [
            h('i', {
              class: getIcon().INPUT_CLEAR
            })
          ])
          : renderEmptyElement($xeDatePicker),
        $xeDatePicker.renderExtraSuffixIcon(h),
        suffixSlot || suffixIcon
          ? h('div', {
            class: 'vxe-date-picker--suffix-icon',
            on: {
              click: $xeDatePicker.clickSuffixEvent
            }
          }, suffixSlot
            ? getSlotVNs(suffixSlot({}))
            : [
                h('i', {
                  class: suffixIcon
                })
              ])
          : renderEmptyElement($xeDatePicker)
      ])
    },
    renderExtraSuffixIcon  (h: CreateElement) {
      const $xeDatePicker = this

      return h('div', {
        class: 'vxe-date-picker--control-icon',
        on: {
          click: $xeDatePicker.datePickerOpenEvent
        }
      }, [
        h('i', {
          class: ['vxe-date-picker--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { className, type, align, name, autocomplete, autoComplete } = props
      const { inputValue, visiblePanel, isActivated } = reactData
      const vSize = $xeDatePicker.computeSize
      const isDisabled = $xeDatePicker.computeIsDisabled
      const formReadonly = $xeDatePicker.computeFormReadonly
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-date-picker--readonly', `type--${type}`, className]
        }, inputValue)
      }
      const inputReadonly = $xeDatePicker.computeInputReadonly
      const inputType = $xeDatePicker.computeDatePickerType
      const inpPlaceholder = $xeDatePicker.computeInpPlaceholder
      const isClearable = $xeDatePicker.computeIsClearable
      const prefix = $xeDatePicker.renderPrefixIcon(h)
      const suffix = $xeDatePicker.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-date-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        prefix || renderEmptyElement($xeDatePicker),
        h('div', {
          class: 'vxe-date-picker--wrapper'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-date-picker--inner',
            domProps: {
              value: inputValue
            },
            attrs: {
              name,
              type: inputType,
              placeholder: inpPlaceholder,
              readonly: inputReadonly,
              disabled: isDisabled,
              autocomplete: autoComplete || autocomplete
            },
            on: {
              keydown: $xeDatePicker.keydownEvent,
              keyup: $xeDatePicker.keyupEvent,
              wheel: $xeDatePicker.wheelEvent,
              click: $xeDatePicker.clickEvent,
              input: $xeDatePicker.inputEvent,
              change: $xeDatePicker.changeEvent,
              focus: $xeDatePicker.focusEvent,
              blur: $xeDatePicker.blurEvent
            }
          })
        ]),
        suffix || renderEmptyElement($xeDatePicker),
        // 下拉面板
        $xeDatePicker.renderPanel(h)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeDatePicker = this

      $xeDatePicker.updateModelValue(val)
      $xeDatePicker.changeValue()
    },
    type () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: '',
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      $xeDatePicker.initValue()
    },
    computeDateLabelFormat () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDatePicker.dateParseValue(reactData.datePanelValue)
        reactData.inputValue = props.multiple ? $xeDatePicker.computeDateMultipleLabel : reactData.datePanelLabel
      }
    }
  },
  created () {
    const $xeDatePicker = this
    const props = $xeDatePicker
    const reactData = $xeDatePicker.reactData

    reactData.inputValue = props.value
    $xeDatePicker.initValue()
  },
  mounted () {
    const $xeDatePicker = this

    globalEvents.on($xeDatePicker, 'mousewheel', $xeDatePicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeDatePicker, 'mousedown', $xeDatePicker.handleGlobalMousedownEvent)
    globalEvents.on($xeDatePicker, 'keydown', $xeDatePicker.handleGlobalKeydownEvent)
    globalEvents.on($xeDatePicker, 'blur', $xeDatePicker.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeDatePicker = this

    const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeDatePicker, 'mousewheel')
    globalEvents.off($xeDatePicker, 'mousedown')
    globalEvents.off($xeDatePicker, 'keydown')
    globalEvents.off($xeDatePicker, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
