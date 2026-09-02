import { h, ref, Ref, computed, reactive, inject, nextTick, watch, PropType, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getFuncText, getText } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxePasswordInputConstructor, VxePasswordInputEmits, PasswordInputReactData, PasswordInputMethods, VxePasswordInputPropTypes, InputPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxePasswordInput',
  props: {
    modelValue: String as PropType<VxePasswordInputPropTypes.ModelValue>,
    immediate: {
      type: Boolean as PropType<VxePasswordInputPropTypes.Immediate>,
      default: true
    },
    name: String as PropType<VxePasswordInputPropTypes.Name>,
    clearable: {
      type: Boolean as PropType<VxePasswordInputPropTypes.Clearable>,
      default: () => getConfig().passwordInput.clearable
    },
    readonly: Boolean as PropType<VxePasswordInputPropTypes.Readonly>,
    disabled: Boolean as PropType<VxePasswordInputPropTypes.Disabled>,
    maxLength: [String, Number] as PropType<VxePasswordInputPropTypes.MaxLength>,
    placeholder: String as PropType<VxePasswordInputPropTypes.Placeholder>,
    floatContent: {
      type: String as PropType<VxePasswordInputPropTypes.FloatContent>,
      default: () => getConfig().passwordInput.floatContent
    },
    floatAlign: {
      type: String as PropType<VxePasswordInputPropTypes.FloatAlign>,
      default: () => getConfig().passwordInput.floatAlign
    },
    autoComplete: {
      type: String as PropType<VxePasswordInputPropTypes.AutoComplete>,
      default: 'off'
    },
    className: String as PropType<VxePasswordInputPropTypes.ClassName>,
    inputClassName: {
      type: String as PropType<VxePasswordInputPropTypes.InputClassName>,
      default: () => getConfig().passwordInput.inputClassName
    },
    size: {
      type: String as PropType<VxePasswordInputPropTypes.Size>,
      default: () => getConfig().passwordInput.size || getConfig().size
    },
    prefixIcon: String as PropType<VxePasswordInputPropTypes.PrefixIcon>,
    suffixIcon: String as PropType<VxePasswordInputPropTypes.SuffixIcon>,
    controls: {
      type: Boolean as PropType<VxePasswordInputPropTypes.Controls>,
      default: () => getConfig().passwordInput.controls
    },
    editable: {
      type: Boolean as PropType<VxePasswordInputPropTypes.Editable>,
      default: true
    },

    // 已废弃
    autocomplete: String as PropType<VxePasswordInputPropTypes.Autocomplete>
  },
  emits: [
    'update:modelValue',
    'input',
    'change',
    'click',
    'focus',
    'blur',
    'clear',
    'lazy-change',
    'toggle-visible',
    'prefix-click',
    'suffix-click'
  ] as VxePasswordInputEmits,
  setup (props, context) {
    const { emit, slots } = context
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<PasswordInputReactData>({
      showPwd: false,
      isActivated: false,
      inputValue: props.modelValue
    })

    const refElem = ref() as Ref<HTMLDivElement>
    const refInputTarget = ref() as Ref<HTMLInputElement>

    const refMaps: InputPrivateRef = {
      refElem,
      refInput: refInputTarget
    }

    const $xePasswordInput = {
      xID,
      props,
      context,
      reactData,
      getRefMaps: () => refMaps
    } as unknown as VxePasswordInputConstructor

    const computeIsClearable = computed(() => {
      return props.clearable
    })

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().passwordInput.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseInput')
    })

    const computeFormReadonly = computed(() => {
      if (getConfig().inputReadonly === 'obsolete') {
        if ($xeForm) {
          return $xeForm.props.readonly
        }
        return false
      }
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

    const computeInputType = computed(() => {
      const { showPwd } = reactData
      if (showPwd) {
        return 'text'
      }
      return 'password'
    })

    const computeInpImmediate = computed(() => {
      const { immediate } = props
      return immediate
    })

    const computeInputReadonly = computed(() => {
      const { editable } = props
      const formReadonly = computeFormReadonly.value
      return formReadonly || !editable
    })

    const computeDomValue = computed(() => {
      const { inputValue } = reactData
      return inputValue
    })

    const dispatchEvent = (type: ValueOf<VxePasswordInputEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $passwordInput: $xePasswordInput }, params))
    }

    const updateDomValue = () => {
      const domValue = computeDomValue.value
      const inputElem = refInputTarget.value
      if (inputElem) {
        inputElem.value = XEUtils.eqNull(domValue) ? '' : ('' + domValue)
      }
    }

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const emitInputEvent = (value: any, evnt: Event) => {
      const inpImmediate = computeInpImmediate.value
      reactData.inputValue = value
      if (inpImmediate) {
        handleChange(value, evnt)
      } else {
        dispatchEvent('input', { value }, evnt)
      }
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      emitInputEvent(value, evnt)
    }

    const handleChange = (value: string, evnt: Event | { type: string }) => {
      reactData.inputValue = value
      emit('update:modelValue', value)
      dispatchEvent('input', { value }, evnt as any)
      if (XEUtils.toValueString(props.modelValue) !== value) {
        dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      triggerEvent(evnt)
      dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, reactData.inputValue)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      reactData.isActivated = true
      triggerEvent(evnt)
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      const value = inputValue
      reactData.isActivated = false
      dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    }

    const passwordToggleEvent = (evnt: Event) => {
      const { showPwd } = reactData
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      if (!isDisabled && !formReadonly) {
        reactData.showPwd = !showPwd
      }
      dispatchEvent('toggle-visible', { visible: reactData.showPwd }, evnt)
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    const clearValueEvent = (evnt: Event, value: VxePasswordInputPropTypes.ModelValue) => {
      focus()
      handleChange('', evnt)
      dispatchEvent('clear', { value }, evnt)
      dispatchEvent('lazy-change', { value: reactData.inputValue }, evnt)
    }

    const clickSuffixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    }

    const clickPrefixEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const { inputValue } = reactData
        dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    }

    const passwordInputMethods: PasswordInputMethods = {
      dispatchEvent,
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

    Object.assign($xePasswordInput, passwordInputMethods)

    const renderPasswordIcon = () => {
      const { showPwd } = reactData
      return h('div', {
        class: 'vxe-password-input--control-icon',
        onClick: passwordToggleEvent
      }, [
        h('i', {
          class: ['vxe-password-input--password-icon', showPwd ? getIcon().PASSWORD_INPUT_SHOW_PWD : getIcon().PASSWORD_INPUT_HIDE_PWD]
        })
      ])
    }

    const renderPrefixIcon = () => {
      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-password-input--prefix',
          onClick: clickPrefixEvent
        }, [
          h('div', {
            class: 'vxe-password-input--prefix-icon'
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
      const { suffixIcon, controls } = props
      const { inputValue } = reactData
      const isDisabled = computeIsDisabled.value
      const isClearable = computeIsClearable.value
      const suffixSlot = slots.suffix
      return isClearable || controls || suffixSlot || suffixIcon
        ? h('div', {
          class: ['vxe-password-input--suffix', {
            'is--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
          }]
        }, [
          isClearable
            ? h('div', {
              class: 'vxe-password-input--clear-icon',
              onClick: clearValueEvent
            }, [
              h('i', {
                class: getIcon().INPUT_CLEAR
              })
            ])
            : renderEmptyElement($xePasswordInput),
          controls ? renderPasswordIcon() : renderEmptyElement($xePasswordInput),
          suffixSlot || suffixIcon
            ? h('div', {
              class: 'vxe-password-input--suffix-icon',
              onClick: clickSuffixEvent
            }, suffixSlot
              ? getSlotVNs(suffixSlot({}))
              : [
                  h('i', {
                    class: suffixIcon
                  })
                ])
            : renderEmptyElement($xePasswordInput)
        ])
        : null
    }

    const renderVN = () => {
      const { className, inputClassName, name, readonly, floatContent, autocomplete, autoComplete, maxLength, floatAlign } = props
      const { inputValue, isActivated } = reactData
      const isDisabled = computeIsDisabled.value
      const formReadonly = computeFormReadonly.value
      if (formReadonly) {
        return h('div', {
          ref: refElem,
          class: ['vxe-password-input--readonly', className]
        }, getText(inputValue))
      }
      const vSize = computeSize.value
      const inputType = computeInputType.value
      const inpPlaceholder = computeInpPlaceholder.value
      const isClearable = computeIsClearable.value
      const inputReadonly = computeInputReadonly.value
      const prefix = renderPrefixIcon()
      const suffix = renderSuffixIcon()
      const floatSlot = slots.float
      return h('div', {
        ref: refElem,
        class: ['vxe-password-input', floatContent ? (`fla--${floatAlign || 'center'}`) : '', className, {
          [`size--${vSize}`]: vSize,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--readonly': readonly,
          'is--disabled': isDisabled,
          'is--active': isActivated,
          'show--clear': isClearable && !isDisabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        spellcheck: false
      }, [
        prefix || renderEmptyElement($xePasswordInput),
        h('div', {
          class: 'vxe-password-input--wrapper'
        }, [
          h('input', {
            ref: refInputTarget,
            class: 'vxe-password-input--inner' + (inputClassName ? (' ' + inputClassName) : ''),
            name,
            type: inputType,
            placeholder: inpPlaceholder,
            readonly: inputReadonly,
            disabled: isDisabled,
            autocomplete: autocomplete || autoComplete,
            maxlength: maxLength,
            onClick: clickEvent,
            onInput: inputEvent,
            onChange: changeEvent,
            onFocus: focusEvent,
            onBlur: blurEvent
          }),
          floatContent || floatSlot
            ? h('span', {
              class: 'vxe-password-input--float-wrapper'
            }, floatSlot ? floatSlot({}) : getText(floatContent))
            : renderEmptyElement($xePasswordInput)
        ]),
        suffix || renderEmptyElement($xePasswordInput)
      ])
    }

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
    })

    const rDvFlag = ref(0)
    watch(computeFormReadonly, () => {
      rDvFlag.value++
    })
    watch(computeDomValue, () => {
      rDvFlag.value++
    })
    watch(rDvFlag, () => {
      updateDomValue()
      nextTick(() => {
        updateDomValue()
      })
    })

    onMounted(() => {
      updateDomValue()
    })

    $xePasswordInput.renderVN = renderVN

    return $xePasswordInput
  },
  render () {
    return this.renderVN()
  }
})
