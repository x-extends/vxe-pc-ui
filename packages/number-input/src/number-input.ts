import { defineComponent, h, ref, Ref, computed, reactive, inject, nextTick, watch, onUnmounted, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, globalEvents, GLOBAL_EVENT_KEYS, createEvent, useSize } from '@vxe-ui/core'
import { getFuncText } from '../../ui/src/utils'
import { hasClass, getEventTargetNode } from '../../ui/src/dom'

import type { VxeInputConstructor, VxeNumberInputEmits, InputReactData, NumberInputMethods, VxeNumberInputPropTypes, InputPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export function handleNumber (val: string | number) {
  return XEUtils.isString(val) ? val.replace(/,/g, '') : val
}

export function toFloatValueFixed (inputValue: string | number, digitsValue: number) {
  if (/^-/.test('' + inputValue)) {
    return XEUtils.toFixed(XEUtils.ceil(inputValue, digitsValue), digitsValue)
  }
  return XEUtils.toFixed(XEUtils.floor(inputValue, digitsValue), digitsValue)
}

export default defineComponent({
  name: 'VxeNumberInput',
  props: {
    modelValue: [String, Number, Date] as PropType<VxeNumberInputPropTypes.ModelValue>,
    immediate: { type: Boolean as PropType<VxeNumberInputPropTypes.Immediate>, default: true },
    name: String as PropType<VxeNumberInputPropTypes.Name>,
    type: { type: String as PropType<VxeNumberInputPropTypes.Type>, default: 'number' },
    clearable: { type: Boolean as PropType<VxeNumberInputPropTypes.Clearable>, default: () => getConfig().input.clearable },
    readonly: Boolean as PropType<VxeNumberInputPropTypes.Readonly>,
    disabled: Boolean as PropType<VxeNumberInputPropTypes.Disabled>,
    placeholder: {
      type: String as PropType<VxeNumberInputPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().input.placeholder) ? getI18n('vxe.base.pleaseInput') : getConfig().input.placeholder
    },
    maxlength: [String, Number] as PropType<VxeNumberInputPropTypes.Maxlength>,
    autocomplete: { type: String as PropType<VxeNumberInputPropTypes.Autocomplete>, default: 'off' },
    align: String as PropType<VxeNumberInputPropTypes.Align>,
    form: String as PropType<VxeNumberInputPropTypes.Form>,
    className: String as PropType<VxeNumberInputPropTypes.ClassName>,
    size: { type: String as PropType<VxeNumberInputPropTypes.Size>, default: () => getConfig().input.size || getConfig().size },
    multiple: Boolean as PropType<VxeNumberInputPropTypes.Multiple>,

    // number、integer、float
    min: { type: [String, Number] as PropType<VxeNumberInputPropTypes.Min>, default: null },
    max: { type: [String, Number] as PropType<VxeNumberInputPropTypes.Max>, default: null },
    step: [String, Number] as PropType<VxeNumberInputPropTypes.Step>,
    exponential: { type: Boolean as PropType<VxeNumberInputPropTypes.Exponential>, default: () => getConfig().input.exponential },

    // number、integer、float
    controls: { type: Boolean as PropType<VxeNumberInputPropTypes.Controls>, default: () => getConfig().input.controls },

    // float
    digits: { type: [String, Number] as PropType<VxeNumberInputPropTypes.Digits>, default: () => getConfig().input.digits },

    prefixIcon: String as PropType<VxeNumberInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxeNumberInputPropTypes.SuffixIcon>
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

    const reactData = reactive<InputReactData>({
      inited: false,
      panelIndex: 0,
      showPwd: false,
      visiblePanel: false,
      animatVisible: false,
      panelStyle: null,
      panelPlacement: '',
      isActivated: false,
      inputValue: props.modelValue,
      datetimePanelValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>
    const refInputPanel = ref() as Ref<HTMLDivElement>

    const refMaps: InputPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xeInput = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxeInputConstructor

    let inputMethods = {} as NumberInputMethods

    const computeIsNumType = computed(() => {
      return true
    })

    const computeDigitsValue = computed(() => {
      return XEUtils.toInteger(props.digits) || 1
    })

    const computeStepValue = computed(() => {
      const { type } = props
      const digitsValue = computeDigitsValue.value
      const step = props.step
      if (type === 'integer') {
        return XEUtils.toInteger(step) || 1
      } else if (type === 'float') {
        return XEUtils.toNumber(step) || (1 / Math.pow(10, digitsValue))
      }
      return XEUtils.toNumber(step) || 1
    })

    const computeInpReadonly = computed(() => {
      const { readonly, multiple } = props
      return readonly || multiple
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      return ''
    })

    const computeInpMaxlength = computed(() => {
      const { maxlength } = props
      const isNumType = computeIsNumType.value
      // 数值最大长度限制 16 位，包含小数
      return isNumType && !XEUtils.toNumber(maxlength) ? 16 : maxlength
    })

    const computeInpImmediate = computed(() => {
      const { type, immediate } = props
      return immediate || !(type === 'number' || type === 'integer' || type === 'float')
    })

    const computeNumValue = computed(() => {
      const { type } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      if (isNumType) {
        return type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      }
      return 0
    })

    const computeIsDisabledSubtractNumber = computed(() => {
      const { min } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && min !== null) {
        return numValue <= XEUtils.toNumber(min)
      }
      return false
    })

    const computeIsDisabledAddNumber = computed(() => {
      const { max } = props
      const { inputValue } = reactData
      const isNumType = computeIsNumType.value
      const numValue = computeNumValue.value
      // 当有值时再进行判断
      if ((inputValue || inputValue === 0) && isNumType && max !== null) {
        return numValue >= XEUtils.toNumber(max)
      }
      return false
    })

    const getNumberValue = (val: any) => {
      const { type, exponential } = props
      const inpMaxlength = computeInpMaxlength.value
      const digitsValue = computeDigitsValue.value
      const restVal = (type === 'float' ? toFloatValueFixed(val, digitsValue) : XEUtils.toValueString(val))
      if (exponential && (val === restVal || XEUtils.toValueString(val).toLowerCase() === XEUtils.toNumber(restVal).toExponential())) {
        return val
      }
      return restVal.slice(0, inpMaxlength)
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'keydown' | 'keyup' | 'wheel' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      inputMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const emitModel = (value: string, evnt: Event | { type: string }) => {
      reactData.inputValue = value
      emit('update:modelValue', value)
      inputMethods.dispatchEvent('input', { value }, evnt as any)
      if (XEUtils.toValueString(props.modelValue) !== value) {
        inputMethods.dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const emitInputEvent = (value: any, evnt: Event) => {
      const inpImmediate = computeInpImmediate.value
      reactData.inputValue = value
      if (inpImmediate) {
        emitModel(value, evnt)
      } else {
        inputMethods.dispatchEvent('input', { value }, evnt)
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
      reactData.isActivated = true
      triggerEvent(evnt)
    }

    const clickPrefixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        inputMethods.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    }

    const clearValueEvent = (evnt: Event, value: VxeNumberInputPropTypes.ModelValue) => {
      const { type } = props
      const isNumType = computeIsNumType.value
      if (isNumType || ['text', 'search', 'password'].indexOf(type) > -1) {
        focus()
      }
      inputMethods.dispatchEvent('clear', { value }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const { disabled } = props
      if (!disabled) {
        if (hasClass(evnt.currentTarget, 'is--clear')) {
          emitModel('', evnt)
          clearValueEvent(evnt, '')
        } else {
          const { inputValue } = reactData
          inputMethods.dispatchEvent('suffix-click', { value: inputValue }, evnt)
        }
      }
    }

    /**
     * 检查初始值
     */
    const initValue = () => {
      const { type } = props
      const { inputValue } = reactData
      const digitsValue = computeDigitsValue.value
      if (type === 'float') {
        if (inputValue) {
          const validValue = toFloatValueFixed(inputValue, digitsValue)
          if (inputValue !== validValue) {
            emitModel(validValue, { type: 'init' })
          }
        }
      }
    }

    const vaildMaxNum = (num: number | string) => {
      return props.max === null || XEUtils.toNumber(num) <= XEUtils.toNumber(props.max)
    }

    const vaildMinNum = (num: number | string) => {
      return props.min === null || XEUtils.toNumber(num) >= XEUtils.toNumber(props.min)
    }

    const afterCheckValue = () => {
      const { type, min, max, exponential } = props
      const { inputValue } = reactData
      const inpReadonly = computeInpReadonly.value
      if (!inpReadonly) {
        if (inputValue) {
          let inpNumVal: number | string = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
          if (!vaildMinNum(inpNumVal)) {
            inpNumVal = min
          } else if (!vaildMaxNum(inpNumVal)) {
            inpNumVal = max
          }
          if (exponential) {
            const inpStringVal = XEUtils.toValueString(inputValue).toLowerCase()
            if (inpStringVal === XEUtils.toNumber(inpNumVal).toExponential()) {
              inpNumVal = inpStringVal
            }
          }
          emitModel(getNumberValue(inpNumVal), { type: 'check' })
        }
      }
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const inpImmediate = computeInpImmediate.value
      if (!inpImmediate) {
        emitModel(inputValue, evnt)
      }
      afterCheckValue()
      if (!reactData.visiblePanel) {
        reactData.isActivated = false
      }
      inputMethods.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    // 数值
    const numberChange = (isPlus: boolean, evnt: Event) => {
      const { min, max, type } = props
      const { inputValue } = reactData
      const stepValue = computeStepValue.value
      const numValue = type === 'integer' ? XEUtils.toInteger(handleNumber(inputValue)) : XEUtils.toNumber(handleNumber(inputValue))
      const newValue = isPlus ? XEUtils.add(numValue, stepValue) : XEUtils.subtract(numValue, stepValue)
      let restNum: number | string
      if (!vaildMinNum(newValue)) {
        restNum = min
      } else if (!vaildMaxNum(newValue)) {
        restNum = max
      } else {
        restNum = newValue
      }
      emitInputEvent(getNumberValue(restNum), evnt as (Event & { type: 'input' }))
    }

    let downbumTimeout: number

    const numberNextEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const isDisabledSubtractNumber = computeIsDisabledSubtractNumber.value
      clearTimeout(downbumTimeout)
      if (!disabled && !readonly && !isDisabledSubtractNumber) {
        numberChange(false, evnt)
      }
      inputMethods.dispatchEvent('next-number', {}, evnt)
    }

    const numberDownNextEvent = (evnt: Event) => {
      downbumTimeout = window.setTimeout(() => {
        numberNextEvent(evnt)
        numberDownNextEvent(evnt)
      }, 60)
    }

    const numberPrevEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const isDisabledAddNumber = computeIsDisabledAddNumber.value
      clearTimeout(downbumTimeout)
      if (!disabled && !readonly && !isDisabledAddNumber) {
        numberChange(true, evnt)
      }
      inputMethods.dispatchEvent('prev-number', {}, evnt)
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
      const { exponential, controls } = props
      const isNumType = computeIsNumType.value
      if (isNumType) {
        const isCtrlKey = evnt.ctrlKey
        const isShiftKey = evnt.shiftKey
        const isAltKey = evnt.altKey
        const keyCode = evnt.keyCode
        if (!isCtrlKey && !isShiftKey && !isAltKey && (globalEvents.hasKey(evnt, GLOBAL_EVENT_KEYS.SPACEBAR) || ((!exponential || keyCode !== 69) && (keyCode >= 65 && keyCode <= 90)) || (keyCode >= 186 && keyCode <= 188) || keyCode >= 191)) {
          evnt.preventDefault()
        }
        if (controls) {
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
      clearTimeout(downbumTimeout)
    }

    const numberDownPrevEvent = (evnt: Event) => {
      downbumTimeout = window.setTimeout(() => {
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
        downbumTimeout = window.setTimeout(() => {
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
      const isNumType = computeIsNumType.value
      if (isNumType && props.controls) {
        if (reactData.isActivated) {
          const delta = evnt.deltaY
          if (delta > 0) {
            numberNextEvent(evnt)
          } else if (delta < 0) {
            numberPrevEvent(evnt)
          }
          evnt.preventDefault()
        }
      }
      triggerEvent(evnt)
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    // 全局事件
    const handleGlobalMousedownEvent = (evnt: Event) => {
      const { disabled } = props
      const { isActivated } = reactData
      const el = refElem.value
      const panelElem = refInputPanel.value
      if (!disabled && isActivated) {
        reactData.isActivated = getEventTargetNode(evnt, el).flag || getEventTargetNode(evnt, panelElem).flag
        if (!reactData.isActivated) {
          afterCheckValue()
        }
      }
    }

    const handleGlobalKeydownEvent = (evnt: KeyboardEvent) => {
      const { clearable, disabled } = props
      if (!disabled) {
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
      return h('span', {
        class: 'vxe-number-input--number-suffix'
      }, [
        h('span', {
          class: ['vxe-number-input--number-prev is--prev', {
            'is--disabled': isDisabledAddNumber
          }],
          onMousedown: numberMousedownEvent,
          onMouseup: numberStopDown,
          onMouseleave: numberStopDown
        }, [
          h('i', {
            class: ['vxe-number-input--number-prev-icon', getIcon().INPUT_PREV_NUM]
          })
        ]),
        h('span', {
          class: ['vxe-number-input--number-next is--next', {
            'is--disabled': isDisabledSubtractNumber
          }],
          onMousedown: numberMousedownEvent,
          onMouseup: numberStopDown,
          onMouseleave: numberStopDown
        }, [
          h('i', {
            class: ['vxe-number-input--number-next-icon', getIcon().INPUT_NEXT_NUM]
          })
        ])
      ])
    }

    const rendePrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      const icons = []
      if (prefixSlot) {
        icons.push(
          h('span', {
            class: 'vxe-number-input--prefix-icon'
          }, prefixSlot({}))
        )
      } else if (prefixIcon) {
        icons.push(
          h('i', {
            class: ['vxe-number-input--prefix-icon', prefixIcon]
          })
        )
      }
      return icons.length
        ? h('span', {
          class: 'vxe-number-input--prefix',
          onClick: clickPrefixEvent
        }, icons)
        : null
    }

    const renderSuffixIcon = () => {
      const { disabled, suffixIcon, clearable } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const icons = []
      if (suffixSlot) {
        icons.push(
          h('span', {
            class: 'vxe-number-input--suffix-icon'
          }, suffixSlot({}))
        )
      } else if (suffixIcon) {
        icons.push(
          h('i', {
            class: ['vxe-number-input--suffix-icon', suffixIcon]
          })
        )
      }
      if (clearable) {
        icons.push(
          h('i', {
            class: ['vxe-number-input--clear-icon', getIcon().INPUT_CLEAR]
          })
        )
      }
      return icons.length
        ? h('span', {
          class: ['vxe-number-input--suffix', {
            'is--clear': clearable && !disabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
          }],
          onClick: clickSuffixEvent
        }, icons)
        : null
    }

    const renderExtraSuffixIcon = () => {
      const { controls } = props
      let icons
      if (controls) {
        icons = renderNumberIcon()
      }
      return icons
        ? h('span', {
          class: 'vxe-number-input--extra-suffix'
        }, [icons])
        : null
    }

    inputMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $input: $xeInput }, params))
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
      }
    }

    Object.assign($xeInput, inputMethods)

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
    })

    watch(() => props.type, () => {
      // 切换类型是重置内置变量
      Object.assign(reactData, {
        inputValue: props.modelValue,
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      })
      initValue()
    })

    nextTick(() => {
      globalEvents.on($xeInput, 'mousedown', handleGlobalMousedownEvent)
      globalEvents.on($xeInput, 'keydown', handleGlobalKeydownEvent)
      globalEvents.on($xeInput, 'blur', handleGlobalBlurEvent)
    })

    onUnmounted(() => {
      numberStopDown()
      globalEvents.off($xeInput, 'mousedown')
      globalEvents.off($xeInput, 'keydown')
      globalEvents.off($xeInput, 'blur')
    })

    initValue()

    const renderVN = () => {
      const { className, controls, type, align, name, disabled, readonly, autocomplete } = props
      const { inputValue, visiblePanel, isActivated } = reactData
      const vSize = computeSize.value
      const inpReadonly = computeInpReadonly.value
      const inpMaxlength = computeInpMaxlength.value
      const inpPlaceholder = computeInpPlaceholder.value
      const childs = []
      const prefix = rendePrefixIcon()
      const suffix = renderSuffixIcon()
      // 前缀图标
      if (prefix) {
        childs.push(prefix)
      }
      // 输入框
      childs.push(
        h('input', {
          ref: refInputTarget,
          class: 'vxe-number-input--inner',
          value: inputValue,
          name,
          type: 'text',
          placeholder: inpPlaceholder,
          maxlength: inpMaxlength,
          readonly: inpReadonly,
          disabled,
          autocomplete,
          onKeydown: keydownEvent,
          onKeyup: keyupEvent,
          onWheel: wheelEvent,
          onClick: clickEvent,
          onInput: inputEvent,
          onChange: changeEvent,
          onFocus: focusEvent,
          onBlur: blurEvent
        })
      )
      // 后缀图标
      if (suffix) {
        childs.push(suffix)
      }
      // 特殊功能图标
      childs.push(renderExtraSuffixIcon())
      return h('div', {
        ref: refElem,
        class: ['vxe-number-input', `type--${type}`, className, {
          [`size--${vSize}`]: vSize,
          [`is--${align}`]: align,
          'is--controls': controls,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--readonly': readonly,
          'is--visivle': visiblePanel,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, childs)
    }

    $xeInput.renderVN = renderVN

    return $xeInput
  },
  render () {
    return this.renderVN()
  }
})
