import { h, Teleport, ref, Ref, computed, provide, reactive, inject, nextTick, watch, PropType, onDeactivated, onUnmounted, onBeforeUnmount } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, globalEvents, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode } from '../../ui/src/dom'
import { parseDateString, parseDateObj, getRangeDateByCode, handleValueFormat } from '../../date-panel/src/util'
import { getSlotVNs } from '../../ui/src/vn'
import { errLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel/src/date-panel'
import VxeButtonComponent from '../../button/src/button'
import VxeButtonGroupComponent from '../../button/src/button-group'

import type { VxeDateRangePickerConstructor, VxeDateRangePickerEmits, DateRangePickerInternalData, DateRangePickerReactData, DateRangePickerMethods, VxeDateRangePickerPropTypes, DateRangePickerPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDateRangePickerDefines, VxeButtonGroupEvents, VxeDatePanelConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

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
    size: {
      type: String as PropType<VxeDateRangePickerPropTypes.Size>,
      default: () => getConfig().dateRangePicker.size || getConfig().size
    },

    minDate: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.MinDate>,
    maxDate: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.MaxDate>,
    defaultDate: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.DefaultDate>,
    startDay: {
      type: [String, Number] as PropType<VxeDateRangePickerPropTypes.StartDay>,
      default: () => getConfig().dateRangePicker.startDay
    },
    labelFormat: String as PropType<VxeDateRangePickerPropTypes.LabelFormat>,
    valueFormat: String as PropType<VxeDateRangePickerPropTypes.ValueFormat>,
    timeFormat: String as PropType<VxeDateRangePickerPropTypes.TimeFormat>,
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

    const reactData = reactive<DateRangePickerReactData>({
      initialized: false,
      panelIndex: 0,
      visiblePanel: false,
      isAniVisible: false,
      panelStyle: {},
      panelPlacement: '',
      isActivated: false,
      startValue: '',
      endValue: ''
    })

    const internalData: DateRangePickerInternalData = {
      // selectStatus: false
      // hpTimeout: undefined
    }

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

    const computeMVal = computed(() => {
      const { startValue, endValue } = props
      return `${startValue || ''}${endValue || ''}`
    })

    const computeIsDateTimeType = computed(() => {
      const { type } = props
      return type === 'time' || type === 'datetime'
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
      const { startValue, endValue } = reactData
      const vals: string[] = startValue || endValue ? [startValue || '', endValue || ''] : []
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

    const getRangeValue = (sValue: string, eValue: string) => {
      const { modelValue } = props
      const isArr = XEUtils.isArray(modelValue)
      if (sValue || eValue) {
        const rest = [sValue || '', eValue || '']
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
      const { modelValue, startValue, endValue } = props
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
      reactData.startValue = restObj.sValue
      reactData.endValue = restObj.eValue
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) => {
      const { startValue, endValue } = reactData
      const value = getRangeValue(startValue, endValue)
      dispatchEvent(evnt.type, { value, startValue, endValue }, evnt)
    }

    const handleChange = (sValue: string, eValue: string, evnt: Event | { type: string }) => {
      const { modelValue } = props
      reactData.startValue = sValue
      reactData.endValue = eValue
      const value = getRangeValue(sValue, eValue)
      emit('update:modelValue', value)
      emit('update:startValue', sValue || '')
      emit('update:endValue', eValue || '')
      if (XEUtils.toValueString(modelValue) !== value) {
        dispatchEvent('change', { value }, evnt as any)
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
      reactData.isActivated = true
      dateRangePickerOpenEvent(evnt)
      triggerEvent(evnt)
    }

    const clickPrefixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { startValue, endValue } = reactData
        const value = getRangeValue(startValue, endValue)
        dispatchEvent('prefix-click', { value, startValue, endValue }, evnt)
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
      handleChange('', '', evnt)
      dispatchEvent('clear', { value }, evnt)
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

    const handleSelectClose = () => {
      const { autoClose } = props
      const { startValue, endValue } = reactData
      const { selectStatus } = internalData
      const isDatePickerType = computeIsDatePickerType.value
      if (autoClose) {
        if (selectStatus && isDatePickerType) {
          if (startValue && endValue) {
            hidePanel()
          }
        }
      } else {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      }
    }

    const clickSuffixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { startValue, endValue } = reactData
        const value = getRangeValue(startValue, endValue)
        dispatchEvent('suffix-click', { value, startValue, endValue }, evnt)
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { startValue, endValue } = reactData
      const inpImmediate = computeInpImmediate.value
      const value = ''
      if (!inpImmediate) {
        handleChange(startValue, endValue, evnt)
      }
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      dispatchEvent('blur', { value, startValue, endValue }, evnt)
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
      const $startDatePanel = refStartDatePanel.value
      const $endDatePanel = refEndDatePanel.value
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if ((startValue && !endValue) || (!startValue && endValue)) {
          handleChange('', '', evnt)
        } else {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        }
      }
      hidePanel()
    }

    const startPanelChangeEvent = (params: any) => {
      const { selectStatus } = internalData
      const { value, $event } = params
      const endValue = selectStatus ? reactData.endValue : ''
      handleChange(value, endValue, $event)
      handleSelectClose()
      if (!selectStatus) {
        internalData.selectStatus = true
      }
      nextTick(() => {
        const $startDatePanel = refStartDatePanel.value
        const $endDatePanel = refEndDatePanel.value
        if ($startDatePanel && $endDatePanel) {
          const startValue = $startDatePanel.getModelValue()
          if (!endValue && startValue) {
            $endDatePanel.setPanelDate(XEUtils.toStringDate(startValue))
          }
        }
      })
    }

    const endPanelChangeEvent = (params: any) => {
      const { selectStatus } = internalData
      const { value, $event } = params
      const startValue = selectStatus ? reactData.startValue : ''
      handleChange(startValue, value, $event)
      handleSelectClose()
      if (!selectStatus) {
        internalData.selectStatus = true
      }
      nextTick(() => {
        const $startDatePanel = refStartDatePanel.value
        const $endDatePanel = refEndDatePanel.value
        if ($startDatePanel && $endDatePanel) {
          const endValue = $endDatePanel.getModelValue()
          if (!startValue && endValue) {
            $startDatePanel.setPanelDate(XEUtils.toStringDate(endValue))
          }
        }
      })
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
      const { visiblePanel } = reactData
      if (visiblePanel) {
        hidePanel()
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
      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    }

    const updatePlacement = () => {
      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = refInputTarget.value
      const panelElem = refInputPanel.value
      const btnTransfer = computeBtnTransfer.value
      const handleStyle = () => {
        const ppObj = updatePanelPlacement(targetElem, panelElem, {
          placement,
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

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    const handleShortcutEvent: VxeButtonGroupEvents.Click = ({ option, $event }) => {
      const { type } = props
      const shortcutOpts = computeShortcutOpts.value
      const { autoClose } = shortcutOpts
      const { code, clickMethod } = option as VxeDateRangePickerDefines.ShortcutOption
      let startValue = reactData.startValue
      let endValue = reactData.endValue
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

    dateRangePickerMethods = {
      dispatchEvent,

      setModelValue (startValue, endValue) {
        reactData.startValue = startValue || ''
        reactData.endValue = endValue || ''
        const value = getRangeValue(startValue, endValue)
        emit('update:modelValue', value)
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
      const { type, separator, autoClose, showConfirmButton, showClearButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, startValue, endValue } = reactData
      const vSize = computeSize.value
      const btnTransfer = computeBtnTransfer.value
      const shortcutOpts = computeShortcutOpts.value
      const isClearable = computeIsClearable.value
      const panelLabelObj = computePanelLabelObj.value
      const shortcutList = computeShortcutList.value
      const isDateTimeType = computeIsDateTimeType.value
      const { startLabel, endLabel } = panelLabelObj
      const { position } = shortcutOpts
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const topSlot = slots.top
      const bottomSlot = slots.bottom
      const leftSlot = slots.left
      const rightSlot = slots.right
      const hasShortcutBtn = shortcutList.length > 0
      const showConfirmBtn = (showConfirmButton === null ? (isDateTimeType || !autoClose) : showConfirmButton)
      const showClearBtn = (showClearButton === null ? isClearable : showClearButton)
      return h(Teleport, {
        to: 'body',
        disabled: btnTransfer ? !initialized : true
      }, [
        h('div', {
          ref: refInputPanel,
          class: ['vxe-table--ignore-clear vxe-date-range-picker--panel', `type--${type}`, {
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
                        modelValue: startValue,
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        endDate: endValue,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        timeFormat: props.timeFormat,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay,
                        onChange: startPanelChangeEvent
                      }),
                      h(VxeDatePanelComponent, {
                        ref: refEndDatePanel,
                        modelValue: endValue,
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        startDate: startValue,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        timeFormat: props.timeFormat,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay,
                        onChange: endPanelChangeEvent
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
                        : []),
                      h('div', {
                        class: 'vxe-date-range-picker--layout-footer-custom'
                      }, footerSlot ? footerSlot({}) : [renderShortcutBtn('footer')]),
                      h('div', {
                        class: 'vxe-date-range-picker--layout-footer-btns'
                      }, [
                        showClearBtn
                          ? h(VxeButtonComponent, {
                            size: 'mini',
                            disabled: !(startValue || endValue),
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
      const { startValue, endValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = computeIsDisabled.value
      const isClearable = computeIsClearable.value
      return h('div', {
        class: ['vxe-date-range-picker--suffix', {
          'is--clear': isClearable && !isDisabled && (startValue || endValue)
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
        onClick: dateRangePickerOpenEvent
      }, [
        h('i', {
          class: ['vxe-date-range-picker--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    }

    const renderVN = () => {
      const { className, type, name, autoComplete } = props
      const { startValue, endValue, visiblePanel, isActivated } = reactData
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
          'show--clear': isClearable && !isDisabled && (startValue || endValue)
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
            readonly: true,
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
      globalEvents.on($xeDateRangePicker, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeDateRangePicker, 'resize', handleGlobalResizeEvent)
    })

    onDeactivated(() => {
      checkValue()
    })

    onUnmounted(() => {
      globalEvents.off($xeDateRangePicker, 'mousewheel')
      globalEvents.off($xeDateRangePicker, 'mousedown')
      globalEvents.off($xeDateRangePicker, 'blur')
      globalEvents.off($xeDateRangePicker, 'resize')
    })

    onBeforeUnmount(() => {
      checkValue()
    })

    provide('$xeDateRangePicker', $xeDateRangePicker)

    $xeDateRangePicker.renderVN = renderVN

    return $xeDateRangePicker
  },
  render () {
    return this.renderVN()
  }
})
