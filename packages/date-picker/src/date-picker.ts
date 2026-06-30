import { h, Teleport, ref, Ref, computed, provide, reactive, inject, nextTick, watch, PropType, onUnmounted, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, createEvent, globalEvents, GLOBAL_EVENT_KEYS, useSize, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode, hasControlKey } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { parseDateObj, parseDateValue, getDateByCode, handleValueFormat, hasDateValueType, hasTimestampValueType, isAllSameChar, getChunkDefaultNum, checkDateInputFormat } from '../../date-panel/src/util'
import { createComponentLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel/src/date-panel'
import VxeButtonComponent from '../../button/src/button'
import VxeButtonGroupComponent from '../../button/src/button-group'

import type { VxeDatePickerConstructor, VxeDatePickerEmits, DatePickerInternalData, DatePickerReactData, DatePickerMethods, VxeDatePanelDefines, VxeDatePickerPropTypes, DatePickerPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDatePickerDefines, VxeButtonGroupEvents, VxeDatePanelConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

const { warnLog, errLog } = createComponentLog('date-picker')

const defaultMaskPlaceholder = '_'
const maskedTypes = ['year', 'month', 'date', 'datetime', 'time']
const inputMaskedKeys = ['y', 'M', 'd', 'H', 'm', 'n', 's']
const parseInputKayMaps: Record<string, boolean> = {}
inputMaskedKeys.forEach(key => {
  parseInputKayMaps[key] = true
})

function createReactData (): DatePickerReactData {
  return {
    initialized: false,
    panelIndex: 0,
    visiblePanel: false,
    isAniVisible: false,
    panelStyle: {},
    panelPlacement: '',
    isActivated: false,
    inputValue: '',
    labelFlag: 0
  }
}

function createInternalData (): DatePickerInternalData {
  return {
    // hpTimeout: undefined,
    // fsTimeout: undefined,
    inputLabel: '',
    laseFocusMasked: 0
  }
}

export default defineVxeComponent({
  name: 'VxeDatePicker',
  props: {
    modelValue: [String, Number, Date] as PropType<VxeDatePickerPropTypes.ModelValue>,
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
    autoComplete: {
      type: String as PropType<VxeDatePickerPropTypes.AutoComplete>,
      default: 'off'
    },
    form: String as PropType<VxeDatePickerPropTypes.Form>,
    className: String as PropType<VxeDatePickerPropTypes.ClassName>,
    zIndex: Number as PropType<VxeDatePickerPropTypes.ZIndex>,
    size: {
      type: String as PropType<VxeDatePickerPropTypes.Size>,
      default: () => getConfig().datePicker.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeDatePickerPropTypes.Multiple>,
    limitCount: {
      type: [String, Number] as PropType<VxeDatePickerPropTypes.LimitCount>,
      default: () => getConfig().datePicker.limitCount
    },

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.StartDate>,
      default: () => getConfig().datePicker.startDate
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.EndDate>,
      default: () => getConfig().datePicker.endDate
    },
    defaultDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.DefaultDate>,
    defaultTime: [String, Number, Date] as PropType<VxeDatePickerPropTypes.DefaultTime>,
    minDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>,
    startDay: {
      type: [String, Number] as PropType<VxeDatePickerPropTypes.StartDay>,
      default: () => getConfig().datePicker.startDay
    },
    labelFormat: String as PropType<VxeDatePickerPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeDatePickerPropTypes.ValueFormat>,
    timeFormat: String as PropType<VxeDatePickerPropTypes.TimeFormat>,
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
    showClearButton: {
      type: Boolean as PropType<VxeDatePickerPropTypes.ShowClearButton>,
      default: () => getConfig().datePicker.showClearButton
    },
    showConfirmButton: {
      type: Boolean as PropType<VxeDatePickerPropTypes.ShowConfirmButton>,
      default: () => getConfig().datePicker.showConfirmButton
    },
    autoClose: {
      type: Boolean as PropType<VxeDatePickerPropTypes.AutoClose>,
      default: () => getConfig().datePicker.autoClose
    },
    maskedConfig: Object as PropType<VxeDatePickerPropTypes.MaskedConfig>,

    prefixIcon: String as PropType<VxeDatePickerPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeDatePickerPropTypes.SuffixIcon>,
    placement: String as PropType<VxeDatePickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Transfer>,
      default: null
    },

    timeConfig: Object as PropType<VxeDatePickerPropTypes.TimeConfig>,
    popupConfig: Object as PropType<VxeDatePickerPropTypes.PopupConfig>,
    shortcutConfig: Object as PropType<VxeDatePickerPropTypes.ShortcutConfig>,

    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeDatePickerPropTypes.StartDay>
  },
  emits: [
    'update:modelValue',
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
  ] as VxeDatePickerEmits,
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

    const refDatePanel = ref<VxeDatePanelConstructor>()

    const refMaps: DatePickerPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeDatePicker = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeDatePickerConstructor

    const computeBtnTransfer = computed(() => {
      const { transfer } = props
      const popupOpts = computePopupOpts.value
      if (XEUtils.isBoolean(popupOpts.transfer)) {
        return popupOpts.transfer
      }
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

    const computeIsDatePanelType = computed(() => {
      const isDateTimeType = computeIsDateTimeType.value
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    })

    const computeDateListValue = computed(() => {
      const { modelValue, type, multiple } = props
      const isDatePanelType = computeIsDatePanelType.value
      const dateValueFormat = computeDateValueFormat.value
      if (multiple && modelValue && isDatePanelType) {
        return XEUtils.toValueString(modelValue).split(',').map(item => {
          const date = parseDateValue(item, type, {
            valueFormat: dateValueFormat
          })
          if (XEUtils.isValidDate(date)) {
            return date
          }
          return date
        })
      }
      return []
    })

    const computeDateStartDate = computed(() => {
      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    })

    const computeDateEndDate = computed(() => {
      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    })

    const computeLimitMaxCount = computed(() => {
      return props.multiple ? XEUtils.toNumber(props.limitCount) : 0
    })

    const computeDateMultipleValue = computed(() => {
      const dateListValue = computeDateListValue.value
      const dateValueFormat = computeDateValueFormat.value
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    })

    const computeOverCount = computed(() => {
      const { multiple } = props
      const limitMaxCount = computeLimitMaxCount.value
      const dateMultipleValue = computeDateMultipleValue.value
      if (multiple && limitMaxCount) {
        return dateMultipleValue.length >= limitMaxCount
      }
      return false
    })

    const computeInputReadonly = computed(() => {
      const { type, editable, multiple } = props
      const formReadonly = computeFormReadonly.value
      return formReadonly || multiple || !editable || type === 'week' || type === 'quarter'
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().datePicker.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseSelect')
    })

    const computeInpImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    const computeTimeOpts = computed(() => {
      return Object.assign({}, getConfig().datePicker.timeConfig, props.timeConfig)
    })

    const computePopupOpts = computed(() => {
      return Object.assign({}, getConfig().datePicker.popupConfig, props.popupConfig)
    })

    const computeShortcutOpts = computed(() => {
      return Object.assign({}, getConfig().datePicker.shortcutConfig, props.shortcutConfig)
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

    const computeDateMaskedFormat = computed(() => {
      const dateLabelFormat = computeDateLabelFormat.value
      return dateLabelFormat
    })

    const computeFirstDayOfWeek = computed(() => {
      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeDatePickerPropTypes.StartDay
    })

    const computePanelLabel = computed(() => {
      const { type, multiple } = props
      const { inputValue } = reactData
      const dateLabelFormat = computeDateLabelFormat.value
      const dateValueFormat = computeDateValueFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      const vals: string[] = inputValue ? (multiple ? inputValue.split(',') : [inputValue]) : []
      return vals.map(val => {
        const dateObj = parseDateObj(val, type, {
          valueFormat: dateValueFormat,
          labelFormat: dateLabelFormat,
          firstDay: firstDayOfWeek
        })
        return dateObj.label
      }).join(', ')
    })

    const computeMaskedOpts = computed(() => {
      return Object.assign({}, getConfig().datePicker.maskedConfig, props.maskedConfig)
    })

    const computeMaskChar = computed(() => {
      const maskedOpts = computeMaskedOpts.value
      const { maskPlaceholder } = maskedOpts
      return (maskPlaceholder ? ('' + maskPlaceholder)[0] : '') || defaultMaskPlaceholder
    })

    const updateModelValue = () => {
      const { modelValue } = props
      let val: any = ''
      if (modelValue) {
        if (XEUtils.isNumber(modelValue) && /^[0-9]{11,15}$/.test(`${modelValue}`)) {
          val = new Date(modelValue)
        } else {
          val = modelValue
        }
      }
      reactData.inputValue = val
    }

    const handleInputLabel = (text: string, isUpdate?: boolean) => {
      internalData.inputLabel = text
      if (isUpdate) {
        reactData.labelFlag++
      }
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const handleChange = (value: string | number | Date, evnt: Event | { type: string }) => {
      const { type, modelValue, valueFormat } = props
      const dateValueFormat = computeDateValueFormat.value
      reactData.inputValue = value
      if (hasTimestampValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        const timeNum = dateVal ? dateVal.getTime() : null
        emit('update:modelValue', timeNum)
        if (modelValue !== timeNum) {
          dispatchEvent('change', { value: timeNum }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, timeNum)
          }
        }
      } else if (hasDateValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        emit('update:modelValue', dateVal)
        if (modelValue && dateVal ? XEUtils.toStringDate(modelValue).getTime() !== dateVal.getTime() : modelValue !== dateVal) {
          dispatchEvent('change', { value: dateVal }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, dateVal)
          }
        }
      } else {
        emit('update:modelValue', value)
        if (XEUtils.toValueString(modelValue) !== value) {
          dispatchEvent('change', { value }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      handleInputLabel(value, true)
      dispatchEvent('input', { value }, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        triggerEvent(evnt)
      }
    }

    const clickPrefixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        dispatchEvent('prefix-click', { value: inputValue }, evnt)
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

    const dateChange = (date: Date, isReload?: boolean) => {
      const { modelValue, multiple } = props
      const isDateTimeType = computeIsDateTimeType.value
      const dateValueFormat = computeDateValueFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeDatePickerPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      if (multiple) {
        const overCount = computeOverCount.value
        // 如果为多选
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = isReload ? [] : [...computeDateListValue.value]
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
              datetimeRest.push(item)
            }
          })
          handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          const dateMultipleValue = isReload ? [] : computeDateMultipleValue.value
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            if (overCount) {
              // 如果超出最大多选数量
              return
            }
            handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(modelValue, inpVal)) {
          handleChange(inpVal, { type: 'update' })
        }
      }
    }

    const dateRevert = () => {
      const panelLabel = computePanelLabel.value
      handleInputLabel(panelLabel, true)
    }

    const afterCheckValue = (inpVal: string) => {
      const { type, editable, multiple, maskedConfig } = props
      const { inputLabel } = internalData
      const dateLabelFormat = computeDateLabelFormat.value
      const maskedOpts = computeMaskedOpts.value
      const dateStartDate = computeDateStartDate.value
      const dateEndDate = computeDateEndDate.value
      if (!inpVal) {
        handleChange('', { type: 'check' })
        return
      }
      // 掩码格式处理
      if (editable && !multiple && (isEnableConf(maskedConfig) || maskedOpts.enabled)) {
        const allMaskedKeys = dateLabelFormat.match(new RegExp(`(${inputMaskedKeys.join('|')})+`, 'g'))
        if (allMaskedKeys) {
          allMaskedKeys.forEach(formatKey => {
            const fkIndex = dateLabelFormat.indexOf(formatKey)
            if (fkIndex > -1) {
              const valStr = inpVal.slice(fkIndex, fkIndex + formatKey.length).replace(/\D/g, '')
              if (!valStr) {
                return
              }
              let valNum = XEUtils.toNumber(valStr)
              // 自动纠错最小值
              if (!valNum && ['MM', 'dd'].includes(formatKey)) {
                valNum = 1
              }
              inpVal = inpVal.slice(0, fkIndex) + XEUtils.padStart(checkDateInputFormat(valNum, formatKey), formatKey.length, '0') + inpVal.slice(fkIndex + formatKey.length)
            }
          })
        }
      }

      const $datePanel = refDatePanel.value
      if ($datePanel) {
        return $datePanel.checkValue(inpVal)
      }

      let inpDateVal: VxeDatePickerPropTypes.ModelValue = parseDateValue(inpVal, type, {
        valueFormat: dateLabelFormat
      })
      if (!XEUtils.isValidDate(inpDateVal)) {
        dateRevert()
        return
      }
      if (type === 'time') {
        inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
        if (inputLabel !== inpDateVal) {
          handleChange(inpDateVal, { type: 'check' })
        }
        handleInputLabel(inpDateVal, true)
        return
      }
      if (dateEndDate && inpDateVal > dateEndDate) {
        inpDateVal = dateEndDate
      }
      if (dateStartDate && inpDateVal < dateStartDate) {
        inpDateVal = dateStartDate
      }
      let isChange = false
      const firstDayOfWeek = computeFirstDayOfWeek.value
      if (type === 'datetime') {
        const dateValue = reactData.inputValue
        if (inpVal !== XEUtils.toDateString(dateValue, dateLabelFormat) || inpVal !== XEUtils.toDateString(inpDateVal, dateLabelFormat)) {
          isChange = true
        }
      } else {
        isChange = true
      }
      const label = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
      handleInputLabel(label, true)
      if (isChange) {
        dateChange(inpDateVal)
      }
    }

    const clearValueEvent = (evnt: Event, value: VxeDatePickerPropTypes.ModelValue) => {
      const isDatePickerType = computeIsDatePickerType.value
      if (isDatePickerType) {
        hidePanel()
      }
      handleChange('', evnt)
      dispatchEvent('clear', { value }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    }

    const checkMaskedInputValue = (numStr: string, chunkFormat: string, isFull: boolean) => {
      const maskedOpts = computeMaskedOpts.value
      const { align } = maskedOpts
      const maskChar = computeMaskChar.value
      const numVal = XEUtils.toNumber(numStr)
      let restVal = checkDateInputFormat(numVal, chunkFormat)
      if (isFull) {
        // 自动纠错最小值
        if (!restVal && ['MM', 'dd'].includes(chunkFormat)) {
          restVal = 1
        }
      }
      let restStr = '' + restVal
      if (numStr.length > restStr.length) {
        restStr = restStr.padStart(numStr.length, '0')
      }
      if (isFull) {
        return XEUtils.padStart(restStr, chunkFormat.length, '0')
      }
      return XEUtils[align === 'right' ? 'padStart' : 'padEnd'](restStr, chunkFormat.length, maskChar)
    }

    const handleArrowInputDate = (evnt: KeyboardEvent, isUpArrow: boolean, isDwArrow: boolean, isLtArrow: boolean, isRtArrow: boolean) => {
      const { type, multiple } = props
      if (multiple) {
        return
      }
      const targetElem = refInputTarget.value
      if (!targetElem) {
        return
      }
      const inpValue = targetElem.value
      if (!inpValue) {
        return
      }
      const dateMaskedFormat = computeDateMaskedFormat.value
      const dateLabelFormat = computeDateLabelFormat.value
      const firstDayOfWeek = computeFirstDayOfWeek.value
      const maskChar = computeMaskChar.value
      const selectionStart = targetElem.selectionStart || 0
      let selectKey = dateMaskedFormat[selectionStart]
      if (!parseInputKayMaps[selectKey]) {
        selectKey = dateMaskedFormat[selectionStart - 1]
      }
      const skRest = dateMaskedFormat.match(new RegExp(selectKey + '+'))
      if (!skRest) {
        return
      }
      if (isUpArrow || isDwArrow) {
        const chunkFormat = skRest[0] || ''
        const chunkStartIndex = skRest.index || 0
        const chunkEndIndex = chunkStartIndex + chunkFormat.length
        const chunkValue = inpValue.slice(chunkStartIndex, chunkEndIndex)
        if (parseInputKayMaps[selectKey]) {
          const chunkNum = (isAllSameChar(chunkValue, maskChar) ? getChunkDefaultNum(selectKey) : XEUtils.toNumber(chunkValue)) + (isUpArrow ? 1 : -1)
          const restValue = inpValue.slice(0, chunkStartIndex) + checkMaskedInputValue('' + chunkNum, chunkFormat, true) + inpValue.slice(chunkEndIndex)
          evnt.preventDefault()
          if (restValue.indexOf(maskChar) === -1) {
            // 解析日期
            const inpDateVal: VxeDatePickerPropTypes.ModelValue = parseDateValue(restValue, type, {
              valueFormat: dateLabelFormat
            })
            if (XEUtils.isValidDate(inpDateVal)) {
              const label = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
              targetElem.value = label
              handleInputLabel(label, false)
            }
          } else {
            targetElem.value = restValue
            handleInputLabel(restValue, false)
          }
        }
        targetElem.setSelectionRange(chunkStartIndex, chunkEndIndex)
      } else if (isLtArrow || isRtArrow) {
        const currKeyIndex = inputMaskedKeys.indexOf(selectKey)
        if (currKeyIndex > -1) {
          const allMaskedKeys = XEUtils.map(dateMaskedFormat.match(new RegExp(`(${inputMaskedKeys.join('|')})+`, 'g')) || [], fullKey => fullKey[0])
          const currIndex = XEUtils.findIndexOf(allMaskedKeys, key => selectKey === key[0])
          const targetFormatKey = isLtArrow ? (allMaskedKeys[currIndex - 1] || allMaskedKeys[0]) : (allMaskedKeys[currIndex + 1] || allMaskedKeys[allMaskedKeys.length - 1])

          const targetKey = targetFormatKey ? targetFormatKey[0] : ''
          const sktRest = dateMaskedFormat.match(new RegExp(targetKey + '+'))
          if (sktRest) {
            evnt.preventDefault()
            const mtStartIndex = sktRest.index || 0
            const mtEndIndex = mtStartIndex + sktRest[0].length
            targetElem.setSelectionRange(mtStartIndex, mtEndIndex)
          }
        }
      }
      internalData.isTriggerMasked = true
    }

    const handleMaskedInputDate = (evnt: KeyboardEvent) => {
      const { multiple } = props
      if (multiple) {
        return
      }
      const targetElem = refInputTarget.value
      if (!targetElem) {
        return
      }
      const isControlKey = hasControlKey(evnt)
      if (isControlKey) {
        return
      }
      evnt.preventDefault()
      const eKey = evnt.key
      const isDeleleKey = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
      const isBackspaceKey = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.BACKSPACE)
      const isNumKey = eKey >= '0' && eKey <= '9'
      const numKey = isNumKey ? evnt.key : ''
      if (!(isDeleleKey || isBackspaceKey || isNumKey)) {
        return
      }
      const { isTriggerMasked } = internalData
      const maskedOpts = computeMaskedOpts.value
      const { align } = maskedOpts
      const dateMaskedFormat = computeDateMaskedFormat.value
      const maskChar = computeMaskChar.value
      let inpValue = targetElem.value || dateMaskedFormat
      const selectionStart = targetElem.selectionStart || 0
      const selectionEnd = targetElem.selectionEnd || 0
      let selectKey = dateMaskedFormat[selectionStart]
      if (!parseInputKayMaps[selectKey]) {
        selectKey = dateMaskedFormat[selectionStart - 1]
      }
      const skRest = dateMaskedFormat.match(new RegExp(selectKey + '+'))
      if (!skRest) {
        return
      }
      const allMaskedKeys = XEUtils.map(dateMaskedFormat.match(new RegExp(`(${inputMaskedKeys.join('|')})+`, 'g')) || [], fullKey => fullKey[0])
      const chunkFormat = skRest[0] || ''
      const chunkStartIndex = skRest.index || 0
      const chunkEndIndex = chunkStartIndex + chunkFormat.length
      const currKeyIndex = allMaskedKeys.indexOf(selectKey)
      // 全选 | 如果无效字符
      const isAllSelected = !selectionStart && selectionEnd === inpValue.length && allMaskedKeys.length > 1
      const isNotMasked = inpValue && inpValue.length !== dateMaskedFormat.length
      if (isAllSelected || isNotMasked) {
        inpValue = dateMaskedFormat
      }
      let chunkValue = isDeleleKey ? '' : inpValue.slice(chunkStartIndex, chunkEndIndex)
      const chunkNums = (chunkValue.match(/\d/g) || [])
      const chunkNumList: string[] = isTriggerMasked && !isBackspaceKey ? [] : chunkNums.slice(0)

      if (isNumKey) {
        chunkNumList.push(numKey)
        chunkValue = checkMaskedInputValue(chunkNumList.join(''), chunkFormat, false)
      } else if (isBackspaceKey) {
        chunkNumList.pop()
        chunkValue = XEUtils[align === 'right' ? 'padStart' : 'padEnd'](chunkNumList.join(''), chunkFormat.length, maskChar)
      }
      let restValue = inpValue.slice(0, chunkStartIndex) + chunkValue + inpValue.slice(chunkEndIndex)
      restValue = restValue.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), maskChar)

      targetElem.value = restValue
      handleInputLabel(restValue, false)

      // 如果是全选/删除
      if (isAllSelected) {
        if (isBackspaceKey || isDeleleKey) {
          const firstMaskedKeys = allMaskedKeys[0]
          const firstSkRest = dateMaskedFormat.match(new RegExp(`${firstMaskedKeys}+`))
          if (firstSkRest) {
            const firstChunkFormat = firstSkRest[0]
            targetElem.setSelectionRange(0, firstChunkFormat.length)
            internalData.isTriggerMasked = true
            return
          }
        }
      } else {
        if (isBackspaceKey && !chunkNums.length) {
          // 回退到上一个数字块
          for (let i = currKeyIndex - 1; i >= 0; i--) {
            const prveChunkKey = allMaskedKeys[i]
            const prveSkRest = dateMaskedFormat.match(new RegExp(`${prveChunkKey}+`))
            if (prveSkRest) {
              const prveChunkFormat = prveSkRest[0]
              const prveChunkStartIndex = prveSkRest.index || 0
              const prveChunkEndIndex = prveChunkStartIndex + prveChunkFormat.length
              let prveChunkValue = restValue.slice(prveChunkStartIndex, prveChunkEndIndex)
              const prveChunkNums = (prveChunkValue.match(/\d/g) || [])
              if (prveChunkNums.length) {
                prveChunkNums.pop()
                prveChunkValue = XEUtils[align === 'right' ? 'padStart' : 'padEnd'](prveChunkNums.join(''), prveChunkFormat.length, maskChar)
                restValue = restValue.slice(0, prveChunkStartIndex) + prveChunkValue + restValue.slice(prveChunkEndIndex)

                targetElem.value = restValue
                handleInputLabel(restValue, false)
                targetElem.setSelectionRange(prveChunkStartIndex, prveChunkEndIndex)
                return
              }
            }
          }
          const firstMaskedKeys = allMaskedKeys[0]
          const firstSkRest = dateMaskedFormat.match(new RegExp(`${firstMaskedKeys}+`))
          if (firstSkRest) {
            const firstChunkFormat = firstSkRest[0]
            restValue = dateMaskedFormat.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), maskChar)
            targetElem.value = restValue
            handleInputLabel(restValue, false)
            targetElem.setSelectionRange(0, firstChunkFormat.length)
            internalData.isTriggerMasked = true
            return
          }
          return
        }
      }
      let maskStartIndex = skRest.index || 0
      let maskEndIndex = maskStartIndex + skRest[0].length

      // 如果输入完成，跳转下一个
      if (chunkNumList.length >= chunkValue.length) {
        const nextKeys = allMaskedKeys.slice(currKeyIndex + 1)
        if (currKeyIndex > -1) {
          const nextRest = nextKeys.length ? dateMaskedFormat.match(new RegExp(`(${nextKeys.join('|')})+`)) : null
          // 如果当前数字块已输入，则跳转下一个数字块
          if (nextRest) {
            maskStartIndex = nextRest.index || 0
            maskEndIndex = maskStartIndex + nextRest[0].length
            targetElem.setSelectionRange(maskStartIndex, maskEndIndex)
          } else {
            targetElem.setSelectionRange(maskStartIndex, maskEndIndex)
          }
        }
        internalData.isTriggerMasked = true
        return
      }
      targetElem.setSelectionRange(maskStartIndex, maskEndIndex)
      internalData.isTriggerMasked = false
    }

    const handleMaskedSelectedDate = (evnt: Event, isFocus?: boolean) => {
      internalData.fsTimeout = undefined
      const { type, multiple, modelValue } = props
      if (multiple) {
        return
      }
      if (!maskedTypes.includes(type)) {
        return
      }
      const targetElem = refInputTarget.value
      if (!targetElem) {
        return
      }
      const { laseFocusMasked } = internalData
      if (laseFocusMasked && Date.now() - laseFocusMasked < 100) {
        return
      }
      const dateMaskedFormat = computeDateMaskedFormat.value
      const maskChar = computeMaskChar.value
      const selectionStart = targetElem.selectionStart || 0
      const selectionEnd = targetElem.selectionEnd || 0
      const inpValue = targetElem.value
      const allMaskedKeys = XEUtils.map(dateMaskedFormat.match(new RegExp(`(${inputMaskedKeys.join('|')})+`, 'g')) || [], fullKey => fullKey[0])

      // 如果为空
      if (!inpValue) {
        let restValue = dateMaskedFormat.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), maskChar)

        // 还原值
        if (isFocus && modelValue) {
          const chunkNums = (('' + XEUtils.toNumber(modelValue)).match(/\d/g) || [])
          let useNumIndex = 0
          restValue = dateMaskedFormat.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), (txt) => chunkNums[useNumIndex++] || txt)
        }

        const firstMaskedKeys = allMaskedKeys[0]
        const firstSkRest = dateMaskedFormat.match(new RegExp(`${firstMaskedKeys}+`))
        if (firstSkRest) {
          evnt.preventDefault()
          const firstChunkFormat = firstSkRest[0]
          targetElem.value = restValue
          handleInputLabel(restValue, false)
          targetElem.setSelectionRange(0, firstChunkFormat.length)
          internalData.laseFocusMasked = Date.now()
          return
        }
      }

      // 全选 | 如果无效字符
      const isAllSelected = !selectionStart && selectionEnd === inpValue.length && allMaskedKeys.length > 1
      const isNotMasked = inpValue && inpValue.length !== dateMaskedFormat.length
      if (isAllSelected || isNotMasked) {
        let restValue = ''
        // 还原值
        if (isNotMasked && inpValue) {
          const chunkNums = inpValue.match(/\d/g) || []
          let useNumIndex = 0
          restValue = dateMaskedFormat.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), () => chunkNums[useNumIndex++] || maskChar)
        } else {
          dateMaskedFormat.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), maskChar)
        }

        const firstMaskedKeys = allMaskedKeys[0]
        const firstSkRest = dateMaskedFormat.match(new RegExp(`${firstMaskedKeys}+`))
        if (firstSkRest) {
          evnt.preventDefault()
          const firstChunkFormat = firstSkRest[0]
          targetElem.value = restValue
          handleInputLabel(restValue, false)
          targetElem.setSelectionRange(0, firstChunkFormat.length)
          internalData.laseFocusMasked = Date.now()
          return
        }
      }

      // 是否选择数字块
      let selectKey = dateMaskedFormat[selectionStart]
      if (!parseInputKayMaps[selectKey]) {
        selectKey = dateMaskedFormat[selectionStart - 1]
      }
      if (selectKey) {
        evnt.stopPropagation()
        const skRest = dateMaskedFormat.match(new RegExp(selectKey + '+'))
        if (skRest) {
          const chunkFormat = skRest[0] || ''
          const chunkStartIndex = skRest.index || 0
          const chunkEndIndex = chunkStartIndex + chunkFormat.length
          targetElem.setSelectionRange(chunkStartIndex, chunkEndIndex)
          internalData.isTriggerMasked = true
          internalData.laseFocusMasked = Date.now()
        }
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const inpImmediate = computeInpImmediate.value
      const value = inputValue
      if (!inpImmediate) {
        handleChange(value, evnt)
      }
      if (!reactData.visiblePanel) {
        const { inputLabel } = internalData
        reactData.isActivated = false
        // 未打开面板时才校验
        afterCheckValue(inputLabel)
      }
      dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    }

    const focusEvent = (evnt: KeyboardEvent & { type: 'focus' }) => {
      const { multiple, editable, maskedConfig } = props
      const { fsTimeout } = internalData
      const maskedOpts = computeMaskedOpts.value
      const popupOpts = computePopupOpts.value
      const { trigger } = popupOpts
      reactData.isActivated = true
      if (fsTimeout) {
        clearTimeout(fsTimeout)
      }
      if (!trigger || trigger === 'default') {
        datePickerOpenEvent(evnt)
      } else if (trigger === 'icon') {
        hidePanel()
      }
      if (editable && !multiple && (isEnableConf(maskedConfig) || maskedOpts.enabled)) {
        internalData.fsTimeout = setTimeout(() => {
          handleMaskedSelectedDate(evnt, true)
        }, 20)
      }
      triggerEvent(evnt)
    }

    const clickEvent = (evnt: MouseEvent & { type: 'click' }) => {
      const { multiple, editable, maskedConfig } = props
      const { fsTimeout } = internalData
      const maskedOpts = computeMaskedOpts.value
      if (fsTimeout) {
        clearTimeout(fsTimeout)
      }
      if (editable && !multiple && (isEnableConf(maskedConfig) || maskedOpts.enabled)) {
        internalData.fsTimeout = setTimeout(() => {
          handleMaskedSelectedDate(evnt)
        }, 10)
      }
      triggerEvent(evnt)
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      const { type, editable, maskedConfig } = props
      const { visiblePanel } = reactData
      const maskedOpts = computeMaskedOpts.value
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      const isLtArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
      const isRtArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
      const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
      if (editable) {
        if (isEnter) {
          const { inputLabel } = internalData
          if (visiblePanel) {
            hidePanel()
          }
          afterCheckValue(inputLabel)
        } else if (maskedTypes.includes(type)) {
          if (isEnableConf(maskedConfig) || maskedOpts.enabled) {
            if (maskedOpts.isArrow && (isUpArrow || isDwArrow || isLtArrow || isRtArrow)) {
              handleArrowInputDate(evnt, isUpArrow, isDwArrow, isLtArrow, isRtArrow)
            } else if (maskedOpts.isMasked) {
              handleMaskedInputDate(evnt)
            }
          }
        }
      }
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    const confirmEvent = (evnt: MouseEvent) => {
      const $datePanel = refDatePanel.value
      if ($datePanel) {
        $datePanel.confirmByEvent(evnt)
      }
      hidePanel()
    }

    const panelChangeEvent = (params: VxeDatePickerDefines.ChangeEventParams) => {
      const { multiple, autoClose } = props
      const { value, $event } = params
      const isDateTimeType = computeIsDateTimeType.value
      handleChange(value, $event)
      if (!multiple && !isDateTimeType) {
        if (autoClose) {
          hidePanel()
        }
      }
    }

    const panelConfirmEvent = (params: VxeDatePanelDefines.ConfirmEventParams) => {
      dispatchEvent('confirm', params, params.$event)
    }

    const panelRevertEvent = (params: VxeDatePanelDefines.RevertEventParams) => {
      handleInputLabel(params.label, true)
    }

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { visiblePanel, isActivated } = reactData
      const el = refElem.value
      const panelWrapperElem = refPanelWrapper.value
      const isDisabled = computeIsDisabled.value
      if (!isDisabled && isActivated) {
        const currActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (currActivated !== isActivated) {
          reactData.isActivated = currActivated
        }
        if (!currActivated) {
          if (visiblePanel) {
            hidePanel()
            const { inputLabel } = internalData
            afterCheckValue(inputLabel)
          }
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { isActivated, visiblePanel } = reactData
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        if (isTab) {
          if (isActivated) {
            reactData.isActivated = false
          }
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
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
            hidePanel()
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        hidePanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        afterCheckValue(internalData.inputLabel)
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
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
          updatePlacement()
        }, 10)
        updateZindex()
        return updatePlacement()
      }
      return nextTick()
    }

    const datePickerOpenEvent = (evnt: Event) => {
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
          datePickerOpenEvent(evnt)
        }
      }
    }

    const handleShortcutEvent: VxeButtonGroupEvents.Click = ({ option, $event }) => {
      const { type } = props
      const { inputValue } = reactData
      const shortcutOpts = computeShortcutOpts.value
      const { autoClose } = shortcutOpts
      const { code, clickMethod } = option as VxeDatePickerDefines.ShortcutOption
      let value = inputValue
      const shortcutParams = {
        $datePicker: $xeDatePicker,
        option,
        value,
        code
      }
      if (!clickMethod && code) {
        const gCommandOpts = commands.get(code)
        const dpCommandMethod = gCommandOpts ? gCommandOpts.datePickerCommandMethod : null
        if (dpCommandMethod) {
          dpCommandMethod(shortcutParams)
        } else {
          const dateValueFormat = computeDateValueFormat.value
          const firstDayOfWeek = computeFirstDayOfWeek.value
          switch (code) {
            case 'now':
            case 'prev':
            case 'next':
            case 'minus':
            case 'plus': {
              const restObj = getDateByCode(code, value, type, {
                valueFormat: dateValueFormat,
                firstDay: firstDayOfWeek
              })
              value = restObj.value
              shortcutParams.value = value
              handleChange(value, $event)
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

    const dispatchEvent = (type: ValueOf<VxeDatePickerEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $datePicker: $xeDatePicker }, params))
    }

    const datePickerMethods: DatePickerMethods = {
      dispatchEvent,

      setModelValue (value) {
        reactData.inputValue = value
        emit('update:modelValue', value)
      },
      setModelValueByEvent (evnt, value) {
        handleChange(value || '', evnt)
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

    const renderShortcutBtn = (pos: 'top' | 'bottom' | 'left' | 'right' | 'header' | 'footer', isVertical?: boolean) => {
      const shortcutOpts = computeShortcutOpts.value
      const { position, align, mode } = shortcutOpts
      const shortcutList = computeShortcutList.value
      if (isEnableConf(shortcutOpts) && shortcutList.length && (position || 'left') === pos) {
        return h('div', {
          class: `vxe-date-picker--layout-${pos}-wrapper`
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
      return renderEmptyElement($xeDatePicker)
    }

    const renderPanel = () => {
      const popupOpts = computePopupOpts.value
      if (popupOpts.enabled === false) {
        return renderEmptyElement($xeDatePicker)
      }
      const { type, multiple, showClearButton, showConfirmButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, inputValue } = reactData
      const vSize = computeSize.value
      const btnTransfer = computeBtnTransfer.value
      const shortcutOpts = computeShortcutOpts.value
      const isClearable = computeIsClearable.value
      const isDateTimeType = computeIsDateTimeType.value
      const shortcutList = computeShortcutList.value
      const timeOpts = computeTimeOpts.value
      const dateStartDate = computeDateStartDate.value
      const dateEndDate = computeDateEndDate.value
      const { position } = shortcutOpts
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const topSlot = slots.top
      const bottomSlot = slots.bottom
      const leftSlot = slots.left
      const rightSlot = slots.right
      const ppClassName = popupOpts.className
      const hasShortcutBtn = shortcutList.length > 0
      const showConfirmBtn = (showConfirmButton === null ? (isDateTimeType || multiple) : showConfirmButton)
      const showClearBtn = (showClearButton === null ? (isClearable && showConfirmBtn && type !== 'time') : showClearButton)
      return h(Teleport, {
        to: 'body',
        disabled: btnTransfer ? !initialized : true
      }, [
        h('div', {
          ref: refInputPanel,
          class: ['vxe-table--ignore-clear vxe-date-picker--panel', `type--${type}`, ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $datePicker: $xeDatePicker }) : ppClassName) : '', {
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
                class: ['vxe-date-picker--layout-all-wrapper', `type--${type}`, {
                  [`size--${vSize}`]: vSize
                }]
              }, [
                topSlot
                  ? h('div', {
                    class: 'vxe-date-picker--layout-top-wrapper'
                  }, topSlot({}))
                  : renderShortcutBtn('top'),
                h('div', {
                  class: 'vxe-date-picker--layout-body-layout-wrapper'
                }, [
                  leftSlot
                    ? h('div', {
                      class: 'vxe-date-picker--layout-left-wrapper'
                    }, leftSlot({}))
                    : renderShortcutBtn('left', true),
                  h('div', {
                    class: 'vxe-date-picker--layout-body-content-wrapper'
                  }, [
                    headerSlot
                      ? h('div', {
                        class: 'vxe-date-picker--layout-header-wrapper'
                      }, headerSlot({}))
                      : renderShortcutBtn('header'),
                    h('div', {
                      class: 'vxe-date-picker--layout-body-wrapper'
                    }, [
                      h(VxeDatePanelComponent, {
                        ref: refDatePanel,
                        modelValue: reactData.inputValue,
                        type: props.type,
                        className: props.className,
                        multiple: props.multiple,
                        limitCount: props.limitCount,
                        startDate: dateStartDate,
                        endDate: dateEndDate,
                        defaultDate: props.defaultDate,
                        defaultTime: props.defaultTime,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        timeFormat: props.timeFormat,
                        timeConfig: timeOpts,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay,
                        onChange: panelChangeEvent,
                        onConfirm: panelConfirmEvent,
                        onRevert: panelRevertEvent
                      })
                    ]),
                    h('div', {
                      class: 'vxe-date-picker--layout-footer-wrapper'
                    }, [
                      h('div', {
                        class: 'vxe-date-picker--layout-footer-custom'
                      }, footerSlot ? footerSlot({}) : [renderShortcutBtn('footer')]),
                      showClearBtn || showConfirmBtn
                        ? h('div', {
                          class: 'vxe-date-picker--layout-footer-btns'
                        }, [
                          showClearBtn
                            ? h(VxeButtonComponent, {
                              size: 'mini',
                              disabled: inputValue === '' || XEUtils.eqNull(inputValue),
                              content: getI18n('vxe.button.clear'),
                              onClick: clearValueEvent
                            })
                            : renderEmptyElement($xeDatePicker),
                          showConfirmBtn
                            ? h(VxeButtonComponent, {
                              size: 'mini',
                              status: 'primary',
                              content: getI18n('vxe.button.confirm'),
                              onClick: confirmEvent
                            })
                            : renderEmptyElement($xeDatePicker)
                        ])
                        : renderEmptyElement($xeDatePicker)
                    ])
                  ]),
                  rightSlot
                    ? h('div', {
                      class: 'vxe-date-picker--layout-right-wrapper'
                    }, rightSlot({}))
                    : renderShortcutBtn('right', true)
                ]),
                bottomSlot
                  ? h('div', {
                    class: 'vxe-date-picker--layout-bottom-wrapper'
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
      const { suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = computeIsDisabled.value
      const isClearable = computeIsClearable.value
      return h('div', {
        class: ['vxe-date-picker--suffix', {
          'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
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
          : renderEmptyElement($xeDatePicker),
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
          : renderEmptyElement($xeDatePicker)
      ])
    }

    const renderExtraSuffixIcon = () => {
      return h('div', {
        class: 'vxe-date-picker--control-icon',
        onClick: clickIconEvent
      }, [
        h('i', {
          class: ['vxe-date-picker--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    }

    const renderVN = () => {
      const { className, type, name, autoComplete } = props
      const { inputValue, visiblePanel, isActivated, labelFlag } = reactData
      const { inputLabel } = internalData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const panelLabel = computePanelLabel.value
      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-date-picker--readonly', `type--${type}`, className]
        }, panelLabel)
      }
      const inputReadonly = computeInputReadonly.value
      const inpPlaceholder = computeInpPlaceholder.value
      const isClearable = computeIsClearable.value
      const prefix = renderPrefixIcon()
      const suffix = renderSuffixIcon()
      return h('div', {
        ref: refElem,
        class: ['vxe-date-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        spellcheck: false
      }, [
        prefix || renderEmptyElement($xeDatePicker),
        h('div', {
          class: 'vxe-date-picker--wrapper'
        }, [
          h('input', {
            ref: refInputTarget,
            class: 'vxe-date-picker--inner',
            value: labelFlag ? inputLabel : '',
            name,
            type: 'text',
            placeholder: inpPlaceholder,
            readonly: inputReadonly,
            disabled: isDisabled,
            autocomplete: autoComplete,
            onKeydown: keydownEvent,
            onKeyup: keyupEvent,
            onClick: clickEvent,
            onInput: inputEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent
          })
        ]),
        suffix || renderEmptyElement($xeDatePicker),
        // 下拉面板
        renderPanel()
      ])
    }

    watch(computePanelLabel, (val) => {
      handleInputLabel(val, true)
    })

    watch(() => props.modelValue, () => {
      updateModelValue()
    })

    nextTick(() => {
      globalEvents.on($xeDatePicker, 'mousewheel', handleGlobalMousewheelEvent)
      globalEvents.on($xeDatePicker, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeDatePicker, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeDatePicker, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeDatePicker, 'resize', handleGlobalResizeEvent)
    })

    onMounted(() => {
      const { type, multiple, maskedConfig } = props
      if (isEnableConf(maskedConfig)) {
        if (multiple) {
          errLog('vxe.error.notSupportProp', ['multiple', 'control-config.enabled=true', 'control-config.enabled=false'])
        }
        if (!maskedTypes.includes(type)) {
          warnLog('vxe.error.notSupportProp', ['control-config.enabled=true', `type=${type}`, `type=${maskedTypes.join('|')}`])
        }
      }
    })

    onUnmounted(() => {
      globalEvents.off($xeDatePicker, 'mousewheel')
      globalEvents.off($xeDatePicker, 'mousedown')
      globalEvents.off($xeDatePicker, 'keydown')
      globalEvents.off($xeDatePicker, 'blur')
      globalEvents.off($xeDatePicker, 'resize')
    })

    updateModelValue()

    provide('$xeDatePicker', $xeDatePicker)

    $xeDatePicker.renderVN = renderVN

    return $xeDatePicker
  },
  render () {
    return this.renderVN()
  }
})
