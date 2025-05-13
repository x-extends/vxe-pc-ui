import { PropType, CreateElement } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, createEvent, globalEvents, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { parseDateObj, getDateByCode } from '../../date-panel/src/util'
import { errLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel/src/date-panel'
import VxeButtonComponent from '../../button/src/button'
import VxeButtonGroupComponent from '../../button/src/button-group'

import type { VxeDatePickerConstructor, VxeDatePickerEmits, DatePickerInternalData, DatePickerReactData, VxeButtonGroupDefines, VxeComponentSizeType, VxeDatePickerPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDatePickerDefines, VxeDatePanelConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default /* define-vxe-component start */ defineVxeComponent({
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
      default: 'date' as VxeDatePickerPropTypes.Type
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
    size: {
      type: String as PropType<VxeDatePickerPropTypes.Size>,
      default: () => getConfig().datePicker.size || getConfig().size
    },
    multiple: Boolean as PropType<VxeDatePickerPropTypes.Multiple>,
    limitCount: {
      type: [String, Number] as PropType<VxeDatePickerPropTypes.LimitCount>,
      default: () => getConfig().upload.limitCount
    },

    // date、week、month、quarter、year
    startDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.StartDate>,
      default: () => getConfig().datePicker.startDate
    },
    endDate: {
      type: [String, Number, Date] as PropType<VxeDatePickerPropTypes.MaxDate>,
      default: () => getConfig().datePicker.endDate
    },
    defaultDate: [String, Number, Date] as PropType<VxeDatePickerPropTypes.DefaultDate>,
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

    prefixIcon: String as PropType<VxeDatePickerPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeDatePickerPropTypes.SuffixIcon>,
    placement: String as PropType<VxeDatePickerPropTypes.Placement>,
    transfer: {
      type: Boolean as PropType<VxeDatePickerPropTypes.Transfer>,
      default: null
    },

    shortcutConfig: Object as PropType<VxeDatePickerPropTypes.ShortcutConfig>,

    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number as PropType<VxeDatePickerPropTypes.StartDay>
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
  provide () {
    const $xeDatePicker = this

    return {
      $xeDatePicker
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
      inputLabel: ''
    }

    const internalData: DatePickerInternalData = {
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
    computeInputReadonly () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { type, editable, multiple } = props
      const formReadonly = $xeDatePicker.computeFormReadonly
      return formReadonly || multiple || !editable || type === 'week' || type === 'quarter'
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
    },
    computeShortcutOpts () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return Object.assign({}, getConfig().datePicker.shortcutConfig, props.shortcutConfig)
    },
    computeShortcutList () {
      const $xeDatePicker = this

      const shortcutOpts = $xeDatePicker.computeShortcutOpts as VxeDatePickerPropTypes.ShortcutConfig
      const { options } = shortcutOpts
      if (options) {
        return options.map((option, index) => {
          return Object.assign({
            name: `${option.name || option.code || index}`
          }, option)
        })
      }
      return []
    },
    computeDateLabelFormat () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { labelFormat } = props
      return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
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
    computeFirstDayOfWeek () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeDatePickerPropTypes.StartDay
    },
    computePanelLabel () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type, multiple } = props
      const { inputValue } = reactData
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      const vals: string[] = inputValue ? (multiple ? inputValue.split(',') : [inputValue]) : []
      return vals.map(val => {
        const dateObj = parseDateObj(val, type, {
          valueFormat: dateValueFormat,
          labelFormat: dateLabelFormat,
          firstDay: firstDayOfWeek
        })
        return dateObj.label
      }).join(', ')
    }
  },
  methods: {

    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDatePickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDatePicker = this
      $xeDatePicker.$emit(type, createEvent(evnt, { $drawer: $xeDatePicker }, params))
    },
    emitModel (value: any) {
      const $xeDatePicker = this

      const { _events } = $xeDatePicker as any
      if (_events && _events.modelValue) {
        $xeDatePicker.$emit('modelValue', value)
      } else {
        $xeDatePicker.$emit('model-value', value)
      }
    },
    updateModelValue () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { value: modelValue } = props
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
    triggerEvent (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { inputValue } = reactData
      $xeDatePicker.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    },
    handleChange (value: string | number | Date, evnt: Event | { type: string }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const $xeForm = $xeDatePicker.$xeForm
      const formItemInfo = $xeDatePicker.formItemInfo

      const { value: modelValue } = props
      reactData.inputValue = value
      $xeDatePicker.emitModel(value)
      if (XEUtils.toValueString(modelValue) !== value) {
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

      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      reactData.inputLabel = value
      $xeDatePicker.dispatchEvent('input', { value }, evnt)
    },
    changeEvent (evnt: Event & { type: 'change' }) {
      const $xeDatePicker = this

      const inpImmediate = $xeDatePicker.computeInpImmediate
      if (!inpImmediate) {
        $xeDatePicker.triggerEvent(evnt)
      }
    },
    focusEvent (evnt: Event & { type: 'focus' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      reactData.isActivated = true
      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDatePicker.datePickerOpenEvent(evnt)
      }
      $xeDatePicker.triggerEvent(evnt)
    },
    clickPrefixEvent (evnt: Event) {
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
        internalData.hpTimeout = setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    },
    clearValueEvent (evnt: Event, value: VxeDatePickerPropTypes.ModelValue) {
      const $xeDatePicker = this

      const isDatePickerType = $xeDatePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDatePicker.hidePanel()
      }
      $xeDatePicker.handleChange('', evnt)
      $xeDatePicker.dispatchEvent('clear', { value }, evnt)
    },
    clickSuffixEvent (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeDatePicker.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const $xeForm = $xeDatePicker.$xeForm
      const formItemInfo = $xeDatePicker.formItemInfo

      const $datePanel = $xeDatePicker.$refs.refDatePanel as VxeDatePanelConstructor
      const { inputValue } = reactData
      const inpImmediate = $xeDatePicker.computeInpImmediate
      const value = inputValue
      if (!inpImmediate) {
        $xeDatePicker.handleChange(value, evnt)
      }
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      if ($datePanel) {
        $datePanel.checkValue(reactData.inputLabel)
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
    confirmEvent (evnt: MouseEvent) {
      const $xeDatePicker = this

      const $datePanel = $xeDatePicker.$refs.refDatePanel as VxeDatePanelConstructor
      if ($datePanel) {
        $datePanel.confirmByEvent(evnt)
      }
      $xeDatePicker.hidePanel()
    },
    panelChangeEvent (params: any) {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { multiple, autoClose } = props
      const { value, $event } = params
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      $xeDatePicker.handleChange(value, $event)
      if (!multiple && !isDateTimeType) {
        if (autoClose) {
          $xeDatePicker.hidePanel()
        }
      }
    },
    // 全局事件
    handleGlobalMousedownEvent (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const $datePanel = $xeDatePicker.$refs.refDatePanel as VxeDatePanelConstructor
      const { visiblePanel, isActivated } = reactData
      const el = $xeDatePicker.$refs.refElem as HTMLDivElement
      const panelWrapperElem = $xeDatePicker.$refs.refPanelWrapper as HTMLDivElement
      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          if (visiblePanel) {
            $xeDatePicker.hidePanel()
            if ($datePanel) {
              $datePanel.checkValue(reactData.inputLabel)
            }
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
          }
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const $datePanel = $xeDatePicker.$refs.refDatePanel as VxeDatePanelConstructor
      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        $xeDatePicker.hidePanel()
        if ($datePanel) {
          $datePanel.checkValue(reactData.inputLabel)
        }
      } else if (isActivated) {
        if ($datePanel) {
          $datePanel.checkValue(reactData.inputLabel)
        }
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
    updatePlacement () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLDivElement
      const btnTransfer = $xeDatePicker.computeBtnTransfer
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
      return $xeDatePicker.$nextTick().then(handleStyle)
    },
    showPanel () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { visiblePanel } = reactData
      const isDisabled = $xeDatePicker.computeIsDisabled
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLElement
      if (!isDisabled && !visiblePanel) {
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
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        $xeDatePicker.updateZindex()
        return $xeDatePicker.updatePlacement()
      }
      return $xeDatePicker.$nextTick()
    },
    datePickerOpenEvent (evnt: Event) {
      const $xeDatePicker = this

      const formReadonly = $xeDatePicker.computeFormReadonly
      if (!formReadonly) {
        evnt.preventDefault()
        $xeDatePicker.showPanel()
      }
    },
    clickEvent (evnt: Event & { type: 'click' }) {
      const $xeDatePicker = this

      $xeDatePicker.triggerEvent(evnt)
    },
    handleShortcutEvent ({ option, $event }: VxeButtonGroupDefines.ClickEventParams) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { type } = props
      const { inputValue } = reactData
      const shortcutOpts = $xeDatePicker.computeShortcutOpts
      const { autoClose } = shortcutOpts
      const { code, clickMethod } = option as VxeDatePickerDefines.ShortcutOption
      let value = inputValue
      const shortcutParams = {
        $datePicker: $xeDatePicker as VxeDatePickerConstructor,
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
          const dateValueFormat = $xeDatePicker.computeDateValueFormat
          const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
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
              $xeDatePicker.handleChange(value, $event)
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
        $xeDatePicker.hidePanel()
      }
      $xeDatePicker.dispatchEvent('shortcut-click', shortcutParams, $event)
    },

    setModelValue (value: string) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      reactData.inputValue = value
      $xeDatePicker.emitModel(value)
    },
    setModelValueByEvent (evnt: Event, value: string) {
      const $xeDatePicker = this

      $xeDatePicker.handleChange(value || '', evnt)
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

    //
    // Render
    //
    renderShortcutBtn (h: CreateElement, pos: 'top' | 'bottom' | 'left' | 'right' | 'header' | 'footer', isVertical?: boolean) {
      const $xeDatePicker = this

      const shortcutOpts = $xeDatePicker.computeShortcutOpts
      const { position, align, mode } = shortcutOpts
      const shortcutList = $xeDatePicker.computeShortcutList
      if (isEnableConf(shortcutOpts) && shortcutList.length && (position || 'left') === pos) {
        return h('div', {
          class: `vxe-date-picker--layout-${pos}-wrapper`
        }, [
          h(VxeButtonGroupComponent, {
            props: {
              options: shortcutList,
              mode,
              align,
              vertical: isVertical
            },
            on: {
              click: $xeDatePicker.handleShortcutEvent
            }
          })
        ])
      }
      return renderEmptyElement($xeDatePicker)
    },
    renderPanel (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const slots = $xeDatePicker.$scopedSlots
      const reactData = $xeDatePicker.reactData

      const { type, multiple, showClearButton, showConfirmButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, inputValue } = reactData
      const vSize = $xeDatePicker.computeSize
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      const shortcutOpts = $xeDatePicker.computeShortcutOpts
      const isClearable = $xeDatePicker.computeIsClearable
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      const shortcutList = $xeDatePicker.computeShortcutList
      const { position } = shortcutOpts
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const topSlot = slots.top
      const bottomSlot = slots.bottom
      const leftSlot = slots.left
      const rightSlot = slots.right
      const hasShortcutBtn = shortcutList.length > 0
      const showConfirmBtn = (showConfirmButton === null ? (isDateTimeType || multiple) : showConfirmButton)
      const showClearBtn = (showClearButton === null ? (isClearable && showConfirmBtn && type !== 'time') : showClearButton)
      return h('div', {
        ref: 'refInputPanel',
        class: ['vxe-table--ignore-clear vxe-date-picker--panel', `type--${type}`, {
          [`size--${vSize}`]: vSize,
          'is--transfer': btnTransfer,
          'ani--leave': isAniVisible,
          'ani--enter': visiblePanel,
          'show--top': !!(topSlot || headerSlot || (hasShortcutBtn && (position === 'top' || position === 'header'))),
          'show--bottom': !!(bottomSlot || footerSlot || (hasShortcutBtn && (position === 'bottom' || position === 'footer'))),
          'show--left': !!(leftSlot || (hasShortcutBtn && position === 'left')),
          'show--right': !!(rightSlot || (hasShortcutBtn && position === 'right'))
        }],
        attrs: {
          placement: panelPlacement
        },
        style: panelStyle
      }, initialized && (visiblePanel || isAniVisible)
        ? [
            h('div', {
              ref: 'refPanelWrapper',
              class: ['vxe-date-picker--layout-all-wrapper', `type--${type}`, {
                [`size--${vSize}`]: vSize
              }]
            }, [
              topSlot
                ? h('div', {
                  class: 'vxe-date-picker--layout-top-wrapper'
                }, topSlot({}))
                : $xeDatePicker.renderShortcutBtn(h, 'top'),
              h('div', {
                class: 'vxe-date-picker--layout-body-layout-wrapper'
              }, [
                leftSlot
                  ? h('div', {
                    class: 'vxe-date-picker--layout-left-wrapper'
                  }, leftSlot({}))
                  : $xeDatePicker.renderShortcutBtn(h, 'left', true),
                h('div', {
                  class: 'vxe-date-picker--layout-body-content-wrapper'
                }, [
                  headerSlot
                    ? h('div', {
                      class: 'vxe-date-picker--layout-header-wrapper'
                    }, headerSlot({}))
                    : $xeDatePicker.renderShortcutBtn(h, 'header'),
                  h('div', {
                    class: 'vxe-date-picker--layout-body-wrapper'
                  }, [
                    h(VxeDatePanelComponent, {
                      ref: 'refDatePanel',
                      props: {
                        value: reactData.inputValue,
                        type: props.type,
                        className: props.className,
                        multiple: props.multiple,
                        limitCount: props.limitCount,
                        startDate: props.startDate,
                        endDate: props.endDate,
                        minDate: props.minDate,
                        defaultDate: props.defaultDate,
                        maxDate: props.maxDate,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDatePicker.panelChangeEvent
                      }
                    })
                  ]),
                  h('div', {
                    class: 'vxe-date-picker--layout-footer-wrapper'
                  }, [
                    h('div', {
                      class: 'vxe-date-picker--layout-footer-custom'
                    }, footerSlot ? footerSlot({}) : [$xeDatePicker.renderShortcutBtn(h, 'footer')]),
                    showClearBtn || showConfirmBtn
                      ? h('div', {
                        class: 'vxe-date-picker--layout-footer-btns'
                      }, [
                        showClearBtn
                          ? h(VxeButtonComponent, {
                            props: {
                              size: 'mini',
                              disabled: inputValue === '' || XEUtils.eqNull(inputValue),
                              content: getI18n('vxe.button.clear')
                            },
                            on: {
                              click: $xeDatePicker.clearValueEvent
                            }
                          })
                          : renderEmptyElement($xeDatePicker),
                        showConfirmBtn
                          ? h(VxeButtonComponent, {
                            props: {
                              size: 'mini',
                              status: 'primary',
                              content: getI18n('vxe.button.confirm')
                            },
                            on: {
                              click: $xeDatePicker.confirmEvent
                            }
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
                  : $xeDatePicker.renderShortcutBtn(h, 'right', true)
              ]),
              bottomSlot
                ? h('div', {
                  class: 'vxe-date-picker--layout-bottom-wrapper'
                }, bottomSlot({}))
                : $xeDatePicker.renderShortcutBtn(h, 'bottom')
            ])
          ]
        : [])
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
    renderSuffixIcon (h: CreateElement) {
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
    renderExtraSuffixIcon (h: CreateElement) {
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
    renderVN (h: CreateElement) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const { className, type, name, autoComplete } = props
      const { inputValue, inputLabel, visiblePanel, isActivated } = reactData
      const vSize = $xeDatePicker.computeSize
      const isDisabled = $xeDatePicker.computeIsDisabled
      const formReadonly = $xeDatePicker.computeFormReadonly
      const panelLabel = $xeDatePicker.computePanelLabel
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-date-picker--readonly', `type--${type}`, className]
        }, panelLabel)
      }
      const inputReadonly = $xeDatePicker.computeInputReadonly
      const inpPlaceholder = $xeDatePicker.computeInpPlaceholder
      const isClearable = $xeDatePicker.computeIsClearable
      const prefix = $xeDatePicker.renderPrefixIcon(h)
      const suffix = $xeDatePicker.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-date-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
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
              value: inputLabel
            },
            attrs: {
              name,
              type: 'text',
              placeholder: inpPlaceholder,
              readonly: inputReadonly,
              disabled: isDisabled,
              autocomplete: autoComplete
            },
            on: {
              keydown: $xeDatePicker.keydownEvent,
              keyup: $xeDatePicker.keyupEvent,
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
    computePanelLabel (val) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      reactData.inputLabel = val
    },
    value () {
      const $xeDatePicker = this

      $xeDatePicker.updateModelValue()
    }
  },
  created () {
    const $xeDatePicker = this

    $xeDatePicker.updateModelValue()
    globalEvents.on($xeDatePicker, 'mousewheel', $xeDatePicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeDatePicker, 'mousedown', $xeDatePicker.handleGlobalMousedownEvent)
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
    globalEvents.off($xeDatePicker, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
