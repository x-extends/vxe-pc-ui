import { PropType, CreateElement } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, globalEvents, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode } from '../../ui/src/dom'
import { parseDateString, parseDateObj, getRangeDateByCode, handleValueFormat } from '../../date-panel/src/util'
import { getSlotVNs } from '../../ui/src/vn'
import { errLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel/src/date-panel'
import VxeButtonComponent from '../../button/src/button'
import VxeButtonGroupComponent from '../../button/src/button-group'

import type { VxeDateRangePickerConstructor, VxeDateRangePickerEmits, DateRangePickerReactData, DateRangePickerInternalData, VxeButtonGroupDefines, VxeComponentSizeType, VxeDateRangePickerPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDateRangePickerDefines, VxeDatePanelConstructor } from '../../../types'
import type { VxeTableConstructor, VxeTablePrivateMethods } from '../../../types/components/table'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeDateRangePicker',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Date, Array] as PropType<VxeDateRangePickerPropTypes.ModelValue>,
    startValue: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.StartValue>,
    endValue: [String, Number, Date] as PropType<VxeDateRangePickerPropTypes.EndValue>,
    immediate: {
      type: Boolean as PropType<VxeDateRangePickerPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeDateRangePickerPropTypes.Name>,
    type: {
      type: String as PropType<VxeDateRangePickerPropTypes.Type>,
      default: 'date' as VxeDateRangePickerPropTypes.Type
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
    const $xeDateRangePicker = this

    return {
      $xeDateRangePicker
    }
  },
  data () {
    const xID = XEUtils.uniqueId()

    const reactData: DateRangePickerReactData = {
      initialized: false,
      panelIndex: 0,
      visiblePanel: false,
      isAniVisible: false,
      panelStyle: {},
      panelPlacement: '',
      isActivated: false,
      startValue: '',
      endValue: ''
    }

    const internalData: DateRangePickerInternalData = {
      // selectStatus: false
      // hpTimeout: undefined
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
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const $xeTable = $xeDateRangePicker.$xeTable
      const $xeModal = $xeDateRangePicker.$xeModal
      const $xeDrawer = $xeDateRangePicker.$xeDrawer
      const $xeForm = $xeDateRangePicker.$xeForm

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
    },
    computeFormReadonly () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const $xeForm = $xeDateRangePicker.$xeForm

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
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const $xeForm = $xeDateRangePicker.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeMVal () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { startValue, endValue } = props
      return `${startValue || ''}${endValue || ''}`
    },
    computeIsDateTimeType () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type } = props
      return type === 'time' || type === 'datetime'
    },
    computeIsDatePickerType () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      return ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeIsClearable () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      return props.clearable
    },
    computeInpPlaceholder () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().dateRangePicker.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.dateRangePicker.pleaseRange')
    },
    computeInpImmediate () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { immediate } = props
      return immediate
    },
    computeShortcutOpts () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      return Object.assign({}, getConfig().dateRangePicker.shortcutConfig, props.shortcutConfig)
    },
    computeShortcutList () {
      const $xeDateRangePicker = this

      const shortcutOpts = $xeDateRangePicker.computeShortcutOpts as VxeDateRangePickerPropTypes.ShortcutConfig
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
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { labelFormat } = props
      return labelFormat || getI18n(`vxe.input.date.labelFormat.${props.type}`)
    },
    computeDateValueFormat () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type, valueFormat } = props
      return handleValueFormat(type, valueFormat)
    },
    computeFirstDayOfWeek () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { startDay } = props
      return XEUtils.toNumber(startDay) as VxeDateRangePickerPropTypes.StartDay
    },
    computePanelLabelObj () {
      const $xeDateRangePicker = this as VxeDateRangePickerConstructor
      const reactData = $xeDateRangePicker.reactData

      const { startValue, endValue } = reactData
      const vals: string[] = startValue || endValue ? [startValue || '', endValue || ''] : []
      return ($xeDateRangePicker as any).formatRangeLabel(vals) as {
        label: string;
        startLabel: string;
        endLabel: string;
    }
    },
    computeInputLabel () {
      const $xeDateRangePicker = this

      const panelLabelObj = $xeDateRangePicker.computePanelLabelObj as {
        label: string;
        startLabel: string;
        endLabel: string;
      }
      return panelLabelObj.label
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDateRangePickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDateRangePicker = this
      $xeDateRangePicker.$emit(type, createEvent(evnt, { $drawer: $xeDateRangePicker }, params))
    },
    emitModel (value: any) {
      const $xeDateRangePicker = this

      const { _events } = $xeDateRangePicker as any
      if (_events && _events.modelValue) {
        $xeDateRangePicker.$emit('modelValue', value)
      } else {
        $xeDateRangePicker.$emit('model-value', value)
      }
    },
    formatRangeLabel (vals: string[]) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type, separator } = props
      const dateLabelFormat = $xeDateRangePicker.computeDateLabelFormat
      const dateValueFormat = $xeDateRangePicker.computeDateValueFormat
      const firstDayOfWeek = $xeDateRangePicker.computeFirstDayOfWeek
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
    },
    getRangeValue (sValue: string, eValue: string) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { value: modelValue } = props
      const isArr = XEUtils.isArray(modelValue)
      if (sValue || eValue) {
        const rest = [sValue || '', eValue || '']
        if (isArr) {
          return rest
        }
        return rest.join(',')
      }
      return isArr ? [] : ''
    },
    paraeUpdateModel () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type, value: modelValue } = props
      const dateValueFormat = $xeDateRangePicker.computeDateValueFormat
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
    },
    parseUpdateData  () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type, startValue, endValue } = props
      const dateValueFormat = $xeDateRangePicker.computeDateValueFormat
      let sValue: string | Date | null = ''
      let eValue: string | Date | null = ''
      sValue = parseDateString(startValue, type, { valueFormat: dateValueFormat })
      eValue = parseDateString(endValue, type, { valueFormat: dateValueFormat })
      return {
        sValue,
        eValue
      }
    },
    updateModelValue (isModel: boolean) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData

      const { value: modelValue, startValue, endValue } = props
      let restObj: {
        sValue: string | Date | null
        eValue: string | Date | null
      } = {
        sValue: '',
        eValue: ''
      }
      if (isModel) {
        if (modelValue) {
          restObj = $xeDateRangePicker.paraeUpdateModel()
        } else {
          restObj = $xeDateRangePicker.parseUpdateData()
        }
      } else {
        if (startValue || endValue) {
          restObj = $xeDateRangePicker.parseUpdateData()
        } else {
          restObj = $xeDateRangePicker.paraeUpdateModel()
        }
      }
      reactData.startValue = restObj.sValue
      reactData.endValue = restObj.eValue
    },
    triggerEvent (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { startValue, endValue } = reactData
      const value = $xeDateRangePicker.getRangeValue(startValue, endValue)
      $xeDateRangePicker.dispatchEvent(evnt.type, { value, startValue, endValue }, evnt)
    },
    handleChange (sValue: string, eValue: string, evnt: Event | { type: string }) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData
      const $xeForm = $xeDateRangePicker.$xeForm
      const formItemInfo = $xeDateRangePicker.formItemInfo

      const { value: modelValue } = props
      reactData.startValue = sValue
      reactData.endValue = eValue
      const value = $xeDateRangePicker.getRangeValue(sValue, eValue)
      $xeDateRangePicker.emitModel(value)
      $xeDateRangePicker.$emit('update:startValue', sValue || '')
      $xeDateRangePicker.$emit('update:endValue', eValue || '')
      if (XEUtils.toValueString(modelValue) !== value) {
        $xeDateRangePicker.dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    changeEvent (evnt: Event & { type: 'change' }) {
      const $xeDateRangePicker = this

      const inpImmediate = $xeDateRangePicker.computeInpImmediate
      if (!inpImmediate) {
        $xeDateRangePicker.triggerEvent(evnt)
      }
    },
    focusEvent (evnt: Event & { type: 'focus' }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      reactData.isActivated = true
      $xeDateRangePicker.dateRangePickerOpenEvent(evnt)
      $xeDateRangePicker.triggerEvent(evnt)
    },
    clickPrefixEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        const { startValue, endValue } = reactData
        const value = $xeDateRangePicker.getRangeValue(startValue, endValue)
        $xeDateRangePicker.dispatchEvent('prefix-click', { value, startValue, endValue }, evnt)
      }
    },
    hidePanel () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      return new Promise<void>(resolve => {
        reactData.visiblePanel = false
        internalData.hpTimeout = setTimeout(() => {
          reactData.isAniVisible = false
          resolve()
        }, 350)
      })
    },
    clearValueEvent (evnt: Event, value: VxeDateRangePickerPropTypes.ModelValue) {
      const $xeDateRangePicker = this

      const isDatePickerType = $xeDateRangePicker.computeIsDatePickerType
      if (isDatePickerType) {
        $xeDateRangePicker.hidePanel()
      }
      $xeDateRangePicker.handleChange('', '', evnt)
      $xeDateRangePicker.dispatchEvent('clear', { value }, evnt)
    },
    checkValue () {
      const $xeDateRangePicker = this

      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if (!startValue || !endValue) {
          $xeDateRangePicker.handleChange('', '', { type: 'check' })
        }
      }
    },
    handleSelectClose () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { autoClose } = props
      const { startValue, endValue } = reactData
      const { selectStatus } = internalData
      const isDatePickerType = $xeDateRangePicker.computeIsDatePickerType
      if (autoClose) {
        if (selectStatus && isDatePickerType) {
          if (startValue && endValue) {
            $xeDateRangePicker.hidePanel()
          }
        }
      } else {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      }
    },
    clickSuffixEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        const { startValue, endValue } = reactData
        const value = $xeDateRangePicker.getRangeValue(startValue, endValue)
        $xeDateRangePicker.dispatchEvent('suffix-click', { value, startValue, endValue }, evnt)
      }
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const $xeForm = $xeDateRangePicker.$xeForm
      const formItemInfo = $xeDateRangePicker.formItemInfo

      const { startValue, endValue } = reactData
      const inpImmediate = $xeDateRangePicker.computeInpImmediate
      const value = ''
      if (!inpImmediate) {
        $xeDateRangePicker.handleChange(startValue, endValue, evnt)
      }
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      $xeDateRangePicker.dispatchEvent('blur', { value, startValue, endValue }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    keydownEvent (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeDateRangePicker = this

      $xeDateRangePicker.triggerEvent(evnt)
    },
    keyupEvent (evnt: KeyboardEvent & { type: 'keyup' }) {
      const $xeDateRangePicker = this

      $xeDateRangePicker.triggerEvent(evnt)
    },
    confirmEvent (evnt: MouseEvent) {
      const $xeDateRangePicker = this

      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if ((startValue && !endValue) || (!startValue && endValue)) {
          $xeDateRangePicker.handleChange('', '', evnt)
        } else {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        }
      }
      $xeDateRangePicker.hidePanel()
    },
    startPanelChangeEvent (params: any) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { selectStatus } = internalData
      const { value, $event } = params
      const endValue = selectStatus ? reactData.endValue : ''
      $xeDateRangePicker.handleChange(value, endValue, $event)
      $xeDateRangePicker.handleSelectClose()
      if (!selectStatus) {
        internalData.selectStatus = true
      }
      $xeDateRangePicker.$nextTick(() => {
        const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
        const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
        if ($startDatePanel && $endDatePanel) {
          const startValue = $startDatePanel.getModelValue()
          if (!endValue && startValue) {
            $endDatePanel.setPanelDate(XEUtils.toStringDate(startValue))
          }
        }
      })
    },
    endPanelChangeEvent (params: any) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { selectStatus } = internalData
      const { value, $event } = params
      const startValue = selectStatus ? reactData.startValue : ''
      $xeDateRangePicker.handleChange(startValue, value, $event)
      $xeDateRangePicker.handleSelectClose()
      if (!selectStatus) {
        internalData.selectStatus = true
      }
      $xeDateRangePicker.$nextTick(() => {
        const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
        const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
        if ($startDatePanel && $endDatePanel) {
          const endValue = $endDatePanel.getModelValue()
          if (!startValue && endValue) {
            $startDatePanel.setPanelDate(XEUtils.toStringDate(endValue))
          }
        }
      })
    },
    // 全局事件
    handleGlobalMousedownEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel, isActivated } = reactData
      const el = $xeDateRangePicker.$refs.refElem as HTMLDivElement
      const panelWrapperElem = $xeDateRangePicker.$refs.refPanelWrapper as HTMLDivElement
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (!reactData.isActivated) {
          if (visiblePanel) {
            $xeDateRangePicker.checkValue()
            $xeDateRangePicker.hidePanel()
          }
        }
      }
    },
    handleGlobalMousewheelEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        if (visiblePanel) {
          const panelWrapperElem = $xeDateRangePicker.$refs.refPanelWrapper as HTMLDivElement
          if (getEventTargetNode(evnt, panelWrapperElem).flag) {
            $xeDateRangePicker.updatePlacement()
          } else {
            $xeDateRangePicker.hidePanel()
          }
        }
      }
    },
    handleGlobalBlurEvent () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel, isActivated } = reactData
      if (visiblePanel) {
        $xeDateRangePicker.hidePanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        const targetElem = $xeDateRangePicker.$refs.refInputTarget as HTMLInputElement
        if (targetElem) {
          targetElem.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeDateRangePicker.updatePlacement()
      }
    },
    // 弹出面板
    updateZindex () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      if (reactData.panelIndex < getLastZIndex()) {
        reactData.panelIndex = nextZIndex()
      }
    },
    updatePlacement () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData

      const { placement } = props
      const { panelIndex } = reactData
      const targetElem = $xeDateRangePicker.$refs.refInputTarget as HTMLInputElement
      const panelElem = $xeDateRangePicker.$refs.refInputPanel as HTMLDivElement
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
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
      return $xeDateRangePicker.$nextTick().then(handleStyle)
    },
    showPanel () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { visiblePanel } = reactData
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
      const panelElem = $xeDateRangePicker.$refs.refInputPanel as HTMLElement
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
        internalData.selectStatus = false
        reactData.isActivated = true
        reactData.isAniVisible = true
        setTimeout(() => {
          reactData.visiblePanel = true
        }, 10)
        $xeDateRangePicker.updateZindex()
        return $xeDateRangePicker.updatePlacement()
      }
      return $xeDateRangePicker.$nextTick()
    },
    dateRangePickerOpenEvent (evnt: Event) {
      const $xeDateRangePicker = this

      const formReadonly = $xeDateRangePicker.computeFormReadonly
      if (!formReadonly) {
        evnt.preventDefault()
        $xeDateRangePicker.showPanel()
      }
    },
    clickEvent (evnt: Event & { type: 'click' }) {
      const $xeDateRangePicker = this

      $xeDateRangePicker.triggerEvent(evnt)
    },
    handleShortcutEvent  ({ option, $event }: VxeButtonGroupDefines.ClickEventParams) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData

      const { type } = props
      const shortcutOpts = $xeDateRangePicker.computeShortcutOpts
      const { autoClose } = shortcutOpts
      const { code, clickMethod } = option as VxeDateRangePickerDefines.ShortcutOption
      let startValue = reactData.startValue
      let endValue = reactData.endValue
      let value = $xeDateRangePicker.getRangeValue(startValue, endValue)
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
          const dateValueFormat = $xeDateRangePicker.computeDateValueFormat
          const firstDayOfWeek = $xeDateRangePicker.computeFirstDayOfWeek
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
              value = $xeDateRangePicker.getRangeValue(startValue, endValue)
              shortcutParams.value = value
              shortcutParams.startValue = startValue
              shortcutParams.endValue = endValue
              $xeDateRangePicker.handleChange(startValue, endValue, $event)
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
        $xeDateRangePicker.hidePanel()
      }
      $xeDateRangePicker.dispatchEvent('shortcut-click', shortcutParams, $event)
    },

    setModelValue (startValue: string, endValue: string) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      reactData.startValue = startValue || ''
      reactData.endValue = endValue || ''
      const value = $xeDateRangePicker.getRangeValue(startValue, endValue)
      $xeDateRangePicker.emitModel(value)
    },
    setModelValueByEvent (evnt: Event, startValue: string, endValue: string) {
      const $xeDateRangePicker = this

      $xeDateRangePicker.handleChange(startValue || '', endValue || '', evnt)
    },
    focus () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const inputElem = $xeDateRangePicker.$refs.refInputTarget as HTMLInputElement
      reactData.isActivated = true
      inputElem.focus()
      return $xeDateRangePicker.$nextTick()
    },
    blur () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const inputElem = $xeDateRangePicker.$refs.refInputTarget as HTMLInputElement
      inputElem.blur()
      reactData.isActivated = false
      return $xeDateRangePicker.$nextTick()
    },
    select () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const inputElem = $xeDateRangePicker.$refs.refInputTarget as HTMLInputElement
      inputElem.select()
      reactData.isActivated = false
      return $xeDateRangePicker.$nextTick()
    },

    //
    // Render
    //
    renderShortcutBtn (h: CreateElement, pos: 'top' | 'bottom' | 'left' | 'right' | 'header' | 'footer', isVertical?: boolean) {
      const $xeDateRangePicker = this

      const shortcutOpts = $xeDateRangePicker.computeShortcutOpts
      const { position, align, mode } = shortcutOpts
      const shortcutList = $xeDateRangePicker.computeShortcutList
      if (isEnableConf(shortcutOpts) && shortcutList.length && (position || 'left') === pos) {
        return h('div', {
          class: `vxe-date-range-picker--layout-${pos}-wrapper`
        }, [
          h(VxeButtonGroupComponent, {
            props: {
              options: shortcutList,
              mode,
              align,
              vertical: isVertical
            },
            on: {
              click: $xeDateRangePicker.handleShortcutEvent
            }
          })
        ])
      }
      return renderEmptyElement($xeDateRangePicker)
    },
    renderPanel (h: CreateElement) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const slots = $xeDateRangePicker.$scopedSlots
      const reactData = $xeDateRangePicker.reactData

      const { type, separator, autoClose, showConfirmButton, showClearButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, startValue, endValue } = reactData
      const vSize = $xeDateRangePicker.computeSize
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
      const shortcutOpts = $xeDateRangePicker.computeShortcutOpts
      const isClearable = $xeDateRangePicker.computeIsClearable
      const panelLabelObj = $xeDateRangePicker.computePanelLabelObj
      const shortcutList = $xeDateRangePicker.computeShortcutList
      const isDateTimeType = $xeDateRangePicker.computeIsDateTimeType
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
      return h('div', {
        ref: 'refInputPanel',
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
        attrs: {
          placement: panelPlacement
        },
        style: panelStyle
      }, initialized && (visiblePanel || isAniVisible)
        ? [
            h('div', {
              ref: 'refPanelWrapper',
              class: ['vxe-date-range-picker--layout-all-wrapper', `type--${type}`, {
                [`size--${vSize}`]: vSize
              }]
            }, [
              topSlot
                ? h('div', {
                  class: 'vxe-date-range-picker--layout-top-wrapper'
                }, topSlot({}))
                : $xeDateRangePicker.renderShortcutBtn(h, 'top'),
              h('div', {
                class: 'vxe-date-range-picker--layout-body-layout-wrapper'
              }, [
                leftSlot
                  ? h('div', {
                    class: 'vxe-date-range-picker--layout-left-wrapper'
                  }, leftSlot({}))
                  : $xeDateRangePicker.renderShortcutBtn(h, 'left', true),
                h('div', {
                  class: 'vxe-date-range-picker--layout-body-content-wrapper'
                }, [
                  headerSlot
                    ? h('div', {
                      class: 'vxe-date-range-picker--layout-header-wrapper'
                    }, headerSlot({}))
                    : $xeDateRangePicker.renderShortcutBtn(h, 'header'),
                  h('div', {
                    class: 'vxe-date-range-picker--layout-body-wrapper'
                  }, [
                    h(VxeDatePanelComponent, {
                      ref: 'refStartDatePanel',
                      props: {
                        value: startValue,
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        endDate: endValue,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        timeFormat: props.timeFormat,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDateRangePicker.startPanelChangeEvent
                      }
                    }),
                    h(VxeDatePanelComponent, {
                      ref: 'refEndDatePanel',
                      props: {
                        value: endValue,
                        type: props.type,
                        className: props.className,
                        minDate: props.minDate,
                        maxDate: props.maxDate,
                        startDate: startValue,
                        startDay: props.startDay,
                        labelFormat: props.labelFormat,
                        valueFormat: props.valueFormat,
                        timeFormat: props.timeFormat,
                        festivalMethod: props.festivalMethod,
                        disabledMethod: props.disabledMethod,
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDateRangePicker.endPanelChangeEvent
                      }
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
                    }, footerSlot ? footerSlot({}) : [$xeDateRangePicker.renderShortcutBtn(h, 'footer')]),
                    h('div', {
                      class: 'vxe-date-range-picker--layout-footer-btns'
                    }, [
                      showClearBtn
                        ? h(VxeButtonComponent, {
                          props: {
                            size: 'mini',
                            disabled: !(startValue || endValue),
                            content: getI18n('vxe.button.clear')
                          },
                          on: {
                            click: $xeDateRangePicker.clearValueEvent
                          }
                        })
                        : renderEmptyElement($xeDateRangePicker),
                      showConfirmBtn
                        ? h(VxeButtonComponent, {
                          props: {
                            size: 'mini',
                            status: 'primary',
                            content: getI18n('vxe.button.confirm')
                          },
                          on: {
                            click: $xeDateRangePicker.confirmEvent
                          }
                        })
                        : renderEmptyElement($xeDateRangePicker)
                    ])
                  ])
                ]),
                rightSlot
                  ? h('div', {
                    class: 'vxe-date-range-picker--layout-right-wrapper'
                  }, rightSlot({}))
                  : $xeDateRangePicker.renderShortcutBtn(h, 'right', true)
              ]),
              bottomSlot
                ? h('div', {
                  class: 'vxe-date-range-picker--layout-bottom-wrapper'
                }, bottomSlot({}))
                : $xeDateRangePicker.renderShortcutBtn(h, 'bottom')
            ])
          ]
        : [])
    },
    renderPrefixIcon (h: CreateElement) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const slots = $xeDateRangePicker.$scopedSlots

      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-date-range-picker--prefix',
          on: {
            click: $xeDateRangePicker.clickPrefixEvent
          }
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
    },
    renderSuffixIcon (h: CreateElement) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const slots = $xeDateRangePicker.$scopedSlots
      const reactData = $xeDateRangePicker.reactData

      const { suffixIcon } = props
      const { startValue, endValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      const isClearable = $xeDateRangePicker.computeIsClearable
      return h('div', {
        class: ['vxe-date-range-picker--suffix', {
          'is--clear': isClearable && !isDisabled && (startValue || endValue)
        }]
      }, [
        isClearable
          ? h('div', {
            class: 'vxe-date-range-picker--clear-icon',
            on: {
              click: $xeDateRangePicker.clearValueEvent
            }
          }, [
            h('i', {
              class: getIcon().INPUT_CLEAR
            })
          ])
          : renderEmptyElement($xeDateRangePicker),
        $xeDateRangePicker.renderExtraSuffixIcon(h),
        suffixSlot || suffixIcon
          ? h('div', {
            class: 'vxe-date-range-picker--suffix-icon',
            on: {
              click: $xeDateRangePicker.clickSuffixEvent
            }
          }, suffixSlot
            ? getSlotVNs(suffixSlot({}))
            : [
                h('i', {
                  class: suffixIcon
                })
              ])
          : renderEmptyElement($xeDateRangePicker)
      ])
    },
    renderExtraSuffixIcon (h: CreateElement) {
      const $xeDateRangePicker = this

      return h('div', {
        class: 'vxe-date-range-picker--control-icon',
        on: {
          click: $xeDateRangePicker.dateRangePickerOpenEvent
        }
      }, [
        h('i', {
          class: ['vxe-date-range-picker--date-picker-icon', getIcon().DATE_PICKER_DATE]
        })
      ])
    },
    renderVN (h: CreateElement) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData

      const { className, type, name, autoComplete } = props
      const { startValue, endValue, visiblePanel, isActivated } = reactData
      const vSize = $xeDateRangePicker.computeSize
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      const formReadonly = $xeDateRangePicker.computeFormReadonly
      const inputLabel = $xeDateRangePicker.computeInputLabel
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-date-range-picker--readonly', `type--${type}`, className]
        }, inputLabel)
      }
      const inpPlaceholder = $xeDateRangePicker.computeInpPlaceholder
      const isClearable = $xeDateRangePicker.computeIsClearable
      const prefix = $xeDateRangePicker.renderPrefixIcon(h)
      const suffix = $xeDateRangePicker.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-date-range-picker', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--visible': visiblePanel,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && (startValue || endValue)
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        prefix || renderEmptyElement($xeDateRangePicker),
        h('div', {
          class: 'vxe-date-range-picker--wrapper'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-date-range-picker--inner',
            domProps: {
              value: inputLabel
            },
            attrs: {
              name,
              type: 'text',
              placeholder: inpPlaceholder,
              readonly: true,
              disabled: isDisabled,
              autocomplete: autoComplete
            },
            on: {
              keydown: $xeDateRangePicker.keydownEvent,
              keyup: $xeDateRangePicker.keyupEvent,
              click: $xeDateRangePicker.clickEvent,
              change: $xeDateRangePicker.changeEvent,
              focus: $xeDateRangePicker.focusEvent,
              blur: $xeDateRangePicker.blurEvent
            }
          })
        ]),
        suffix || renderEmptyElement($xeDateRangePicker),
        // 下拉面板
        $xeDateRangePicker.renderPanel(h)
      ])
    }
  },
  watch: {
    value () {
      const $xeDateRangePicker = this

      $xeDateRangePicker.updateModelValue(true)
    },
    computeMVal () {
      const $xeDateRangePicker = this

      $xeDateRangePicker.updateModelValue(false)
    }
  },
  created () {
    const $xeDateRangePicker = this

    $xeDateRangePicker.updateModelValue(true)

    globalEvents.on($xeDateRangePicker, 'mousewheel', $xeDateRangePicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeDateRangePicker, 'mousedown', $xeDateRangePicker.handleGlobalMousedownEvent)
    globalEvents.on($xeDateRangePicker, 'blur', $xeDateRangePicker.handleGlobalBlurEvent)
    globalEvents.on($xeDateRangePicker, 'resize', $xeDateRangePicker.handleGlobalResizeEvent)
  },
  deactivated () {
    const $xeDateRangePicker = this

    $xeDateRangePicker.checkValue()
  },
  beforeDestroy () {
    const $xeDateRangePicker = this

    const panelElem = $xeDateRangePicker.$refs.refInputPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    $xeDateRangePicker.checkValue()
    globalEvents.off($xeDateRangePicker, 'mousewheel')
    globalEvents.off($xeDateRangePicker, 'mousedown')
    globalEvents.off($xeDateRangePicker, 'blur')
    globalEvents.off($xeDateRangePicker, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
