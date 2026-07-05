import { PropType, CreateElement } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, commands, createEvent, globalEvents, GLOBAL_EVENT_KEYS, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, getLastZIndex, nextZIndex, isEnableConf } from '../../ui/src/utils'
import { updatePanelPlacement, getEventTargetNode, hasControlKey } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { parseDateObj, parseDateValue, getDateByCode, handleValueFormat, hasDateValueType, hasTimestampValueType, isAllSameChar, getChunkDefaultNum, checkDateInputFormat } from '../../date-panel/src/util'
import { createComponentLog } from '../../ui/src/log'
import VxeDatePanelComponent from '../../date-panel'
import VxeButtonComponent from '../../button'
import VxeButtonGroupComponent from '../../button-group'

import type { VxeDatePickerConstructor, VxeDatePickerEmits, DatePickerInternalData, DatePickerReactData, VxeButtonGroupDefines, VxeComponentSizeType, VxeDatePanelDefines, VxeDatePickerPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf, VxeModalConstructor, VxeDrawerConstructor, VxeModalMethods, VxeDrawerMethods, VxeDatePickerDefines, VxeDatePanelConstructor } from '../../../types'
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
    value: [String, Number, Date, Array] as PropType<VxeDatePickerPropTypes.ModelValue>,
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
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: DatePickerInternalData
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
      const $xeDatePicker = this
      const props = $xeDatePicker
      const $xeTable = $xeDatePicker.$xeTable
      const $xeModal = $xeDatePicker.$xeModal
      const $xeDrawer = $xeDatePicker.$xeDrawer
      const $xeForm = $xeDatePicker.$xeForm

      const { transfer } = props
      const popupOpts = $xeDatePicker.computePopupOpts as VxeDatePickerPropTypes.PopupConfig
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
    computeIsDatePanelType () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      return isDateTimeType || ['date', 'week', 'month', 'quarter', 'year'].indexOf(props.type) > -1
    },
    computeDateListValue () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { value: modelValue, type, multiple } = props
      const isDatePanelType = $xeDatePicker.computeIsDatePanelType
      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
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
    },
    computeDateStartDate  () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.startDate ? XEUtils.toStringDate(props.startDate) : null
    },
    computeDateEndDate  () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.endDate ? XEUtils.toStringDate(props.endDate) : null
    },
    computeLimitMaxCount () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return props.multiple ? XEUtils.toNumber(props.limitCount) : 0
    },
    computeDateMultipleValue () {
      const $xeDatePicker = this

      const dateListValue = $xeDatePicker.computeDateListValue as Date[]
      const dateValueFormat = $xeDatePicker.computeDateValueFormat as string
      return dateListValue.map(date => XEUtils.toDateString(date, dateValueFormat))
    },
    computeOverCount () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { multiple } = props
      const limitMaxCount = $xeDatePicker.computeLimitMaxCount as number
      const dateMultipleValue = $xeDatePicker.computeDateMultipleValue as string[]
      if (multiple && limitMaxCount) {
        return dateMultipleValue.length >= limitMaxCount
      }
      return false
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
    computeTimeOpts () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return Object.assign({}, getConfig().datePicker.timeConfig, props.timeConfig)
    },
    computePopupOpts () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return Object.assign({}, getConfig().datePicker.popupConfig, props.popupConfig)
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
      return handleValueFormat(type, valueFormat)
    },
    computeDateMaskedFormat () {
      const $xeDatePicker = this

      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat as string
      return dateLabelFormat
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
    },
    computeMaskedOpts () {
      const $xeDatePicker = this
      const props = $xeDatePicker

      return Object.assign({}, getConfig().datePicker.maskedConfig, props.maskedConfig)
    },
    computeMaskChar () {
      const $xeDatePicker = this

      const maskedOpts = $xeDatePicker.computeMaskedOpts as VxeDatePickerPropTypes.MaskedConfig
      const { maskPlaceholder } = maskedOpts
      return (maskPlaceholder ? ('' + maskPlaceholder)[0] : '') || defaultMaskPlaceholder
    }
  },
  methods: {

    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeDatePickerEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeDatePicker = this
      $xeDatePicker.$emit(type, createEvent(evnt, { $datePicker: $xeDatePicker }, params))
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
    handleInputLabel (text: string, isUpdate?: boolean) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      internalData.inputLabel = text
      if (isUpdate) {
        reactData.labelFlag++
      }
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

      const { type, value: modelValue, valueFormat } = props
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      reactData.inputValue = value
      if (hasTimestampValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        const timeNum = dateVal ? dateVal.getTime() : null
        $xeDatePicker.emitModel(timeNum)
        if (modelValue !== timeNum) {
          $xeDatePicker.dispatchEvent('change', { value: timeNum }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, timeNum)
          }
        }
      } else if (hasDateValueType(valueFormat)) {
        const dateVal = parseDateValue(value, type, { valueFormat: dateValueFormat })
        $xeDatePicker.emitModel(dateVal)
        if (modelValue && dateVal ? XEUtils.toStringDate(modelValue).getTime() !== dateVal.getTime() : modelValue !== dateVal) {
          $xeDatePicker.dispatchEvent('change', { value: dateVal }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, dateVal)
          }
        }
      } else {
        $xeDatePicker.emitModel(value)
        if (XEUtils.toValueString(modelValue) !== value) {
          $xeDatePicker.dispatchEvent('change', { value }, evnt as Event)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    },
    inputEvent (evnt: Event & { type: 'input' }) {
      const $xeDatePicker = this

      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      $xeDatePicker.handleInputLabel(value, true)
      $xeDatePicker.dispatchEvent('input', { value }, evnt)
    },
    changeEvent (evnt: Event & { type: 'change' }) {
      const $xeDatePicker = this

      const inpImmediate = $xeDatePicker.computeInpImmediate
      if (!inpImmediate) {
        $xeDatePicker.triggerEvent(evnt)
      }
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
    dateChange (date: Date, isReload?: boolean) {
      const $xeDatePicker = this
      const props = $xeDatePicker

      const { value: modelValue, multiple } = props
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      const dateValueFormat = $xeDatePicker.computeDateValueFormat
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      if (props.type === 'week') {
        const sWeek = XEUtils.toNumber(props.selectDay) as VxeDatePickerPropTypes.SelectDay
        date = XEUtils.getWhatWeek(date, 0, sWeek, firstDayOfWeek)
      }
      const inpVal = XEUtils.toDateString(date, dateValueFormat, { firstDay: firstDayOfWeek })
      if (multiple) {
        const overCount = $xeDatePicker.computeOverCount
        // 如果为多选
        if (isDateTimeType) {
          // 如果是datetime特殊类型
          const dateListValue = isReload ? [] : [...$xeDatePicker.computeDateListValue]
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
          $xeDatePicker.handleChange(datetimeRest.map(date => XEUtils.toDateString(date, dateValueFormat)).join(','), { type: 'update' })
        } else {
          const dateMultipleValue = isReload ? [] : $xeDatePicker.computeDateMultipleValue
          // 如果是日期类型
          if (dateMultipleValue.some(val => XEUtils.isEqual(val, inpVal))) {
            $xeDatePicker.handleChange(dateMultipleValue.filter(val => !XEUtils.isEqual(val, inpVal)).join(','), { type: 'update' })
          } else {
            if (overCount) {
              // 如果超出最大多选数量
              return
            }
            $xeDatePicker.handleChange(dateMultipleValue.concat([inpVal]).join(','), { type: 'update' })
          }
        }
      } else {
        // 如果为单选
        if (!XEUtils.isEqual(modelValue, inpVal)) {
          $xeDatePicker.handleChange(inpVal, { type: 'update' })
        }
      }
    },
    dateRevert () {
      const $xeDatePicker = this

      const panelLabel = $xeDatePicker.computePanelLabel
      $xeDatePicker.handleInputLabel(panelLabel, true)
    },
    afterCheckValue (inpVal: string) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { type, editable, multiple, maskedConfig } = props
      const { inputLabel } = internalData
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat
      const maskedOpts = $xeDatePicker.computeMaskedOpts
      const dateStartDate = $xeDatePicker.computeDateStartDate
      const dateEndDate = $xeDatePicker.computeDateEndDate
      if (!inpVal) {
        $xeDatePicker.handleChange('', { type: 'check' })
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

      const $datePanel = $xeDatePicker.$refs.refDatePanel as VxeDatePanelConstructor
      if ($datePanel) {
        return $datePanel.checkValue(inpVal)
      }

      let inpDateVal: VxeDatePickerPropTypes.ModelValue = parseDateValue(inpVal, type, {
        valueFormat: dateLabelFormat
      })
      if (!XEUtils.isValidDate(inpDateVal)) {
        $xeDatePicker.dateRevert()
        return
      }
      if (type === 'time') {
        inpDateVal = XEUtils.toDateString(inpDateVal, dateLabelFormat)
        if (inputLabel !== inpDateVal) {
          $xeDatePicker.handleChange(inpDateVal, { type: 'check' })
        }
        $xeDatePicker.handleInputLabel(inpDateVal, true)
        return
      }
      if (dateEndDate && inpDateVal > dateEndDate) {
        inpDateVal = dateEndDate
      }
      if (dateStartDate && inpDateVal < dateStartDate) {
        inpDateVal = dateStartDate
      }
      let isChange = false
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      if (type === 'datetime') {
        const dateValue = reactData.inputValue
        if (inpVal !== XEUtils.toDateString(dateValue, dateLabelFormat) || inpVal !== XEUtils.toDateString(inpDateVal, dateLabelFormat)) {
          isChange = true
        }
      } else {
        isChange = true
      }
      const label = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
      $xeDatePicker.handleInputLabel(label, true)
      if (isChange) {
        $xeDatePicker.dateChange(inpDateVal)
      }
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
    checkMaskedInputValue (numStr: string, chunkFormat: string, isFull: boolean) {
      const $xeDatePicker = this

      const maskedOpts = $xeDatePicker.computeMaskedOpts
      const { align } = maskedOpts
      const maskChar = $xeDatePicker.computeMaskChar
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
      return XEUtils[align === 'right' ? 'padStart' : 'padEnd'](restVal, chunkFormat.length, maskChar)
    },
    handleArrowInputDate (evnt: KeyboardEvent, isUpArrow: boolean, isDwArrow: boolean, isLtArrow: boolean, isRtArrow: boolean) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const internalData = $xeDatePicker.internalData

      const { type, multiple } = props
      if (multiple) {
        return
      }
      const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      if (!targetElem) {
        return
      }
      const inpValue = targetElem.value
      if (!inpValue) {
        return
      }
      const dateMaskedFormat = $xeDatePicker.computeDateMaskedFormat
      const dateLabelFormat = $xeDatePicker.computeDateLabelFormat
      const firstDayOfWeek = $xeDatePicker.computeFirstDayOfWeek
      const maskChar = $xeDatePicker.computeMaskChar
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
          const restValue = inpValue.slice(0, chunkStartIndex) + $xeDatePicker.checkMaskedInputValue('' + chunkNum, chunkFormat, true) + inpValue.slice(chunkEndIndex)
          evnt.preventDefault()
          if (restValue.indexOf(maskChar) === -1) {
            // 解析日期
            const inpDateVal: VxeDatePickerPropTypes.ModelValue = parseDateValue(restValue, type, {
              valueFormat: dateLabelFormat
            })
            if (XEUtils.isValidDate(inpDateVal)) {
              const label = XEUtils.toDateString(inpDateVal, dateLabelFormat, { firstDay: firstDayOfWeek })
              targetElem.value = label
              $xeDatePicker.handleInputLabel(label, false)
            }
          } else {
            targetElem.value = restValue
            $xeDatePicker.handleInputLabel(restValue, false)
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
    },
    handleMaskedInputDate (evnt: KeyboardEvent) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const internalData = $xeDatePicker.internalData

      const { multiple } = props
      if (multiple) {
        return
      }
      const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
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
      const maskedOpts = $xeDatePicker.computeMaskedOpts
      const { align } = maskedOpts
      const dateMaskedFormat = $xeDatePicker.computeDateMaskedFormat
      const maskChar = $xeDatePicker.computeMaskChar
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
        chunkValue = $xeDatePicker.checkMaskedInputValue(chunkNumList.join(''), chunkFormat, false)
      } else if (isBackspaceKey) {
        chunkNumList.pop()
        chunkValue = XEUtils[align === 'right' ? 'padStart' : 'padEnd'](chunkNumList.join(''), chunkFormat.length, maskChar)
      }
      let restValue = inpValue.slice(0, chunkStartIndex) + chunkValue + inpValue.slice(chunkEndIndex)
      restValue = restValue.replace(new RegExp(`(${inputMaskedKeys.join('|')})`, 'g'), maskChar)

      targetElem.value = restValue
      $xeDatePicker.handleInputLabel(restValue, false)

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
                $xeDatePicker.handleInputLabel(restValue, false)
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
            $xeDatePicker.handleInputLabel(restValue, false)
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
    },
    handleMaskedSelectedDate (evnt: Event, isFocus?: boolean) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const internalData = $xeDatePicker.internalData

      const { type, multiple, value: modelValue } = props
      internalData.fsTimeout = undefined
      if (multiple) {
        return
      }
      if (!maskedTypes.includes(type)) {
        return
      }
      const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
      if (!targetElem) {
        return
      }
      const { laseFocusMasked } = internalData
      if (laseFocusMasked && Date.now() - laseFocusMasked < 100) {
        return
      }
      const dateMaskedFormat = $xeDatePicker.computeDateMaskedFormat
      const maskChar = $xeDatePicker.computeMaskChar
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
          $xeDatePicker.handleInputLabel(restValue, false)
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
          $xeDatePicker.handleInputLabel(restValue, false)
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
        evnt.preventDefault()
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
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData
      const $xeForm = $xeDatePicker.$xeForm
      const formItemInfo = $xeDatePicker.formItemInfo

      const { inputValue } = reactData
      const inpImmediate = $xeDatePicker.computeInpImmediate
      const value = inputValue
      if (!inpImmediate) {
        $xeDatePicker.handleChange(value, evnt)
      }
      if (!reactData.visiblePanel) {
        const { inputLabel } = internalData
        reactData.isActivated = false
        // 未打开面板时才校验
        $xeDatePicker.afterCheckValue(inputLabel)
      }
      $xeDatePicker.dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    focusEvent (evnt: KeyboardEvent & { type: 'focus' }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { fsTimeout } = internalData
      const { multiple, editable, maskedConfig } = props
      const maskedOpts = $xeDatePicker.computeMaskedOpts
      const popupOpts = $xeDatePicker.computePopupOpts
      const { trigger } = popupOpts
      reactData.isActivated = true
      if (fsTimeout) {
        clearTimeout(fsTimeout)
      }
      if (!trigger || trigger === 'default') {
        $xeDatePicker.datePickerOpenEvent(evnt)
      } else if (trigger === 'icon') {
        $xeDatePicker.hidePanel()
      }
      if (editable && !multiple && (isEnableConf(maskedConfig) || maskedOpts.enabled)) {
        internalData.fsTimeout = setTimeout(() => {
          $xeDatePicker.handleMaskedSelectedDate(evnt, true)
        }, 20)
      }
      $xeDatePicker.triggerEvent(evnt)
    },
    clickEvent (evnt: MouseEvent & { type: 'click' }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const internalData = $xeDatePicker.internalData

      const { multiple, editable, maskedConfig } = props
      const { fsTimeout } = internalData
      const maskedOpts = $xeDatePicker.computeMaskedOpts
      if (fsTimeout) {
        clearTimeout(fsTimeout)
      }
      if (editable && !multiple && (isEnableConf(maskedConfig) || maskedOpts.enabled)) {
        internalData.fsTimeout = setTimeout(() => {
          $xeDatePicker.handleMaskedSelectedDate(evnt)
        }, 10)
      }
      $xeDatePicker.triggerEvent(evnt)
    },
    keydownEvent (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { type, editable, maskedConfig } = props
      const { visiblePanel } = reactData
      const maskedOpts = $xeDatePicker.computeMaskedOpts
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      const isLtArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_LEFT)
      const isRtArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_RIGHT)
      const isEnter = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ENTER)
      if (editable) {
        if (isEnter) {
          const { inputLabel } = internalData
          if (visiblePanel) {
            $xeDatePicker.hidePanel()
          }
          $xeDatePicker.afterCheckValue(inputLabel)
        } else if (maskedTypes.includes(type)) {
          if (isEnableConf(maskedConfig) || maskedOpts.enabled) {
            if (maskedOpts.isArrow && (isUpArrow || isDwArrow || isLtArrow || isRtArrow)) {
              $xeDatePicker.handleArrowInputDate(evnt, isUpArrow, isDwArrow, isLtArrow, isRtArrow)
            } else if (maskedOpts.isMasked) {
              $xeDatePicker.handleMaskedInputDate(evnt)
            }
          }
        }
      }
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
    panelChangeEvent (params: VxeDatePickerDefines.ChangeEventParams) {
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
    panelConfirmEvent (params: VxeDatePanelDefines.ConfirmEventParams) {
      const $xeDatePicker = this

      $xeDatePicker.dispatchEvent('confirm', params, params.$event)
    },
    panelRevertEvent (params: VxeDatePanelDefines.RevertEventParams) {
      const $xeDatePicker = this

      $xeDatePicker.handleInputLabel(params.label, true)
    },
    // 全局事件
    handleGlobalMousedownEvent (evnt: Event) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData
      const internalData = $xeDatePicker.internalData

      const { visiblePanel, isActivated } = reactData
      const el = $xeDatePicker.$refs.refElem as HTMLDivElement
      const panelWrapperElem = $xeDatePicker.$refs.refPanelWrapper as HTMLDivElement
      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled && isActivated) {
        const currActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelWrapperElem).flag
        if (currActivated !== isActivated) {
          reactData.isActivated = currActivated
        }
        if (!currActivated) {
          if (visiblePanel) {
            $xeDatePicker.hidePanel()
            const { inputLabel } = internalData
            $xeDatePicker.afterCheckValue(inputLabel)
          }
        }
      }
    },
    handleGlobalKeydownEvent (evnt: KeyboardEvent) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { visiblePanel } = reactData
      const isDisabled = $xeDatePicker.computeIsDisabled
      if (!isDisabled) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
        if (isTab) {
          reactData.isActivated = false
        }
        if (visiblePanel) {
          if (isEsc || isTab) {
            $xeDatePicker.hidePanel()
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
      const internalData = $xeDatePicker.internalData

      const { isActivated, visiblePanel } = reactData
      if (visiblePanel) {
        $xeDatePicker.hidePanel()
      }
      if (isActivated) {
        reactData.isActivated = false
      }
      if (visiblePanel || isActivated) {
        $xeDatePicker.afterCheckValue(internalData.inputLabel)
        const targetElem = $xeDatePicker.$refs.refInputTarget as HTMLInputElement
        if (targetElem) {
          targetElem.blur()
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { visiblePanel } = reactData
      if (visiblePanel) {
        $xeDatePicker.updatePlacement()
      }
    },
    // 弹出面板
    updateZindex () {
      const $xeDatePicker = this
      const props = $xeDatePicker
      const reactData = $xeDatePicker.reactData

      const popupOpts = $xeDatePicker.computePopupOpts
      const customZIndex = popupOpts.zIndex || props.zIndex
      if (customZIndex) {
        reactData.panelIndex = XEUtils.toNumber(customZIndex)
      } else if (reactData.panelIndex < getLastZIndex()) {
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
      if (!panelElem) {
        return $xeDatePicker.$nextTick()
      }
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      const popupOpts = $xeDatePicker.computePopupOpts
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
          if (btnTransfer && panelElem) {
            document.body.appendChild(panelElem)
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
          $xeDatePicker.updatePlacement()
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
    clickIconEvent (evnt: MouseEvent) {
      const $xeDatePicker = this
      const reactData = $xeDatePicker.reactData

      const { visiblePanel } = reactData
      const popupOpts = $xeDatePicker.computePopupOpts
      const { trigger } = popupOpts
      if (!trigger || trigger === 'default' || trigger === 'icon') {
        if (visiblePanel) {
          $xeDatePicker.hidePanel()
        } else {
          $xeDatePicker.datePickerOpenEvent(evnt)
        }
      }
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

      const popupOpts = $xeDatePicker.computePopupOpts
      if (popupOpts.enabled === false) {
        return renderEmptyElement($xeDatePicker)
      }
      const { type, multiple, showClearButton, showConfirmButton } = props
      const { initialized, isAniVisible, visiblePanel, panelPlacement, panelStyle, inputValue } = reactData
      const vSize = $xeDatePicker.computeSize
      const btnTransfer = $xeDatePicker.computeBtnTransfer
      const shortcutOpts = $xeDatePicker.computeShortcutOpts
      const isClearable = $xeDatePicker.computeIsClearable
      const isDateTimeType = $xeDatePicker.computeIsDateTimeType
      const shortcutList = $xeDatePicker.computeShortcutList
      const timeOpts = $xeDatePicker.computeTimeOpts
      const dateStartDate = $xeDatePicker.computeDateStartDate
      const dateEndDate = $xeDatePicker.computeDateEndDate
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
              class: ['vxe-date-picker--layout-all-wrapper', `type--${type}`, ppClassName ? (XEUtils.isFunction(ppClassName) ? ppClassName({ $datePicker: $xeDatePicker }) : ppClassName) : '', {
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
                        selectDay: props.selectDay
                      },
                      on: {
                        change: $xeDatePicker.panelChangeEvent,
                        confirm: $xeDatePicker.panelConfirmEvent,
                        revert: $xeDatePicker.panelRevertEvent
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
          click: $xeDatePicker.clickIconEvent
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
      const internalData = $xeDatePicker.internalData

      const { className, type, name, autoComplete } = props
      const { inputValue, visiblePanel, isActivated, labelFlag } = reactData
      const { inputLabel } = internalData
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
              value: labelFlag ? inputLabel : ''
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

      $xeDatePicker.handleInputLabel(val, true)
    },
    value () {
      const $xeDatePicker = this

      $xeDatePicker.updateModelValue()
    }
  },
  created () {
    const $xeDatePicker = this
    const props = $xeDatePicker

    $xeDatePicker.internalData = createInternalData()

    const { type, multiple, maskedConfig } = props
    if (isEnableConf(maskedConfig)) {
      if (multiple) {
        errLog('vxe.error.notSupportProp', ['multiple', 'control-config.enabled=true', 'control-config.enabled=false'])
      }
      if (!maskedTypes.includes(type)) {
        warnLog('vxe.error.notSupportProp', ['control-config.enabled=true', `type=${type}`, `type=${maskedTypes.join('|')}`])
      }
    }
    $xeDatePicker.updateModelValue()
    globalEvents.on($xeDatePicker, 'mousewheel', $xeDatePicker.handleGlobalMousewheelEvent)
    globalEvents.on($xeDatePicker, 'mousedown', $xeDatePicker.handleGlobalMousedownEvent)
    globalEvents.on($xeDatePicker, 'keydown', $xeDatePicker.handleGlobalKeydownEvent)
    globalEvents.on($xeDatePicker, 'blur', $xeDatePicker.handleGlobalBlurEvent)
    globalEvents.on($xeDatePicker, 'resize', $xeDatePicker.handleGlobalResizeEvent)
  },
  beforeDestroy () {
    const $xeDatePicker = this
    const reactData = $xeDatePicker.reactData
    const internalData = $xeDatePicker.internalData

    const panelElem = $xeDatePicker.$refs.refInputPanel as HTMLElement | undefined
    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem)
    }
    globalEvents.off($xeDatePicker, 'mousewheel')
    globalEvents.off($xeDatePicker, 'mousedown')
    globalEvents.off($xeDatePicker, 'keydown')
    globalEvents.off($xeDatePicker, 'blur')
    globalEvents.off($xeDatePicker, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
