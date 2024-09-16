import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText } from '../../ui/src/utils'
import { hasClass, getEventTargetNode } from '../../ui/src/dom'
import { getSlotVNs } from '../..//ui/src/vn'
import { handleNumber, toFloatValueFixed } from './util'

import type { NumberInputInternalData, VxeNumberInputEmits, NumberInputReactData, VxeNumberInputPropTypes, VxeComponentSizeType, VxeFormConstructor, ValueOf, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
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
    maxLength: [String, Number] as PropType<VxeNumberInputPropTypes.MaxLength>,
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
    multiple: Boolean as PropType<VxeNumberInputPropTypes.Multiple>,

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

    // number、integer、float
    controls: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Controls>,
      default: () => getConfig().numberInput.controls
    },

    // float
    digits: {
      type: [String, Number] as PropType<VxeNumberInputPropTypes.Digits>,
      default: () => getConfig().numberInput.digits
    },

    prefixIcon: String as PropType<VxeNumberInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeNumberInputPropTypes.SuffixIcon>,

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
      isActivated: false,
      inputValue: ''
    }
    const internalData: NumberInputInternalData = {
      dnTimeout: undefined
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

      return XEUtils.toInteger(props.digits) || 1
    },
    computeStepValue () {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { type } = props
      const digitsValue = $xeNumberInput.computeDigitsValue as number
      const step = props.step
      if (type === 'integer') {
        return XEUtils.toInteger(step) || 1
      } else if (type === 'float') {
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

      const { multiple } = props
      const formReadonly = $xeNumberInput.computeFormReadonly
      return formReadonly || multiple
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

      const { type, immediate } = props
      return immediate || !(type === 'number' || type === 'integer' || type === 'float')
    },
    computeNumValue () {
      const $xeNumberInput = (this as any)
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type } = props
      const { inputValue } = reactData
      return type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
    },
    computeNumLabel () {
      const $xeNumberInput = (this as any)
      const reactData = $xeNumberInput.reactData

      const { inputValue } = reactData
      return XEUtils.toString(inputValue)
    },
    computeIsDisabledSubtractNumber () {
      const $xeNumberInput = (this as any)
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
      const $xeNumberInput = (this as any)
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
      const $xeModal = this

      $xeModal.$emit('modelValue', value)
    },
    focus () {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      const inputElem = $xeNumberInput.$refs.refInputTarget as HTMLInputElement
      reactData.isActivated = true
      inputElem.focus()
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

      const { type, exponential } = props
      const inpMaxLength = $xeNumberInput.computeInpMaxLength
      const digitsValue = $xeNumberInput.computeDigitsValue
      const restVal = (type === 'float' ? toFloatValueFixed(val, digitsValue) : XEUtils.toValueString(val))
      if (exponential && (val === restVal || XEUtils.toValueString(val).toLowerCase() === XEUtils.toNumber(restVal).toExponential())) {
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
      const $xeForm = $xeNumberInput.$xeForm
      const formItemInfo = $xeNumberInput.formItemInfo

      const value = val ? Number(val) : null
      const isChange = value !== props.value
      if (isChange) {
        reactData.inputValue = inputValue || ''
        $xeNumberInput.emitModel(value)
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
      const value = inputValue ? XEUtils.toNumber(inputValue) : null
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

      const inpImmediate = $xeNumberInput.computeInpImmediate
      if (!inpImmediate) {
        $xeNumberInput.triggerEvent(evnt)
      }
    },
    focusEvent  (evnt: Event & { type: 'focus' }) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      reactData.isActivated = true
      $xeNumberInput.triggerEvent(evnt)
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
    /**
     * 检查初始值
     */
    initValue  () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type } = props
      const { inputValue } = reactData
      const digitsValue = $xeNumberInput.computeDigitsValue
      if (type === 'float') {
        if (inputValue) {
          let textValue = ''
          let validValue: number | null = null
          if (inputValue) {
            textValue = toFloatValueFixed(inputValue, digitsValue)
            validValue = Number(textValue)
          }
          if (inputValue !== validValue) {
            $xeNumberInput.handleChange(validValue, textValue, { type: 'init' })
          }
        }
      }
    },
    validMaxNum  (num: number | string) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return props.max === null || XEUtils.toNumber(num) <= XEUtils.toNumber(props.max)
    },
    validMinNum  (num: number | string) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      return props.min === null || XEUtils.toNumber(num) >= XEUtils.toNumber(props.min)
    },
    afterCheckValue  () {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { type, min, max, exponential } = props
      const { inputValue } = reactData
      const inputReadonly = $xeNumberInput.computeInputReadonly
      if (!inputReadonly) {
        if (inputValue) {
          let inpNumVal: number | string = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
          if (!$xeNumberInput.validMinNum(inpNumVal)) {
            inpNumVal = min
          } else if (!$xeNumberInput.validMaxNum(inpNumVal)) {
            inpNumVal = max
          }
          if (exponential) {
            const inpStringVal = XEUtils.toValueString(inputValue).toLowerCase()
            if (inpStringVal === XEUtils.toNumber(inpNumVal).toExponential()) {
              inpNumVal = inpStringVal
            }
          }
          const inpValue = $xeNumberInput.getNumberValue(inpNumVal)
          $xeNumberInput.handleChange(inpValue === null ? null : Number(inpValue), inpValue, { type: 'check' })
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
        $xeNumberInput.handleChange(value, `${inputValue || ''}`, evnt)
      }
      $xeNumberInput.afterCheckValue()
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
        restNum = min
      } else if (!$xeNumberInput.validMaxNum(newValue)) {
        restNum = max
      } else {
        restNum = newValue
      }
      $xeNumberInput.emitInputEvent($xeNumberInput.getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    },
    numberNextEvent (evnt: Event) {
      const $xeNumberInput = this

      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const isDisabledSubtractNumber = $xeNumberInput.computeIsDisabledSubtractNumber
      $xeNumberInput.numberStopDown()
      if (!isDisabled && !formReadonly && !isDisabledSubtractNumber) {
        $xeNumberInput.numberChange(false, evnt)
      }
      $xeNumberInput.dispatchEvent('next-number', {}, evnt)
    },
    numberDownNextEvent (evnt: Event) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      internalData.dnTimeout = window.setTimeout(() => {
        $xeNumberInput.numberNextEvent(evnt)
        $xeNumberInput.numberDownNextEvent(evnt)
      }, 60)
    },
    numberPrevEvent (evnt: Event) {
      const $xeNumberInput = this

      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const isDisabledAddNumber = $xeNumberInput.computeIsDisabledAddNumber
      $xeNumberInput.numberStopDown()
      if (!isDisabled && !formReadonly && !isDisabledAddNumber) {
        $xeNumberInput.numberChange(true, evnt)
      }
      $xeNumberInput.dispatchEvent('prev-number', {}, evnt)
    },
    numberKeydownEvent  (evnt: KeyboardEvent) {
      const $xeNumberInput = this

      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (isUpArrow || isDwArrow) {
        evnt.preventDefault()
        if (isUpArrow) {
          $xeNumberInput.numberPrevEvent(evnt)
        } else {
          $xeNumberInput.numberNextEvent(evnt)
        }
      }
    },
    keydownEvent  (evnt: KeyboardEvent & { type: 'keydown' }) {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { exponential, controls } = props
      const isCtrlKey = evnt.ctrlKey
      const isShiftKey = evnt.shiftKey
      const isAltKey = evnt.altKey
      const keyCode = evnt.keyCode
      const isEsc = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ESCAPE)
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (!isCtrlKey && !isShiftKey && !isAltKey && (globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR) || ((!exponential || keyCode !== 69) && (keyCode >= 65 && keyCode <= 90)) || (keyCode >= 186 && keyCode <= 188) || keyCode >= 191)) {
        evnt.preventDefault()
      }
      if (isEsc) {
        $xeNumberInput.afterCheckValue()
      } else if (isUpArrow || isDwArrow) {
        if (controls) {
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
    numberStopDown () {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      const { dnTimeout } = internalData
      if (dnTimeout) {
        clearTimeout(dnTimeout)
        internalData.dnTimeout = undefined
      }
    },
    numberDownPrevEvent  (evnt: Event) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      internalData.dnTimeout = window.setTimeout(() => {
        $xeNumberInput.numberPrevEvent(evnt)
        $xeNumberInput.numberDownPrevEvent(evnt)
      }, 60)
    },
    numberMousedownEvent  (evnt: MouseEvent) {
      const $xeNumberInput = this
      const internalData = $xeNumberInput.internalData

      $xeNumberInput.numberStopDown()
      if (evnt.button === 0) {
        const isPrevNumber = hasClass(evnt.currentTarget, 'is--prev')
        if (isPrevNumber) {
          $xeNumberInput.numberPrevEvent(evnt)
        } else {
          $xeNumberInput.numberNextEvent(evnt)
        }
        internalData.dnTimeout = window.setTimeout(() => {
          if (isPrevNumber) {
            $xeNumberInput.numberDownPrevEvent(evnt)
          } else {
            $xeNumberInput.numberDownNextEvent(evnt)
          }
        }, 500)
      }
    },
    wheelEvent  (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      if (props.controls) {
        if (reactData.isActivated) {
          const delta = evnt.deltaY
          if (delta > 0) {
            $xeNumberInput.numberNextEvent(evnt)
          } else if (delta < 0) {
            $xeNumberInput.numberPrevEvent(evnt)
          }
          evnt.preventDefault()
        }
      }
      $xeNumberInput.triggerEvent(evnt)
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
      if (!isDisabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (!reactData.isActivated) {
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
      if (!isDisabled) {
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
    renderNumberIcon (h: CreateElement): VNode {
      const $xeNumberInput = this

      const isDisabledAddNumber = $xeNumberInput.computeIsDisabledAddNumber
      const isDisabledSubtractNumber = $xeNumberInput.computeIsDisabledSubtractNumber
      return h('div', {
        class: 'vxe-input--control-icon'
      }, [
        h('div', {
          class: 'vxe-input--number-icon'
        }, [
          h('div', {
            class: ['vxe-input--number-btn is--prev', {
              'is--disabled': isDisabledAddNumber
            }],
            on: {
              mousedown: $xeNumberInput.numberMousedownEvent,
              mouseup: $xeNumberInput.numberStopDown,
              mouseleave: $xeNumberInput.numberStopDown
            }
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_PREV_NUM
            })
          ]),
          h('div', {
            class: ['vxe-input--number-btn is--next', {
              'is--disabled': isDisabledSubtractNumber
            }],
            on: {
              mousedown: $xeNumberInput.numberMousedownEvent,
              mouseup: $xeNumberInput.numberStopDown,
              mouseleave: $xeNumberInput.numberStopDown
            }
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_NEXT_NUM
            })
          ])
        ])
      ])
    },
    renderPrefixIcon (h: CreateElement): VNode | null {
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
        : null
    },
    renderSuffixIcon  (h: CreateElement): VNode {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const slots = $xeNumberInput.$scopedSlots
      const reactData = $xeNumberInput.reactData

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
        $xeNumberInput.renderExtraSuffixIcon(h),
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
    renderExtraSuffixIcon (h: CreateElement): VNode {
      const $xeNumberInput = this
      const props = $xeNumberInput

      const { controls } = props
      if (controls) {
        return $xeNumberInput.renderNumberIcon(h)
      }
      return renderEmptyElement($xeNumberInput)
    },
    renderVN (h: CreateElement): VNode {
      const $xeNumberInput = this
      const props = $xeNumberInput
      const reactData = $xeNumberInput.reactData

      const { className, controls, type, align, name, autocomplete, autoComplete } = props
      const { inputValue, isActivated } = reactData
      const vSize = $xeNumberInput.computeSize
      const isDisabled = $xeNumberInput.computeIsDisabled
      const formReadonly = $xeNumberInput.computeFormReadonly
      const numLabel = $xeNumberInput.computeNumLabel
      if (formReadonly) {
        return h('div', {
          ref: 'refElem',
          class: ['vxe-number-input--readonly', `type--${type}`, className]
        }, numLabel)
      }
      const inputReadonly = $xeNumberInput.computeInputReadonly
      const inpMaxLength = $xeNumberInput.computeInpMaxLength
      const inpPlaceholder = $xeNumberInput.computeInpPlaceholder
      const isClearable = $xeNumberInput.computeIsClearable
      const prefix = $xeNumberInput.renderPrefixIcon(h)
      const suffix = $xeNumberInput.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-number-input', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': controls,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        prefix || renderEmptyElement($xeNumberInput),
        h('div', {
          class: 'vxe-number-input--wrapper'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-number-input--inner',
            domProps: {
              value: inputValue
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
              wheel: $xeNumberInput.wheelEvent,
              click: $xeNumberInput.clickEvent,
              input: $xeNumberInput.inputEvent,
              change: $xeNumberInput.changeEvent,
              focus: $xeNumberInput.focusEvent,
              blur: $xeNumberInput.blurEvent
            }
          })
        ]),
        suffix || renderEmptyElement($xeNumberInput)
      ])
    }
  },
  watch: {
    value (val) {
      const $xeNumberInput = this
      const reactData = $xeNumberInput.reactData

      reactData.inputValue = val
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

    globalEvents.on($xeNumberInput, 'mousedown', $xeNumberInput.handleGlobalMousedownEvent)
    globalEvents.on($xeNumberInput, 'keydown', $xeNumberInput.handleGlobalKeydownEvent)
    globalEvents.on($xeNumberInput, 'blur', $xeNumberInput.handleGlobalBlurEvent)
  },
  beforeDestroy () {
    const $xeNumberInput = this

    $xeNumberInput.numberStopDown()
    $xeNumberInput.afterCheckValue()
    globalEvents.off($xeNumberInput, 'mousedown')
    globalEvents.off($xeNumberInput, 'keydown')
    globalEvents.off($xeNumberInput, 'blur')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
