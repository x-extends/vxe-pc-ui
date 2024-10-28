import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getI18n, createEvent, globalMixins } from '../../ui'
import { getDateQuarter } from '../../date-picker/src/util'
import { toCssUnit } from '../..//ui/src/dom'
import VxeButtonComponent from '../../button/src/button'

import type { VxeCalendarEmits, CalendarInternalData, CalendarReactData, ValueOf, VxeCalendarPropTypes, VxeComponentSizeType, VxeDatePickerDefines, VxeCalendarConstructor } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCalendar',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number, Date] as PropType<VxeCalendarPropTypes.ModelValue>,
    type: {
      type: String as PropType<VxeCalendarPropTypes.Type>,
      default: 'date'
    },
    className: String as PropType<VxeCalendarPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeCalendarPropTypes.Size>,
      default: () => getConfig().calendar.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeCalendarPropTypes.Multiple>,

    width: [String, Number] as PropType<VxeCalendarPropTypes.Width>,
    height: [String, Number] as PropType<VxeCalendarPropTypes.Height>,

    // date、week、month、quarter、year
    minDate: {
      type: [String, Number, Date] as PropType<VxeCalendarPropTypes.MinDate>,
      default: () => getConfig().calendar.minDate
    },
    maxDate: {
      type: [String, Number, Date] as PropType<VxeCalendarPropTypes.MaxDate>,
      default: () => getConfig().calendar.maxDate
    },
    startDay: {
      type: [String, Number] as PropType<VxeCalendarPropTypes.StartDay>,
      default: () => getConfig().calendar.startDay
    },
    labelFormat: String as PropType<VxeCalendarPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeCalendarPropTypes.ValueFormat>,
    festivalMethod: {
      type: Function as PropType<VxeCalendarPropTypes.FestivalMethod>,
      default: () => getConfig().calendar.festivalMethod
    },
    disabledMethod: {
      type: Function as PropType<VxeCalendarPropTypes.DisabledMethod>,
      default: () => getConfig().calendar.disabledMethod
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeCalendarPropTypes.SelectDay>,
      default: () => getConfig().calendar.selectDay
    }
  },
  data () {
    const reactData: CalendarReactData = {
      selectValue: null,
      inputValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    }
    const internalData: CalendarInternalData = {
      yearSize: 12,
      monthSize: 20,
      quarterSize: 8
    }

    return {
      xID: XEUtils.uniqueId(),
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeCalendarStyle () {
      const $xeCalendar = this
      const props = $xeCalendar

      const { height, width } = props
      const stys: Record<string, string> = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      return stys
    },
    computeIsDisabled () {
      return false
    },
    computeIsCalendarType () {
      const $xeCalendar = this
      const props = $xeCalendar

      return ['date', 'week', 'month', 'quarter', 'year'].includes(props.type)
    },
    computeDateStartTime () {
      const $xeCalendar = this
      const props = $xeCalendar

      return props.minDate ? XEUtils.toStringDate(props.minDate) : null
    },
    computeDateEndTime () {
      const $xeCalendar = this
      const props = $xeCalendar

      return props.maxDate ? XEUtils.toStringDate(props.maxDate) : null
    },
    computeSupportMultiples () {
      const $xeCalendar = this
      const props = $xeCalendar

      return ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeDateListValue (this: any) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { selectValue } = reactData
      const isCalendarType = $xeCalendar.computeIsCalendarType as boolean
      const dateValueFormat = $xeCalendar.computeDateValueFormat as string
      if (multiple && selectValue && isCalendarType) {
        return XEUtils.toValueString(selectValue).split(',').map(item => {
          const date = $xeCalendar.parseDate(item, dateValueFormat)
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return date
        }) as Date[]
      }
      return []
    },
    computeDateMultipleValue () {
      const $xeCalendar = this

      const dateListValue = $xeCalendar.computeDateListValue as Date[]
      const dateValueFormat = $xeCalendar.computeDateValueFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    },
    computeDateMultipleLabel () {
      const $xeCalendar = this

      const dateListValue = $xeCalendar.computeDateListValue as Date[]
      const dateLabelFormat = $xeCalendar.computeDateLabelFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateLabelFormat)).join(', ')
    },
    computeDateValueFormat () {
      const $xeCalendar = this
      const props = $xeCalendar

      const { valueFormat } = props
      if (valueFormat) {
        return valueFormat
      }
      return 'yyyy-MM-dd'
    },
    computeDateValue (this: any) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const { selectValue } = reactData
      const isCalendarType = $xeCalendar.computeIsCalendarType
      const dateValueFormat = $xeCalendar.computeDateValueFormat
      let val = null
      if (selectValue && isCalendarType) {
        const date = $xeCalendar.parseDate(selectValue, dateValueFormat)
        if (XEUtils.isValidDate(date)) {
          val = date
        }
      }
      return val
    },
    computeIsDisabledPrevDateBtn (this: any) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const dateStartTime = $xeCalendar.computeDateStartTime
      const { selectMonth } = reactData
      if (selectMonth && dateStartTime) {
        return selectMonth <= dateStartTime
      }
      return false
    },
    computeIsDisabledNextDateBtn (this: any) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const dateEndTime = $xeCalendar.computeDateEndTime
      const { selectMonth } = reactData
      if (selectMonth && dateEndTime) {
        return selectMonth >= dateEndTime
      }
      return false
    },
    computeDateHMSTime () {
      const $xeCalendar = this

      const dateValue = $xeCalendar.computeDateValue as Date | null
      return dateValue ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0
    },
    computeDateLabelFormat () {
      const $xeCalendar = this
      const props = $xeCalendar

      const { labelFormat } = props
      const isCalendarType = $xeCalendar.computeIsCalendarType as boolean
      const dateValueFormat = $xeCalendar.computeDateValueFormat as string
      if (isCalendarType) {
        return labelFormat || dateValueFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
      }
      return ''
    },
    computeYearList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

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
    computeSelectDatePanelLabel (this: any) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = $xeCalendar.computeYearList as VxeDatePickerDefines.DateYearItem[]
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
      const $xeCalendar = this
      const props = $xeCalendar

      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeCalendarPropTypes.StartDay
    },
    computeWeekDatas () {
      const $xeCalendar = this

      const weeks = []
      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        let sWeek = $xeCalendar.computeFirstDayOfWeek as VxeCalendarPropTypes.StartDay
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
      const $xeCalendar = this

      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        const weekDatas = $xeCalendar.computeWeekDatas as number[]
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
      const $xeCalendar = this

      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        const dateHeaders = $xeCalendar.computeDateHeaders as {
          value: number
          label: string
        }[]
        return [{ label: getI18n('vxe.input.date.weeks.w') }].concat(dateHeaders)
      }
      return []
    },
    computeYearDatas () {
      const $xeCalendar = this

      const yearList = $xeCalendar.computeYearList as VxeDatePickerDefines.DateYearItem[]
      return XEUtils.chunk(yearList, 4)
    },
    computeQuarterList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

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
      const $xeCalendar = this

      const quarterList = $xeCalendar.computeQuarterList as VxeDatePickerDefines.DateQuarterItem[]
      return XEUtils.chunk(quarterList, 2)
    },
    computeMonthList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

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
      const $xeCalendar = this

      const monthList = $xeCalendar.computeMonthList as VxeDatePickerDefines.DateMonthItem[]
      return XEUtils.chunk(monthList, 4)
    },
    computeDayList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const { selectMonth, currentDate } = reactData
      const days: VxeDatePickerDefines.DateDayItem[] = []
      if (selectMonth && currentDate) {
        const dateHMSTime = $xeCalendar.computeDateHMSTime
        const weekDatas = $xeCalendar.computeWeekDatas
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
      const $xeCalendar = this

      const dayList = $xeCalendar.computeDayList as VxeDatePickerDefines.DateDayItem[]
      return XEUtils.chunk(dayList, 7)
    },
    computeWeekDates () {
      const $xeCalendar = this

      const dayDatas = $xeCalendar.computeDayDatas as VxeDatePickerDefines.DateDayItem[][]
      const firstDayOfWeek = $xeCalendar.computeFirstDayOfWeek
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
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCalendarEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCalendar = this
      $xeCalendar.$emit(type, createEvent(evnt, { $input: $xeCalendar }, params))
    },
    emitModel (value: any) {
      const $xeCalendar = this

      const { _events } = $xeCalendar as any
      $xeCalendar.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeCalendar.$emit('modelValue', value)
      } else {
        $xeCalendar.$emit('model-value', value)
      }
    },
    parseDate  (value: VxeCalendarPropTypes.ModelValue, format: string) {
      return XEUtils.toStringDate(value, format)
    },
    handleChange (value: string, evnt: Event | { type: string }) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      reactData.inputValue = value
      $xeCalendar.emitModel(value)
      if (XEUtils.toValueString(props.value) !== value) {
        $xeCalendar.dispatchEvent('change', { value }, evnt as any)
      }
    },
    dateParseValue  (value?: VxeCalendarPropTypes.ModelValue) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { type } = props
      const dateLabelFormat = $xeCalendar.computeDateLabelFormat
      const dateValueFormat = $xeCalendar.computeDateValueFormat
      const firstDayOfWeek = $xeCalendar.computeFirstDayOfWeek
      let dValue: Date | null = null
      let dLabel = ''
      if (value) {
        dValue = $xeCalendar.parseDate(value, dateValueFormat)
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
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const isCalendarType = $xeCalendar.computeIsCalendarType
      const { inputValue } = reactData
      if (isCalendarType) {
        $xeCalendar.dateParseValue(inputValue)
        reactData.inputValue = props.multiple ? $xeCalendar.computeDateMultipleLabel : reactData.datePanelLabel
      }
    },
    /**
     * 检查初始值
     */
    initValue () {
      const $xeCalendar = this

      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        $xeCalendar.changeValue()
      }
    },
    dateCheckMonth  (date: Date) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const month = XEUtils.getWhatMonth(date, 0, 'first')
      if (!XEUtils.isEqual(month, reactData.selectMonth)) {
        reactData.selectMonth = month
      }
    },
    dateChange (date: Date) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { value, multiple } = props
      const dateValueFormat = $xeCalendar.computeDateValueFormat
      const firstDayOfWeek = $xeCalendar.computeFirstDayOfWeek
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeCalendarPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      $xeCalendar.dateCheckMonth(date)
      reactData.selectValue = date
      if (multiple) {
        // 如果为多选
        const dateMultipleValue = $xeCalendar.computeDateMultipleValue
        // 如果是日期类型
        if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
          $xeCalendar.handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
        } else {
          $xeCalendar.handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(value, inpVal)) {
          $xeCalendar.handleChange(inpVal, { type: 'update' })
        }
      }
    },
    dateMonthHandle  (date: Date, offsetMonth: number) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      reactData.selectMonth = XEUtils.getWhatMonth(date, offsetMonth, 'first')
    },
    dateNowHandle  () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      reactData.currentDate = currentDate
      $xeCalendar.dateMonthHandle(currentDate, 0)
    },
    dateToggleTypeEvent  () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
    },
    datePrevEvent  (evnt: Event) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const { yearSize } = internalData
      const isDisabledPrevDateBtn = $xeCalendar.computeIsDisabledPrevDateBtn
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
        $xeCalendar.dispatchEvent('date-prev', { type }, evnt)
      }
    },
    dateTodayMonthEvent  (evnt: Event) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      $xeCalendar.dateNowHandle()
      if (!props.multiple) {
        $xeCalendar.dateChange(reactData.currentDate)
      }
      $xeCalendar.dispatchEvent('date-today', { type: props.type }, evnt)
    },
    dateNextEvent (evnt: Event) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const { yearSize } = internalData
      const isDisabledNextDateBtn = $xeCalendar.computeIsDisabledNextDateBtn
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
        $xeCalendar.dispatchEvent('date-next', { type }, evnt)
      }
    },
    isDateDisabled  (item: { date: Date }) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { disabledMethod } = props
      const { datePanelType } = reactData
      return disabledMethod && disabledMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor })
    },
    dateSelectItem (date: Date) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { type } = props
      const { datePanelType } = reactData
      if (type === 'month') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeCalendar.dateCheckMonth(date)
        } else {
          $xeCalendar.dateChange(date)
        }
      } else if (type === 'year') {
        $xeCalendar.dateChange(date)
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          $xeCalendar.dateCheckMonth(date)
        } else {
          $xeCalendar.dateChange(date)
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          $xeCalendar.dateCheckMonth(date)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeCalendar.dateCheckMonth(date)
        } else {
          $xeCalendar.dateChange(date)
        }
      }
    },
    dateSelectEvent  (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeCalendar = this

      if (!$xeCalendar.isDateDisabled(item)) {
        $xeCalendar.dateSelectItem(item.date)
      }
    },
    dateMoveDay  (offsetDay: Date) {
      const $xeCalendar = this

      if (!$xeCalendar.isDateDisabled({ date: offsetDay })) {
        const dayList = $xeCalendar.computeDayList
        if (!dayList.some((item) => XEUtils.isDateSame(item.date, offsetDay, 'yyyyMMdd'))) {
          $xeCalendar.dateCheckMonth(offsetDay)
        }
        $xeCalendar.dateParseValue(offsetDay)
      }
    },
    dateMoveYear (offsetYear: Date) {
      const $xeCalendar = this

      if (!$xeCalendar.isDateDisabled({ date: offsetYear })) {
        const yearList = $xeCalendar.computeYearList
        if (!yearList.some((item) => XEUtils.isDateSame(item.date, offsetYear, 'yyyy'))) {
          $xeCalendar.dateCheckMonth(offsetYear)
        }
        $xeCalendar.dateParseValue(offsetYear)
      }
    },
    dateMoveQuarter (offsetQuarter: Date) {
      const $xeCalendar = this

      if (!$xeCalendar.isDateDisabled({ date: offsetQuarter })) {
        const quarterList = $xeCalendar.computeQuarterList
        if (!quarterList.some((item) => XEUtils.isDateSame(item.date, offsetQuarter, 'yyyyq'))) {
          $xeCalendar.dateCheckMonth(offsetQuarter)
        }
        $xeCalendar.dateParseValue(offsetQuarter)
      }
    },
    dateMoveMonth  (offsetMonth: Date) {
      const $xeCalendar = this

      if (!$xeCalendar.isDateDisabled({ date: offsetMonth })) {
        const monthList = $xeCalendar.computeMonthList
        if (!monthList.some((item) => XEUtils.isDateSame(item.date, offsetMonth, 'yyyyMM'))) {
          $xeCalendar.dateCheckMonth(offsetMonth)
        }
        $xeCalendar.dateParseValue(offsetMonth)
      }
    },
    dateMouseenterEvent  (item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      if (!$xeCalendar.isDateDisabled(item)) {
        const { datePanelType } = reactData
        if (datePanelType === 'month') {
          $xeCalendar.dateMoveMonth(item.date)
        } else if (datePanelType === 'quarter') {
          $xeCalendar.dateMoveQuarter(item.date)
        } else if (datePanelType === 'year') {
          $xeCalendar.dateMoveYear(item.date)
        } else {
          $xeCalendar.dateMoveDay(item.date)
        }
      }
    },
    dateConfirmEvent  () {
    },
    dateOpenPanel  () {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { type } = props
      const dateValue = $xeCalendar.computeDateValue
      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        reactData.datePanelType = type as 'year' | 'quarter' | 'month' | 'week'
      } else {
        reactData.datePanelType = 'day'
      }
      reactData.currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      if (dateValue) {
        $xeCalendar.dateMonthHandle(dateValue, 0)
        $xeCalendar.dateParseValue(dateValue)
      } else {
        $xeCalendar.dateNowHandle()
      }
    },

    //
    // Render
    //
    renderDateLabel  (h: CreateElement, item: VxeDatePickerDefines.DateYearItem | VxeDatePickerDefines.DateQuarterItem | VxeDatePickerDefines.DateMonthItem | VxeDatePickerDefines.DateDayItem, label: string | number) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { festivalMethod } = props
      if (festivalMethod) {
        const { datePanelType } = reactData
        const festivalRest = festivalMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor })
        const festivalItem = festivalRest ? (XEUtils.isString(festivalRest) ? { label: festivalRest } : festivalRest) : {}
        const extraItem = festivalItem.extra ? (XEUtils.isString(festivalItem.extra) ? { label: festivalItem.extra } : festivalItem.extra) : null
        const labels = [
          h('span', {
            class: ['vxe-calendar--date-label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('span', `${label || ''}`),
                h('span', {
                  class: ['vxe-calendar--date-label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
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
              class: ['vxe-calendar--date-festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
              style: festivalItem.style
            }, [
              festivalLabels.length > 1
                ? h('span', {
                  class: ['vxe-calendar--date-festival--overlap', `overlap--${festivalLabels.length}`]
                }, festivalLabels.map(label => h('span', label.substring(0, 3))))
                : h('span', {
                  class: 'vxe-calendar--date-festival--label'
                }, festivalLabels[0].substring(0, 3))
            ])
          )
        }
        return labels
      }
      return `${label || ''}`
    },
    renderDateDayTable (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const dateHeaders = $xeCalendar.computeDateHeaders
      const dayDatas = $xeCalendar.computeDayDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-calendar--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tr', dateHeaders.map((item) => {
            return h('th', {
              class: 'vxe-calendar--view-th'
            }, item.label)
          })),
          ...dayDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: ['vxe-calendar--view-td', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                on: {
                  click: () => $xeCalendar.dateSelectEvent(item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item)
                }
              }, $xeCalendar.renderDateLabel(h, item, item.label))
            }))
          })
        ])
      ]
    },
    renderDateWeekTable (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const weekHeaders = $xeCalendar.computeWeekHeaders
      const weekDates = $xeCalendar.computeWeekDates
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-calendar--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tr', weekHeaders.map((item) => {
            return h('td', {
              class: 'vxe-calendar--view-th'
            }, item.label)
          })),
          ...weekDates.map((rows) => {
            const isSelected = multiple ? rows.some((item) => dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat))) : rows.some((item) => XEUtils.isDateSame(dateValue, item.date, matchFormat))
            const isHover = rows.some((item) => XEUtils.isDateSame(datePanelValue, item.date, matchFormat))
            return h('tr', rows.map((item) => {
              return h('td', {
                class: ['vxe-calendar--view-td', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': isHover
                }],
                on: {
                  click: () => $xeCalendar.dateSelectEvent(item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item)
                }
              }, $xeCalendar.renderDateLabel(h, item, item.label))
            }))
          })
        ])
      ]
    },
    renderDateMonthTable (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const monthDatas = $xeCalendar.computeMonthDatas as VxeDatePickerDefines.DateMonthItem[][]
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMM'
      return [
        h('table', {
          class: `vxe-calendar--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', monthDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: ['vxe-calendar--view-td', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                on: {
                  click: () => $xeCalendar.dateSelectEvent(item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item)
                }
              }, $xeCalendar.renderDateLabel(h, item, getI18n(`vxe.input.date.months.m${item.month}`)))
            }))
          }))
        ])
      ]
    },
    renderDateQuarterTable  (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const quarterDatas = $xeCalendar.computeQuarterDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyq'
      return [
        h('table', {
          class: `vxe-calendar--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', quarterDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: ['vxe-calendar--view-td', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                on: {
                  click: () => $xeCalendar.dateSelectEvent(item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item)
                }
              }, $xeCalendar.renderDateLabel(h, item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
            }))
          }))
        ])
      ]
    },
    renderDateYearTable  (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const yearDatas = $xeCalendar.computeYearDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyy'
      return [
        h('table', {
          class: `vxe-calendar--date-${datePanelType}-view`,
          attrs: {
            cellspacing: 0,
            cellpadding: 0,
            border: 0
          }
        }, [
          h('tbody', yearDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: ['vxe-calendar--view-td', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                on: {
                  click: () => $xeCalendar.dateSelectEvent(item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item)
                }
              }, $xeCalendar.renderDateLabel(h, item, item.year))
            }))
          }))
        ])
      ]
    },
    renderDateTable  (h: CreateElement) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const { datePanelType } = reactData
      switch (datePanelType) {
        case 'week' :
          return $xeCalendar.renderDateWeekTable(h)
        case 'month' :
          return $xeCalendar.renderDateMonthTable(h)
        case 'quarter' :
          return $xeCalendar.renderDateQuarterTable(h)
        case 'year' :
          return $xeCalendar.renderDateYearTable(h)
      }
      return $xeCalendar.renderDateDayTable(h)
    },
    renderDatePanel (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple } = props
      const { datePanelType } = reactData
      const isDisabledPrevDateBtn = $xeCalendar.computeIsDisabledPrevDateBtn
      const isDisabledNextDateBtn = $xeCalendar.computeIsDisabledNextDateBtn
      const selectDatePanelLabel = $xeCalendar.computeSelectDatePanelLabel
      return [
        h('div', {
          class: 'vxe-calendar--header'
        }, [
          h('div', {
            class: 'vxe-calendar--type-wrapper'
          }, [
            h(VxeButtonComponent, {
              props: {
                disabled: datePanelType === 'year',
                content: selectDatePanelLabel
              },
              on: {
                click: $xeCalendar.dateToggleTypeEvent
              }
            })
          ]),
          h('div', {
            class: 'vxe-calendar--btn-wrapper'
          }, [
            h(VxeButtonComponent, {
              props: {
                disabled: isDisabledPrevDateBtn,
                icon: 'vxe-icon-caret-left'
              },
              on: {
                click: $xeCalendar.datePrevEvent
              }
            }),
            h(VxeButtonComponent, {
              props: {
                icon: 'vxe-icon-dot'
              },
              on: {
                click: $xeCalendar.dateTodayMonthEvent
              }
            }),
            h(VxeButtonComponent, {
              props: {
                disabled: isDisabledNextDateBtn,
                icon: 'vxe-icon-caret-right'
              },
              on: {
                click: $xeCalendar.dateNextEvent
              }
            }),
            multiple && $xeCalendar.computeSupportMultiples
              ? h('span', {
                class: 'vxe-calendar--btn vxe-calendar--confirm-btn'
              }, [
                h('button', {
                  class: 'vxe-calendar--confirm',
                  attrs: {
                    type: 'button'
                  },
                  on: {
                    click: $xeCalendar.dateConfirmEvent
                  }
                }, getI18n('vxe.button.confirm'))
              ])
              : null
          ])
        ]),
        h('div', {
          class: 'vxe-calendar--body'
        }, $xeCalendar.renderDateTable(h))
      ]
    },
    renderVN (h: CreateElement): VNode {
      const $xeCalendar = this
      const props = $xeCalendar

      const { className, type } = props
      const vSize = $xeCalendar.computeSize
      const isDisabled = $xeCalendar.computeIsDisabled
      const calendarStyle = $xeCalendar.computeCalendarStyle
      return h('div', {
        ref: 'refElem',
        class: ['vxe-calendar', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          'is--disabled': isDisabled
        }],
        style: calendarStyle
      }, [
        $xeCalendar.renderDatePanel(h)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      reactData.inputValue = val
      $xeCalendar.changeValue()
    },
    type () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      // 切换类型是重置内置变量
      Object.assign(reactData, {
        selectValue: null,
        inputValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      $xeCalendar.initValue()
      $xeCalendar.dateOpenPanel()
    },
    computeDateLabelFormat () {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const isCalendarType = $xeCalendar.computeIsCalendarType
      if (isCalendarType) {
        $xeCalendar.dateParseValue(reactData.datePanelValue)
        reactData.inputValue = props.multiple ? $xeCalendar.computeDateMultipleLabel : reactData.datePanelLabel
      }
    }
  },
  created () {
    const $xeCalendar = this
    const props = $xeCalendar
    const reactData = $xeCalendar.reactData

    reactData.selectValue = props.value
    reactData.inputValue = props.value
    $xeCalendar.initValue()
  },
  mounted () {
    const $xeCalendar = this

    $xeCalendar.dateOpenPanel()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
