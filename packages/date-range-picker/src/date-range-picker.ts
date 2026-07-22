import { h, Teleport, ref, Ref, computed, provide, reactive, inject, nextTick, watch, PropType, onDeactivated, onUnmounted, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, globalEvents, createEvent, GLOBAL_EVENT_KEYS, useSize, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode, getPopupContainer } from '../../ui/src/dom'
import { parseDateString, parseDateObj, getRangeDateByCode, handleValueFormat, hasTimestampValueType, hasDateValueType, parseDateValue, getNextMonth, getPrevMonth, getNextYear, getPrevYear } from '../../date-panel/src/util'
import { getSlotVNs } from '../../ui/src/vn'
import { createComponentLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel'
import VxeButtonComponent from '../../button'
import VxeButtonGroupComponent from '../../button-group'

import type { VxeDateRangePickerConstructor, VxeDateRangePickerEmits, DateRangePickerInternalData, DateRangePickerReactData, DateRangePickerMethods, VxeDateRangePickerPropTypes, DateRangePickerPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDatePanelPropTypes, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDatePanelEvents, VxeDateRangePickerDefines, VxeButtonGroupEvents, VxeDatePanelConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

const { errLog } = createComponentLog('date-range-picker')

function createReactData (): DateRangePickerReactData {
  return {
    initialized: false,
    panelIndex: 0,
    visiblePanel: false,
    isAniVisible: false,
    panelStyle: {},
    panelPlacement: '',
    isActivated: false,
    selectStValue: '',
    selectEdValue: '',
    paneStartVal: [],
    paneEndVal: []
  }
}

function createInternalData (): DateRangePickerInternalData {
  return {
    // selectStatus: false
    // hpTimeout: undefined
  }
}

export default defineVxeComponent({
  name: 'VxeDateRangePicker',
  props: {
    modelValue: [String, Number, Date, Array] as PropType<VxeDateRangePickerPropTypes.ModelValue>,
    startValue: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.StartValue>,
    endValue: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.EndValue>,
    immediate: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeDateRangePickerPropTypes.Name>,
    type: {
      type: String as PropType<VxeDateRangePickerPropTypes.Type>,
      default: 'date'
    },
    clearable: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Clearable>,
      default: () => getConfig().dateRangePicker.clearable
    },
    linkedPanels: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.LinkedPanels>,
      default: () => getConfig().dateRangePicker.linkedPanels
    },
    readonly: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Disabled>,
      default: null
    },
    placeholder: String as PropType<VxeDateRangePickerPropTypes.Placeholder>,
    autoComplete: {
      type: String as PropType<VxeDateRangePickerPropTypes.AutoComplete>,
      default: 'off'
    },
    form: String as PropType<VxeDateRangePickerPropTypes.Form>,
    className: String as PropType<VxeDateRangePickerPropTypes.ClassName>,
    zIndex: Number as PropType<VxeDateRangePickerPropTypes.ZIndex>,
    size: {
      type: String as PropType<VxeDateRangePickerPropTypes.Size>,
      default: () => getConfig().dateRangePicker.size || getConfig().size
    },

    // startDate: {
    //   type: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.StartDate>,
    //   default: () => getConfig().dateRangePicker.startDate
    // },
    // endDate: {
    //   type: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.EndDate>,
    //   default: () => getConfig().dateRangePicker.endDate
    // },
    minDate: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.MaxDate>,
    defaultDate: [String, Number, Date, Array] as PropType<VxeDateRangePickerPropTypes.DefaultDate>,
    defaultTime: [String, Number, Date, Array] as PropType<VxeDateRangePickerPropTypes.DefaultTime>,
    startDay: {
      type: [String, Number] as PropType<VxeDateRangePickerPropTypes.StartDay>,
      default: () => getConfig().dateRangePicker.startDay
    },
    labelFormat: String as PropType<VxeDateRangePickerPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeDateRangePickerPropTypes.ValueFormat>,
    timeFormat: String as PropType<VxeDateRangePickerPropTypes.TimeFormat>,
    valueType: String as PropType<VxeDateRangePickerPropTypes.ValueType>,
    editable: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Editable>,
      default: true
    },
    festivalMethod: {
      type: Function as PropType<VxeDateRangePickerPropTypes.FestivalMethod>,
      default: () => getConfig().dateRangePicker.festivalMethod
    },
    disabledMethod: {
      type: Function as PropType<VxeDateRangePickerPropTypes.DisabledMethod>,
      default: () => getConfig().dateRangePicker.disabledMethod
    },
    separator: {
      type: [String, Number] as PropType<VxeDateRangePickerPropTypes.Separator>,
      default: () => getConfig().dateRangePicker.separator
    },

    // week
    selectDay: {
      type: [String, Number] as PropType<VxeDateRangePickerPropTypes.SelectDay>,
      default: () => getConfig().dateRangePicker.selectDay
    },
    showClearButton: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.ShowClearButton>,
      default: () => getConfig().dateRangePicker.showClearButton
    },
    showConfirmButton: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.ShowConfirmButton>,
      default: () => getConfig().dateRangePicker.showConfirmButton
    },
    autoClose: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.AutoClose>,
      default: () => getConfig().dateRangePicker.autoClose
    },

    prefixIcon: String as PropType<VxeDateRangePickerPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeDateRangePickerPropTypes.SuffixIcon>,
    placement: String as PropType<VxeDateRangePickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Transfer>,
      default: null
    },

    timeConfig: Object as PropType<VxeDateRangePickerPropTypes.TimeConfig>,
    popupConfig: Object as PropType<VxeDateRangePickerPropTypes.PopupConfig>,
    shortcutConfig: Object as PropType<VxeDateRangePickerPropTypes.ShortcutConfig>
  },
  emits: [
    'update:modelValue',
    'update:startValue',
    'update:endValue',
    'input',
    'change',
    'keydown',
    'keyup',
    'click',
    'focus',
    'blur',
    'clear',
    'confirm',
    'prefix-click',
    'suffix-click',
    'date-prev',
    'date-today',
    'date-next',
    'shortcut-click'
  ] as VxeDateRangePickerEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeModal = inject<(VxeModalConstructor & VxeModalMethods) | null>('$xeModal', null)
    const $xeDrawer = inject<(VxeDrawerConstructor & VxeDrawerMethods) | null>('$xeDrawer', null)
    const $xeTable = inject<(VxeTableConstructor & VxeTablePrivateMethods) | null>('$xeTable', null)
    const $xeForm = inject<(VxeFormConstructor & VxeFormPrivateMethods) | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>
    const refInputPanel = ref<HTMLDivElement>()
    const refPanelWrapper = ref<HTMLDivElement>()

    const refStartDatePanel = ref<VxeDatePanelConstructor>()
    const refEndDatePanel = ref<VxeDatePanelConstructor>()

    const refMaps: DateRangePickerPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeDateRangePicker = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeDateRangePickerConstructor

    let dateRangePickerMethods = {} as DateRangePickerMethods

    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      const popupOpts = computePopupOpts.value
      if (XEUtils.isBoolean(popupOpts.transfer)) {
        return popupOpts.transfer
      }
      if (transfer === null) {
        const globalTransfer = getConfig().dateRangePicker.transfer
        if (XEUtils.isBoolean(globalTransfer)) {
          return globalTransfer
        }
        if ($xeTable || $xeModal || $xeDrawer || $xeForm) {
          return true
        }
      }
      return transfer
    })

    const computeFormReadonly = computed(() => {
      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
      return readonly
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeDefaultDates = computed(() => {
      const { defaultDate } = props
      if (defaultDate) {
        if (XEUtils.isArray(defaultDate)) {
          return defaultDate
        }
        if (`${defaultDate}`.indexOf(',') > -1) {
          return `${defaultDate}`.split(',')
        }
        return [defaultDate, defaultDate]
      }
      return []
    })

    const computeDefaultTimes = computed(() => {
      const { defaultTime } = props
      if (defaultTime) {
        if (XEUtils.isArray(defaultTime)) {
          return defaultTime
        }
        if (`${defaultTime}`.indexOf(',') > -1) {
          return `${defaultTime}`.split(',')
        }
        return [defaultTime, defaultTime]
      }
      return []
    })

    const computeMVal = computed(() => {
      const { startValue, endValue } = props
      return `${startValue || ''}${endValue || ''}`
    })

    const computeIsTimeType = computed(() => {
      const { type } = props
      return type === 'time'
    })

    const computeIsTimeOrDateTimeType = computed(() => {
      const { type } = props
      const isTimeType = computeIsTimeType.value
      return isTimeType || type === 'datetime'
    })

    const computeIsDatePickerType = computed(() => {
      return ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    })

    const computeIsClearable = computed(() => {
      return props.clearable
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().dateRangePicker.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.dateRangePicker.pleaseRange')
    })

    const computeInpImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    const computeTimeOpts = computed(() => {
      return Object.assign({}, getConfig().dateRangePicker.timeConfig, props.timeConfig)
    })

    const computePopupOpts = computed(() => {
      return Object.assign({}, getConfig().dateRangePicker.popupConfig, props.popupConfig)
    })

    const computeShortcutOpts = computed(() => {
      return Object.assign({}, getConfig().dateRangePicker.shortcutConfig, props.shortcutConfig)
    })

    const computeShortcutList = computed(() => {
      const shortcutOpts = computeShortcutOpts.value
      const { options } = shortcutOpts
      if (options) {
        return options.map((option, index) => {
          return Object.assign({
            name: `${option.name || option.code || index}`
          }, option)
        })
      }
      return []
    })

    const computeDateLabelFormat = computed(() => {
      const { labelFormat } = props
      return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
    })

    const computeDateValueFormat = computed(() => {
      const { type, valueFormat } = props
      return handleValueFormat(type, valueFormat)
    })

    const computeFirstDayOfWeek = computed(() => {
      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeDateRangePickerPropTypes.StartDay
    })

    const computePanelLabelObj = computed(() => {
      const { selectStValue, selectEdValue } = reactData
      const vals: string[] = selectStValue || selectEdValue ? [selectStValue || '', selectEdValue || ''] : []
      return formatRangeLabel(vals)
    })

    const computeInputLabel = computed(() => {
      const panelLabelObj = computePanelLabelObj.value
      return panelLabelObj.label
    })

    const formatRangeLabel = (vals: string[]) => {
      const { type, separator } = props
      const dateLabelFormat = computeDateLabelFormat.value
      const dateValueFormat = computeDateValueFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      const startRest = vals[0]
        ? parseDateObj(vals[0], type, {
          valueFormat: dateValueFormat,
          labelFormat: dateLabelFormat,
          firstDay: firstDayOfWeek
        })
        : null
      const endRest = vals[1]
        ? parseDateObj(vals[1], type, {
          valueFormat: dateValueFormat,
          labelFormat: dateLabelFormat,
          firstDay: firstDayOfWeek
        })
        : null
      const startLabel = startRest ? startRest.label : ''
      const endLabel = endRest ? endRest.label : ''
      return {
        label: (startLabel || endLabel ? [startLabel, endLabel] : []).join(`${separator || ' ~ '}`),
        startLabel,
        endLabel
      }
    }

    const getRangeValue = (sValue: string | number | Date | null, eValue: string | number | Date | null) => {
      const { modelValue, valueType, valueFormat } = props
      let isArr = valueFormat === 'date' || XEUtils.isArray(modelValue)
      if (valueType) {
        switch (valueType) {
          case 'array':
            isArr = true
            break
          case 'string':
            isArr = false
            break
        }
      }
      if (sValue || eValue) {
        const rest = [sValue || null, eValue || null]
        if (isArr) {
          return rest
        }
        return rest.join(',')
      }
      return isArr ? [] : ''
    }

    const paraeUpdateModel = () => {
      const { type, modelValue } = props
      const dateValueFormat = computeDateValueFormat.value
      let sValue: string | Date | null = ''
      let eValue: string | Date | null = ''
      if (XEUtils.isArray(modelValue)) {
        const date1 = parseDateString(modelValue[0], type, { valueFormat: dateValueFormat })
        const date2 = parseDateString(modelValue[1], type, { valueFormat: dateValueFormat })
        if (date1 || date2) {
          sValue = date1 || ''
          eValue = date2 || ''
        }
      } else if (XEUtils.isString(modelValue)) {
        const strArr = modelValue.split(',')
        if (strArr[0] || strArr[1]) {
          sValue = strArr[0] || ''
          eValue = strArr[1] || ''
        }
      }
      return {
        sValue,
        eValue
      }
    }

    const parseUpdateData = () => {
      const { type, startValue, endValue } = props
      const dateValueFormat = computeDateValueFormat.value
      let sValue: string | Date | null = ''
      let eValue: string | Date | null = ''
      sValue = parseDateString(startValue, type, { valueFormat: dateValueFormat })
      eValue = parseDateString(endValue, type, { valueFormat: dateValueFormat })
      return {
        sValue,
        eValue
      }
    }

    const updateModelValue = (isModel: boolean) => {
      const { modelValue, startValue, endValue, valueFormat } = props
      let restObj: {
        sValue: string | Date | null
        eValue: string | Date | null
      } = {
        sValue: '',
        eValue: ''
      }
      if (isModel) {
        if (modelValue) {
          restObj = paraeUpdateModel()
        } else {
          restObj = parseUpdateData()
        }
      } else {
        if (startValue || endValue) {
          restObj = parseUpdateData()
        } else {
          restObj = paraeUpdateModel()
        }
      }
      let startRest: string | number | Date | null = restObj.sValue
      let endRest: string | number | Date | null = restObj.eValue
      if (valueFormat === 'timestamp') {
        if (XEUtils.isString(startRest) && /^\d+$/.test(startRest)) {
          startRest = Number(startRest)
        }
        if (XEUtils.isString(endRest) && /^\d+$/.test(endRest)) {
          endRest = Number(endRest)
        }
      }
      reactData.selectStValue = startRest
      reactData.selectEdValue = endRest
      reactData.paneEndVal = [startRest, endRest]
      reactData.paneStartVal = [startRest, endRest]
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) => {
      const { selectStValue, selectEdValue } = reactData
      const value = getRangeValue(selectStValue, selectEdValue)
      dispatchEvent(evnt.type, { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
    }

    const handleChange = (sValue: string, eValue: string, evnt: Event | { type: string }) => {
      const { type, modelValue, valueFormat } = props
      const dateValueFormat = computeDateValueFormat.value
      let startRest: string | number | Date | null = sValue
      let endRest: string | number | Date | null = eValue
      if (hasTimestampValueType(valueFormat)) {
        if (startRest) {
          const dateVal = parseDateValue(startRest, type, { valueFormat: dateValueFormat })
          startRest = dateVal ? dateVal.getTime() : null
        }
        if (endRest) {
          const dateVal = parseDateValue(endRest, type, { valueFormat: dateValueFormat })
          endRest = dateVal ? dateVal.getTime() : null
        }
      } else if (hasDateValueType(valueFormat)) {
        if (startRest) {
          startRest = parseDateValue(startRest, type, { valueFormat: dateValueFormat })
        }
        if (endRest) {
          endRest = parseDateValue(endRest, type, { valueFormat: dateValueFormat })
        }
      }
      reactData.selectStValue = startRest
      reactData.selectEdValue = endRest
      const value = getRangeValue(startRest, endRest)
      const isFinish = (startRest && endRest) || (!startRest && !endRest)
      emitModel(value)
      emit('update:startValue', startRest || '')
      emit('update:endValue', endRest || '')
      if (XEUtils.toValueString(modelValue) !== value) {
        dispatchEvent('change', { value, startValue: startRest, endValue: endRest, isFinish }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        triggerEvent(evnt)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      const popupOpts = computePopupOpts.value
      const { trigger } = popupOpts
      reactData.isActivated = true
      if (!trigger || trigger === 'default') {
        dateRangePickerOpenEvent(evnt)
      } else if (trigger === 'icon') {
        hidePanel()
      }
      triggerEvent(evnt)
    }

    const clickPrefixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { selectStValue, selectEdValue } = reactData
        const value = getRangeValue(selectStValue, selectEdValue)
        dispatchEvent('prefix-click', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
      }
    }

    const hidePanel = () => {
      return new Promise<void>(resolve => {
        reactData.visiblePanel = false
        internalData.hpTimeout = setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    }

    const clearValueEvent = (evnt: Event, value: VxeDateRangePickerPropTypes.ModelValue) => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        hidePanel()
      }
      const startValue = ''
      const endValue = ''
      handleChange(startValue, endValue, evnt)
      dispatchEvent('clear', { value, startValue, endValue }, evnt)
    }

    const checkValue = () => {
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if (!startValue || !endValue) {
          handleChange('', '', { type: 'check' })
        }
      }
    }

    const panelCellClassName: VxeDatePanelPropTypes.CellClassName = ({ date }) => {
      const startValue = reactData.selectStValue
      const endValue = reactData.selectEdValue
      if (startValue && endValue) {
        const currTime = date.getTime()
        const startTime = XEUtils.toStringDate(startValue).getTime()
        const endTime = XEUtils.toStringDate(endValue).getTime()
        if (currTime >= startTime && currTime <= endTime) {
          return 'is--range-selected'
        }
      }
      return ''
    }

    const handleSelectClose = () => {
      const { autoClose } = props
      const { selectStValue, selectEdValue } = reactData
      const { selectStatus } = internalData
      const isDatePickerType = computeIsDatePickerType.value
      if (autoClose) {
        if (selectStatus && isDatePickerType) {
          if (selectStValue && selectEdValue) {
            hidePanel()
          }
        }
      } else {
        if (selectStValue && selectEdValue) {
          internalData.selectStatus = false
        }
      }
    }

    const clickSuffixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { selectStValue, selectEdValue } = reactData
        const value = getRangeValue(selectStValue, selectEdValue)
        dispatchEvent('suffix-click', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { selectStValue, selectEdValue } = reactData
      const inpImmediate = computeInpImmediate.value
      const value = ''
      if (!inpImmediate) {
        handleChange(selectStValue, selectEdValue, evnt)
      }
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
        checkValue()
      }
      dispatchEvent('blur', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    const confirmEvent = (evnt: MouseEvent) => {
      const isTimeType = computeIsTimeType.value
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if (isTimeType) {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        } else if ((startValue && !endValue) || (!startValue && endValue)) {
          handleChange('', '', evnt)
        } else {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        }
        const value = getRangeValue(startValue, endValue)
        dispatchEvent('confirm', { value, startValue, endValue }, evnt)
      }
      hidePanel()
    }

    const startPanelChangeEvent = (params: any) => {
      const { paneStartVal } = reactData
      const { selectStatus } = internalData
      const { value, currValue, $event } = params
      const paneVals = value ? (XEUtils.isString(value) ? value.split(',') : [value]) : []
      let startValue = ''
      let endValue = ''
      if (selectStatus) {
        // 如果选择同一天
        if (!value && currValue === paneStartVal[0]) {
          startValue = currValue
          endValue = currValue
        } else {
          startValue = paneVals[0]
          if (paneVals[1]) {
            endValue = paneVals[1]
          } else {
            endValue = reactData.selectEdValue
          }
        }
      } else {
        startValue = currValue || XEUtils.last(paneVals)
      }
      reactData.paneEndVal = [startValue, endValue]
      reactData.paneStartVal = [startValue, endValue]
      handleChange(startValue, endValue, $event)
      handleSelectClose()
      if (selectStatus) {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      } else {
        internalData.selectStatus = true
      }
      nextTick(() => {
        handleUpdateStartPanelDate()
      })
    }

    const endPanelChangeEvent = (params: any) => {
      const { paneEndVal } = reactData
      const { selectStatus } = internalData
      const { value, currValue, $event } = params
      const paneVals = value ? (XEUtils.isString(value) ? value.split(',') : [value]) : []
      let startValue = ''
      let endValue = ''
      if (selectStatus) {
        // 如果选择同一天
        if (!value && currValue === paneEndVal[1]) {
          startValue = currValue
          endValue = currValue
        } else {
          endValue = paneVals[0]
          if (paneVals[1]) {
            startValue = paneVals[0]
            endValue = paneVals[1]
          } else {
            startValue = reactData.selectStValue
          }
        }
      } else {
        endValue = currValue || XEUtils.last(paneVals)
      }
      reactData.paneEndVal = [startValue, endValue]
      reactData.paneStartVal = [startValue, endValue]
      handleChange(startValue, endValue, $event)
      handleSelectClose()
      if (selectStatus) {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      } else {
        internalData.selectStatus = true
      }
      nextTick(() => {
        handleUpdateEndPanelDate()
      })
    }

    const handleUpdateStartPanelDate = () => {
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if (!$startDatePanel || !$endDatePanel) {
        return
      }
      const startPanelDate = $startDatePanel.getPanelDate()
      const endPanelDate = $endDatePanel.getPanelDate()
      if (!startPanelDate || !endPanelDate) {
        return
      }
      const viewType = $startDatePanel.getViewType()
      const startYear = startPanelDate.getFullYear()
      const startMonth = startPanelDate.getMonth()
      const endYear = endPanelDate.getFullYear()
      const endMonth = endPanelDate.getMonth()
      switch (viewType) {
        case 'day':
        case 'date':
        case 'week': {
          if (endYear <= startYear && endMonth <= startMonth) {
            $endDatePanel.setPanelDate(getNextMonth(startPanelDate))
          }
          break
        }
        case 'month':
        case 'quarter': {
          if (endYear <= startYear) {
            $endDatePanel.setPanelDate(getNextYear(startPanelDate))
          }
          break
        }
        case 'year': {
          const { computeYearList } = $startDatePanel.getComputeMaps()
          const yearList = computeYearList.value
          if (yearList.some((item) => XEUtils.isDateSame(item.date, endPanelDate, 'yyyy'))) {
            $endDatePanel.setPanelDate(getNextYear(startPanelDate, yearList.length))
          }
          break
        }
      }
    }

    const startPanelDateBtnChangeEvent: VxeDatePanelEvents.DateToday = () => {
      const { linkedPanels } = props
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if (!$startDatePanel || !$endDatePanel) {
        return
      }
      const startPanelDate = $startDatePanel.getPanelDate()
      const endPanelDate = $endDatePanel.getPanelDate()
      if (!startPanelDate || !endPanelDate) {
        return
      }
      const viewType = $startDatePanel.getViewType()
      if (linkedPanels) {
        switch (viewType) {
          case 'day':
          case 'date':
          case 'week': {
            $endDatePanel.setPanelDate(getNextMonth(startPanelDate))
            break
          }
          case 'month':
          case 'quarter': {
            $endDatePanel.setPanelDate(getNextYear(startPanelDate))
            break
          }
          case 'year': {
            const { computeYearList } = $startDatePanel.getComputeMaps()
            const yearList = computeYearList.value
            $endDatePanel.setPanelDate(getNextYear(startPanelDate, yearList.length))
            break
          }
        }
      } else {
        handleUpdateStartPanelDate()
      }
    }

    const handleUpdateEndPanelDate = () => {
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if (!$startDatePanel || !$endDatePanel) {
        return
      }
      const startPanelDate = $startDatePanel.getPanelDate()
      const endPanelDate = $endDatePanel.getPanelDate()
      if (!startPanelDate || !endPanelDate) {
        return
      }
      const viewType = $endDatePanel.getViewType()
      const startYear = startPanelDate.getFullYear()
      const startMonth = startPanelDate.getMonth()
      const endYear = endPanelDate.getFullYear()
      const endMonth = endPanelDate.getMonth()
      switch (viewType) {
        case 'day':
        case 'date':
        case 'week': {
          if (startYear >= endYear && startMonth >= endMonth) {
            $startDatePanel.setPanelDate(getPrevMonth(endPanelDate))
          }
          break
        }
        case 'month':
        case 'quarter': {
          if (startYear >= endYear) {
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate))
          }
          break
        }
        case 'year': {
          const { computeYearList } = $endDatePanel.getComputeMaps()
          const yearList = computeYearList.value
          if (yearList.some((item) => XEUtils.isDateSame(item.date, startPanelDate, 'yyyy'))) {
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate, yearList.length))
          }
          break
        }
      }
    }

    const endPanelDateBtnChangeEvent: VxeDatePanelEvents.DateToday = () => {
      const { linkedPanels } = props
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if (!$startDatePanel || !$endDatePanel) {
        return
      }
      const startPanelDate = $startDatePanel.getPanelDate()
      const endPanelDate = $endDatePanel.getPanelDate()
      if (!startPanelDate || !endPanelDate) {
        return
      }
      const viewType = $endDatePanel.getViewType()
      if (linkedPanels) {
        switch (viewType) {
          case 'day':
          case 'date':
          case 'week': {
            $startDatePanel.setPanelDate(getPrevMonth(endPanelDate))
            break
          }
          case 'month':
          case 'quarter': {
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate))
            break
          }
          case 'year': {
            const { computeYearList } = $endDatePanel.getComputeMaps()
            const yearList = computeYearList.value
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate, yearList.length))
            break
          }
        }
      } else {
        handleUpdateEndPanelDate()
      }
    }

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { visiblePanel, isActivated } = reactData
      const el = refElem.value
      const panelWrapperElem = refPanelWrapper.value
      const isDisabled = computeIsDisabled.value
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          if (visiblePanel) {
            checkValue()
            hidePanel()
          }
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        if (isTab) {
          reactData.isActivated = false
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
            checkValue()
            hidePanel()
          }
        }
      }
    }

    const handleGlobalMousewheelEvent = (evnt: Event) => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        if (visiblePanel) {
          const panelWrapperElem = refPanelWrapper.value
          if (getEventTargetNode(evnt, panelWrapperElem).flag) {
            updatePlacement()
          } else {
            checkValue()
            hidePanel()
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        checkValue()
        hidePanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const targetElem = refInputTarget.value
        if (targetElem) {
          targetElem.blur()
        }
      }
    }

    const handleGlobalResizeEvent = () => {
      const { visiblePanel } = reactData
      if (visiblePanel) {
        updatePlacement()
      }
    }

    // 弹出面板
    const updateZindex = () => {
      const popupOpts = computePopupOpts.value
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = refInputTarget.value
      const panelElem = refInputPanel.value
      if (!panelElem) {
        return nextTick()
      }
      const btnTransfer = computeBtnTransfer.value
      const popupOpts = computePopupOpts.value
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement: popupOpts.placement || placement,
          defaultPlacement: popupOpts.defaultPlacement,
          teleportTo: btnTransfer
        })
        const panelStyle: { [key: string]: string | number } = Object.assign(ppObj.style, {
          zIndex: panelIndex
        })
        reactData.panelStyle = panelStyle
        reactData.panelPlacement = ppObj.placement
      }
      handleStyle()
      return nextTick().then(handleStyle)
    }

    const showPanel = () => {
      const { visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled && !visiblePanel) {
        if (!reactData.initialized) {
          reactData.initialized = true
        }
        if (internalData.hpTimeout) {
          clearTimeout(internalData.hpTimeout)
          internalData.hpTimeout = undefined
        }
        internalData.selectStatus = false
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
          handleUpdateStartPanelDate()
          updatePlacement()
        }, 10)
        updateZindex()
        return updatePlacement()
      }
      return nextTick()
    }

    const dateRangePickerOpenEvent = (evnt: Event) => {
      const formReadonly = computeFormReadonly.value
      if (!formReadonly) {
        evnt.preventDefault()
        showPanel()
      }
    }

    const clickIconEvent = (evnt: MouseEvent) => {
      const { visiblePanel } = reactData
      const popupOpts = computePopupOpts.value
      const { trigger } = popupOpts
      if (!trigger || trigger === 'default' || trigger === 'icon') {
        if (visiblePanel) {
          hidePanel()
        } else {
          dateRangePickerOpenEvent(evnt)
        }
      }
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    const handleShortcutEvent: VxeButtonGroupEvents.Click = ({ option, $event }) => {
      const { type } = props
      const shortcutOpts = computeShortcutOpts.value
      const { autoClose } = shortcutOpts
      const { code, clickMethod } = option as VxeDateRangePickerDefines.ShortcutOption
      let startValue = reactData.selectStValue
      let endValue = reactData.selectEdValue
      let value = getRangeValue(startValue, endValue)
      const shortcutParams = {
        $dateRangePicker: $xeDateRangePicker,
        option: option,
        value,
        startValue,
        endValue,
        code
      }
      if (!clickMethod && code) {
        const gCommandOpts = commands.get(code)
        const drpCommandMethod = gCommandOpts ? gCommandOpts.dateRangePickerCommandMethod : null
        if (drpCommandMethod) {
          drpCommandMethod(shortcutParams)
        } else {
          const dateValueFormat = computeDateValueFormat.value
          const firstDayOfWeek = computeFirstDayOfWeek.value
          switch (code) {
            case 'last1':
            case 'last3':
            case 'last7':
            case 'last30':
            case 'last60':
            case 'last90':
            case 'last180': {
              const restObj = getRangeDateByCode(code, value, type, {
                valueFormat: dateValueFormat,
                firstDay: firstDayOfWeek
              })
              startValue = restObj.startValue
              endValue = restObj.endValue
              value = getRangeValue(startValue, endValue)
              shortcutParams.value = value
              shortcutParams.startValue = startValue
              shortcutParams.endValue = endValue
              handleChange(startValue, endValue, $event)
              break
            }
            default:
              errLog('vxe.error.notCommands', [code])
              break
          }
        }
      } else {
        const optClickMethod = clickMethod || shortcutOpts.clickMethod
        if (optClickMethod) {
          optClickMethod(shortcutParams)
        }
      }
      if (autoClose) {
        hidePanel()
      }
      dispatchEvent('shortcut-click', shortcutParams, $event)
    }

    const dispatchEvent = (type: ValueOf<VxeDateRangePickerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $dateRangePicker: $xeDateRangePicker }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    dateRangePickerMethods = {
      dispatchEvent,

      setModelValue (startValue, endValue) {
        reactData.selectStValue = startValue || ''
        reactData.selectEdValue = endValue || ''
        const value = getRangeValue(startValue, endValue)
        emitModel(value)
      },
      setModelValueByEvent (evnt, startValue, endValue) {
        handleChange(startValue || '', endValue || '', evnt)
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

    Object.assign($xeDateRangePicker, dateRangePickerMethods)

    const renderShortcutBtn = (pos: 'top' | 'bottom' | 'left' | 'right' | 'header' | 'footer', isVertical?: boolean) => {
      const shortcutOpts = computeShortcutOpts.value
      const { position, align, mode } = shortcutOpts
      const shortcutList = computeShortcutList.value
      if (isEnableConf(shortcutOpts) && shortcutList.length && (position || 'left') === pos) {
        return h('div', {
          class: `vxe-date-range-picker--layout-${pos}-wrapper`
        }, [
          h(VxeButtonGroupComponent, {
            options: shortcutList,
            mode,
            align,
            vertical: isVertical,
            onClick: handleShortcutEvent
          })
        ])
      }
      return renderEmptyElement($xeDateRangePicker)
    }

    const renderPanel = () => {
      const popupOpts = computePopupOpts.value
      if (popupOpts.enabled === false) {
        return renderEmptyElement($xeDateRangePicker)
      }
      const { type, separator, autoClose, valueFormat, showConfirmButton, showClearButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, selectStValue, selectEdValue, paneStartVal, paneEndVal } = reactData
      const vSize = computeSize.value
      const btnTransfer = computeBtnTransfer.value
      const shortcutOpts = computeShortcutOpts.value
      const isClearable = computeIsClearable.value
      const panelLabelObj = computePanelLabelObj.value
      const shortcutList = computeShortcutList.value
      const isTimeType = computeIsTimeType.value
      const isTimeOrDateTimeType = computeIsTimeOrDateTimeType.value
      const defaultDates = computeDefaultDates.value
      const defaultTimes = computeDefaultTimes.value
      const timeOpts = computeTimeOpts.value
      const { appendTo } = popupOpts
      const { startLabel, endLabel } = panelLabelObj
      const { position } = shortcutOpts
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const topSlot = slots.top
      const bottomSlot = slots.bottom
      const leftSlot = slots.left
      const rightSlot = slots.right
      const ppClassName = popupOpts.className
      const [sdDate, edDate] = defaultDates
      const [sdTime, edTime] = defaultTimes
      const hasShortcutBtn = shortcutList.length > 0
      const showConfirmBtn = (showConfirmButton === null ? (isTimeOrDateTimeType || !autoClose) : showConfirmButton)
      const showClearBtn = (showClearButton === null ? isClearable : showClearButton)
      return h(Teleport, {
        to: getPopupContainer(appendTo),
        disabled: btnTransfer ? !initialized : true
      }, [
        h('div', {
          ref: refInputPanel,
          class: ['vxe-table--ignore-clear vxe-date-range-picker--panel', `type--${type}`, ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $dateRangePicker: $xeDateRangePicker }) : ppClassName) : '', {
            [`size--${vSize}`]: vSize,
            'is--transfer': btnTransfer,
            'ani--leave': isAniVisible,
            'ani--enter': visiblePanel,
            'show--top': !!(topSlot || headerSlot || (hasShortcutBtn && (position === 'top' || position === 'header'))),
            'show--bottom': !!(bottomSlot || footerSlot || (hasShortcutBtn && (position === 'bottom' || position === 'footer'))),
            'show--left': !!(leftSlot || (hasShortcutBtn && position === 'left')),
            'show--right': !!(rightSlot || (hasShortcutBtn && position === 'right'))
          }],
          placement: panelPlacement,
          style: panelStyle
        }, initialized && (visiblePanel || isAniVisible)
          ? [
              h('div', {
                ref: refPanelWrapper,
                class: ['vxe-date-range-picker--layout-all-wrapper', `type--${type}`, {
                  [`size--${vSize}`]: vSize
                }]
              }, [
                topSlot
                  ? h('div', {
                    class: 'vxe-date-range-picker--layout-top-wrapper'
                  }, topSlot({}))
                  : renderShortcutBtn('top'),
                h('div', {
                  class: 'vxe-date-range-picker--layout-body-layout-wrapper'
                }, [
                  leftSlot
                    ? h('div', {
                      class: 'vxe-date-range-picker--layout-left-wrapper'
                    }, leftSlot({}))
                    : renderShortcutBtn('left', true),
                  h('div', {
                    class: 'vxe-date-range-picker--layout-body-content-wrapper'
                  }, [
                    headerSlot
                      ? h('div', {
                        class: 'vxe-date-range-picker--layout-header-wrapper'
                      }, headerSlot({}))
                      : renderShortcutBtn('header'),
                    h('div', {
                      class: 'vxe-date-range-picker--layout-body-wrapper'
                    }, [
                      h(VxeDatePanelComponent, {
                        ref: refStartDatePanel,
                        modelValue: paneStartVal,
                        multiple: !isTimeType,
                        valueSort: true,
                        limitCount: 3,
                        defaultMode: 'first',
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: valueFormat === 'date' || valueFormat === 'timestamp' ? '' : valueFormat,
                        timeFormat: props.timeFormat,
                        defaultDate: sdDate,
                        defaultTime: sdTime,
                        timeConfig: timeOpts,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay,
                        cellClassName: panelCellClassName,
                        onChange: startPanelChangeEvent,
                        onDatePrev: startPanelDateBtnChangeEvent,
                        onDateToday: startPanelDateBtnChangeEvent,
                        onDateNext: startPanelDateBtnChangeEvent
                      }),
                      h(VxeDatePanelComponent, {
                        ref: refEndDatePanel,
                        modelValue: paneEndVal,
                        multiple: !isTimeType,
                        valueSort: true,
                        limitCount: 3,
                        defaultMode: 'last',
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: valueFormat === 'date' || valueFormat === 'timestamp' ? '' : valueFormat,
                        timeFormat: props.timeFormat,
                        defaultDate: edDate,
                        defaultTime: edTime,
                        timeConfig: timeOpts,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay,
                        cellClassName: panelCellClassName,
                        onChange: endPanelChangeEvent,
                        onDatePrev: endPanelDateBtnChangeEvent,
                        onDateToday: endPanelDateBtnChangeEvent,
                        onDateNext: endPanelDateBtnChangeEvent
                      })
                    ]),
                    h('div', {
                      class: 'vxe-date-range-picker--layout-footer-wrapper'
                    }, [
                      h('div', {
                        class: 'vxe-date-range-picker--layout-footer-label'
                      }, startLabel || endLabel
                        ? [
                            h('span', startLabel),
                            h('span', `${separator || ''}`),
                            h('span', endLabel)
                          ]
                        : `${separator || ''}`),
                      h('div', {
                        class: 'vxe-date-range-picker--layout-footer-custom'
                      }, footerSlot ? footerSlot({}) : [renderShortcutBtn('footer')]),
                      h('div', {
                        class: 'vxe-date-range-picker--layout-footer-btns'
                      }, [
                        showClearBtn
                          ? h(VxeButtonComponent, {
                            size: 'mini',
                            disabled: !(selectStValue || selectEdValue),
                            content: getI18n('vxe.button.clear'),
                            onClick: clearValueEvent
                          })
                          : renderEmptyElement($xeDateRangePicker),
                        showConfirmBtn
                          ? h(VxeButtonComponent, {
                            size: 'mini',
                            status: 'primary',
                            content: getI18n('vxe.button.confirm'),
                            onClick: confirmEvent
                          })
                          : renderEmptyElement($xeDateRangePicker)
                      ])
                    ])
                  ]),
                  rightSlot
                    ? h('div', {
                      class: 'vxe-date-range-picker--layout-right-wrapper'
                    }, rightSlot({}))
                    : renderShortcutBtn('right', true)
                ]),
                bottomSlot
                  ? h('div', {
                    class: 'vxe-date-range-picker--layout-bottom-wrapper'
                  }, bottomSlot({}))
                  : renderShortcutBtn('bottom')
              ])
            ]
          : [])
      ])
    }

    const renderPrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-date-range-picker--prefix',
          onClick: clickPrefixEvent
        }, [
          h('div', {
            class: 'vxe-date-range-picker--prefix-icon'
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
      const { suffixIcon } = props
      const { selectStValue, selectEdValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = computeIsDisabled.value
      const isClearable = computeIsClearable.value
      return h('div', {
        class: ['vxe-date-range-picker--suffix', {
          'is--clear': isClearable && !isDisabled && (selectStValue || selectEdValue)
        }]
      }, [
        isClearable
          ? h('div', {
            class: 'vxe-date-range-picker--clear-icon',
            onClick: clearValueEvent
          }, [
            h('i', {
              class: getIcon().INPUT_CLEAR
            })
          ])
          : renderEmptyElement($xeDateRangePicker),
        renderExtraSuffixIcon(),
        suffixSlot || suffixIcon
          ? h('div', {
            class: 'vxe-date-range-picker--suffix-icon',
            onClick: clickSuffixEvent
          }, suffixSlot
            ? getSlotVNs(suffixSlot({}))
            : [
                h('i', {
                  class: suffixIcon
                })
              ])
          : renderEmptyElement($xeDateRangePicker)
      ])
    }

    const renderExtraSuffixIcon = () => {
      return h('div', {
        class: 'vxe-date-range-picker--control-icon',
        onClick: clickIconEvent
      }, [
        h('i', {
          class: ['vxe-date-range-picker--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    }

    const renderVN = () => {
      const { className, type, name, autoComplete } = props
      const { selectStValue, selectEdValue, visiblePanel, isActivated } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const inputLabel = computeInputLabel.value
      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-date-range-picker--readonly', `type--${type}`, className]
        }, inputLabel)
      }
      const inpPlaceholder = computeInpPlaceholder.value
      const isClearable = computeIsClearable.value
      const prefix = renderPrefixIcon()
      const suffix = renderSuffixIcon()
      return h('div', {
        ref: refElem,
        class: ['vxe-date-range-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && (selectStValue || selectEdValue)
        }],
        spellcheck: false
      }, [
        prefix || renderEmptyElement($xeDateRangePicker),
        h('div', {
          class: 'vxe-date-range-picker--wrapper'
        }, [
          h('input', {
            ref: refInputTarget,
            class: 'vxe-date-range-picker--inner',
            value: inputLabel,
            name,
            type: 'text',
            placeholder: inpPlaceholder,
            editable: false,
            disabled: isDisabled,
            autocomplete: autoComplete,
            onKeydown: keydownEvent,
            onKeyup: keyupEvent,
            onClick: clickEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent
          })
        ]),
        suffix || renderEmptyElement($xeDateRangePicker),
        // 下拉面板
        renderPanel()
      ])
    }

    watch(() => props.modelValue, () => {
      updateModelValue(true)
    })

    watch(computeMVal, () => {
      updateModelValue(false)
    })

    updateModelValue(true)

    nextTick(() => {
      globalEvents.on($xeDateRangePicker, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeDateRangePicker, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeDateRangePicker, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeDateRangePicker, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeDateRangePicker, 'resize', handleGlobalResizeEvent)
    })

    onDeactivated(() => {
      checkValue()
    })

    onBeforeUnmount(() => {
      checkValue()
    })

    onUnmounted(() => {
      globalEvents.off($xeDateRangePicker, 'mousewheel')
      globalEvents.off($xeDateRangePicker, 'mousedown')
      globalEvents.off($xeDateRangePicker, 'blur')
      globalEvents.off($xeDateRangePicker, 'resize')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    provide('$xeDateRangePicker', $xeDateRangePicker)

    $xeDateRangePicker.renderVN = renderVN

    return $xeDateRangePicker
  },
  render () {
    return this.renderVN()
  }
})
