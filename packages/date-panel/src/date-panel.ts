import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { toStringTimeDate, getDateQuarter, parseDateValue, parseDateObj, handleValueFormat, hasDateValueType, hasTimestampValueType } from './util'

import type { VxeDatePanelConstructor, DatePanelInternalData, DatePanelReactData, VxeDatePanelPropTypes, VxeComponentSizeType, ValueOf, VxeDatePanelEmits, VxeDatePanelDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeDatePanel',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Date] as PropType<VxeDatePanelPropTypes.ModelValue>,
    type: {
      type: String as PropType<VxeDatePanelPropTypes.Type>,
      default: 'date' as VxeDatePanelPropTypes.Type
    },
    className: String as PropType<VxeDatePanelPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeDatePanelPropTypes.Size>,
      default: () => getConfig().datePanel.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeDatePanelPropTypes.Multiple>,
    limitCount: {
      type: [String, Number] as PropType<VxeDatePanelPropTypes.LimitCount>,
      default: () => getConfig().datePanel.limitCount
    },

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeDatePanelPropTypes.StartDate>,
      default: () => getConfig().datePanel.startDate
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeDatePanelPropTypes.EndDate>,
      default: () => getConfig().datePanel.endDate
    },
    defaultDate: [String, Number, Date] as PropType<VxeDatePanelPropTypes.DefaultDate>,
    minDate: [String, Number, Date] as PropType<VxeDatePanelPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDatePanelPropTypes.MaxDate>,
    startDay: {
      type: [String, Number] as PropType<VxeDatePanelPropTypes.StartDay>,
      default: () => getConfig().datePanel.startDay
    },
    labelFormat: String as PropType<VxeDatePanelPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeDatePanelPropTypes.ValueFormat>,
    timeFormat: String as PropType<VxeDatePanelPropTypes.TimeFormat>,
    festivalMethod: {
      type: Function as PropType<VxeDatePanelPropTypes.FestivalMethod>,
      default: () => getConfig().datePanel.festivalMethod
    },
    disabledMethod: {
      type: Function as PropType<VxeDatePanelPropTypes.DisabledMethod>,
      default: () => getConfig().datePanel.disabledMethod
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeDatePanelPropTypes.SelectDay>,
      default: () => getConfig().datePanel.selectDay
    }
  },
  data () {
    const xID = XEUtils.uniqueId()

    const reactData: DatePanelReactData = {
      visiblePanel: false,
      isAniVisible: false,
      isActivated: false,
      inputValue: '',
      datetimePanelValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    }

    const internalData: DatePanelInternalData = {
      yearSize: 12,
      monthSize: 20,
      quarterSize: 8,
      hpTimeout: undefined as any
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
    }),
    computeIsDateTimeType () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { type } = props
      return type === 'time' || type === 'datetime'
    },
    computeIsDatePanelType () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeDateStartTime () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    },
    computeDateEndTime () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    },
    computeDateListValue () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { value: modelValue, multiple } = props
      const isDatePanelType = $xeDatePanel.computeIsDatePanelType as boolean
      const dateValueFormat = $xeDatePanel.computeDateValueFormat as string
      if (multiple && modelValue && isDatePanelType) {
        return XEUtils.toValueString(modelValue).split(',').map(item => {
          const date = ($xeDatePanel as any).parseDate(item, dateValueFormat)
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return date
        })
      }
      return []
    },
    computeDateMultipleValue () {
      const $xeDatePanel = this

      const dateListValue = $xeDatePanel.computeDateListValue as Date[]
      const dateValueFormat = $xeDatePanel.computeDateValueFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    },
    computeDateMultipleLabel () {
      const $xeDatePanel = this

      const dateListValue = $xeDatePanel.computeDateListValue as Date[]
      const dateLabelFormat = $xeDatePanel.computeDateLabelFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateLabelFormat)).join(', ')
    },
    computeLimitMaxCount () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      return props.multiple ? XEUtils.toNumber(props.limitCount) : 0
    },
    computeOverCount () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { multiple } = props
      const limitMaxCount = $xeDatePanel.computeLimitMaxCount as number
      const dateMultipleValue = $xeDatePanel.computeDateMultipleValue as string[]
      if (multiple && limitMaxCount) {
        return dateMultipleValue.length >= limitMaxCount
      }
      return false
    },
    computeDateValueFormat () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { type, valueFormat } = props
      return handleValueFormat(type, valueFormat)
    },
    computeDateValue () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { value: modelValue } = props
      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      let val = null
      if (modelValue && isDatePanelType) {
        const date = ($xeDatePanel as any).parseDate(modelValue, dateValueFormat)
        if (XEUtils.isValidDate(date)) {
          val = date
        }
      }
      return val
    },
    computeIsDisabledPrevDateBtn () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData as DatePanelReactData

      const dateStartTime = $xeDatePanel.computeDateStartTime as Date | null
      const { selectMonth } = reactData
      if (selectMonth && dateStartTime) {
        return selectMonth <= dateStartTime
      }
      return false
    },
    computeIsDisabledNextDateBtn () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData as DatePanelReactData

      const dateEndTime = $xeDatePanel.computeDateEndTime as Date | null
      const { selectMonth } = reactData
      if (selectMonth && dateEndTime) {
        return XEUtils.getWhatMonth(selectMonth, 0, 'last') >= dateEndTime
      }
      return false
    },
    computeDateTimeLabel () {
      const $xeDatePanel = this
      const reactData = ($xeDatePanel as unknown as VxeDatePanelConstructor).reactData

      const { datetimePanelValue } = reactData
      const hasTimeSecond = $xeDatePanel.computeHasTimeSecond
      const hasTimeMinute = $xeDatePanel.computeHasTimeMinute
      if (datetimePanelValue) {
        return XEUtils.toDateString(datetimePanelValue, hasTimeMinute && hasTimeSecond ? 'HH:mm:ss' : (hasTimeMinute ? 'HH:mm' : 'HH'))
      }
      return ''
    },
    computeDateHMSTime () {
      const $xeDatePanel = this

      const dateValue = $xeDatePanel.computeDateValue as Date | null
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
      return dateValue && isDateTimeType ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0
    },
    computeDateLabelFormat () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { labelFormat } = props
      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      if (isDatePanelType) {
        return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
      }
      return ''
    },
    computeYearList () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      const { yearSize } = internalData
      const { selectMonth, currentDate } = reactData
      const years: VxeDatePanelDefines.DateYearItem[] = []
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
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      let y = ''
      let m = ''
      if (isDatePanelType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = $xeDatePanel.computeYearList
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
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeDatePanelPropTypes.StartDay
    },
    computeWeekDatas () {
      const $xeDatePanel = this

      const weeks: number[] = []
      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      if (isDatePanelType) {
        let sWeek = $xeDatePanel.computeFirstDayOfWeek
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
      const $xeDatePanel = this

      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      if (isDatePanelType) {
        const weekDatas = $xeDatePanel.computeWeekDatas as number[]
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
      const $xeDatePanel = this

      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      if (isDatePanelType) {
        const dateHeaders = $xeDatePanel.computeDateHeaders as {
          value: number;
          label: string;
      }[]
        return [{ label: getI18n('vxe.input.date.weeks.w') }].concat(dateHeaders)
      }
      return []
    },
    computeYearDatas () {
      const $xeDatePanel = this

      const yearList = $xeDatePanel.computeYearList as VxeDatePanelDefines.DateYearItem[]
      return XEUtils.chunk(yearList, 4)
    },
    computeQuarterList () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      const { quarterSize } = internalData
      const { selectMonth, currentDate } = reactData
      const quarters: VxeDatePanelDefines.DateQuarterItem[] = []
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
      const $xeDatePanel = this

      const quarterList = $xeDatePanel.computeQuarterList as VxeDatePanelDefines.DateQuarterItem[]
      return XEUtils.chunk(quarterList, 2)
    },
    computeMonthList () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      const { monthSize } = internalData
      const { selectMonth, currentDate } = reactData
      const months: VxeDatePanelDefines.DateMonthItem[] = []
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
      const $xeDatePanel = this

      const monthList = $xeDatePanel.computeMonthList as VxeDatePanelDefines.DateMonthItem[]
      return XEUtils.chunk(monthList, 4)
    },
    computeDayList () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { selectMonth, currentDate } = reactData
      const days: VxeDatePanelDefines.DateDayItem[] = []
      if (selectMonth && currentDate) {
        const dateHMSTime = $xeDatePanel.computeDateHMSTime
        const weekDatas = $xeDatePanel.computeWeekDatas
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
      const $xeDatePanel = this

      const dayList = $xeDatePanel.computeDayList as VxeDatePanelDefines.DateDayItem[]
      return XEUtils.chunk(dayList, 7)
    },
    computeWeekDates () {
      const $xeDatePanel = this

      const dayDatas = $xeDatePanel.computeDayDatas as VxeDatePanelDefines.DateDayItem[][]
      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      return dayDatas.map((list) => {
        const firstItem = list[0]
        const item: VxeDatePanelDefines.DateDayItem = {
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
      const $xeDatePanel = this

      const list: VxeDatePanelDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
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
      const $xeDatePanel = this

      const list: VxeDatePanelDefines.DateHourMinuteSecondItem[] = []
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
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
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { timeFormat } = props
      const dateValueFormat = $xeDatePanel.computeDateValueFormat as string
      return !/HH/.test(timeFormat || dateValueFormat) || /mm/.test(timeFormat || dateValueFormat)
    },
    computeHasTimeSecond () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { timeFormat } = props
      const dateValueFormat = $xeDatePanel.computeDateValueFormat as string
      return !/HH/.test(timeFormat || dateValueFormat) || /ss/.test(timeFormat || dateValueFormat)
    },
    computeSecondList () {
      const $xeDatePanel = this

      const minuteList = $xeDatePanel.computeMinuteList
      return minuteList
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDatePanelEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDatePanel = this
      $xeDatePanel.$emit(type, createEvent(evnt, { $drawer: $xeDatePanel }, params))
    },
    emitModel (value: any) {
      const $xeDatePanel = this

      const { _events } = $xeDatePanel as any
      if (_events && _events.modelValue) {
        $xeDatePanel.$emit('modelValue', value)
      } else {
        $xeDatePanel.$emit('model-value', value)
      }
    },
    updateModelValue (modelValue: VxeDatePanelPropTypes.ModelValue | undefined) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type } = props
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      reactData.inputValue = parseDateValue(modelValue, type, { valueFormat: dateValueFormat })
      $xeDatePanel.dateOpenPanel()
    },
    parseDate (value: VxeDatePanelPropTypes.ModelValue, format: string) {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { type, multiple } = props
      if (type === 'time') {
        return toStringTimeDate(value)
      }
      if (XEUtils.isArray(value)) {
        return XEUtils.toStringDate(value[0], format)
      }
      if (XEUtils.isString(value)) {
        return XEUtils.toStringDate(multiple ? XEUtils.last(value.split(',')) : value, format)
      }
      return XEUtils.toStringDate(value, format)
    },
    dateRevert () {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      reactData.inputValue = props.multiple ? $xeDatePanel.computeDateMultipleLabel : reactData.datePanelLabel
    },
    afterCheckValue (inputLabel: string) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type } = props
      const { inputValue, datetimePanelValue } = reactData
      const dateLabelFormat = $xeDatePanel.computeDateLabelFormat
      if (inputLabel) {
        let inpDateVal: VxeDatePanelPropTypes.ModelValue = $xeDatePanel.parseDate(inputLabel, dateLabelFormat as string)
        if (XEUtils.isValidDate(inpDateVal)) {
          if (type === 'time') {
            inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
            if (inputValue !== inpDateVal) {
              $xeDatePanel.handleChange(inpDateVal, { type: 'check' })
            }
            reactData.inputValue = inpDateVal
          } else {
            let isChange = false
            const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
            if (type === 'datetime') {
              const dateValue = $xeDatePanel.computeDateValue
              if (inputLabel !== XEUtils.toDateString(dateValue, dateLabelFormat) || inputLabel !== XEUtils.toDateString(inpDateVal, dateLabelFormat)) {
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
              $xeDatePanel.dateChange(inpDateVal)
            }
          }
        } else {
          $xeDatePanel.dateRevert()
        }
      } else {
        $xeDatePanel.handleChange('', { type: 'check' })
      }
    },
    handleChange (value: string, evnt: Event | { type: string }) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type, value: modelValue, valueFormat } = props
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      reactData.inputValue = value
      if (hasTimestampValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        const timeNum = dateVal ? dateVal.getTime() : null
        $xeDatePanel.emitModel(timeNum)
        if (modelValue !== timeNum) {
          $xeDatePanel.dispatchEvent('change', { value: timeNum }, evnt as Event)
        }
      } else if (hasDateValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        $xeDatePanel.emitModel(dateVal)
        if (modelValue && dateVal ? XEUtils.toStringDate(modelValue).getTime() !== dateVal.getTime() : modelValue !== dateVal) {
          $xeDatePanel.dispatchEvent('change', { value: dateVal }, evnt as Event)
        }
      } else {
        $xeDatePanel.emitModel(value)
        if (XEUtils.toValueString(modelValue) !== value) {
          $xeDatePanel.dispatchEvent('change', { value }, evnt as Event)
        }
      }
    },
    hidePanel () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      return new Promise<void>(resolve => {
        reactData.visiblePanel = false
        internalData.hpTimeout = setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    },
    dateParseValue (val?: VxeDatePanelPropTypes.ModelValue) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type } = props
      const dateLabelFormat = $xeDatePanel.computeDateLabelFormat
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      const dateObj = parseDateObj(val, type, {
        valueFormat: dateValueFormat,
        labelFormat: dateLabelFormat,
        firstDay: firstDayOfWeek
      })
      reactData.datePanelValue = dateObj.value
      reactData.datePanelLabel = dateObj.label
    },
    /**
     * 值变化时处理
     */
    changeValue () {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      const { inputValue } = reactData
      if (isDatePanelType) {
        $xeDatePanel.dateParseValue(inputValue)
        reactData.inputValue = props.multiple ? $xeDatePanel.computeDateMultipleLabel : reactData.datePanelLabel
      }
    },
    /**
     * 检查初始值
     */
    initValue () {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { value: modelValue } = props
      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      $xeDatePanel.updateModelValue(modelValue)
      if (isDatePanelType) {
        $xeDatePanel.changeValue()
      }
    },
    dateCheckMonth (date: Date) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      const weekNum = XEUtils.getYearWeek(date, firstDayOfWeek)
      const weekStartDate = XEUtils.getWhatWeek(date, 0, firstDayOfWeek, firstDayOfWeek)
      const month = XEUtils.getWhatMonth(weekNum === 1 ? XEUtils.getWhatDay(weekStartDate, 6) : date, 0, 'first')
      if (!XEUtils.isEqual(month, reactData.selectMonth)) {
        reactData.selectMonth = month
      }
    },
    dateChange (date: Date, isReload?: boolean) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { value: modelValue, multiple } = props
      const { datetimePanelValue } = reactData
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeDatePanelPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      } else if (isDateTimeType) {
        if (datetimePanelValue) {
          date.setHours(datetimePanelValue.getHours())
          date.setMinutes(datetimePanelValue.getMinutes())
          date.setSeconds(datetimePanelValue.getSeconds())
        }
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      $xeDatePanel.dateCheckMonth(date)
      if (multiple) {
        const overCount = $xeDatePanel.computeOverCount
        // 如果为多选
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = isReload ? [] : [...$xeDatePanel.computeDateListValue]
          const datetimeRest: Date[] = []
          const eqIndex = XEUtils.findIndexOf(dateListValue, val => XEUtils.isDateSame(date, val, 'yyyyMMdd'))
          if (eqIndex === -1) {
            if (overCount) {
              // 如果超出最大多选数量
              return
            }
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
          $xeDatePanel.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          const dateMultipleValue = isReload ? [] : $xeDatePanel.computeDateMultipleValue
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            $xeDatePanel.handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            if (overCount) {
              // 如果超出最大多选数量
              return
            }
            $xeDatePanel.handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(modelValue, inpVal)) {
          $xeDatePanel.handleChange(inpVal, { type: 'update' })
        }
      }
    },
    // 日期
    dateMonthHandle (date: Date, offsetMonth: number) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      const weekNum = XEUtils.getYearWeek(date, firstDayOfWeek)
      const weekStartDate = XEUtils.getWhatWeek(date, 0, firstDayOfWeek, firstDayOfWeek)
      const month = XEUtils.getWhatMonth(weekNum === 1 ? XEUtils.getWhatDay(weekStartDate, 6) : date, offsetMonth, 'first')
      reactData.selectMonth = month
    },
    dateNowHandle () {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type } = props
      const firstDayOfWeek = $xeDatePanel.computeFirstDayOfWeek
      let currentDate = new Date()
      switch (type) {
        case 'week':
          currentDate = XEUtils.getWhatWeek(currentDate, 0, firstDayOfWeek)
          break
        case 'datetime':
          currentDate = new Date()
          reactData.datetimePanelValue = new Date()
          break
        default:
          currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
          break
      }
      reactData.currentDate = currentDate
      $xeDatePanel.dateMonthHandle(currentDate, 0)
    },
    dateToggleYearTypeEvent () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      reactData.datePanelType = 'year'
    },
    dateToggleMonthTypeEvent () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
    },
    datePrevEvent (evnt: Event) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      const { type } = props
      const { datePanelType, selectMonth, inputValue } = reactData
      const { yearSize } = internalData
      const value = inputValue
      const isDisabledPrevDateBtn = $xeDatePanel.computeIsDisabledPrevDateBtn
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
        $xeDatePanel.dispatchEvent('date-prev', { viewType: datePanelType, viewDate, value, type }, evnt)
      }
    },
    dateTodayMonthEvent (evnt: Event) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      $xeDatePanel.dateNowHandle()
      $xeDatePanel.dateChange(reactData.currentDate, true)
      if (!props.multiple) {
        $xeDatePanel.hidePanel()
      }
      $xeDatePanel.dispatchEvent('date-today', { type: props.type }, evnt)
    },
    dateNextEvent (evnt: Event) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData
      const internalData = $xeDatePanel.internalData

      const { type } = props
      const { datePanelType, selectMonth, inputValue } = reactData
      const { yearSize } = internalData
      const value = inputValue
      const isDisabledNextDateBtn = $xeDatePanel.computeIsDisabledNextDateBtn
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
        $xeDatePanel.dispatchEvent('date-next', { viewType: datePanelType, value, type }, evnt)
      }
    },
    isRangeDisabled (item: { date: Date }) {
      const $xeDatePanel = this

      const dateStartTime = $xeDatePanel.computeDateStartTime
      const dateEndTime = $xeDatePanel.computeDateEndTime
      const { date } = item
      if (dateStartTime && dateStartTime.getTime() > date.getTime()) {
        return true
      }
      if (dateEndTime && dateEndTime.getTime() < date.getTime()) {
        return true
      }
      return false
    },
    isDateDisabled (item: { date: Date }) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { disabledMethod } = props
      const { datePanelType } = reactData
      const { date } = item
      if (disabledMethod) {
        return disabledMethod({ type: datePanelType, viewType: datePanelType, date, $datePanel: $xeDatePanel })
      }
      return false
    },
    hasAllDisabled (item: { date: Date }) {
      const $xeDatePanel = this

      return $xeDatePanel.isRangeDisabled(item) || $xeDatePanel.isDateDisabled(item)
    },
    dateSelectItem (date: Date) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type, multiple } = props
      const { datePanelType } = reactData
      if (type === 'month') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeDatePanel.dateCheckMonth(date)
        } else {
          $xeDatePanel.dateChange(date)
          if (!multiple) {
            $xeDatePanel.hidePanel()
          }
        }
      } else if (type === 'year') {
        $xeDatePanel.dateChange(date)
        if (!multiple) {
          $xeDatePanel.hidePanel()
        }
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          $xeDatePanel.dateCheckMonth(date)
        } else {
          $xeDatePanel.dateChange(date)
          if (!multiple) {
            $xeDatePanel.hidePanel()
          }
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          $xeDatePanel.dateCheckMonth(date)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeDatePanel.dateCheckMonth(date)
        } else {
          $xeDatePanel.dateChange(date)
          if (type === 'datetime') {
            // 日期带时间
          } else {
            if (!multiple) {
              $xeDatePanel.hidePanel()
            }
          }
        }
      }
    },
    dateSelectEvent (item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem) {
      const $xeDatePanel = this

      if (!$xeDatePanel.hasAllDisabled(item)) {
        $xeDatePanel.dateSelectItem(item.date)
      }
    },
    dateMoveDay (offsetDay: Date) {
      const $xeDatePanel = this

      if (!$xeDatePanel.hasAllDisabled({ date: offsetDay })) {
        const dayList = $xeDatePanel.computeDayList
        if (!dayList.some((item) => XEUtils.isDateSame(item.date, offsetDay, 'yyyyMMdd'))) {
          $xeDatePanel.dateCheckMonth(offsetDay)
        }
        $xeDatePanel.dateParseValue(offsetDay)
      }
    },
    dateMoveYear (offsetYear: Date) {
      const $xeDatePanel = this

      if (!$xeDatePanel.hasAllDisabled({ date: offsetYear })) {
        const yearList = $xeDatePanel.computeYearList
        if (!yearList.some((item) => XEUtils.isDateSame(item.date, offsetYear, 'yyyy'))) {
          $xeDatePanel.dateCheckMonth(offsetYear)
        }
        $xeDatePanel.dateParseValue(offsetYear)
      }
    },
    dateMoveQuarter (offsetQuarter: Date) {
      const $xeDatePanel = this

      if (!$xeDatePanel.hasAllDisabled({ date: offsetQuarter })) {
        const quarterList = $xeDatePanel.computeQuarterList
        if (!quarterList.some((item) => XEUtils.isDateSame(item.date, offsetQuarter, 'yyyyq'))) {
          $xeDatePanel.dateCheckMonth(offsetQuarter)
        }
        $xeDatePanel.dateParseValue(offsetQuarter)
      }
    },
    dateMoveMonth (offsetMonth: Date) {
      const $xeDatePanel = this

      if (!$xeDatePanel.hasAllDisabled({ date: offsetMonth })) {
        const monthList = $xeDatePanel.computeMonthList
        if (!monthList.some((item) => XEUtils.isDateSame(item.date, offsetMonth, 'yyyyMM'))) {
          $xeDatePanel.dateCheckMonth(offsetMonth)
        }
        $xeDatePanel.dateParseValue(offsetMonth)
      }
    },
    dateMouseenterEvent (item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      if (!$xeDatePanel.hasAllDisabled(item)) {
        const { datePanelType } = reactData
        if (datePanelType === 'month') {
          $xeDatePanel.dateMoveMonth(item.date)
        } else if (datePanelType === 'quarter') {
          $xeDatePanel.dateMoveQuarter(item.date)
        } else if (datePanelType === 'year') {
          $xeDatePanel.dateMoveYear(item.date)
        } else {
          $xeDatePanel.dateMoveDay(item.date)
        }
      }
    },
    dateMouseleaveEvent () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      reactData.datePanelValue = null
    },
    updateTimePos (liElem: Element) {
      if (liElem) {
        const height = (liElem as HTMLElement).offsetHeight
        const ulElem = liElem.parentNode as HTMLElement
        ulElem.scrollTop = (liElem as HTMLElement).offsetTop - height * 4
      }
    },
    dateTimeChangeEvent (evnt: Event) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datetimePanelValue } = reactData
      reactData.datetimePanelValue = datetimePanelValue ? new Date(datetimePanelValue.getTime()) : new Date()
      $xeDatePanel.updateTimePos(evnt.currentTarget as HTMLLIElement)
    },
    dateHourEvent (evnt: MouseEvent, item: VxeDatePanelDefines.DateHourMinuteSecondItem) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setHours(item.value)
      }
      $xeDatePanel.dateTimeChangeEvent(evnt)
    },
    dateConfirmEvent (evnt: Event) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datetimePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
      if (isDateTimeType) {
        const dateValueFormat = $xeDatePanel.computeDateValueFormat
        if (multiple) {
          // 如果为多选
          const dateMultipleValue = $xeDatePanel.computeDateMultipleValue
          if (isDateTimeType) {
            // 如果是datetime特殊类型
            const dateListValue = [...$xeDatePanel.computeDateListValue]
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
            $xeDatePanel.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
          } else {
            // 如果是日期类型
            $xeDatePanel.handleChange(dateMultipleValue.join(','), { type: 'update' })
          }
        } else {
          $xeDatePanel.dateChange(dateValue || reactData.currentDate)
        }
      }
      $xeDatePanel.hidePanel()
      $xeDatePanel.dispatchEvent('confirm', {}, evnt)
    },
    dateMinuteEvent (evnt: MouseEvent, item: VxeDatePanelDefines.DateHourMinuteSecondItem) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setMinutes(item.value)
      }
      $xeDatePanel.dateTimeChangeEvent(evnt)
    },
    dateSecondEvent (evnt: MouseEvent, item: VxeDatePanelDefines.DateHourMinuteSecondItem) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        datetimePanelValue.setSeconds(item.value)
      }
      $xeDatePanel.dateTimeChangeEvent(evnt)
    },
    dateOpenPanel () {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type, defaultDate } = props
      const isDateTimeType = $xeDatePanel.computeIsDateTimeType
      const dateValueFormat = $xeDatePanel.computeDateValueFormat
      const dateValue = $xeDatePanel.computeDateValue
      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        reactData.datePanelType = type as 'year' | 'quarter' | 'month' | 'week'
      } else {
        reactData.datePanelType = 'day'
      }
      reactData.currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      if (dateValue) {
        $xeDatePanel.dateMonthHandle(dateValue, 0)
        $xeDatePanel.dateParseValue(dateValue)
      } else {
        if (defaultDate) {
          const defDate = $xeDatePanel.parseDate(defaultDate, dateValueFormat)
          if (XEUtils.isValidDate(defDate)) {
            $xeDatePanel.dateMonthHandle(defDate, 0)
          } else {
            $xeDatePanel.dateNowHandle()
          }
        } else {
          $xeDatePanel.dateNowHandle()
        }
      }
      if (isDateTimeType) {
        reactData.datetimePanelValue = reactData.datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
        $xeDatePanel.$nextTick(() => {
          const timeBodyElem = $xeDatePanel.$refs.refInputTimeBody as HTMLDivElement
          XEUtils.arrayEach(timeBodyElem.querySelectorAll('li.is--selected'), (elem) => {
            $xeDatePanel.updateTimePos(elem)
          })
        })
      }
    },
    getModelValue () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      return reactData.inputValue
    },
    setPanelDate (date: Date) {
      const $xeDatePanel = this

      if (date) {
        $xeDatePanel.dateCheckMonth(date)
      }
    },
    getPanelDate () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      return reactData.selectMonth
    },
    checkValue (inputLabel: string) {
      const $xeDatePanel = this

      $xeDatePanel.afterCheckValue(inputLabel)
    },
    confirmByEvent (evnt: Event) {
      const $xeDatePanel = this

      $xeDatePanel.dateConfirmEvent(evnt)
    },

    //
    // Render
    //
    renderDateLabel (h: CreateElement, item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem, label: string | number) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { festivalMethod } = props
      const labelVNs: VNode[] = []
      if (festivalMethod) {
        const { datePanelType } = reactData
        const festivalRest = festivalMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $datePanel: $xeDatePanel })
        const festivalItem = festivalRest ? (XEUtils.isString(festivalRest) ? { label: festivalRest } : festivalRest) : {}
        const extraItem = festivalItem.extra ? (XEUtils.isString(festivalItem.extra) ? { label: festivalItem.extra } : festivalItem.extra) : null
        labelVNs.push(
          h('div', {
            class: ['vxe-date-panel--label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('div', `${label}`),
                h('div', {
                  class: ['vxe-date-panel--label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
                  style: extraItem.style
                }, XEUtils.toValueString(extraItem.label))
              ]
            : `${label}`)
        )
        const festivalLabel = festivalItem.label
        if (festivalLabel) {
        // 默认最多支持3个节日重叠
          const festivalLabels = XEUtils.toValueString(festivalLabel).split(',')
          labelVNs.push(
            h('div', {
              class: ['vxe-date-panel--festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
              style: festivalItem.style
            }, [
              festivalLabels.length > 1
                ? h('div', {
                  class: ['vxe-date-panel--festival--overlap', `overlap--${festivalLabels.length}`]
                }, festivalLabels.map(label => h('div', label.substring(0, 3))))
                : h('div', {
                  class: 'vxe-date-panel--festival--label'
                }, festivalLabels[0].substring(0, 3))
            ])
          )
        }
      }
      return labelVNs
    },
    renderDateDayTable (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const dateHeaders = $xeDatePanel.computeDateHeaders
      const dayDatas = $xeDatePanel.computeDayDatas
      const dateListValue = $xeDatePanel.computeDateListValue
      const overCount = $xeDatePanel.computeOverCount
      const matchFormat = 'yyyyMMdd'
      return [
        h('div', {
          class: ['vxe-date-panel--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-date-panel--view-header'
          }, [
            h('div', {
              class: 'vxe-date-panel--view-row'
            }, dateHeaders.map((item) => {
              return h('div', {
                class: 'vxe-date-panel--view-item',
                style: {
                  width: `${100 / dateHeaders.length}%`
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, [
                  h('div', {
                    class: 'vxe-date-panel--view-item-label'
                  }, item.label)
                ])
              ])
            }))
          ]),
          h('div', {
            class: 'vxe-date-panel--view-body'
          }, dayDatas.map((rows) => {
            return h('div', {
              class: 'vxe-date-panel--view-row',
              style: {
                height: `${100 / dayDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-date-panel--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--range-disabled': $xeDatePanel.isRangeDisabled(item),
                  'is--disabled': $xeDatePanel.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--over': overCount && !isSelected,
                  'is--hover': !overCount && XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: {
                  width: `${100 / rows.length}%`
                },
                on: {
                  click: () => $xeDatePanel.dateSelectEvent(item),
                  mouseenter: () => $xeDatePanel.dateMouseenterEvent(item),
                  mouseleave: $xeDatePanel.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, $xeDatePanel.renderDateLabel(h, item, item.label))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateWeekTable (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const weekHeaders = $xeDatePanel.computeWeekHeaders
      const weekDates = $xeDatePanel.computeWeekDates
      const dateListValue = $xeDatePanel.computeDateListValue
      const overCount = $xeDatePanel.computeOverCount
      const matchFormat = 'yyyyMMdd'
      return [
        h('div', {
          class: ['vxe-date-panel--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-date-panel--view-header'
          }, [
            h('div', {
              class: 'vxe-date-panel--view-row'
            }, weekHeaders.map((item, rIndex) => {
              return h('div', {
                class: 'vxe-date-panel--view-item',
                style: {
                  width: `${rIndex ? 13 : 9}%`
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, [
                  h('div', {
                    class: 'vxe-date-panel--view-item-label'
                  }, item.label)
                ])
              ])
            }))
          ]),
          h('div', {
            class: 'vxe-date-panel--view-body'
          }, weekDates.map((rows) => {
            const isSelected = multiple ? rows.some((item) => dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat))) : rows.some((item) => XEUtils.isDateSame(dateValue, item.date, matchFormat))
            const isHover = rows.some((item) => XEUtils.isDateSame(datePanelValue, item.date, matchFormat))
            const isNowWeek = rows.some(item => item.isNow)
            return h('div', {
              class: 'vxe-date-panel--view-row',
              style: {
                height: `${100 / weekDates.length}%`
              }
            }, rows.map((item, rIndex) => {
              return h('div', {
                class: ['vxe-date-panel--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': rIndex ? item.isNow : isNowWeek,
                  'is--next': item.isNext,
                  'is--range-disabled': $xeDatePanel.isRangeDisabled(item),
                  'is--disabled': $xeDatePanel.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--over': overCount && !isSelected,
                  'is--hover': !overCount && isHover
                }],
                style: {
                  width: `${rIndex ? 13 : 9}%`
                },
                on: {
                  click: () => $xeDatePanel.dateSelectEvent(item),
                  mouseenter: () => $xeDatePanel.dateMouseenterEvent(item),
                  mouseleave: $xeDatePanel.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, $xeDatePanel.renderDateLabel(h, item, item.label))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateMonthTable (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const monthDatas = $xeDatePanel.computeMonthDatas
      const dateListValue = $xeDatePanel.computeDateListValue
      const overCount = $xeDatePanel.computeOverCount
      const matchFormat = 'yyyyMM'
      return [
        h('div', {
          class: ['vxe-date-panel--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-date-panel--view-body'
          }, monthDatas.map((rows) => {
            return h('div', {
              class: 'vxe-date-panel--view-row',
              style: {
                height: `${100 / monthDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-date-panel--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--range-disabled': $xeDatePanel.isRangeDisabled(item),
                  'is--disabled': $xeDatePanel.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--over': overCount && !isSelected,
                  'is--hover': !overCount && XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: {
                  width: `${100 / rows.length}%`
                },
                on: {
                  click: () => $xeDatePanel.dateSelectEvent(item),
                  mouseenter: () => $xeDatePanel.dateMouseenterEvent(item),
                  mouseleave: $xeDatePanel.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, $xeDatePanel.renderDateLabel(h, item, getI18n(`vxe.input.date.months.m${item.month}`)))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateQuarterTable (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const quarterDatas = $xeDatePanel.computeQuarterDatas
      const dateListValue = $xeDatePanel.computeDateListValue
      const overCount = $xeDatePanel.computeOverCount
      const matchFormat = 'yyyyq'
      return [
        h('div', {
          class: ['vxe-date-panel--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-date-panel--view-body'
          }, quarterDatas.map((rows) => {
            return h('div', {
              class: 'vxe-date-panel--view-row',
              style: {
                height: `${100 / quarterDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-date-panel--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--range-disabled': $xeDatePanel.isRangeDisabled(item),
                  'is--disabled': $xeDatePanel.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--over': overCount && !isSelected,
                  'is--hover': !overCount && XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: {
                  width: `${100 / rows.length}%`
                },
                on: {
                  click: () => $xeDatePanel.dateSelectEvent(item),
                  mouseenter: () => $xeDatePanel.dateMouseenterEvent(item),
                  mouseleave: $xeDatePanel.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, $xeDatePanel.renderDateLabel(h, item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateYearTable (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeDatePanel.computeDateValue
      const yearDatas = $xeDatePanel.computeYearDatas
      const dateListValue = $xeDatePanel.computeDateListValue
      const overCount = $xeDatePanel.computeOverCount
      const matchFormat = 'yyyy'
      return [
        h('div', {
          class: ['vxe-date-panel--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-date-panel--view-body'
          }, yearDatas.map((rows) => {
            return h('div', {
              class: 'vxe-date-panel--view-row',
              style: {
                height: `${100 / yearDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-date-panel--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--range-disabled': $xeDatePanel.isRangeDisabled(item),
                  'is--disabled': $xeDatePanel.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--over': overCount && !isSelected,
                  'is--hover': !overCount && XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: {
                  width: `${100 / rows.length}%`
                },
                on: {
                  click: () => $xeDatePanel.dateSelectEvent(item),
                  mouseenter: () => $xeDatePanel.dateMouseenterEvent(item),
                  mouseleave: $xeDatePanel.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-date-panel--view-item-inner'
                }, $xeDatePanel.renderDateLabel(h, item, item.year))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateTable (h: CreateElement) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datePanelType } = reactData
      switch (datePanelType) {
        case 'week' :
          return $xeDatePanel.renderDateWeekTable(h)
        case 'month' :
          return $xeDatePanel.renderDateMonthTable(h)
        case 'quarter' :
          return $xeDatePanel.renderDateQuarterTable(h)
        case 'year' :
          return $xeDatePanel.renderDateYearTable(h)
      }
      return $xeDatePanel.renderDateDayTable(h)
    },
    renderDatePanel (h: CreateElement) {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

      const { datePanelType } = reactData
      const isDisabledPrevDateBtn = $xeDatePanel.computeIsDisabledPrevDateBtn
      const isDisabledNextDateBtn = $xeDatePanel.computeIsDisabledNextDateBtn
      const selectDatePanelObj = $xeDatePanel.computeSelectDatePanelObj
      return [
        h('div', {
          class: 'vxe-date-panel--picker-header'
        }, [
          h('div', {
            class: 'vxe-date-panel--picker-type-wrapper'
          }, [
            datePanelType === 'year'
              ? h('span', {
                class: 'vxe-date-panel--picker-label'
              }, selectDatePanelObj.y)
              : h('span', {
                class: 'vxe-date-panel--picker-btns'
              }, [
                h('span', {
                  class: 'vxe-date-panel--picker-btn',
                  on: {
                    click: $xeDatePanel.dateToggleYearTypeEvent
                  }
                }, selectDatePanelObj.y),
                selectDatePanelObj.m
                  ? h('span', {
                    class: 'vxe-date-panel--picker-btn',
                    on: {
                      click: $xeDatePanel.dateToggleMonthTypeEvent
                    }
                  }, selectDatePanelObj.m)
                  : renderEmptyElement($xeDatePanel)
              ])
          ]),
          h('div', {
            class: 'vxe-date-panel--picker-btn-wrapper'
          }, [
            h('span', {
              class: ['vxe-date-panel--picker-btn vxe-date-panel--picker-prev-btn', {
                'is--disabled': isDisabledPrevDateBtn
              }],
              on: {
                click: $xeDatePanel.datePrevEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-left'
              })
            ]),
            h('span', {
              class: 'vxe-date-panel--picker-btn vxe-date-panel--picker-current-btn',
              on: {
                click: $xeDatePanel.dateTodayMonthEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-dot'
              })
            ]),
            h('span', {
              class: ['vxe-date-panel--picker-btn vxe-date-panel--picker-next-btn', {
                'is--disabled': isDisabledNextDateBtn
              }],
              on: {
                click: $xeDatePanel.dateNextEvent
              }
            }, [
              h('i', {
                class: 'vxe-icon-caret-right'
              })
            ])
          ])
        ]),
        h('div', {
          class: 'vxe-date-panel--picker-body'
        }, $xeDatePanel.renderDateTable(h))
      ]
    },
    renderTimePanel (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const { type } = props
      const { datetimePanelValue } = reactData
      const dateTimeLabel = $xeDatePanel.computeDateTimeLabel
      const hourList = $xeDatePanel.computeHourList
      const hasTimeMinute = $xeDatePanel.computeHasTimeMinute
      const minuteList = $xeDatePanel.computeMinuteList
      const hasTimeSecond = $xeDatePanel.computeHasTimeSecond
      const secondList = $xeDatePanel.computeSecondList as VxeDatePanelDefines.DateHourMinuteSecondItem[]
      return [
        type === 'time'
          ? renderEmptyElement($xeDatePanel)
          : h('div', {
            class: 'vxe-date-panel--time-header'
          }, [
            h('div', {
              class: 'vxe-date-panel--time-title'
            }, dateTimeLabel)
          ]),
        h('div', {
          ref: 'refInputTimeBody',
          class: 'vxe-date-panel--time-body'
        }, [
          h('ul', {
            class: 'vxe-date-panel--time-hour-list'
          }, hourList.map((item, index) => {
            return h('li', {
              key: index,
              class: {
                'is--selected': datetimePanelValue && datetimePanelValue.getHours() === item.value
              },
              on: {
                click: (evnt: MouseEvent) => $xeDatePanel.dateHourEvent(evnt, item)
              }
            }, item.label)
          })),
          hasTimeMinute
            ? h('ul', {
              class: 'vxe-date-panel--time-minute-list'
            }, minuteList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getMinutes() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeDatePanel.dateMinuteEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeDatePanel),
          hasTimeMinute && hasTimeSecond
            ? h('ul', {
              class: 'vxe-date-panel--time-second-list'
            }, secondList.map((item, index) => {
              return h('li', {
                key: index,
                class: {
                  'is--selected': datetimePanelValue && datetimePanelValue.getSeconds() === item.value
                },
                on: {
                  click: (evnt: MouseEvent) => $xeDatePanel.dateSecondEvent(evnt, item)
                }
              }, item.label)
            }))
            : renderEmptyElement($xeDatePanel)
        ])
      ]
    },
    renderPickerPanel (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { type } = props
      if (type === 'datetime') {
        return h('div', {
          key: type,
          ref: 'refPanelWrapper',
          class: 'vxe-date-panel--time-layout-wrapper'
        }, [
          h('div', {
            class: 'vxe-date-panel--time-left-wrapper'
          }, $xeDatePanel.renderDatePanel(h)),
          h('div', {
            class: 'vxe-date-panel--time-right-wrapper'
          }, $xeDatePanel.renderTimePanel(h))
        ])
      } else if (type === 'time') {
        return h('div', {
          key: type,
          ref: 'refPanelWrapper',
          class: 'vxe-date-panel--wrapper'
        }, $xeDatePanel.renderTimePanel(h))
      }
      return h('div', {
        key: type || 'default',
        ref: 'refPanelWrapper',
        class: 'vxe-date-panel--wrapper'
      }, $xeDatePanel.renderDatePanel(h))
    },
    renderVN (h: CreateElement) {
      const $xeDatePanel = this
      const props = $xeDatePanel

      const { type } = props
      const vSize = $xeDatePanel.computeSize
      return h('div', {
        class: ['vxe-date-panel', `type--${type}`, {
          [`size--${vSize}`]: vSize
        }]
      }, [
        $xeDatePanel.renderPickerPanel(h)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeDatePanel = this

      $xeDatePanel.updateModelValue(val)
      $xeDatePanel.changeValue()
    },
    type () {
      const $xeDatePanel = this
      const reactData = $xeDatePanel.reactData

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
      $xeDatePanel.initValue()
    },
    computeDateLabelFormat () {
      const $xeDatePanel = this
      const props = $xeDatePanel
      const reactData = $xeDatePanel.reactData

      const isDatePanelType = $xeDatePanel.computeIsDatePanelType
      if (isDatePanelType) {
        $xeDatePanel.dateParseValue(reactData.datePanelValue)
        reactData.inputValue = props.multiple ? $xeDatePanel.computeDateMultipleLabel : reactData.datePanelLabel
      }
    }
  },
  created () {
    const $xeDatePanel = this

    $xeDatePanel.initValue()
    $xeDatePanel.dateOpenPanel()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
