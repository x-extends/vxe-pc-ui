import { defineComponent, h, ref, Ref, computed, reactive, inject, nextTick, watch, onMounted, createCommentVNode, onBeforeUnmount, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, useSize } from '../../ui'
import { getFuncText, eqEmptyValue } from '../../ui/src/utils'
import { hasClass, getEventTargetNode, hasControlKey } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import { handleNumber, toFloatValueFixed } from './util'

import type { VxeNumberInputConstructor, NumberInputInternalData, VxeNumberInputEmits, NumberInputReactData, NumberInputMethods, VxeNumberInputPropTypes, InputPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf } from '../../../types'

export default defineComponent({
  name: 'VxeNumberInput',
  props: {
    modelValue: [String, Number] as PropType<VxeNumberInputPropTypes.ModelValue>,
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
    wheel: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Wheel>,
      default: () => getConfig().numberInput.wheel ?? true
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

    // number、integer、float
    controls: {
      type: Boolean as PropType<VxeNumberInputPropTypes.Controls>,
      default: () => getConfig().numberInput.controls
    },

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

    prefixIcon: String as PropType<VxeNumberInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeNumberInputPropTypes.SuffixIcon>,

    // 已废弃
    maxlength: [String, Number] as PropType<VxeNumberInputPropTypes.Maxlength>,
    // 已废弃
    autocomplete: String as PropType<VxeNumberInputPropTypes.Autocomplete>
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
    'prev-number',
    'next-number',
    'prefix-click',
    'suffix-click'
  ] as VxeNumberInputEmits,

  setup (props, context) {
    const { slots, emit } = context
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<NumberInputReactData>({
      isFocus: false,
      isActivated: false,
      inputValue: props.modelValue
    })

    const internalData: NumberInputInternalData = {
      // dnTimeout: undefined,
      // isUM: undefined
    }

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>
    const refInputPanel = ref() as Ref<HTMLDivElement>

    const refMaps: InputPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeNumberInput = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeNumberInputConstructor

    let numberInputMethods = {} as NumberInputMethods

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

    const computeDigitsValue = computed(() => {
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
    })

    const computeDecimalsType = computed(() => {
      const { type } = props
      return type === 'float' || type === 'amount'
    })

    const computeStepValue = computed(() => {
      const { type } = props
      const digitsValue = computeDigitsValue.value
      const decimalsType = computeDecimalsType.value
      const step = props.step
      if (type === 'integer') {
        return XEUtils.toInteger(step) || 1
      } else if (decimalsType) {
        return XEUtils.toNumber(step) || (1 / Math.pow(10, digitsValue))
      }
      return XEUtils.toNumber(step) || 1
    })

    const computeIsClearable = computed(() => {
      return props.clearable
    })

    const computeInputReadonly = computed(() => {
      const { editable } = props
      const formReadonly = computeFormReadonly.value
      return formReadonly || !editable
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().numberInput.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseInput')
    })

    const computeInpMaxLength = computed(() => {
      const { maxLength, maxlength } = props
      // 数值最大长度限制 16 位，包含小数
      return XEUtils.toNumber(maxLength || maxlength) || 16
    })

    const computeInpImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    const computeNumValue = computed(() => {
      const { type } = props
      const { inputValue } = reactData
      return type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
    })

    const computeNumLabel = computed(() => {
      const { type, showCurrency, currencySymbol, autoFill } = props
      const { inputValue } = reactData
      const digitsValue = computeDigitsValue.value
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
    })

    const computeIsDisabledSubtractNumber = computed(() => {
      const { min } = props
      const { inputValue } = reactData
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && min !== null) {
        return numValue <= XEUtils.toNumber(min)
      }
      return false
    })

    const computeIsDisabledAddNumber = computed(() => {
      const { max } = props
      const { inputValue } = reactData
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && max !== null) {
        return numValue >= XEUtils.toNumber(max)
      }
      return false
    })

    const handleNumberString = (val: any) => {
      if (XEUtils.eqNull(val)) {
        return ''
      }
      return `${val}`
    }

    const getNumberValue = (val: any) => {
      const { exponential, autoFill } = props
      const inpMaxLength = computeInpMaxLength.value
      const digitsValue = computeDigitsValue.value
      const decimalsType = computeDecimalsType.value
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
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      numberInputMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const handleChange = (val: number | null, inputValue: string, evnt: Event | { type: string }) => {
      const value = eqEmptyValue(val) ? null : Number(val)
      const isChange = value !== props.modelValue
      if (isChange) {
        internalData.isUM = true
        emit('update:modelValue', value)
      }
      if (reactData.inputValue !== inputValue) {
        nextTick(() => {
          reactData.inputValue = inputValue || ''
        })
      }
      numberInputMethods.dispatchEvent('input', { value }, evnt as Event)
      if (isChange) {
        numberInputMethods.dispatchEvent('change', { value }, evnt as Event)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const emitInputEvent = (inputValue: any, evnt: Event) => {
      const inpImmediate = computeInpImmediate.value
      const value = eqEmptyValue(inputValue) ? null : XEUtils.toNumber(inputValue)
      reactData.inputValue = inputValue
      if (inpImmediate) {
        handleChange(value, inputValue, evnt)
      } else {
        numberInputMethods.dispatchEvent('input', { value }, evnt)
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      emitInputEvent(value, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        triggerEvent(evnt)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      const inputReadonly = computeInputReadonly.value
      if (!inputReadonly) {
        const { inputValue } = reactData
        reactData.inputValue = eqEmptyValue(inputValue) ? '' : `${XEUtils.toNumber(inputValue)}`
        reactData.isFocus = true
        reactData.isActivated = true
        triggerEvent(evnt)
      }
    }

    const clickPrefixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        numberInputMethods.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    }

    const clearValueEvent = (evnt: Event, value: VxeNumberInputPropTypes.ModelValue) => {
      focus()
      handleChange(null, '', evnt)
      numberInputMethods.dispatchEvent('clear', { value }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        numberInputMethods.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    }

    const updateModel = (val: any) => {
      const { autoFill } = props
      const { inputValue } = reactData
      const digitsValue = computeDigitsValue.value
      const decimalsType = computeDecimalsType.value
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
    }

    /**
     * 检查初始值
     */
    const initValue = () => {
      const { autoFill } = props
      const { inputValue } = reactData
      const digitsValue = computeDigitsValue.value
      const decimalsType = computeDecimalsType.value
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
            handleChange(validValue, textValue, { type: 'init' })
          } else {
            reactData.inputValue = textValue
          }
        }
      }
    }

    const validMaxNum = (num: number | string) => {
      return props.max === null || XEUtils.toNumber(num) <= XEUtils.toNumber(props.max)
    }

    const validMinNum = (num: number | string) => {
      return props.min === null || XEUtils.toNumber(num) >= XEUtils.toNumber(props.min)
    }

    const afterCheckValue = () => {
      const { type, min, max, exponential } = props
      const { inputValue } = reactData
      const inputReadonly = computeInputReadonly.value
      if (!inputReadonly) {
        if (eqEmptyValue(inputValue)) {
          let inpNumVal = null
          let inpValue = inputValue
          if (min || min === 0) {
            inpNumVal = XEUtils.toNumber(min)
            inpValue = `${inpNumVal}`
          }
          handleChange(inpNumVal, `${inpValue || ''}`, { type: 'check' })
          return
        }
        if (inputValue || (min || max)) {
          let inpNumVal: number | string = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
          if (!validMinNum(inpNumVal)) {
            inpNumVal = min
          } else if (!validMaxNum(inpNumVal)) {
            inpNumVal = max
          }
          if (exponential) {
            const inpStringVal = handleNumberString(inputValue).toLowerCase()
            if (inpStringVal === XEUtils.toNumber(inpNumVal).toExponential()) {
              inpNumVal = inpStringVal
            }
          }
          const inpValue = getNumberValue(inpNumVal)
          handleChange(eqEmptyValue(inpValue) ? null : Number(inpValue), inpValue, { type: 'check' })
        }
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const inpImmediate = computeInpImmediate.value
      const value = inputValue ? Number(inputValue) : null
      if (!inpImmediate) {
        handleChange(value, handleNumberString(inputValue), evnt)
      }
      afterCheckValue()
      reactData.isFocus = false
      reactData.isActivated = false
      numberInputMethods.dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    }

    // 数值
    const numberChange = (isPlus: boolean, evnt: Event) => {
      const { min, max, type } = props
      const { inputValue } = reactData
      const stepValue = computeStepValue.value
      const numValue = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      const newValue = isPlus ? XEUtils.add(numValue, stepValue) : XEUtils.subtract(numValue, stepValue)
      let restNum: number | string
      if (!validMinNum(newValue)) {
        restNum = min
      } else if (!validMaxNum(newValue)) {
        restNum = max
      } else {
        restNum = newValue
      }
      emitInputEvent(getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    }

    const numberNextEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const isDisabledSubtractNumber = computeIsDisabledSubtractNumber.value
      numberStopDown()
      if (!isDisabled && !formReadonly && !isDisabledSubtractNumber) {
        numberChange(false, evnt)
      }
      reactData.isActivated = true
      numberInputMethods.dispatchEvent('next-number', { value: reactData.inputValue }, evnt)
    }

    const numberDownNextEvent = (evnt: Event) => {
      internalData.dnTimeout = setTimeout(() => {
        numberNextEvent(evnt)
        numberDownNextEvent(evnt)
      }, 60)
    }

    const numberPrevEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const isDisabledAddNumber = computeIsDisabledAddNumber.value
      numberStopDown()
      if (!isDisabled && !formReadonly && !isDisabledAddNumber) {
        numberChange(true, evnt)
      }
      reactData.isActivated = true
      numberInputMethods.dispatchEvent('prev-number', { value: reactData.inputValue }, evnt)
    }

    const numberKeydownEvent = (evnt: KeyboardEvent) => {
      const isUpArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_UP)
      const isDwArrow = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.ARROW_DOWN)
      if (isUpArrow || isDwArrow) {
        evnt.preventDefault()
        if (isUpArrow) {
          numberPrevEvent(evnt)
        } else {
          numberNextEvent(evnt)
        }
      }
    }

    const keydownEvent = (evnt: KeyboardEvent & { type: 'keydown' }) => {
      const { type, exponential, controls } = props
      const inputReadonly = computeInputReadonly.value
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
        afterCheckValue()
      } else if (isUpArrow || isDwArrow) {
        if (controls && !inputReadonly) {
          numberKeydownEvent(evnt)
        }
      }
      triggerEvent(evnt)
    }

    const keyupEvent = (evnt: KeyboardEvent & { type: 'keyup' }) => {
      triggerEvent(evnt)
    }

    // 数值

    const numberStopDown = () => {
      const { dnTimeout } = internalData
      if (dnTimeout) {
        clearTimeout(dnTimeout)
        internalData.dnTimeout = undefined
      }
    }

    const numberDownPrevEvent = (evnt: Event) => {
      internalData.dnTimeout = setTimeout(() => {
        numberPrevEvent(evnt)
        numberDownPrevEvent(evnt)
      }, 60)
    }

    const numberMousedownEvent = (evnt: MouseEvent) => {
      numberStopDown()
      if (evnt.button === 0) {
        const isPrevNumber = hasClass(evnt.currentTarget, 'is--prev')
        if (isPrevNumber) {
          numberPrevEvent(evnt)
        } else {
          numberNextEvent(evnt)
        }
        internalData.dnTimeout = setTimeout(() => {
          if (isPrevNumber) {
            numberDownPrevEvent(evnt)
          } else {
            numberDownNextEvent(evnt)
          }
        }, 500)
      }
    }

    const wheelEvent = (evnt: WheelEvent & {
      type: 'wheel';
      wheelDelta: number;
    }) => {
      const inputReadonly = computeInputReadonly.value
      if (props.controls && !inputReadonly && props.wheel) {
        if (reactData.isActivated) {
          evnt.stopPropagation()
          evnt.preventDefault()
          const delta = evnt.deltaY
          if (delta > 0) {
            numberNextEvent(evnt)
          } else if (delta < 0) {
            numberPrevEvent(evnt)
          }
        }
      }
      triggerEvent(evnt)
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { isActivated } = reactData
      const el = refElem.value
      const panelElem = refInputPanel.value
      const isDisabled = computeIsDisabled.value
      const inputReadonly = computeInputReadonly.value
      const inpImmediate = computeInpImmediate.value
      if (!isDisabled && !inputReadonly && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (!reactData.isActivated) {
          if (!inpImmediate) {
            const { inputValue } = reactData
            const value = inputValue ? Number(inputValue) : null
            handleChange(value, handleNumberString(inputValue), evnt)
          }
          afterCheckValue()
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable } = props
      const isDisabled = computeIsDisabled.value
      const inputReadonly = computeInputReadonly.value
      if (!isDisabled && !inputReadonly) {
        const isTab = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.TAB)
        const isDel = globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.DELETE)
        let isActivated = reactData.isActivated
        if (isTab) {
          if (isActivated) {
            afterCheckValue()
          }
          isActivated = false
          reactData.isActivated = isActivated
        }
        if (isDel && clearable) {
          if (isActivated) {
            clearValueEvent(evnt, null)
          }
        }
      }
    }

    const handleGlobalBlurEvent = () => {
      const { isActivated } = reactData
      if (isActivated) {
        afterCheckValue()
      }
    }

    const renderNumberIcon = () => {
      const isDisabledAddNumber = computeIsDisabledAddNumber.value
      const isDisabledSubtractNumber = computeIsDisabledSubtractNumber.value
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
            onMousedown: numberMousedownEvent,
            onMouseup: numberStopDown,
            onMouseleave: numberStopDown
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_PREV_NUM
            })
          ]),
          h('div', {
            class: ['vxe-input--number-btn is--next', {
              'is--disabled': isDisabledSubtractNumber
            }],
            onMousedown: numberMousedownEvent,
            onMouseup: numberStopDown,
            onMouseleave: numberStopDown
          }, [
            h('i', {
              class: getIcon().NUMBER_INPUT_NEXT_NUM
            })
          ])
        ])
      ])
    }

    const renderPrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-number-input--prefix',
          onClick: clickPrefixEvent
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
    }

    const renderSuffixIcon = () => {
      const { suffixIcon } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isDisabled = computeIsDisabled.value
      const isClearable = computeIsClearable.value
      return h('div', {
        class: ['vxe-number-input--suffix', {
          'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }]
      }, [
        isClearable
          ? h('div', {
            class: 'vxe-number-input--clear-icon',
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
            class: 'vxe-number-input--suffix-icon',
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
    }

    const renderExtraSuffixIcon = () => {
      const { controls } = props
      const inputReadonly = computeInputReadonly.value
      if (controls && !inputReadonly) {
        return renderNumberIcon()
      }
      return createCommentVNode()
    }

    const dispatchEvent = (type: ValueOf<VxeNumberInputEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $numberInput: $xeNumberInput }, params))
    }

    numberInputMethods = {
      dispatchEvent,

      focus () {
        const inputReadonly = computeInputReadonly.value
        if (!inputReadonly) {
          const inputElem = refInputTarget.value
          reactData.isActivated = true
          inputElem.focus()
        }
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
      }
    }

    Object.assign($xeNumberInput, numberInputMethods)

    const renderVN = () => {
      const { className, controls, type, align, name, autocomplete, autoComplete } = props
      const { inputValue, isFocus, isActivated } = reactData
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      const numLabel = computeNumLabel.value
      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-number-input--readonly', `type--${type}`, className]
        }, numLabel)
      }
      const inputReadonly = computeInputReadonly.value
      const inpMaxLength = computeInpMaxLength.value
      const inpPlaceholder = computeInpPlaceholder.value
      const isClearable = computeIsClearable.value
      const prefix = renderPrefixIcon()
      const suffix = renderSuffixIcon()
      return h('div', {
        ref: refElem,
        class: ['vxe-number-input', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': controls && !inputReadonly,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        spellcheck: false
      }, [
        prefix || createCommentVNode(),
        h('div', {
          class: 'vxe-number-input--wrapper'
        }, [
          h('input', {
            ref: refInputTarget,
            class: 'vxe-number-input--inner',
            value: !isFocus && type === 'amount' ? numLabel : inputValue,
            name,
            type: 'text',
            placeholder: inpPlaceholder,
            maxlength: inpMaxLength,
            readonly: inputReadonly,
            disabled: isDisabled,
            autocomplete: autoComplete || autocomplete,
            onKeydown: keydownEvent,
            onKeyup: keyupEvent,
            onWheel: wheelEvent,
            onClick: clickEvent,
            onInput: inputEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent
          })
        ]),
        suffix || createCommentVNode()
      ])
    }

    $xeNumberInput.renderVN = renderVN

    watch(() => props.modelValue, (val) => {
      if (!internalData.isUM) {
        updateModel(val)
      }
      internalData.isUM = false
    })

    watch(() => props.type, () => {
      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.modelValue
      })
      initValue()
    })

    onMounted(() => {
      globalEvents.on($xeNumberInput, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeNumberInput, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeNumberInput, 'blur', handleGlobalBlurEvent)
    })

    onBeforeUnmount(() => {
      reactData.isFocus = false
      numberStopDown()
      afterCheckValue()
      globalEvents.off($xeNumberInput, 'mousedown')
      globalEvents.off($xeNumberInput, 'keydown')
      globalEvents.off($xeNumberInput, 'blur')
    })

    initValue()

    return $xeNumberInput
  },
  render () {
    return this.renderVN()
  }
})
