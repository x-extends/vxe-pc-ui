import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText, eqEmptyValue, isEnableConf } from '../../ui/src/utils'
import { hasClass, getEventTargetNode, hasControlKey } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { handleNumber, toFloatValueFixed } from './util'

import type { NumberInputInternalData, VxeNumberInputEmits, NumberInputReactData, VxeNumberInputPropTypes, VxeComponentSizeType, VxeFormConstructor, ValueOf, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

const handleNumberString = (val: any) => {
  if (XEUtils.eqNull(val)) {
    return ''
  }
  return `${val}`
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeNumberInput',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number] as PropType<VxeNumberInputPropTypes.ModelValue>,
    immediate: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxeNumberInputPropTypes.Name>,
    type: {
      type: String as PropType<VxeNumberInputPropTypes.Type>,
      default: 'number'
    },
    clearable: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Clearable>,
      default: () => getConfig().numberInput.clearable
    },
    readonly: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Readonly>,
      default: null
    },
    disabled: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Disabled>,
      default: null
    },
    placeholder: String as PropType<VxeNumberInputPropTypes.Placeholder>,
    maxLength: {
      type: [String, Number] as PropType<VxeNumberInputPropTypes.MaxLength>,
      default: () => getConfig().numberInput.maxLength
    },
    autoComplete: {
      type: String as PropType<VxeNumberInputPropTypes.AutoComplete>,
      default: 'off'
    },
    align: String as PropType<VxeNumberInputPropTypes.Align>,
    form: String as PropType<VxeNumberInputPropTypes.Form>,
    className: String as PropType<VxeNumberInputPropTypes.ClassName>,
    size: {
      type: String as PropType<VxeNumberInputPropTypes.Size>,
      default: () => getConfig().numberInput.size || getConfig().size
    },

    // number、integer、float
    min: {
      type: [String, Number] as PropType<VxeNumberInputPropTypes.Min>,
      default: null
    },
    max: {
      type: [String, Number] as PropType<VxeNumberInputPropTypes.Max>,
      default: null
    },
    step: [String, Number] as PropType<VxeNumberInputPropTypes.Step>,
    exponential: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Exponential>,
      default: () => getConfig().numberInput.exponential
    },
    showCurrency: {
      type: Boolean as PropType<VxeNumberInputPropTypes.ShowCurrency>,
      default: () => getConfig().numberInput.showCurrency
    },
    currencySymbol: {
      type: String as PropType<VxeNumberInputPropTypes.CurrencySymbol>,
      default: () => getConfig().numberInput.currencySymbol
    },
    controlConfig: Object as PropType<VxeNumberInputPropTypes.ControlConfig>,

    // float
    digits: {
      type: [String, Number] as PropType<VxeNumberInputPropTypes.Digits>,
      default: null
    },
    autoFill: {
      type: Boolean as PropType<VxeNumberInputPropTypes.AutoFill>,
      default: () => getConfig().numberInput.autoFill
    },
    editable: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Editable>,
      default: true
    },

    plusIcon: String as PropType<VxeNumberInputPropTypes.PlusIcon>,
    minusIcon: String as PropType<VxeNumberInputPropTypes.MinusIcon>,
    prefixIcon: String as PropType<VxeNumberInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeNumberInputPropTypes.SuffixIcon>,

    // 已废弃
    controls: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Controls>,
      default: null
    },
    // 已废弃
    maxlength: [String, Number] as PropType<VxeNumberInputPropTypes.Maxlength>,
    // 已废弃
    autocomplete: String as PropType<VxeNumberInputPropTypes.Autocomplete>
  },
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: NumberInputReactData = {
      isFocus: false,
      isActivated: false,
      inputValue: ''
    }
    const internalData: NumberInputInternalData = {
      // dnTimeout: undefined,
      // ainTimeout: undefined,
      // isMouseDown: undefined,
      // isUM: undefined
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
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeFormReadonly () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const $xeForm = $xeNumberInput.$xeForm

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
      const $xeNumberInput = this
      const props = $xeNumberInput
      const $xeForm = $xeNumberInput.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeDigitsValue () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { type, digits } = props
      let defDigits: any = digits
      if (defDigits === null) {
        defDigits = getConfig().numberInput.digits
        if (defDigits === null) {
          if (type === 'amount') {
            defDigits = 2
          }
        }
      }
      return XEUtils.toInteger(defDigits) || 1
    },
    computeControlOpts () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return Object.assign({}, getConfig().numberInput.controlConfig, props.controlConfig)
    },
    computeDecimalsType () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { type } = props
      return type === 'float' || type === 'amount'
    },
    computeStepValue () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { type } = props
      const digitsValue = $xeNumberInput.computeDigitsValue as number
      const decimalsType = $xeNumberInput.computeDecimalsType
      const step = props.step
      if (type === 'integer') {
        return XEUtils.toInteger(step) || 1
      } else if (decimalsType) {
        return XEUtils.toNumber(step) || (1 / Math.pow(10, digitsValue))
      }
      return XEUtils.toNumber(step) || 1
    },
    computeIsClearable () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return props.clearable
    },
    computeInputReadonly () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { editable } = props
      const formReadonly = $xeNumberInput.computeFormReadonly
      return formReadonly || !editable
    },
    computeInpPlaceholder () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().numberInput.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseInput')
    },
    computeInpMaxLength () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { maxLength, maxlength } = props
      // 数值最大长度限制 16 位，包含小数
      return XEUtils.toNumber(maxLength || maxlength) || 16
    },
    computeInpImmediate () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { immediate } = props
      return immediate
    },
    computeNumValue () {
      const $xeNumberInput = this as any
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type } = props
      const { inputValue } = reactData
      return type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
    },
    computeNumLabel () {
      const $xeNumberInput = this as any
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type, showCurrency, currencySymbol, autoFill } = props
      const { inputValue } = reactData
      const digitsValue = $xeNumberInput.computeDigitsValue
      if (type === 'amount') {
        const num = XEUtils.toNumber(inputValue)
        let amountLabel = XEUtils.commafy(num, { digits: digitsValue })
        if (!autoFill) {
          const [iStr, dStr] = amountLabel.split('.')
          if (dStr) {
            const dRest = dStr.replace(/0+$/, '')
            amountLabel = dRest ? [iStr, '.', dRest].join('') : iStr
          }
        }
        if (showCurrency) {
          return `${currencySymbol || getI18n('vxe.numberInput.currencySymbol') || ''}${amountLabel}`
        }
        return amountLabel
      }
      return XEUtils.toString(inputValue)
    },
    computeIsDisabledSubtractNumber () {
      const $xeNumberInput = this as any
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { min } = props
      const { inputValue } = reactData
      const numValue = $xeNumberInput.computeNumValue as number
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && min !== null) {
        return numValue <= XEUtils.toNumber(min)
      }
      return false
    },
    computeIsDisabledAddNumber () {
      const $xeNumberInput = this as any
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { max } = props
      const { inputValue } = reactData
      const numValue = $xeNumberInput.computeNumValue as number
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && max !== null) {
        return numValue >= XEUtils.toNumber(max)
      }
      return false
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeNumberInputEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeNumberInput = this
      $xeNumberInput.$emit(type, createEvent(evnt, { $numberInput: $xeNumberInput }, params))
    },
    emitModel  (value: any) {
      const $xeNumberInput = this

      const { _events } = $xeNumberInput as any
      if (_events && _events.modelValue) {
        $xeNumberInput.$emit('modelValue', value)
      } else {
        $xeNumberInput.$emit('model-value', value)
      }
    },
    focus () {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!inputReadonly) {
        const inputElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
        reactData.isActivated = true
        inputElem.focus()
      }
      return $xeNumberInput.$nextTick()
    },
    blur () {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inputElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
      inputElem.blur()
      reactData.isActivated = false
      return $xeNumberInput.$nextTick()
    },
    select () {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inputElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
      inputElem.select()
      reactData.isActivated = false
      return $xeNumberInput.$nextTick()
    },
    getNumberValue (val: any) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { exponential, autoFill } = props
      const inpMaxLength = $xeNumberInput.computeInpMaxLength
      const digitsValue = $xeNumberInput.computeDigitsValue
      const decimalsType = $xeNumberInput.computeDecimalsType
      let restVal = ''
      if (decimalsType) {
        restVal = toFloatValueFixed(val, digitsValue)
        if (!autoFill) {
          restVal = handleNumberString(XEUtils.toNumber(restVal))
        }
      } else {
        restVal = handleNumberString(val)
      }
      if (exponential && (val === restVal || handleNumberString(val).toLowerCase() === XEUtils.toNumber(restVal).toExponential())) {
        return val
      }
      return restVal.slice(0, inpMaxLength)
    },
    triggerEvent (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const { inputValue } = reactData
      $xeNumberInput.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    },
    handleChange (val: number | null, inputValue: string, evnt: Event | { type: string }) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData
      const internalData = $xeNumberInput.internalData
      const $xeForm = $xeNumberInput.$xeForm
      const formItemInfo = $xeNumberInput.formItemInfo

      const value = eqEmptyValue(val) ? null : Number(val)
      const isChange = value !== props.value
      if (isChange) {
        internalData.isUM = true
        $xeNumberInput.emitModel(value)
      }
      if (reactData.inputValue !== inputValue) {
        $xeNumberInput.$nextTick(() => {
          reactData.inputValue = inputValue || ''
        })
      }
      $xeNumberInput.dispatchEvent('input', { value }, evnt as Event)
      if (isChange) {
        $xeNumberInput.dispatchEvent('change', { value }, evnt as Event)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    emitInputEvent (inputValue: any, evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inpImmediate = $xeNumberInput.computeInpImmediate
      const value = inputValue === eqEmptyValue(inputValue) ? null : XEUtils.toNumber(inputValue)
      reactData.inputValue = inputValue
      if (inpImmediate) {
        $xeNumberInput.handleChange(value, inputValue, evnt)
      } else {
        $xeNumberInput.dispatchEvent('input', { value }, evnt)
      }
    },
    inputEvent (evnt: Event & { type: 'input' }) {
      const $xeNumberInput = this

      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      $xeNumberInput.emitInputEvent(value, evnt)
    },
    changeEvent  (evnt: Event & { type: 'change' }) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inpImmediate = $xeNumberInput.computeInpImmediate
      if (!inpImmediate) {
        $xeNumberInput.triggerEvent(evnt)
      }
      $xeNumberInput.dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
    },
    focusEvent  (evnt: Event & { type: 'focus' }) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!inputReadonly) {
        const { inputValue } = reactData
        reactData.inputValue = eqEmptyValue(inputValue) ? '' : `${XEUtils.toNumber(inputValue)}`
        reactData.isFocus = true
        reactData.isActivated = true
        $xeNumberInput.triggerEvent(evnt)
      }
    },
    clickPrefixEvent (evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const isDisabled = $xeNumberInput.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeNumberInput.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    },
    clearValueEvent  (evnt: Event, value: VxeNumberInputPropTypes.ModelValue) {
      const $xeNumberInput = this

      $xeNumberInput.focus()
      $xeNumberInput.handleChange(null, '', evnt)
      $xeNumberInput.dispatchEvent('clear', { value }, evnt)
      $xeNumberInput.dispatchEvent('lazy-change', { value }, evnt)
    },
    clickSuffixEvent (evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const isDisabled = $xeNumberInput.computeIsDisabled
      if (!isDisabled) {
        const { inputValue } = reactData
        $xeNumberInput.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    },
    updateModel (val: any) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { autoFill } = props
      const { inputValue } = reactData
      const digitsValue = $xeNumberInput.computeDigitsValue
      const decimalsType = $xeNumberInput.computeDecimalsType
      if (eqEmptyValue(val)) {
        reactData.inputValue = ''
      } else {
        let textValue = `${val}`
        if (decimalsType) {
          textValue = toFloatValueFixed(val, digitsValue)
          if (!autoFill) {
            textValue = `${XEUtils.toNumber(textValue)}`
          }
        }
        if (textValue !== inputValue) {
          reactData.inputValue = textValue
        }
      }
    },
    /**
     * 检查初始值
     */
    initValue  () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { autoFill } = props
      const { inputValue } = reactData
      const digitsValue = $xeNumberInput.computeDigitsValue
      const decimalsType = $xeNumberInput.computeDecimalsType
      if (decimalsType) {
        if (inputValue) {
          let textValue = ''
          let validValue: number | null = null
          if (inputValue) {
            textValue = toFloatValueFixed(inputValue, digitsValue)
            validValue = XEUtils.toNumber(textValue)
            if (!autoFill) {
              textValue = `${validValue}`
            }
          }
          if (inputValue !== validValue) {
            $xeNumberInput.handleChange(validValue, textValue, { type: 'init' })
          } else {
            reactData.inputValue = textValue
          }
        }
      }
    },
    validMaxNum  (num: number | string) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return props.max === null || props.max === '' || XEUtils.toNumber(num) <= XEUtils.toNumber(props.max)
    },
    validMinNum  (num: number | string) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return props.min === null || props.min === '' || XEUtils.toNumber(num) >= XEUtils.toNumber(props.min)
    },
    afterCheckValue  () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type, min, max, exponential } = props
      const { inputValue } = reactData
      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!inputReadonly) {
        if (eqEmptyValue(inputValue)) {
          let inpNumVal = null
          let inpValue = inputValue
          if (min || min === 0) {
            inpNumVal = XEUtils.toNumber(min)
            inpValue = `${inpNumVal}`
          }
          $xeNumberInput.handleChange(inpNumVal, `${inpValue || ''}`, { type: 'check' })
          return
        }
        if (inputValue || (min || max)) {
          let inpNumVal: number | string = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
          if (!$xeNumberInput.validMinNum(inpNumVal)) {
            inpNumVal = min as number
          } else if (!$xeNumberInput.validMaxNum(inpNumVal)) {
            inpNumVal = max as number
          }
          if (exponential) {
            const inpStringVal = handleNumberString(inputValue).toLowerCase()
            if (inpStringVal === XEUtils.toNumber(inpNumVal).toExponential()) {
              inpNumVal = inpStringVal
            }
          }
          const inpValue = $xeNumberInput.getNumberValue(inpNumVal)
          $xeNumberInput.handleChange(eqEmptyValue(inpValue) ? null : Number(inpValue), inpValue, { type: 'check' })
        }
      }
    },
    blurEvent  (evnt: Event & { type: 'blur' }) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData
      const $xeForm = $xeNumberInput.$xeForm
      const formItemInfo = $xeNumberInput.formItemInfo

      const { inputValue } = reactData
      const inpImmediate = $xeNumberInput.computeInpImmediate
      const value = inputValue ? Number(inputValue) : null
      if (!inpImmediate) {
        $xeNumberInput.handleChange(value, handleNumberString(inputValue), evnt)
      }
      $xeNumberInput.afterCheckValue()
      reactData.isFocus = false
      reactData.isActivated = false
      $xeNumberInput.dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    // 数值
    numberChange  (isPlus: boolean, evnt: Event) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { min, max, type } = props
      const { inputValue } = reactData
      const stepValue = $xeNumberInput.computeStepValue
      const numValue = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      const newValue = isPlus ? XEUtils.add(numValue, stepValue) : XEUtils.subtract(numValue, stepValue)
      let restNum: number | string
      if (!$xeNumberInput.validMinNum(newValue)) {
        restNum = min as number
      } else if (!$xeNumberInput.validMaxNum(newValue)) {
        restNum = max as number
      } else {
        restNum = newValue
      }
      $xeNumberInput.emitInputEvent($xeNumberInput.getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    },
    numberPlusEvent (evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const isDisabledAddNumber = $xeNumberInput.computeIsDisabledAddNumber
      if (!isDisabled && !formReadonly && !isDisabledAddNumber) {
        $xeNumberInput.numberChange(true, evnt)
      }
      reactData.isActivated = true
      $xeNumberInput.dispatchEvent('plus-number', { value: reactData.inputValue }, evnt)
      $xeNumberInput.dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
      // 已废弃
      $xeNumberInput.dispatchEvent('next-number', { value: reactData.inputValue }, evnt)
    },
    numberMinusEvent (evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const isDisabledSubtractNumber = $xeNumberInput.computeIsDisabledSubtractNumber
      if (!isDisabled && !formReadonly && !isDisabledSubtractNumber) {
        $xeNumberInput.numberChange(false, evnt)
      }
      reactData.isActivated = true
      $xeNumberInput.dispatchEvent('minus-number', { value: reactData.inputValue }, evnt)
      $xeNumberInput.dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
      // 已废弃
      $xeNumberInput.dispatchEvent('prev-number', { value: reactData.inputValue }, evnt)
    },
    numberKeydownEvent  (evnt: KeyboardEvent) {
      const $xeNumberInput = this

      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (isUpArrow || isDwArrow) {
        evnt.preventDefault()
        if (isUpArrow) {
          $xeNumberInput.numberPlusEvent(evnt)
        } else {
          $xeNumberInput.numberMinusEvent(evnt)
        }
      }
    },
    keydownEvent  (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { type, exponential, controls } = props
      const controlOpts = $xeNumberInput.computeControlOpts
      const { isArrow } = controlOpts
      const inputReadonly = $xeNumberInput.computeInputReadonly
      const isControlKey = hasControlKey(evnt)
      const isShiftKey = evnt.shiftKey
      const isAltKey = evnt.altKey
      const keyCode = evnt.keyCode
      const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (!isControlKey && !isShiftKey && !isAltKey) {
        if (globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR) || (type === 'integer' && keyCode === 110) || ((!exponential || keyCode !== 69) && (keyCode >= 65 && keyCode <= 90)) || (keyCode >= 186 && keyCode <= 188) || keyCode >= 191) {
          evnt.preventDefault()
        }
      }
      if (isEsc) {
        $xeNumberInput.afterCheckValue()
      } else if (isUpArrow || isDwArrow) {
        if (isEnableConf(controlOpts) && (controls === false ? controls : isArrow) && !inputReadonly) {
          $xeNumberInput.numberKeydownEvent(evnt)
        }
      }
      $xeNumberInput.triggerEvent(evnt)
    },
    keyupEvent  (evnt: KeyboardEvent & { type: 'keyup' }) {
      const $xeNumberInput = this

      $xeNumberInput.triggerEvent(evnt)
    },
    // 数值
    stopDown () {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      const { dnTimeout } = internalData
      if (dnTimeout) {
        clearTimeout(dnTimeout)
        internalData.dnTimeout = undefined
      }
    },
    stopAutoIncrement () {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      const { ainTimeout } = internalData
      if (ainTimeout) {
        clearTimeout(ainTimeout)
        internalData.ainTimeout = undefined
      }
    },
    numberDownMinusEvent (evnt: Event) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      $xeNumberInput.numberStopAll()
      internalData.ainTimeout = setTimeout(() => {
        $xeNumberInput.numberMinusEvent(evnt)
        $xeNumberInput.numberDownMinusEvent(evnt)
      }, 60)
    },
    numberDownPlusEvent (evnt: Event) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      $xeNumberInput.numberStopAll()
      internalData.ainTimeout = setTimeout(() => {
        $xeNumberInput.numberPlusEvent(evnt)
        $xeNumberInput.numberDownPlusEvent(evnt)
      }, 60)
    },
    numberStopAll () {
      const $xeNumberInput = this

      $xeNumberInput.stopDown()
      $xeNumberInput.stopAutoIncrement()
    },
    numberClickEvent (evnt: MouseEvent) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      if (internalData.isMouseDown) {
        internalData.isMouseDown = false
      } else {
        $xeNumberInput.numberStopAll()
        const isAddNumber = hasClass(evnt.currentTarget, 'is--plus')
        if (isAddNumber) {
          $xeNumberInput.numberPlusEvent(evnt)
        } else {
          $xeNumberInput.numberMinusEvent(evnt)
        }
      }
    },
    numberMousedownEvent (evnt: MouseEvent) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      $xeNumberInput.numberStopAll()
      internalData.isMouseDown = true
      if (evnt.button === 0) {
        const isAddNumber = hasClass(evnt.currentTarget, 'is--plus')
        if (isAddNumber) {
          $xeNumberInput.numberPlusEvent(evnt)
        } else {
          $xeNumberInput.numberMinusEvent(evnt)
        }
        internalData.dnTimeout = setTimeout(() => {
          if (isAddNumber) {
            $xeNumberInput.numberDownPlusEvent(evnt)
          } else {
            $xeNumberInput.numberDownMinusEvent(evnt)
          }
        }, 500)
      }
    },
    wheelEvent  (evnt: WheelEvent) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { controls } = props
      const controlOpts = $xeNumberInput.computeControlOpts
      const { isWheel } = controlOpts
      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (isEnableConf(controlOpts) && (controls === false ? controls : isWheel) && !inputReadonly) {
        if (reactData.isActivated) {
          evnt.stopPropagation()
          evnt.preventDefault()
          const delta = evnt.deltaY
          if (delta > 0) {
            // 向下
            $xeNumberInput.numberMinusEvent(evnt)
          } else if (delta < 0) {
            // 向上
            $xeNumberInput.numberPlusEvent(evnt)
          }
        }
      }
      $xeNumberInput.triggerEvent(evnt as WheelEvent & { type: 'wheel' })
    },
    clickEvent  (evnt: Event & { type: 'click' }) {
      const $xeNumberInput = this

      $xeNumberInput.triggerEvent(evnt)
    },
    // 全局事件
    handleGlobalMousedownEvent (evnt: Event) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const { isActivated } = reactData
      const el = $xeNumberInput.$refs.refElem as HTMLElement
      const panelElem = $xeNumberInput.$refs.refInputPanel as HTMLDivElement
      const isDisabled = $xeNumberInput.computeIsDisabled
      const inpImmediate = $xeNumberInput.computeInpImmediate
      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!isDisabled && !inputReadonly && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (!reactData.isActivated) {
          if (!inpImmediate) {
            const { inputValue } = reactData
            const value = inputValue ? Number(inputValue) : null
            $xeNumberInput.handleChange(value, handleNumberString(inputValue), evnt)
          }
          $xeNumberInput.afterCheckValue()
        }
      }
    },
    handleGlobalKeydownEvent  (evnt: KeyboardEvent) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { clearable } = props
      const isDisabled = $xeNumberInput.computeIsDisabled
      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!isDisabled && !inputReadonly) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isDel = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
        let isActivated = reactData.isActivated
        if (isTab) {
          if (isActivated) {
            $xeNumberInput.afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        }
        if (isDel && clearable) {
          if (isActivated) {
            $xeNumberInput.clearValueEvent(evnt, null)
          }
        }
      }
    },
    handleGlobalBlurEvent  () {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const { isActivated } = reactData
      if (isActivated) {
        $xeNumberInput.afterCheckValue()
      }
    },

    //
    // Render
    //
    renderPrefixIcon (h: CreateElement) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const slots = $xeNumberInput.$scopedSlots

      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-number-input--prefix',
          on: {
            click: $xeNumberInput.clickPrefixEvent
          }
        }, [
          h('div', {
            class: 'vxe-number-input--prefix-icon'
          }, prefixSlot
            ? getSlotVNs(prefixSlot({}))
            : [
                h('i', {
                  class: prefixIcon
                })
              ])
        ])
        : renderEmptyElement($xeNumberInput)
    },
    renderSuffixIcon (h: CreateElement) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData
      const slots = $xeNumberInput.$scopedSlots

      const { suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = $xeNumberInput.computeIsDisabled
      const isClearable = $xeNumberInput.computeIsClearable
      return h('div', {
        class: ['vxe-number-input--suffix', {
          'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }]
      }, [
        isClearable
          ? h('div', {
            class: 'vxe-number-input--clear-icon',
            on: {
              click: $xeNumberInput.clearValueEvent
            }
          }, [
            h('i', {
              class: getIcon().INPUT_CLEAR
            })
          ])
          : renderEmptyElement($xeNumberInput),
        suffixSlot || suffixIcon
          ? h('div', {
            class: 'vxe-number-input--suffix-icon',
            on: {
              click: $xeNumberInput.clickSuffixEvent
            }
          }, suffixSlot
            ? getSlotVNs(suffixSlot({}))
            : [
                h('i', {
                  class: suffixIcon
                })
              ])
          : renderEmptyElement($xeNumberInput)
      ])
    },
    renderInput (h: CreateElement) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type, name, autocomplete, autoComplete } = props
      const { inputValue, isFocus } = reactData
      const isDisabled = $xeNumberInput.computeIsDisabled
      const numLabel = $xeNumberInput.computeNumLabel
      const inputReadonly = $xeNumberInput.computeInputReadonly
      const inpMaxLength = $xeNumberInput.computeInpMaxLength
      const inpPlaceholder = $xeNumberInput.computeInpPlaceholder
      return h('div', {
        key: 'ni',
        class: 'vxe-number-input--input-wrapper'
      }, [
        $xeNumberInput.renderPrefixIcon(h),
        h('div', {
          class: 'vxe-number-input--input-inner'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-number-input--input',
            domProps: {
              value: !isFocus && type === 'amount' ? numLabel : inputValue
            },
            attrs: {
              name,
              type: 'text',
              placeholder: inpPlaceholder,
              maxlength: inpMaxLength,
              readonly: inputReadonly,
              disabled: isDisabled,
              autocomplete: autoComplete || autocomplete
            },
            on: {
              keydown: $xeNumberInput.keydownEvent,
              keyup: $xeNumberInput.keyupEvent,
              click: $xeNumberInput.clickEvent,
              input: $xeNumberInput.inputEvent,
              change: $xeNumberInput.changeEvent,
              focus: $xeNumberInput.focusEvent,
              blur: $xeNumberInput.blurEvent
            }
          })
        ]),
        $xeNumberInput.renderSuffixIcon(h)
      ])
    },
    renderMinusBtn (h: CreateElement) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { minusIcon } = props
      const isDisabledSubtractNumber = $xeNumberInput.computeIsDisabledSubtractNumber
      return h('button', {
        key: 'prev',
        class: ['vxe-number-input--minus-btn is--minus', {
          'is--disabled': isDisabledSubtractNumber
        }],
        attrs: {
          type: 'button'
        },
        on: {
          click: $xeNumberInput.numberClickEvent,
          mousedown: $xeNumberInput.numberMousedownEvent,
          mouseup: $xeNumberInput.numberStopAll,
          mouseleave: $xeNumberInput.numberStopAll
        }
      }, [
        h('i', {
          class: minusIcon || getIcon().NUMBER_INPUT_MINUS_NUM
        })
      ])
    },
    renderPlusBtn (h: CreateElement) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { plusIcon } = props
      const isDisabledAddNumber = $xeNumberInput.computeIsDisabledAddNumber
      return h('button', {
        key: 'next',
        class: ['vxe-number-input--plus-btn is--plus', {
          'is--disabled': isDisabledAddNumber
        }],
        attrs: {
          type: 'button'
        },
        on: {
          click: $xeNumberInput.numberClickEvent,
          mousedown: $xeNumberInput.numberMousedownEvent,
          mouseup: $xeNumberInput.numberStopAll,
          mouseleave: $xeNumberInput.numberStopAll
        }
      }, [
        h('i', {
          class: plusIcon || getIcon().NUMBER_INPUT_PLUS_NUM
        })
      ])
    },
    renderSideControl (h: CreateElement) {
      const $xeNumberInput = this

      return h('div', {
        key: 'cplr',
        class: 'vxe-number-input--side-control'
      }, [
        $xeNumberInput.renderPlusBtn(h),
        $xeNumberInput.renderMinusBtn(h)
      ])
    },
    renderVN (h: CreateElement): VNode {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData
      const slots = $xeNumberInput.$scopedSlots

      const { className, controls, type, align, prefixIcon, suffixIcon } = props
      const { inputValue, isActivated } = reactData
      const vSize = $xeNumberInput.computeSize
      const controlOpts = $xeNumberInput.computeControlOpts
      const { layout, showButton } = controlOpts
      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const numLabel = $xeNumberInput.computeNumLabel
      const prefixSlot = slots.prefix
      const suffixSlot = slots.suffix
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-number-input--readonly', `type--${type}`, className]
        }, numLabel)
      }
      const inputReadonly = $xeNumberInput.computeInputReadonly
      const isClearable = $xeNumberInput.computeIsClearable
      const isControls = isEnableConf(controlOpts) && (controls === false ? controls : showButton)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-number-input', `type--${type}`, `ctl--${layout === 'right' || layout === 'left' ? layout : 'default'}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': isControls && !inputReadonly,
          'is--prefix': !!prefixSlot || prefixIcon,
          'is--suffix': !!suffixSlot || suffixIcon,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        attrs: {
          spellcheck: false
        }
      }, isControls
        ? (layout === 'right'
            ? [
                $xeNumberInput.renderInput(h),
                $xeNumberInput.renderSideControl(h)
              ]
            : (layout === 'left'
                ? [
                    $xeNumberInput.renderSideControl(h),
                    $xeNumberInput.renderInput(h)
                  ]
                : [
                    $xeNumberInput.renderMinusBtn(h),
                    $xeNumberInput.renderInput(h),
                    $xeNumberInput.renderPlusBtn(h)
                  ]))
        : [
            $xeNumberInput.renderInput(h)
          ])
    }
  },
  watch: {
    value (val) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      if (!internalData.isUM) {
        this.updateModel(val)
      }
      internalData.isUM = false
    },
    type () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.value
      })
      $xeNumberInput.initValue()
    }
  },
  created () {
    const $xeNumberInput = this
    const props = $xeNumberInput
    const reactData = $xeNumberInput.reactData

    reactData.inputValue = props.value
    $xeNumberInput.initValue()
  },
  mounted () {
    const $xeNumberInput = this

    const targetElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
    if (targetElem) {
      targetElem.addEventListener('wheel', $xeNumberInput.wheelEvent, { passive: false })
    }
    globalEvents.on($xeNumberInput, 'mousedown', $xeNumberInput.handleGlobalMousedownEvent)
    globalEvents.on($xeNumberInput, 'keydown', $xeNumberInput.handleGlobalKeydownEvent)
    globalEvents.on($xeNumberInput, 'blur', $xeNumberInput.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeNumberInput = this
    const reactData = $xeNumberInput.reactData

    reactData.isFocus = false
    $xeNumberInput.numberStopAll()
    $xeNumberInput.afterCheckValue()
    const targetElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
    if (targetElem) {
      targetElem.removeEventListener('wheel', $xeNumberInput.wheelEvent)
    }
    globalEvents.off($xeNumberInput, 'mousedown')
    globalEvents.off($xeNumberInput, 'keydown')
    globalEvents.off($xeNumberInput, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
