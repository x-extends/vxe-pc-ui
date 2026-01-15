import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getDateQuarter } from '../../date-panel/src/util'
import { toCssUnit } from '../../ui/src/dom'
import { isEnableConf } from '../../ui/src/utils'
import { errLog } from '../../ui/src/log'
import VxeButtonComponent from '../../button/src/button'

import type { VxeCalendarEmits, CalendarInternalData, CalendarReactData, ValueOf, VxeCalendarPropTypes, VxeComponentSizeType, VxeDatePanelDefines, VxeCalendarConstructor } from '../../../types'

const { menus, getConfig, getI18n } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
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
    cellStyle: [Object, Function] as PropType<VxeCalendarPropTypes.CellStyle>,
    menuConfig: Object as PropType<VxeCalendarPropTypes.MenuConfig>,

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
    computeMenuOpts () {
      const $xeCalendar = this
      const props = $xeCalendar

      return Object.assign({}, getConfig().calendar.menuConfig, props.menuConfig)
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
    computeSelectDatePanelObj (this: any) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const isCalendarType = $xeCalendar.computeIsCalendarType
      let y = ''
      let m = ''
      if (isCalendarType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = $xeCalendar.computeYearList as VxeDatePanelDefines.DateYearItem[]
        let year = ''
        let month
        if (selectMonth) {
          year = selectMonth.getFullYear()
          month = selectMonth.getMonth() + 1
        }
        if (datePanelType === 'quarter' || datePanelType === 'month') {
          y = `${year}`
        } else if (datePanelType === 'year') {
          y = yearList.length ? `${yearList[0].year} - ${yearList[yearList.length - 1].year}` : ''
        } else {
          y = `${year}`
          m = month ? getI18n(`vxe.input.date.m${month}`) : '-'
        }
      }
      return {
        y,
        m
      }
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

      const yearList = $xeCalendar.computeYearList as VxeDatePanelDefines.DateYearItem[]
      return XEUtils.chunk(yearList, 4)
    },
    computeQuarterList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

      const { selectMonth, currentDate } = reactData
      const { quarterSize } = internalData
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
      const $xeCalendar = this

      const quarterList = $xeCalendar.computeQuarterList as VxeDatePanelDefines.DateQuarterItem[]
      return XEUtils.chunk(quarterList, 2)
    },
    computeMonthList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData
      const internalData = $xeCalendar.internalData

      const { selectMonth, currentDate } = reactData
      const { monthSize } = internalData
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
      const $xeCalendar = this

      const monthList = $xeCalendar.computeMonthList as VxeDatePanelDefines.DateMonthItem[]
      return XEUtils.chunk(monthList, 4)
    },
    computeDayList () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const { selectMonth, currentDate } = reactData
      const days: VxeDatePanelDefines.DateDayItem[] = []
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

      const dayList = $xeCalendar.computeDayList as VxeDatePanelDefines.DateDayItem[]
      return XEUtils.chunk(dayList, 7)
    },
    computeWeekDates () {
      const $xeCalendar = this

      const dayDatas = $xeCalendar.computeDayDatas as VxeDatePanelDefines.DateDayItem[][]
      const firstDayOfWeek = $xeCalendar.computeFirstDayOfWeek
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
    dateToggleYearTypeEvent () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      reactData.datePanelType = 'year'
    },
    dateToggleMonthTypeEvent  (evnt: MouseEvent) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
      $xeCalendar.changeViewEvent(evnt)
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
        $xeCalendar.changeViewEvent(evnt)
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
      $xeCalendar.changeViewEvent(evnt)
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
        $xeCalendar.changeViewEvent(evnt)
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
    changeViewEvent (evnt: Event | null) {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      const { datePanelType } = reactData
      const yearDatas = $xeCalendar.computeYearDatas
      const quarterDatas = $xeCalendar.computeQuarterDatas
      const monthDatas = $xeCalendar.computeMonthDatas
      const weekDates = $xeCalendar.computeWeekDates
      const dayDatas = $xeCalendar.computeDayDatas
      const viewDates: Date[] = []
      let dataList: { date: Date }[][] = []
      switch (datePanelType) {
        case 'year':
          dataList = yearDatas
          break
        case 'quarter':
          dataList = quarterDatas
          break
        case 'month':
          dataList = monthDatas
          break
        case 'week':
          dataList = weekDates
          break
        case 'day':
          dataList = dayDatas
          break
      }
      dataList.forEach(rows => {
        rows.forEach(item => {
          viewDates.push(item.date)
        })
      })
      $xeCalendar.dispatchEvent('view-change', { viewType: datePanelType, viewDates }, evnt)
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
          $xeCalendar.changeViewEvent(null)
        } else {
          $xeCalendar.dateChange(date)
        }
      } else if (type === 'year') {
        $xeCalendar.dateChange(date)
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          $xeCalendar.dateCheckMonth(date)
          $xeCalendar.changeViewEvent(null)
        } else {
          $xeCalendar.dateChange(date)
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          $xeCalendar.dateCheckMonth(date)
          $xeCalendar.changeViewEvent(null)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          $xeCalendar.dateCheckMonth(date)
          $xeCalendar.changeViewEvent(null)
        } else {
          $xeCalendar.dateChange(date)
        }
      }
    },
    dateClickEvent (evnt: MouseEvent, item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { type } = props
      const { datePanelType } = reactData
      const { date } = item
      if (!$xeCalendar.isDateDisabled(item)) {
        $xeCalendar.dateSelectItem(date)
        $xeCalendar.dispatchEvent('cell-click', { date, type, viewType: datePanelType }, evnt)
      }
    },
    datContextmenuEvent (evnt: MouseEvent, item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { type } = props
      const { datePanelType } = reactData
      const { menuConfig } = props
      const menuOpts = $xeCalendar.computeMenuOpts
      if (menuConfig ? isEnableConf(menuOpts) : menuOpts.enabled) {
        const { options, visibleMethod } = menuOpts
        const { date } = item
        if (!visibleMethod || visibleMethod({ $calendar: $xeCalendar as VxeCalendarConstructor, options, date, type, viewType: datePanelType })) {
          if (VxeUI.contextMenu) {
            VxeUI.contextMenu.openByEvent(evnt, {
              options,
              events: {
                optionClick (eventParams) {
                  const { option } = eventParams
                  const gMenuOpts = menus.get(option.code)
                  const cmMethod = gMenuOpts ? gMenuOpts.calendarMenuMethod : null
                  const params = { menu: option, date, type, viewType: datePanelType, $event: evnt, $calendar: $xeCalendar as VxeCalendarConstructor }
                  if (cmMethod) {
                    cmMethod(params, evnt)
                  }
                  $xeCalendar.dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      $xeCalendar.dispatchEvent('cell-menu', { date: item.date, type, viewType: datePanelType }, evnt)
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
    dateMouseenterEvent  (item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem) {
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
    dateMouseleaveEvent () {
      const $xeCalendar = this
      const reactData = $xeCalendar.reactData

      reactData.datePanelValue = null
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
    renderDateLabel  (h: CreateElement, item: VxeDatePanelDefines.DateYearItem | VxeDatePanelDefines.DateQuarterItem | VxeDatePanelDefines.DateMonthItem | VxeDatePanelDefines.DateDayItem, label: string | number) {
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
            class: ['vxe-calendar--label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('span', {
                  class: 'vxe-calendar--label--number'
                }, `${label || ''}`),
                h('span', {
                  class: ['vxe-calendar--label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
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
              class: ['vxe-calendar--festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
              style: festivalItem.style
            }, [
              festivalLabels.length > 1
                ? h('span', {
                  class: ['vxe-calendar--festival--overlap', `overlap--${festivalLabels.length}`]
                }, festivalLabels.map(label => h('span', label.substring(0, 3))))
                : h('span', {
                  class: 'vxe-calendar--festival--label'
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

      const { multiple, cellStyle } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const dateHeaders = $xeCalendar.computeDateHeaders
      const dayDatas = $xeCalendar.computeDayDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('div', {
          class: ['vxe-calendar--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-calendar--view-header',
            style: {
              height: `${100 / (dayDatas.length + 1)}%`
            }
          }, [
            h('div', {
              class: 'vxe-calendar--view-row'
            }, dateHeaders.map((item) => {
              return h('div', {
                class: 'vxe-calendar--view-item',
                style: {
                  width: `${100 / dateHeaders.length}%`
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, [
                  h('div', {
                    class: 'vxe-calendar--view-item-label'
                  }, item.label)
                ])
              ])
            }))
          ]),
          h('div', {
            class: 'vxe-calendar--view-body'
          }, dayDatas.map((rows) => {
            return h('div', {
              class: 'vxe-calendar--view-row',
              style: {
                height: `${100 / dayDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-calendar--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: Object.assign({}, XEUtils.isFunction(cellStyle) ? cellStyle({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor }) : cellStyle, {
                  width: `${100 / rows.length}%`
                }),
                on: {
                  click: (evnt: MouseEvent) => $xeCalendar.dateClickEvent(evnt, item),
                  contextmenu: (evnt: MouseEvent) => $xeCalendar.datContextmenuEvent(evnt, item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item),
                  mouseleave: $xeCalendar.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, $xeCalendar.renderDateLabel(h, item, item.label))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateWeekTable (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple, cellStyle } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const weekHeaders = $xeCalendar.computeWeekHeaders
      const weekDates = $xeCalendar.computeWeekDates
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMMdd'
      return [
        h('div', {
          class: ['vxe-calendar--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-calendar--view-header',
            style: {
              height: `${100 / (weekDates.length + 1)}%`
            }
          }, [
            h('div', {
              class: 'vxe-calendar--view-row'
            }, weekHeaders.map((item, rIndex) => {
              return h('div', {
                class: 'vxe-calendar--view-item',
                style: {
                  width: `${rIndex ? 13 : 9}%`
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, [
                  h('div', {
                    class: 'vxe-calendar--view-item-label'
                  }, item.label)
                ])
              ])
            }))
          ]),
          h('div', {
            class: 'vxe-calendar--view-body'
          }, weekDates.map((rows) => {
            const isSelected = multiple ? rows.some((item) => dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat))) : rows.some((item) => XEUtils.isDateSame(dateValue, item.date, matchFormat))
            const isHover = rows.some((item) => XEUtils.isDateSame(datePanelValue, item.date, matchFormat))
            const isNowWeek = rows.some(item => item.isNow)
            return h('div', {
              class: 'vxe-calendar--view-row',
              style: {
                height: `${100 / weekDates.length}%`
              }
            }, rows.map((item, rIndex) => {
              return h('div', {
                class: ['vxe-calendar--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': rIndex ? item.isNow : isNowWeek,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': isHover
                }],
                style: Object.assign({}, XEUtils.isFunction(cellStyle) ? cellStyle({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor }) : cellStyle, {
                  width: `${rIndex ? 13 : 9}%`
                }),
                on: {
                  click: (evnt: MouseEvent) => $xeCalendar.dateClickEvent(evnt, item),
                  contextmenu: (evnt: MouseEvent) => $xeCalendar.datContextmenuEvent(evnt, item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item),
                  mouseleave: $xeCalendar.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, $xeCalendar.renderDateLabel(h, item, item.label))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateMonthTable (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple, cellStyle } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const monthDatas = $xeCalendar.computeMonthDatas as VxeDatePanelDefines.DateMonthItem[][]
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyMM'
      return [
        h('div', {
          class: ['vxe-calendar--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-calendar--view-body'
          }, monthDatas.map((rows) => {
            return h('div', {
              class: 'vxe-calendar--view-row',
              style: {
                height: `${100 / monthDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-calendar--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: Object.assign({}, XEUtils.isFunction(cellStyle) ? cellStyle({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor }) : cellStyle, {
                  width: `${100 / rows.length}%`
                }),
                on: {
                  click: (evnt: MouseEvent) => $xeCalendar.dateClickEvent(evnt, item),
                  contextmenu: (evnt: MouseEvent) => $xeCalendar.datContextmenuEvent(evnt, item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item),
                  mouseleave: $xeCalendar.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, $xeCalendar.renderDateLabel(h, item, getI18n(`vxe.input.date.months.m${item.month}`)))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateQuarterTable  (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple, cellStyle } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const quarterDatas = $xeCalendar.computeQuarterDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyyq'
      return [
        h('div', {
          class: ['vxe-calendar--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-calendar--view-body'
          }, quarterDatas.map((rows) => {
            return h('div', {
              class: 'vxe-calendar--view-row',
              style: {
                height: `${100 / quarterDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-calendar--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: Object.assign({}, XEUtils.isFunction(cellStyle) ? cellStyle({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor }) : cellStyle, {
                  width: `${100 / rows.length}%`
                }),
                on: {
                  click: (evnt: MouseEvent) => $xeCalendar.dateClickEvent(evnt, item),
                  contextmenu: (evnt: MouseEvent) => $xeCalendar.datContextmenuEvent(evnt, item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item),
                  mouseleave: $xeCalendar.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, $xeCalendar.renderDateLabel(h, item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
              ])
            }))
          }))
        ])
      ]
    },
    renderDateYearTable  (h: CreateElement) {
      const $xeCalendar = this
      const props = $xeCalendar
      const reactData = $xeCalendar.reactData

      const { multiple, cellStyle } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = $xeCalendar.computeDateValue
      const yearDatas = $xeCalendar.computeYearDatas
      const dateListValue = $xeCalendar.computeDateListValue
      const matchFormat = 'yyyy'
      return [
        h('div', {
          class: ['vxe-calendar--view-wrapper', `type--${datePanelType}`]
        }, [
          h('div', {
            class: 'vxe-calendar--view-body'
          }, yearDatas.map((rows) => {
            return h('div', {
              class: 'vxe-calendar--view-row',
              style: {
                height: `${100 / yearDatas.length}%`
              }
            }, rows.map((item) => {
              const isSelected = multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat)
              return h('div', {
                class: ['vxe-calendar--view-item', {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': $xeCalendar.isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                }],
                style: Object.assign({}, XEUtils.isFunction(cellStyle) ? cellStyle({ type: datePanelType, viewType: datePanelType, date: item.date, $calendar: $xeCalendar as VxeCalendarConstructor }) : cellStyle, {
                  width: `${100 / rows.length}%`
                }),
                on: {
                  click: (evnt: MouseEvent) => $xeCalendar.dateClickEvent(evnt, item),
                  contextmenu: (evnt: MouseEvent) => $xeCalendar.datContextmenuEvent(evnt, item),
                  mouseenter: () => $xeCalendar.dateMouseenterEvent(item),
                  mouseleave: $xeCalendar.dateMouseleaveEvent
                }
              }, [
                h('div', {
                  class: 'vxe-calendar--view-item-inner'
                }, $xeCalendar.renderDateLabel(h, item, item.year))
              ])
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
      const selectDatePanelObj = $xeCalendar.computeSelectDatePanelObj
      return [
        h('div', {
          class: 'vxe-calendar--header'
        }, [
          h('div', {
            class: 'vxe-calendar--type-wrapper'
          }, [
            datePanelType === 'year'
              ? h(VxeButtonComponent, {
                props: {
                  disabled: datePanelType === 'year',
                  content: selectDatePanelObj.y
                }
              })
              : h('span', {
                class: 'vxe-calendar--date-picker-btns'
              }, [
                h(VxeButtonComponent, {
                  props: {
                    content: selectDatePanelObj.y
                  },
                  on: {
                    click: $xeCalendar.dateToggleYearTypeEvent
                  }
                }),
                selectDatePanelObj.m
                  ? h(VxeButtonComponent, {
                    props: {
                      content: selectDatePanelObj.m
                    },
                    on: {
                      click: $xeCalendar.dateToggleMonthTypeEvent
                    }
                  })
                  : renderEmptyElement($xeCalendar)
              ])
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
    const props = $xeCalendar

    const { menuConfig } = props
    const VxeUIContextMenu = VxeUI.getComponent('VxeContextMenu')
    if (menuConfig && !VxeUIContextMenu) {
      errLog('vxe.error.reqComp', ['vxe-context-menu'])
    }
    $xeCalendar.dateOpenPanel()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
