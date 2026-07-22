import { PropType, CreateElement } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, globalEvents, createEvent, GLOBAL_EVENT_KEYS, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode, getPopupContainer } from '../../ui/src/dom'
import { parseDateString, parseDateObj, getRangeDateByCode, handleValueFormat, hasTimestampValueType, hasDateValueType, parseDateValue, getNextMonth, getPrevMonth, getNextYear, getPrevYear } from '../../date-panel/src/util'
import { getSlotVNs } from '../../ui/src/vn'
import { createComponentLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel/src/date-panel'
import VxeButtonComponent from '../../button/src/button'
import VxeButtonGroupComponent from '../../button/src/button-group'

import type { VxeDateRangePickerConstructor, VxeDateRangePickerEmits, DateRangePickerReactData, DateRangePickerInternalData, VxeButtonGroupDefines, VxeComponentSizeType, VxeDateRangePickerPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDateRangePickerDefines, VxeDatePanelConstructor } from '../../../types'
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
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: DateRangePickerInternalData
      }),
      xID,
      reactData
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
      const popupOpts = $xeDateRangePicker.computePopupOpts as VxeDateRangePickerPropTypes.PopupConfig
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
    computeDefaultDates () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

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
    },
    computeDefaultTimes () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

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
    },
    computeMVal () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { startValue, endValue } = props
      return `${startValue || ''}${endValue || ''}`
    },
    computeIsTimeType () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type } = props
      return type === 'time'
    },
    computeIsTimeOrDateTimeType () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { type } = props
      const isTimeType = $xeDateRangePicker.computeIsTimeType
      return isTimeType || type === 'datetime'
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
    computeTimeOpts () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return Object.assign({}, getConfig().dateRangePicker.timeConfig, props.timeConfig)
    },
    computePopupOpts () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      return Object.assign({}, getConfig().dateRangePicker.popupConfig, props.popupConfig)
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

      const { selectStValue, selectEdValue } = reactData
      const vals: string[] = selectStValue || selectEdValue ? [selectStValue || '', selectEdValue || ''] : []
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
      $xeDateRangePicker.$emit(type, createEvent(evnt, { $dateRangePicker: $xeDateRangePicker }, params))
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
    getRangeValue (sValue: string | number | Date | null, eValue: string | number | Date | null) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { value: modelValue, valueType, valueFormat } = props
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

      const { value: modelValue, startValue, endValue, valueFormat } = props
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
    },
    triggerEvent (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'click' | 'focus' | 'blur' }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { selectStValue, selectEdValue } = reactData
      const value = $xeDateRangePicker.getRangeValue(selectStValue, selectEdValue)
      $xeDateRangePicker.dispatchEvent(evnt.type, { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
    },
    handleChange (sValue: string, eValue: string, evnt: Event | { type: string }) {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData
      const $xeForm = $xeDateRangePicker.$xeForm
      const formItemInfo = $xeDateRangePicker.formItemInfo

      const { type, value: modelValue, valueFormat } = props
      const dateValueFormat = $xeDateRangePicker.computeDateValueFormat
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
      const value = $xeDateRangePicker.getRangeValue(startRest, endRest)
      const isFinish = (startRest && endRest) || (!startRest && !endRest)
      $xeDateRangePicker.emitModel(value)
      $xeDateRangePicker.$emit('update:startValue', startRest || '')
      $xeDateRangePicker.$emit('update:endValue', endRest || '')
      if (XEUtils.toValueString(modelValue) !== value) {
        $xeDateRangePicker.dispatchEvent('change', { value, startValue: startRest, endValue: endRest, isFinish }, evnt as any)
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

      const popupOpts = $xeDateRangePicker.computePopupOpts
      const { trigger } = popupOpts
      reactData.isActivated = true
      if (!trigger || trigger === 'default') {
        $xeDateRangePicker.dateRangePickerOpenEvent(evnt)
      } else if (trigger === 'icon') {
        $xeDateRangePicker.hidePanel()
      }
      $xeDateRangePicker.triggerEvent(evnt)
    },
    clickPrefixEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        const { selectStValue, selectEdValue } = reactData
        const value = $xeDateRangePicker.getRangeValue(selectStValue, selectEdValue)
        $xeDateRangePicker.dispatchEvent('prefix-click', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
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
      const startValue = ''
      const endValue = ''
      $xeDateRangePicker.handleChange(startValue, endValue, evnt)
      $xeDateRangePicker.dispatchEvent('clear', { value, startValue, endValue }, evnt)
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
    panelCellClassName ({ date }: { date: Date }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

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
    },
    handleSelectClose () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { autoClose } = props
      const { selectStValue, selectEdValue } = reactData
      const { selectStatus } = internalData
      const isDatePickerType = $xeDateRangePicker.computeIsDatePickerType
      if (autoClose) {
        if (selectStatus && isDatePickerType) {
          if (selectStValue && selectEdValue) {
            $xeDateRangePicker.hidePanel()
          }
        }
      } else {
        if (selectStValue && selectEdValue) {
          internalData.selectStatus = false
        }
      }
    },
    clickSuffixEvent (evnt: Event) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        const { selectStValue, selectEdValue } = reactData
        const value = $xeDateRangePicker.getRangeValue(selectStValue, selectEdValue)
        $xeDateRangePicker.dispatchEvent('suffix-click', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
      }
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const $xeForm = $xeDateRangePicker.$xeForm
      const formItemInfo = $xeDateRangePicker.formItemInfo

      const { selectStValue, selectEdValue } = reactData
      const inpImmediate = $xeDateRangePicker.computeInpImmediate
      const value = ''
      if (!inpImmediate) {
        $xeDateRangePicker.handleChange(selectStValue, selectEdValue, evnt)
      }
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      $xeDateRangePicker.dispatchEvent('blur', { value, startValue: selectStValue, endValue: selectEdValue }, evnt)
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

      const isTimeType = $xeDateRangePicker.computeIsTimeType
      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
      if ($startDatePanel && $endDatePanel) {
        const startValue = $startDatePanel.getModelValue()
        const endValue = $endDatePanel.getModelValue()
        if (isTimeType) {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        } else if ((startValue && !endValue) || (!startValue && endValue)) {
          $xeDateRangePicker.handleChange('', '', evnt)
        } else {
          $startDatePanel.confirmByEvent(evnt)
          $endDatePanel.confirmByEvent(evnt)
        }
        const value = $xeDateRangePicker.getRangeValue(startValue, endValue)
        $xeDateRangePicker.dispatchEvent('confirm', { value, startValue, endValue }, evnt)
      }
      $xeDateRangePicker.hidePanel()
    },
    startPanelChangeEvent (params: any) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

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
      $xeDateRangePicker.handleChange(startValue, endValue, $event)
      $xeDateRangePicker.handleSelectClose()
      if (selectStatus) {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      } else {
        internalData.selectStatus = true
      }
      $xeDateRangePicker.$nextTick(() => {
        $xeDateRangePicker.handleUpdateStartPanelDate()
      })
    },
    endPanelChangeEvent (params: any) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

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
      $xeDateRangePicker.handleChange(startValue, endValue, $event)
      $xeDateRangePicker.handleSelectClose()
      if (selectStatus) {
        if (startValue && endValue) {
          internalData.selectStatus = false
        }
      } else {
        internalData.selectStatus = true
      }
      $xeDateRangePicker.$nextTick(() => {
        $xeDateRangePicker.handleUpdateEndPanelDate()
      })
    },
    handleUpdateStartPanelDate () {
      const $xeDateRangePicker = this

      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
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
          const yearList = $startDatePanel.computeYearList
          if (yearList.some((item) => XEUtils.isDateSame(item.date, endPanelDate, 'yyyy'))) {
            $endDatePanel.setPanelDate(getNextYear(startPanelDate, yearList.length))
          }
          break
        }
      }
    },
    startPanelDateBtnChangeEvent () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { linkedPanels } = props
      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
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
            const yearList = $startDatePanel.computeYearList
            $endDatePanel.setPanelDate(getNextYear(startPanelDate, yearList.length))
            break
          }
        }
      } else {
        $xeDateRangePicker.handleUpdateStartPanelDate()
      }
    },
    handleUpdateEndPanelDate () {
      const $xeDateRangePicker = this

      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
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
          const yearList = $endDatePanel.computeYearList
          if (yearList.some((item) => XEUtils.isDateSame(item.date, startPanelDate, 'yyyy'))) {
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate, yearList.length))
          }
          break
        }
      }
    },
    endPanelDateBtnChangeEvent () {
      const $xeDateRangePicker = this
      const props = $xeDateRangePicker

      const { linkedPanels } = props
      const $startDatePanel = $xeDateRangePicker.$refs.refStartDatePanel as VxeDatePanelConstructor
      const $endDatePanel = $xeDateRangePicker.$refs.refEndDatePanel as VxeDatePanelConstructor
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
            const yearList = $endDatePanel.computeYearList
            $startDatePanel.setPanelDate(getPrevYear(endPanelDate, yearList.length))
            break
          }
        }
      } else {
        $xeDateRangePicker.handleUpdateEndPanelDate()
      }
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
    handleGlobalKeydownEvent (evnt: KeyboardEvent) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        if (isTab) {
          reactData.isActivated = false
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
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
            $xeDateRangePicker.checkValue()
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
        $xeDateRangePicker.checkValue()
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
      const props = $xeDateRangePicker
      const reactData = $xeDateRangePicker.reactData

      const popupOpts = $xeDateRangePicker.computePopupOpts
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
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
      if (!panelElem) {
        return $xeDateRangePicker.$nextTick()
      }
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
      const popupOpts = $xeDateRangePicker.computePopupOpts
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
      return $xeDateRangePicker.$nextTick().then(handleStyle)
    },
    showPanel () {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData
      const internalData = $xeDateRangePicker.internalData

      const { visiblePanel } = reactData
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
      const popupOpts = $xeDateRangePicker.computePopupOpts
      const panelElem = $xeDateRangePicker.$refs.refInputPanel as HTMLElement
      if (!isDisabled && !visiblePanel) {
        if (!reactData.initialized) {
          reactData.initialized = true
          if (btnTransfer && panelElem) {
            const { appendTo } = popupOpts
            getPopupContainer(appendTo).appendChild(panelElem)
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
          $xeDateRangePicker.handleUpdateStartPanelDate()
          $xeDateRangePicker.updatePlacement()
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
    clickIconEvent (evnt: MouseEvent) {
      const $xeDateRangePicker = this
      const reactData = $xeDateRangePicker.reactData

      const { visiblePanel } = reactData
      const popupOpts = $xeDateRangePicker.computePopupOpts
      const { trigger } = popupOpts
      if (!trigger || trigger === 'default' || trigger === 'icon') {
        if (visiblePanel) {
          $xeDateRangePicker.hidePanel()
        } else {
          $xeDateRangePicker.dateRangePickerOpenEvent(evnt)
        }
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
      let startValue = reactData.selectStValue
      let endValue = reactData.selectEdValue
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

      reactData.selectStValue = startValue || ''
      reactData.selectEdValue = endValue || ''
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

      const popupOpts = $xeDateRangePicker.computePopupOpts
      if (popupOpts.enabled === false) {
        return renderEmptyElement($xeDateRangePicker)
      }
      const { type, separator, autoClose, valueFormat, showConfirmButton, showClearButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, selectStValue, selectEdValue, paneStartVal, paneEndVal } = reactData
      const vSize = $xeDateRangePicker.computeSize
      const btnTransfer = $xeDateRangePicker.computeBtnTransfer
      const shortcutOpts = $xeDateRangePicker.computeShortcutOpts
      const isClearable = $xeDateRangePicker.computeIsClearable
      const panelLabelObj = $xeDateRangePicker.computePanelLabelObj
      const shortcutList = $xeDateRangePicker.computeShortcutList
      const isTimeType = $xeDateRangePicker.computeIsTimeType
      const isTimeOrDateTimeType = $xeDateRangePicker.computeIsTimeOrDateTimeType
      const defaultDates = $xeDateRangePicker.computeDefaultDates
      const defaultTimes = $xeDateRangePicker.computeDefaultTimes
      const timeOpts = $xeDateRangePicker.computeTimeOpts
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
      return h('div', {
        ref: 'refInputPanel',
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
                        value: paneStartVal,
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
                        cellClassName: $xeDateRangePicker.panelCellClassName,
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDateRangePicker.startPanelChangeEvent,
                        datePrev: $xeDateRangePicker.endPanelDateBtnChangeEvent,
                        dateToday: $xeDateRangePicker.endPanelDateBtnChangeEvent,
                        dateNext: $xeDateRangePicker.endPanelDateBtnChangeEvent
                      }
                    }),
                    h(VxeDatePanelComponent, {
                      ref: 'refEndDatePanel',
                      props: {
                        value: paneEndVal,
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
                        cellClassName: $xeDateRangePicker.panelCellClassName,
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDateRangePicker.endPanelChangeEvent,
                        datePrev: $xeDateRangePicker.endPanelDateBtnChangeEvent,
                        dateToday: $xeDateRangePicker.endPanelDateBtnChangeEvent,
                        dateNext: $xeDateRangePicker.endPanelDateBtnChangeEvent
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
                      : `${separator || ''}`),
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
                            disabled: !(selectStValue || selectEdValue),
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
      const { selectStValue, selectEdValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = $xeDateRangePicker.computeIsDisabled
      const isClearable = $xeDateRangePicker.computeIsClearable
      return h('div', {
        class: ['vxe-date-range-picker--suffix', {
          'is--clear': isClearable && !isDisabled && (selectStValue || selectEdValue)
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
      const { selectStValue, selectEdValue, visiblePanel, isActivated } = reactData
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
          'show--clear': isClearable && !isDisabled && (selectStValue || selectEdValue)
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
              editable: false,
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

    $xeDateRangePicker.internalData = createInternalData()

    $xeDateRangePicker.updateModelValue(true)

    globalEvents.on($xeDateRangePicker, 'mousewheel', $xeDateRangePicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeDateRangePicker, 'mousedown', $xeDateRangePicker.handleGlobalMousedownEvent)
    globalEvents.on($xeDateRangePicker, 'keydown', $xeDateRangePicker.handleGlobalKeydownEvent)
    globalEvents.on($xeDateRangePicker, 'blur', $xeDateRangePicker.handleGlobalBlurEvent)
    globalEvents.on($xeDateRangePicker, 'resize', $xeDateRangePicker.handleGlobalResizeEvent)
  },
  deactivated () {
    const $xeDateRangePicker = this

    $xeDateRangePicker.checkValue()
  },
  beforeDestroy () {
    const $xeDateRangePicker = this
    const reactData = $xeDateRangePicker.reactData
    const internalData = $xeDateRangePicker.internalData

    const panelElem = $xeDateRangePicker.$refs.refInputPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    $xeDateRangePicker.checkValue()
    globalEvents.off($xeDateRangePicker, 'mousewheel')
    globalEvents.off($xeDateRangePicker, 'mousedown')
    globalEvents.off($xeDateRangePicker, 'blur')
    globalEvents.off($xeDateRangePicker, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
