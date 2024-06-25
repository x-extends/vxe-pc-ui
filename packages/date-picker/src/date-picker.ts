import { defineComponent, h, Teleport, ref, Ref, computed, reactive, inject, nextTick, watch, onUnmounted, PropType, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, useSize, VxeComponentStyleType } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getAbsolutePos, getEventTargetNode } from '../../ui/src/dom'
import { getSlotVNs } from '../..//ui/src/vn'

import type { VxeDatePickerConstructor, VxeDatePickerEmits, DatePickerReactData, DatePickerMethods, VxeDatePickerPropTypes, DatePickerPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, VxeTableConstructor, VxeTablePrivateMethods } from '../../../types'

interface DateYearItem {
  date: Date;
  isPrev: boolean;
  isCurrent: boolean;
  isNow: boolean;
  isNext: boolean;
  year: number;
}

interface DateMonthItem {
  date: Date;
  isPrev: boolean;
  isCurrent: boolean;
  isNow: boolean;
  isNext: boolean;
  month: number;
}

interface DateQuarterItem {
  date: Date;
  isPrev: boolean;
  isCurrent: boolean;
  isNow: boolean;
  isNext: boolean;
  quarter: number;
}

interface DateDayItem {
  date: Date;
  isWeekNumber?: boolean;
  isPrev: boolean;
  isCurrent: boolean;
  isNow: boolean;
  isNext: boolean;
  label: number;
}

interface DateHourMinuteSecondItem {
  value: number;
  label: string;
}

const yearSize = 12
const monthSize = 20
const quarterSize = 8

export function toStringTimeDate (str: VxeDatePickerPropTypes.ModelValue) {
  if (str) {
    const rest = new Date()
    let h = 0
    let m = 0
    let s = 0
    if (XEUtils.isDate(str)) {
      h = str.getHours()
      m = str.getMinutes()
      s = str.getSeconds()
    } else {
      str = XEUtils.toValueString(str)
      const parses = str.match(/^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?/)
      if (parses) {
        h = XEUtils.toNumber(parses[1])
        m = XEUtils.toNumber(parses[3])
        s = XEUtils.toNumber(parses[5])
      }
    }
    rest.setHours(h)
    rest.setMinutes(m)
    rest.setSeconds(s)
    return rest
  }
  return new Date('')
}

export function getDateQuarter (date: Date) {
  const month = date.getMonth()
  if (month < 3) {
    return 1
  } else if (month < 6) {
    return 2
  } else if (month < 9) {
    return 3
  }
  return 4
}

export default defineComponent({
  name: 'VxeDatePicker',
  props: {
    modelValue: [String, Number, Date] as PropType<VxeDatePickerPropTypes.ModelValue>,
    immediate: { type: Boolean as PropType<VxeDatePickerPropTypes.Immediate>, default: true },
    name: String as PropType<VxeDatePickerPropTypes.Name>,
    type: { type: String as PropType<VxeDatePickerPropTypes.Type>, default: 'text' },
    clearable: { type: Boolean as PropType<VxeDatePickerPropTypes.Clearable>, default: () => getConfig().datePicker.clearable },
    readonly: Boolean as PropType<VxeDatePickerPropTypes.Readonly>,
    disabled: Boolean as PropType<VxeDatePickerPropTypes.Disabled>,
    placeholder: {
      type: String as PropType<VxeDatePickerPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().datePicker.placeholder) ? getI18n('vxe.base.pleaseSelect') : getConfig().datePicker.placeholder
    },
    maxlength: [String, Number] as PropType<VxeDatePickerPropTypes.Maxlength>,
    autocomplete: { type: String as PropType<VxeDatePickerPropTypes.Autocomplete>, default: 'off' },
    align: String as PropType<VxeDatePickerPropTypes.Align>,
    form: String as PropType<VxeDatePickerPropTypes.Form>,
    className: String as PropType<VxeDatePickerPropTypes.ClassName>,
    size: { type: String as PropType<VxeDatePickerPropTypes.Size>, default: () => getConfig().datePicker.size || getConfig().size },
    multiple: Boolean as PropType<VxeDatePickerPropTypes.Multiple>,

    // date、week、month、quarter、year
    startDate: { type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MinDate>, default: () => getConfig().datePicker.startDate },
    endDate: { type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>, default: () => getConfig().datePicker.endDate },
    minDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>,
    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeDatePickerPropTypes.StartDay>,
    startDay: { type: [String, Number] as PropType<VxeDatePickerPropTypes.StartDay>, default: () => getConfig().datePicker.startDay },
    labelFormat: { type: String as PropType<VxeDatePickerPropTypes.LabelFormat>, default: () => getConfig().datePicker.labelFormat },
    valueFormat: { type: String as PropType<VxeDatePickerPropTypes.ValueFormat>, default: () => getConfig().datePicker.valueFormat },
    editable: { type: Boolean as PropType<VxeDatePickerPropTypes.Editable>, default: true },
    festivalMethod: { type: Function as PropType<VxeDatePickerPropTypes.FestivalMethod>, default: () => getConfig().datePicker.festivalMethod },
    disabledMethod: { type: Function as PropType<VxeDatePickerPropTypes.DisabledMethod>, default: () => getConfig().datePicker.disabledMethod },

    // week
    selectDay: { type: [String, Number] as PropType<VxeDatePickerPropTypes.SelectDay>, default: () => getConfig().datePicker.selectDay },

    prefixIcon: String as PropType<VxeDatePickerPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeDatePickerPropTypes.SuffixIcon>,
    placement: String as PropType<VxeDatePickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Transfer>,
      default: null
    }
  },
  emits: [
    'update:modelValue',
    'input',
    'change',
    'keydown',
    'keyup',
    'wheel',
    'click',
    'focus',
    'blur',
    'clear',
    'prefix-click',
    'suffix-click',
    'date-prev',
    'date-today',
    'date-next'
  ] as VxeDatePickerEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeTable = inject<VxeTableConstructor & VxeTablePrivateMethods | null>('$xeTable', null)
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<DatePickerReactData>({
      inited: false,
      panelIndex: 0,
      showPwd: false,
      visiblePanel: false,
      animatVisible: false,
      panelStyle: null,
      panelPlacement: '',
      isActivated: false,
      inputValue: props.modelValue,
      datetimePanelValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>
    const refInputPanel = ref() as Ref<HTMLDivElement>
    const refPanelWrapper = ref() as Ref<HTMLDivElement>
    const refInputTimeBody = ref() as Ref<HTMLDivElement>

    const refMaps: DatePickerPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeDatePicker = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeDatePickerConstructor

    let datePickerMethods = {} as DatePickerMethods

    const parseDate = (value: VxeDatePickerPropTypes.ModelValue, format: string) => {
      const { type } = props
      if (type === 'time') {
        return toStringTimeDate(value)
      }
      return XEUtils.toStringDate(value, format)
    }

    const compTransfer = computed(() => {
      const { transfer } = props
      if (transfer === null) {
        const globalTransfer = getConfig().datePicker.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computeIsDateTimeType = computed(() => {
      const { type } = props
      return type === 'time' || type === 'datetime'
    })

    const computeIsDatePickerType = computed(() => {
      const isDateTimeType = computeIsDateTimeType.value
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    })

    const computeIsClearable = computed(() => {
      return props.clearable
    })

    const computeDateStartTime = computed(() => {
      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    })

    const computeDateEndTime = computed(() => {
      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    })

    const computeSupportMultiples = computed(() => {
      return ['date', 'week', 'month', 'quarter', 'year'].includes(props.type)
    })

    const computeDateListValue = computed(() => {
      const { modelValue, multiple } = props
      const isDatePickerType = computeIsDatePickerType.value
      const dateValueFormat = computeDateValueFormat.value
      if (multiple && modelValue && isDatePickerType) {
        return XEUtils.toValueString(modelValue).split(',').map(item => {
          const date = parseDate(item, dateValueFormat)
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return null
        })
      }
      return []
    })

    const computeDateMultipleValue = computed(() => {
      const dateListValue = computeDateListValue.value
      const dateValueFormat = computeDateValueFormat.value
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    })

    const computeDateMultipleLabel = computed(() => {
      const dateListValue = computeDateListValue.value
      const dateLabelFormat = computeDateLabelFormat.value
      return dateListValue.map(date => XEUtils.toDateString(date, dateLabelFormat)).join(', ')
    })

    const computeDateValueFormat = computed(() => {
      const { type } = props
      return type === 'time' ? 'HH:mm:ss' : (props.valueFormat || (type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'))
    })

    const computeDateValue = computed(() => {
      const { modelValue } = props
      const isDatePickerType = computeIsDatePickerType.value
      const dateValueFormat = computeDateValueFormat.value
      let val = null
      if (modelValue && isDatePickerType) {
        const date = parseDate(modelValue, dateValueFormat)
        if (XEUtils.isValidDate(date)) {
          val = date
        }
      }
      return val
    })

    const computeIsDisabledPrevDateBtn = computed(() => {
      const dateStartTime = computeDateStartTime.value
      const { selectMonth } = reactData
      if (selectMonth && dateStartTime) {
        return selectMonth <= dateStartTime
      }
      return false
    })

    const computeIsDisabledNextDateBtn = computed(() => {
      const dateEndTime = computeDateEndTime.value
      const { selectMonth } = reactData
      if (selectMonth && dateEndTime) {
        return selectMonth >= dateEndTime
      }
      return false
    })

    const computeDateTimeLabel = computed(() => {
      const { datetimePanelValue } = reactData
      if (datetimePanelValue) {
        return XEUtils.toDateString(datetimePanelValue, 'HH:mm:ss')
      }
      return ''
    })

    const computeDateHMSTime = computed(() => {
      const dateValue = computeDateValue.value
      const isDateTimeType = computeIsDateTimeType.value
      return dateValue && isDateTimeType ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0
    })

    const computeDateLabelFormat = computed(() => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        return props.labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
      }
      return null
    })

    const computeYearList = computed(() => {
      const { selectMonth, currentDate } = reactData
      const years: DateYearItem[] = []
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
    })

    const computeSelectDatePanelLabel = computed(() => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        const { datePanelType, selectMonth } = reactData
        const yearList = computeYearList.value
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
    })

    const computeFirstDayOfWeek = computed(() => {
      const { startDay, startWeek } = props
      return XEUtils.toNumber(XEUtils.isNumber(startDay) || XEUtils.isString(startDay) ? startDay : startWeek) as VxeDatePickerPropTypes.StartDay
    })

    const computeWeekDatas = computed(() => {
      const weeks = []
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        let sWeek = computeFirstDayOfWeek.value
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
    })

    const computeDateHeaders = computed(() => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        const weekDatas = computeWeekDatas.value
        return weekDatas.map((day) => {
          return {
            value: day,
            label: getI18n(`vxe.input.date.weeks.w${day}`)
          }
        })
      }
      return []
    })

    const computeWeekHeaders = computed(() => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        const dateHeaders = computeDateHeaders.value
        return [{ label: getI18n('vxe.input.date.weeks.w') }].concat(dateHeaders)
      }
      return []
    })

    const computeYearDatas = computed(() => {
      const yearList = computeYearList.value
      return XEUtils.chunk(yearList, 4)
    })

    const computeQuarterList = computed(() => {
      const { selectMonth, currentDate } = reactData
      const quarters: DateQuarterItem[] = []
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
    })

    const computeQuarterDatas = computed(() => {
      const quarterList = computeQuarterList.value
      return XEUtils.chunk(quarterList, 2)
    })

    const computeMonthList = computed(() => {
      const { selectMonth, currentDate } = reactData
      const months: DateMonthItem[] = []
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
    })

    const computeMonthDatas = computed(() => {
      const monthList = computeMonthList.value
      return XEUtils.chunk(monthList, 4)
    })

    const computeDayList = computed(() => {
      const { selectMonth, currentDate } = reactData
      const days: DateDayItem[] = []
      if (selectMonth && currentDate) {
        const dateHMSTime = computeDateHMSTime.value
        const weekDatas = computeWeekDatas.value
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
    })

    const computeDayDatas = computed(() => {
      const dayList = computeDayList.value
      return XEUtils.chunk(dayList, 7)
    })

    const computeWeekDates = computed(() => {
      const dayDatas = computeDayDatas.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      return dayDatas.map((list) => {
        const firstItem = list[0]
        const item: DateDayItem = {
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
    })

    const computeHourList = computed(() => {
      const list: DateHourMinuteSecondItem[] = []
      const isDateTimeType = computeIsDateTimeType.value
      if (isDateTimeType) {
        for (let index = 0; index < 24; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, '0')
          })
        }
      }
      return list
    })

    const computeMinuteList = computed(() => {
      const list: DateHourMinuteSecondItem[] = []
      const isDateTimeType = computeIsDateTimeType.value
      if (isDateTimeType) {
        for (let index = 0; index < 60; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, '0')
          })
        }
      }
      return list
    })

    const computeSecondList = computed(() => {
      const minuteList = computeMinuteList.value
      return minuteList
    })

    const computeInpReadonly = computed(() => {
      const { type, readonly, editable, multiple } = props
      return readonly || multiple || !editable || type === 'week' || type === 'quarter'
    })

    const computeDatePickerType = computed(() => {
      return 'text'
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      return ''
    })

    const computeInpImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      datePickerMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const emitModel = (value: string, evnt: Event | { type: string }) => {
      reactData.inputValue = value
      emit('update:modelValue', value)
      datePickerMethods.dispatchEvent('input', { value }, evnt as any)
      if (XEUtils.toValueString(props.modelValue) !== value) {
        datePickerMethods.dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const emitDatePickerEvent = (value: any, evnt: Event) => {
      const isDatePickerType = computeIsDatePickerType.value
      const inpImmediate = computeInpImmediate.value
      reactData.inputValue = value
      if (!isDatePickerType) {
        if (inpImmediate) {
          emitModel(value, evnt)
        } else {
          datePickerMethods.dispatchEvent('input', { value }, evnt)
        }
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      emitDatePickerEvent(value, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        triggerEvent(evnt)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      reactData.isActivated = true
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        datePickerOpenEvent(evnt)
      }
      triggerEvent(evnt)
    }

    const clickPrefixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        datePickerMethods.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    }

    let hidePanelTimeout: number

    const hidePanel = (): Promise<void> => {
      return new Promise(resolve => {
        reactData.visiblePanel = false
        hidePanelTimeout = window.setTimeout(() => {
          reactData.animatVisible = false
          resolve()
        }, 350)
      })
    }

    const clearValueEvent = (evnt: Event, value: VxeDatePickerPropTypes.ModelValue) => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        hidePanel()
      }
      emitModel('', evnt)
      datePickerMethods.dispatchEvent('clear', { value }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        datePickerMethods.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    }

    const dateParseValue = (value?: VxeDatePickerPropTypes.ModelValue) => {
      const { type } = props
      const { valueFormat } = props
      const dateLabelFormat = computeDateLabelFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      let dValue: Date | null = null
      let dLabel = ''
      if (value) {
        dValue = parseDate(value, valueFormat)
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
    }

    /**
     * 值变化时处理
     */
    const changeValue = () => {
      const isDatePickerType = computeIsDatePickerType.value
      const { inputValue } = reactData
      if (isDatePickerType) {
        dateParseValue(inputValue)
        reactData.inputValue = props.multiple ? computeDateMultipleLabel.value : reactData.datePanelLabel
      }
    }

    /**
     * 检查初始值
     */
    const initValue = () => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        changeValue()
      }
    }

    const dateRevert = () => {
      reactData.inputValue = props.multiple ? computeDateMultipleLabel.value : reactData.datePanelLabel
    }

    const dateCheckMonth = (date: Date) => {
      const month = XEUtils.getWhatMonth(date, 0, 'first')
      if (!XEUtils.isEqual(month, reactData.selectMonth)) {
        reactData.selectMonth = month
      }
    }

    const dateChange = (date: Date) => {
      const { modelValue, multiple } = props
      const { datetimePanelValue } = reactData
      const isDateTimeType = computeIsDateTimeType.value
      const dateValueFormat = computeDateValueFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeDatePickerPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      } else if (isDateTimeType) {
        date.setHours(datetimePanelValue.getHours())
        date.setMinutes(datetimePanelValue.getMinutes())
        date.setSeconds(datetimePanelValue.getSeconds())
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      dateCheckMonth(date)
      if (multiple) {
        // 如果为多选
        const dateMultipleValue = computeDateMultipleValue.value
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = [...computeDateListValue.value]
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
          emitModel(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            emitModel(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            emitModel(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(modelValue, inpVal)) {
          emitModel(inpVal, { type: 'update' })
        }
      }
    }

    const afterCheckValue = () => {
      const { type } = props
      const { inputValue, datetimePanelValue } = reactData
      const dateLabelFormat = computeDateLabelFormat.value
      const inpReadonly = computeInpReadonly.value
      if (!inpReadonly) {
        if (inputValue) {
          let inpDateVal: VxeDatePickerPropTypes.ModelValue = parseDate(inputValue, dateLabelFormat as string)
          if (XEUtils.isValidDate(inpDateVal)) {
            if (type === 'time') {
              inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
              if (inputValue !== inpDateVal) {
                emitModel(inpDateVal, { type: 'check' })
              }
              reactData.inputValue = inpDateVal
            } else {
              let isChange = false
              const firstDayOfWeek = computeFirstDayOfWeek.value
              if (type === 'datetime') {
                const dateValue = computeDateValue.value
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
                dateChange(inpDateVal)
              }
            }
          } else {
            dateRevert()
          }
        } else {
          emitModel('', { type: 'check' })
        }
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        emitModel(inputValue, evnt)
      }
      afterCheckValue()
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      datePickerMethods.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    const wheelEvent = (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) => {
      triggerEvent(evnt)
    }

    // 日期
    const dateMonthHandle = (date: Date, offsetMonth: number) => {
      reactData.selectMonth = XEUtils.getWhatMonth(date, offsetMonth, 'first')
    }

    const dateNowHandle = () => {
      const currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      reactData.currentDate = currentDate
      dateMonthHandle(currentDate, 0)
    }

    const dateToggleTypeEvent = () => {
      let { datePanelType } = reactData
      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year'
      } else {
        datePanelType = 'month'
      }
      reactData.datePanelType = datePanelType
    }

    const datePrevEvent = (evnt: Event) => {
      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const isDisabledPrevDateBtn = computeIsDisabledPrevDateBtn.value
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
        datePickerMethods.dispatchEvent('date-prev', { type }, evnt)
      }
    }

    const dateTodayMonthEvent = (evnt: Event) => {
      dateNowHandle()
      if (!props.multiple) {
        dateChange(reactData.currentDate)
        hidePanel()
      }
      datePickerMethods.dispatchEvent('date-today', { type: props.type }, evnt)
    }

    const dateNextEvent = (evnt: Event) => {
      const { type } = props
      const { datePanelType, selectMonth } = reactData
      const isDisabledNextDateBtn = computeIsDisabledNextDateBtn.value
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
        datePickerMethods.dispatchEvent('date-next', { type }, evnt)
      }
    }

    const isDateDisabled = (item: { date: Date }) => {
      const { disabledMethod } = props
      const { datePanelType } = reactData
      return disabledMethod && disabledMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $datePicker: $xeDatePicker })
    }

    const dateSelectItem = (date: Date) => {
      const { type, multiple } = props
      const { datePanelType } = reactData
      if (type === 'month') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          dateCheckMonth(date)
        } else {
          dateChange(date)
          if (!multiple) {
            hidePanel()
          }
        }
      } else if (type === 'year') {
        dateChange(date)
        if (!multiple) {
          hidePanel()
        }
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          reactData.datePanelType = 'quarter'
          dateCheckMonth(date)
        } else {
          dateChange(date)
          if (!multiple) {
            hidePanel()
          }
        }
      } else {
        if (datePanelType === 'month') {
          reactData.datePanelType = type === 'week' ? type : 'day'
          dateCheckMonth(date)
        } else if (datePanelType === 'year') {
          reactData.datePanelType = 'month'
          dateCheckMonth(date)
        } else {
          dateChange(date)
          if (type === 'datetime') {
            // 日期带时间
          } else {
            if (!multiple) {
              hidePanel()
            }
          }
        }
      }
    }

    const dateSelectEvent = (item: DateYearItem | DateQuarterItem | DateMonthItem | DateDayItem) => {
      if (!isDateDisabled(item)) {
        dateSelectItem(item.date)
      }
    }

    const dateMoveDay = (offsetDay: Date) => {
      if (!isDateDisabled({ date: offsetDay })) {
        const dayList = computeDayList.value
        if (!dayList.some((item) => XEUtils.isDateSame(item.date, offsetDay, 'yyyyMMdd'))) {
          dateCheckMonth(offsetDay)
        }
        dateParseValue(offsetDay)
      }
    }

    const dateMoveYear = (offsetYear: Date) => {
      if (!isDateDisabled({ date: offsetYear })) {
        const yearList = computeYearList.value
        if (!yearList.some((item) => XEUtils.isDateSame(item.date, offsetYear, 'yyyy'))) {
          dateCheckMonth(offsetYear)
        }
        dateParseValue(offsetYear)
      }
    }

    const dateMoveQuarter = (offsetQuarter: Date) => {
      if (!isDateDisabled({ date: offsetQuarter })) {
        const quarterList = computeQuarterList.value
        if (!quarterList.some((item) => XEUtils.isDateSame(item.date, offsetQuarter, 'yyyyq'))) {
          dateCheckMonth(offsetQuarter)
        }
        dateParseValue(offsetQuarter)
      }
    }

    const dateMoveMonth = (offsetMonth: Date) => {
      if (!isDateDisabled({ date: offsetMonth })) {
        const monthList = computeMonthList.value
        if (!monthList.some((item) => XEUtils.isDateSame(item.date, offsetMonth, 'yyyyMM'))) {
          dateCheckMonth(offsetMonth)
        }
        dateParseValue(offsetMonth)
      }
    }

    const dateMouseenterEvent = (item: DateYearItem | DateQuarterItem | DateMonthItem | DateDayItem) => {
      if (!isDateDisabled(item)) {
        const { datePanelType } = reactData
        if (datePanelType === 'month') {
          dateMoveMonth(item.date)
        } else if (datePanelType === 'quarter') {
          dateMoveQuarter(item.date)
        } else if (datePanelType === 'year') {
          dateMoveYear(item.date)
        } else {
          dateMoveDay(item.date)
        }
      }
    }

    const updateTimePos = (liElem: Element) => {
      if (liElem) {
        const height = (liElem as HTMLElement).offsetHeight
        const ulElem = liElem.parentNode as HTMLElement
        ulElem.scrollTop = (liElem as HTMLElement).offsetTop - height * 4
      }
    }

    const dateTimeChangeEvent = (evnt: Event) => {
      reactData.datetimePanelValue = new Date(reactData.datetimePanelValue.getTime())
      updateTimePos(evnt.currentTarget as HTMLLIElement)
    }

    const dateHourEvent = (evnt: MouseEvent, item: DateHourMinuteSecondItem) => {
      reactData.datetimePanelValue.setHours(item.value)
      dateTimeChangeEvent(evnt)
    }

    const dateConfirmEvent = () => {
      const { multiple } = props
      const { datetimePanelValue } = reactData
      const dateValue = computeDateValue.value
      const isDateTimeType = computeIsDateTimeType.value
      if (isDateTimeType) {
        const dateValueFormat = computeDateValueFormat.value
        if (multiple) {
          // 如果为多选
          const dateMultipleValue = computeDateMultipleValue.value
          if (isDateTimeType) {
            // 如果是datetime特殊类型
            const dateListValue = [...computeDateListValue.value]
            const datetimeRest: Date[] = []
            dateListValue.forEach(item => {
              if (item) {
                item.setHours(datetimePanelValue.getHours())
                item.setMinutes(datetimePanelValue.getMinutes())
                item.setSeconds(datetimePanelValue.getSeconds())
                datetimeRest.push(item)
              }
            })
            emitModel(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
          } else {
            // 如果是日期类型
            emitModel(dateMultipleValue.join(','), { type: 'update' })
          }
        } else {
          dateChange(dateValue || reactData.currentDate)
        }
      }
      hidePanel()
    }

    const dateMinuteEvent = (evnt: MouseEvent, item: DateHourMinuteSecondItem) => {
      reactData.datetimePanelValue.setMinutes(item.value)
      dateTimeChangeEvent(evnt)
    }

    const dateSecondEvent = (evnt: MouseEvent, item: DateHourMinuteSecondItem) => {
      reactData.datetimePanelValue.setSeconds(item.value)
      dateTimeChangeEvent(evnt)
    }

    const dateOffsetEvent = (evnt: KeyboardEvent) => {
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
          dateMoveYear(offsetYear)
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
          dateMoveQuarter(offsetQuarter)
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
          dateMoveMonth(offsetMonth)
        } else {
          let offsetDay = datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
          const firstDayOfWeek = computeFirstDayOfWeek.value
          if (isLeftArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, -1)
          } else if (isUpArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, -1, firstDayOfWeek)
          } else if (isRightArrow) {
            offsetDay = XEUtils.getWhatDay(offsetDay, 1)
          } else if (isDwArrow) {
            offsetDay = XEUtils.getWhatWeek(offsetDay, 1, firstDayOfWeek)
          }
          dateMoveDay(offsetDay)
        }
      }
    }

    const datePgOffsetEvent = (evnt: KeyboardEvent) => {
      const { isActivated } = reactData
      if (isActivated) {
        const isPgUp = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.PAGE_UP)
        evnt.preventDefault()
        if (isPgUp) {
          datePrevEvent(evnt)
        } else {
          dateNextEvent(evnt)
        }
      }
    }

    const dateOpenPanel = () => {
      const { type } = props
      const isDateTimeType = computeIsDateTimeType.value
      const dateValue = computeDateValue.value
      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        reactData.datePanelType = type as 'year' | 'quarter' | 'month' | 'week'
      } else {
        reactData.datePanelType = 'day'
      }
      reactData.currentDate = XEUtils.getWhatDay(Date.now(), 0, 'first')
      if (dateValue) {
        dateMonthHandle(dateValue, 0)
        dateParseValue(dateValue)
      } else {
        dateNowHandle()
      }
      if (isDateTimeType) {
        reactData.datetimePanelValue = reactData.datePanelValue || XEUtils.getWhatDay(Date.now(), 0, 'first')
        nextTick(() => {
          const timeBodyElem = refInputTimeBody.value
          XEUtils.arrayEach(timeBodyElem.querySelectorAll('li.is--selected'), updateTimePos)
        })
      }
    }

    // 日期

    // 弹出面板
    const updateZindex = () => {
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      return nextTick().then(() => {
        const { placement } = props
        const { panelIndex } = reactData
        const targetElem = refInputTarget.value
        const panelElem = refInputPanel.value
        const transfer = compTransfer.value
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
          if (transfer) {
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
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top'
                  panelStyle.bottom = `${targetHeight}px`
                }
              }
            }
          }
          reactData.panelStyle = panelStyle
          reactData.panelPlacement = panelPlacement
          return nextTick()
        }
      })
    }

    const showPanel = () => {
      const { disabled } = props
      const { visiblePanel } = reactData
      const isDatePickerType = computeIsDatePickerType.value
      if (!disabled && !visiblePanel) {
        if (!reactData.inited) {
          reactData.inited = true
        }
        clearTimeout(hidePanelTimeout)
        reactData.isActivated = true
        reactData.animatVisible = true
        if (isDatePickerType) {
          dateOpenPanel()
        }
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        updateZindex()
        return updatePlacement()
      }
      return nextTick()
    }

    const datePickerOpenEvent = (evnt: Event) => {
      const { readonly } = props
      if (!readonly) {
        evnt.preventDefault()
        showPanel()
      }
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    // 弹出面板

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel, isActivated } = reactData
      const isDatePickerType = computeIsDatePickerType.value
      const el = refElem.value
      const panelWrapperElem = refPanelWrapper.value
      if (!disabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          // 如果是日期类型
          if (isDatePickerType) {
            if (visiblePanel) {
              hidePanel()
              afterCheckValue()
            }
          } else {
            afterCheckValue()
          }
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable, disabled } = props
      const { visiblePanel } = reactData
      const isDatePickerType = computeIsDatePickerType.value
      if (!disabled) {
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
            afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        } else if (operArrow) {
          if (isDatePickerType) {
            if (isActivated) {
              if (visiblePanel) {
                dateOffsetEvent(evnt)
              } else if (isUpArrow || isDwArrow) {
                datePickerOpenEvent(evnt)
              }
            }
          }
        } else if (isEnter) {
          if (isDatePickerType) {
            if (visiblePanel) {
              if (reactData.datePanelValue) {
                dateSelectItem(reactData.datePanelValue)
              } else {
                hidePanel()
              }
            } else if (isActivated) {
              datePickerOpenEvent(evnt)
            }
          }
        } else if (isPgUp || isPgDn) {
          if (isDatePickerType) {
            if (isActivated) {
              datePgOffsetEvent(evnt)
            }
          }
        }
        if (isTab || isEsc) {
          if (visiblePanel) {
            hidePanel()
          }
        } else if (isDel && clearable) {
          if (isActivated) {
            clearValueEvent(evnt, null)
          }
        }
      }
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const { disabled } = props
      const { visiblePanel } = reactData
      if (!disabled) {
        if (visiblePanel) {
          const panelWrapperElem = refPanelWrapper.value
          if (getEventTargetNode(evnt, panelWrapperElem).flag) {
            updatePlacement()
          } else {
            hidePanel()
            afterCheckValue()
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        hidePanel()
        afterCheckValue()
      } else if (isActivated) {
        afterCheckValue()
      }
    }

    const renderDateLabel = (item: DateYearItem | DateQuarterItem | DateMonthItem | DateDayItem, label: string | number) => {
      const { festivalMethod } = props
      if (festivalMethod) {
        const { datePanelType } = reactData
        const festivalRest = festivalMethod({ type: datePanelType, viewType: datePanelType, date: item.date, $datePicker: $xeDatePicker })
        const festivalItem = festivalRest ? (XEUtils.isString(festivalRest) ? { label: festivalRest } : festivalRest) : {}
        const extraItem = festivalItem.extra ? (XEUtils.isString(festivalItem.extra) ? { label: festivalItem.extra } : festivalItem.extra) : null
        const labels = [
          h('span', {
            class: ['vxe-date-picker--date-label', {
              'is-notice': festivalItem.notice
            }]
          }, extraItem && extraItem.label
            ? [
                h('span', label),
                h('span', {
                  class: ['vxe-date-picker--date-label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
                  style: extraItem.style
                }, XEUtils.toValueString(extraItem.label))
              ]
            : label)
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
      return label
    }

    const renderDateDayTable = () => {
      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = computeDateValue.value
      const dateHeaders = computeDateHeaders.value
      const dayDatas = computeDayDatas.value
      const dateListValue = computeDateListValue.value
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
          cellspacing: 0,
          cellpadding: 0,
          border: 0
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
                  'is--disabled': isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                onClick: () => dateSelectEvent(item),
                onMouseenter: () => dateMouseenterEvent(item)
              }, renderDateLabel(item, item.label))
            }))
          }))
        ])
      ]
    }

    const renderDateWeekTable = () => {
      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = computeDateValue.value
      const weekHeaders = computeWeekHeaders.value
      const weekDates = computeWeekDates.value
      const dateListValue = computeDateListValue.value
      const matchFormat = 'yyyyMMdd'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
          cellspacing: 0,
          cellpadding: 0,
          border: 0
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
                  'is--disabled': isDateDisabled(item),
                  'is--selected': isSelected,
                  'is--hover': isHover
                },
                // event
                onClick: () => dateSelectEvent(item),
                onMouseenter: () => dateMouseenterEvent(item)
              }, renderDateLabel(item, item.label))
            }))
          }))
        ])
      ]
    }

    const renderDateMonthTable = () => {
      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = computeDateValue.value
      const monthDatas = computeMonthDatas.value
      const dateListValue = computeDateListValue.value
      const matchFormat = 'yyyyMM'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
          cellspacing: 0,
          cellpadding: 0,
          border: 0
        }, [
          h('tbody', monthDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                onClick: () => dateSelectEvent(item),
                onMouseenter: () => dateMouseenterEvent(item)
              }, renderDateLabel(item, getI18n(`vxe.input.date.months.m${item.month}`)))
            }))
          }))
        ])
      ]
    }

    const renderDateQuarterTable = () => {
      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = computeDateValue.value
      const quarterDatas = computeQuarterDatas.value
      const dateListValue = computeDateListValue.value
      const matchFormat = 'yyyyq'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
          cellspacing: 0,
          cellpadding: 0,
          border: 0
        }, [
          h('tbody', quarterDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                onClick: () => dateSelectEvent(item),
                onMouseenter: () => dateMouseenterEvent(item)
              }, renderDateLabel(item, getI18n(`vxe.input.date.quarters.q${item.quarter}`)))
            }))
          }))
        ])
      ]
    }

    const renderDateYearTable = () => {
      const { multiple } = props
      const { datePanelType, datePanelValue } = reactData
      const dateValue = computeDateValue.value
      const yearDatas = computeYearDatas.value
      const dateListValue = computeDateListValue.value
      const matchFormat = 'yyyy'
      return [
        h('table', {
          class: `vxe-date-picker--date-${datePanelType}-view`,
          cellspacing: 0,
          cellpadding: 0,
          border: 0
        }, [
          h('tbody', yearDatas.map((rows) => {
            return h('tr', rows.map((item) => {
              return h('td', {
                class: {
                  'is--prev': item.isPrev,
                  'is--current': item.isCurrent,
                  'is--now': item.isNow,
                  'is--next': item.isNext,
                  'is--disabled': isDateDisabled(item),
                  'is--selected': multiple ? dateListValue.some(val => XEUtils.isDateSame(val, item.date, matchFormat)) : XEUtils.isDateSame(dateValue, item.date, matchFormat),
                  'is--hover': XEUtils.isDateSame(datePanelValue, item.date, matchFormat)
                },
                onClick: () => dateSelectEvent(item),
                onMouseenter: () => dateMouseenterEvent(item)
              }, renderDateLabel(item, item.year))
            }))
          }))
        ])
      ]
    }

    const renderDateTable = () => {
      const { datePanelType } = reactData
      switch (datePanelType) {
        case 'week' :
          return renderDateWeekTable()
        case 'month' :
          return renderDateMonthTable()
        case 'quarter' :
          return renderDateQuarterTable()
        case 'year' :
          return renderDateYearTable()
      }
      return renderDateDayTable()
    }

    const renderDatePanel = () => {
      const { multiple } = props
      const { datePanelType } = reactData
      const isDisabledPrevDateBtn = computeIsDisabledPrevDateBtn.value
      const isDisabledNextDateBtn = computeIsDisabledNextDateBtn.value
      const selectDatePanelLabel = computeSelectDatePanelLabel.value
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
                onClick: dateToggleTypeEvent
              }, selectDatePanelLabel)
          ]),
          h('div', {
            class: 'vxe-date-picker--date-picker-btn-wrapper'
          }, [
            h('span', {
              class: ['vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-prev-btn', {
                'is--disabled': isDisabledPrevDateBtn
              }],
              onClick: datePrevEvent
            }, [
              h('i', {
                class: 'vxe-icon-caret-left'
              })
            ]),
            h('span', {
              class: 'vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-current-btn',
              onClick: dateTodayMonthEvent
            }, [
              h('i', {
                class: 'vxe-icon-dot'
              })
            ]),
            h('span', {
              class: ['vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-next-btn', {
                'is--disabled': isDisabledNextDateBtn
              }],
              onClick: dateNextEvent
            }, [
              h('i', {
                class: 'vxe-icon-caret-right'
              })
            ]),
            multiple && computeSupportMultiples.value
              ? h('span', {
                class: 'vxe-date-picker--date-picker-btn vxe-date-picker--date-picker-confirm-btn'
              }, [
                h('button', {
                  class: 'vxe-date-picker--date-picker-confirm',
                  type: 'button',
                  onClick: dateConfirmEvent
                }, getI18n('vxe.button.confirm'))
              ])
              : null
          ])
        ]),
        h('div', {
          class: 'vxe-date-picker--date-picker-body'
        }, renderDateTable())
      ]
    }

    const renderTimePanel = () => {
      const { datetimePanelValue } = reactData
      const dateTimeLabel = computeDateTimeLabel.value
      const hourList = computeHourList.value
      const minuteList = computeMinuteList.value
      const secondList = computeSecondList.value
      return [
        h('div', {
          class: 'vxe-date-picker--time-picker-header'
        }, [
          h('span', {
            class: 'vxe-date-picker--time-picker-title'
          }, dateTimeLabel),
          h('button', {
            class: 'vxe-date-picker--time-picker-confirm',
            type: 'button',
            onClick: dateConfirmEvent
          }, getI18n('vxe.button.confirm'))
        ]),
        h('div', {
          ref: refInputTimeBody,
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
              onClick: (evnt: MouseEvent) => dateHourEvent(evnt, item)
            }, item.label)
          })),
          h('ul', {
            class: 'vxe-date-picker--time-picker-minute-list'
          }, minuteList.map((item, index) => {
            return h('li', {
              key: index,
              class: {
                'is--selected': datetimePanelValue && datetimePanelValue.getMinutes() === item.value
              },
              onClick: (evnt: MouseEvent) => dateMinuteEvent(evnt, item)
            }, item.label)
          })),
          h('ul', {
            class: 'vxe-date-picker--time-picker-second-list'
          }, secondList.map((item, index) => {
            return h('li', {
              key: index,
              class: {
                'is--selected': datetimePanelValue && datetimePanelValue.getSeconds() === item.value
              },
              onClick: (evnt: MouseEvent) => dateSecondEvent(evnt, item)
            }, item.label)
          }))
        ])
      ]
    }

    const renderPanel = () => {
      const { type } = props
      const { inited, animatVisible, visiblePanel, panelPlacement, panelStyle } = reactData
      const vSize = computeSize.value
      const isDatePickerType = computeIsDatePickerType.value
      const transfer = compTransfer.value
      const renders = []
      if (isDatePickerType) {
        if (type === 'datetime') {
          renders.push(
            h('div', {
              key: type,
              ref: refPanelWrapper,
              class: 'vxe-date-picker--panel-layout-wrapper'
            }, [
              h('div', {
                class: 'vxe-date-picker--panel-left-wrapper'
              }, renderDatePanel()),
              h('div', {
                class: 'vxe-date-picker--panel-right-wrapper'
              }, renderTimePanel())
            ])
          )
        } else if (type === 'time') {
          renders.push(
            h('div', {
              key: type,
              ref: refPanelWrapper,
              class: 'vxe-date-picker--panel-wrapper'
            }, renderTimePanel())
          )
        } else {
          renders.push(
            h('div', {
              key: type || 'default',
              ref: refPanelWrapper,
              class: 'vxe-date-picker--panel-wrapper'
            }, renderDatePanel())
          )
        }
        return h(Teleport, {
          to: 'body',
          disabled: transfer ? !inited : true
        }, [
          h('div', {
            ref: refInputPanel,
            class: ['vxe-table--ignore-clear vxe-date-picker--panel', `type--${type}`, {
              [`size--${vSize}`]: vSize,
              'is--transfer': transfer,
              'animat--leave': animatVisible,
              'animat--enter': visiblePanel
            }],
            placement: panelPlacement,
            style: panelStyle
          }, renders)
        ])
      }
      return createCommentVNode()
    }

    const renderDatePickerIcon = () => {
      return h('div', {
        class: 'vxe-date-picker--control-icon',
        onClick: datePickerOpenEvent
      }, [
        h('i', {
          class: ['vxe-date-picker--date-picker-icon', getIcon().INPUT_DATE]
        })
      ])
    }

    const renderPrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-date-picker--prefix',
          onClick: clickPrefixEvent
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
    }

    const renderSuffixIcon = () => {
      const { disabled, suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isClearable = computeIsClearable.value
      return isClearable || suffixSlot || suffixIcon
        ? h('div', {
          class: ['vxe-date-picker--suffix', {
            'is--clear': isClearable && !disabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
          }]
        }, [
          isClearable
            ? h('div', {
              class: 'vxe-date-picker--clear-icon',
              onClick: clearValueEvent
            }, [
              h('i', {
                class: getIcon().INPUT_CLEAR
              })
            ])
            : createCommentVNode(),
          renderExtraSuffixIcon(),
          suffixSlot || suffixIcon
            ? h('div', {
              class: 'vxe-date-picker--suffix-icon',
              onClick: clickSuffixEvent
            }, suffixSlot
              ? getSlotVNs(suffixSlot({}))
              : [
                  h('i', {
                    class: suffixIcon
                  })
                ])
            : createCommentVNode()
        ])
        : null
    }

    const renderExtraSuffixIcon = () => {
      return renderDatePickerIcon()
    }

    datePickerMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $input: $xeDatePicker }, params))
      },

      focus () {
        const inputElem = refInputTarget.value
        reactData.isActivated = true
        inputElem.focus()
        return nextTick()
      },
      blur () {
        const inputElem = refInputTarget.value
        inputElem.blur()
        reactData.isActivated = false
        return nextTick()
      },
      select () {
        const inputElem = refInputTarget.value
        inputElem.select()
        reactData.isActivated = false
        return nextTick()
      },
      showPanel,
      hidePanel,
      updatePlacement
    }

    Object.assign($xeDatePicker, datePickerMethods)

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
      changeValue()
    })

    watch(() => props.type, () => {
      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.modelValue,
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      initValue()
    })

    watch(computeDateLabelFormat, () => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        dateParseValue(reactData.datePanelValue)
        reactData.inputValue = props.multiple ? computeDateMultipleLabel.value : reactData.datePanelLabel
      }
    })

    nextTick(() => {
      globalEvents.on($xeDatePicker, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeDatePicker, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeDatePicker, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeDatePicker, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      globalEvents.off($xeDatePicker, 'mousewheel')
      globalEvents.off($xeDatePicker, 'mousedown')
      globalEvents.off($xeDatePicker, 'keydown')
      globalEvents.off($xeDatePicker, 'blur')
    })

    initValue()

    const renderVN = () => {
      const { className, type, align, name, disabled, readonly, autocomplete } = props
      const { inputValue, visiblePanel, isActivated } = reactData
      const vSize = computeSize.value
      const inpReadonly = computeInpReadonly.value
      const inputType = computeDatePickerType.value
      const inpPlaceholder = computeInpPlaceholder.value
      const isClearable = computeIsClearable.value
      const prefix = renderPrefixIcon()
      const suffix = renderSuffixIcon()
      return h('div', {
        ref: refElem,
        class: ['vxe-date-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--readonly': readonly,
          'is--visible': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated,
          'show--clear': isClearable && !disabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }]
      }, [
        prefix || createCommentVNode(),
        h('div', {
          class: 'vxe-date-picker--wrapper'
        }, [
          h('input', {
            ref: refInputTarget,
            class: 'vxe-date-picker--inner',
            value: inputValue,
            name,
            type: inputType,
            placeholder: inpPlaceholder,
            readonly: inpReadonly,
            disabled,
            autocomplete,
            onKeydown: keydownEvent,
            onKeyup: keyupEvent,
            onWheel: wheelEvent,
            onClick: clickEvent,
            onDatePicker: inputEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent
          })
        ]),
        suffix || createCommentVNode(),
        // 下拉面板
        renderPanel()
      ])
    }

    $xeDatePicker.renderVN = renderVN

    return $xeDatePicker
  },
  render () {
    return this.renderVN()
  }
})
