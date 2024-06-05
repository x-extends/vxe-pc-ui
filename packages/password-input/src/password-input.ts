import { defineComponent, h, ref, Ref, computed, reactive, inject, nextTick, watch, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, createEvent, useSize } from '../../ui'
import { getFuncText } from '../../ui/src/utils'

import type { VxePasswordInputConstructor, VxePasswordInputEmits, PasswordInputReactData, PasswordInputMethods, VxePasswordInputPropTypes, InputPrivateRef, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineComponent({
  name: 'VxePasswordInput',
  props: {
    modelValue: String as PropType<VxePasswordInputPropTypes.ModelValue>,
    name: String as PropType<VxePasswordInputPropTypes.Name>,
    clearable: { type: Boolean as PropType<VxePasswordInputPropTypes.Clearable>, default: () => getConfig().input.clearable },
    readonly: Boolean as PropType<VxePasswordInputPropTypes.Readonly>,
    disabled: Boolean as PropType<VxePasswordInputPropTypes.Disabled>,
    placeholder: {
      type: String as PropType<VxePasswordInputPropTypes.Placeholder>,
      default: () => XEUtils.eqNull(getConfig().input.placeholder) ? getI18n('vxe.base.pleaseInput') : getConfig().input.placeholder
    },
    autocomplete: { type: String as PropType<VxePasswordInputPropTypes.Autocomplete>, default: 'off' },
    className: String as PropType<VxePasswordInputPropTypes.ClassName>,
    size: { type: String as PropType<VxePasswordInputPropTypes.Size>, default: () => getConfig().input.size || getConfig().size }
  },
  emits: [
    'update:modelValue',
    'input',
    'change',
    'click',
    'focus',
    'blur',
    'clear',
    'toggle-visible'
  ] as VxePasswordInputEmits,
  setup (props, context) {
    const { emit } = context
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

    let passwordInputMethods = {} as PasswordInputMethods

    const computeInpPlaceholder = computed(() => {
      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      return ''
    })

    const computeInputType = computed(() => {
      const { showPwd } = reactData
      if (showPwd) {
        return 'text'
      }
      return 'password'
    })

    const triggerEvent = (evnt: Event & { type: 'input' | 'change' | 'click' | 'focus' | 'blur' }) => {
      const { inputValue } = reactData
      passwordInputMethods.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    }

    const emitInputEvent = (value: any, evnt: Event) => {
      reactData.inputValue = value
      passwordInputMethods.dispatchEvent('input', { value }, evnt)
    }

    const inputEvent = (evnt: Event & { type: 'input' }) => {
      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      emitInputEvent(value, evnt)
    }

    const changeEvent = (evnt: Event & { type: 'change' }) => {
      triggerEvent(evnt)
      const { inputValue } = reactData
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, inputValue)
      }
    }

    const focusEvent = (evnt: Event & { type: 'focus' }) => {
      reactData.isActivated = true
      triggerEvent(evnt)
    }

    const blurEvent = (evnt: Event & { type: 'blur' }) => {
      const { inputValue } = reactData
      passwordInputMethods.dispatchEvent('blur', { value: inputValue }, evnt)
    }

    const passwordToggleEvent = (evnt: Event) => {
      const { readonly, disabled } = props
      const { showPwd } = reactData
      if (!disabled && !readonly) {
        reactData.showPwd = !showPwd
      }
      passwordInputMethods.dispatchEvent('toggle-visible', { visible: reactData.showPwd }, evnt)
    }

    const clickEvent = (evnt: Event & { type: 'click' }) => {
      triggerEvent(evnt)
    }

    const renderExtraSuffixIcon = () => {
      const { showPwd } = reactData
      return h('span', {
        class: 'vxe-password-input--extra-suffix'
      }, [
        h('span', {
          class: 'vxe-password-input--password-suffix',
          onClick: passwordToggleEvent
        }, [
          h('i', {
            class: ['vxe-password-input--password-icon', showPwd ? getIcon().INPUT_SHOW_PWD : getIcon().INPUT_PWD]
          })
        ])
      ])
    }

    passwordInputMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $passwordInput: $xePasswordInput }, params))
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

    Object.assign($xePasswordInput, passwordInputMethods)

    watch(() => props.modelValue, (val) => {
      reactData.inputValue = val
    })

    const renderVN = () => {
      const { className, name, disabled, readonly, autocomplete } = props
      const { inputValue, isActivated } = reactData
      const vSize = computeSize.value
      const inpPlaceholder = computeInpPlaceholder.value
      const inputType = computeInputType.value
      return h('div', {
        ref: refElem,
        class: ['vxe-password-input', className, {
          [`size--${vSize}`]: vSize,
          'is--readonly': readonly,
          'is--disabled': disabled,
          'is--active': isActivated
        }]
      }, [
        h('input', {
          ref: refInputTarget,
          class: 'vxe-password-input--inner',
          value: inputValue,
          name,
          type: inputType,
          placeholder: inpPlaceholder,
          disabled,
          autocomplete,
          onClick: clickEvent,
          onInput: inputEvent,
          onChange: changeEvent,
          onFocus: focusEvent,
          onBlur: blurEvent
        }),
        renderExtraSuffixIcon()
      ])
    }

    $xePasswordInput.renderVN = renderVN

    return $xePasswordInput
  },
  render () {
    return this.renderVN()
  }
})
