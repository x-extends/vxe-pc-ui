import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, getI18n, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText } from '../../ui/src/utils'
import { getSlotVNs } from '../..//ui/src/vn'

import type { VxePasswordInputEmits, VxeComponentSizeType, PasswordInputReactData, ValueOf, VxePasswordInputPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxePasswordInput',
  mixins: [
    globalMixins.sizeMixin
  ],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: String as PropType<VxePasswordInputPropTypes.ModelValue>,
    name: String as PropType<VxePasswordInputPropTypes.Name>,
    clearable: {
      type: Boolean as PropType<VxePasswordInputPropTypes.Clearable>,
      default: () => getConfig().passwordInput.clearable
    },
    readonly: Boolean as PropType<VxePasswordInputPropTypes.Readonly>,
    disabled: Boolean as PropType<VxePasswordInputPropTypes.Disabled>,
    maxLength: [String, Number] as PropType<VxePasswordInputPropTypes.MaxLength>,
    placeholder: String as PropType<VxePasswordInputPropTypes.Placeholder>,
    autoComplete: {
      type: String as PropType<VxePasswordInputPropTypes.AutoComplete>,
      default: 'off'
    },
    className: String as PropType<VxePasswordInputPropTypes.ClassName>,
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

    // 已废弃
    autocomplete: String as PropType<VxePasswordInputPropTypes.Autocomplete>
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
    const reactData: PasswordInputReactData = {
      showPwd: false,
      isActivated: false,
      inputValue: ''
    }
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeIsClearable () {
      const $xePasswordInput = this
      const props = $xePasswordInput

      return props.clearable
    },
    computeInpReadonly () {
      const $xePasswordInput = this
      const props = $xePasswordInput

      const { readonly } = props
      return readonly
    },
    computeInpPlaceholder () {
      const $xePasswordInput = this
      const props = $xePasswordInput

      const { placeholder } = props
      if (placeholder) {
        return getFuncText(placeholder)
      }
      const globalPlaceholder = getConfig().passwordInput.placeholder
      if (globalPlaceholder) {
        return getFuncText(globalPlaceholder)
      }
      return getI18n('vxe.base.pleaseInput')
    },
    computeInputType () {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const { showPwd } = reactData
      if (showPwd) {
        return 'text'
      }
      return 'password'
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxePasswordInputEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xePasswordInput = this
      $xePasswordInput.$emit(type, createEvent(evnt, { $passwordInput: $xePasswordInput }, params))
    },
    emitModel  (value: any) {
      const $xeModal = this

      $xeModal.$emit('modelValue', value)
    },
    focus () {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const inputElem = $xePasswordInput.$refs.refInputTarget as HTMLInputElement
      reactData.isActivated = true
      inputElem.focus()
      return $xePasswordInput.$nextTick()
    },
    blur () {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const inputElem = $xePasswordInput.$refs.refInputTarget as HTMLInputElement
      inputElem.blur()
      reactData.isActivated = false
      return $xePasswordInput.$nextTick()
    },
    select () {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const inputElem = $xePasswordInput.$refs.refInputTarget as HTMLInputElement
      inputElem.select()
      reactData.isActivated = false
      return $xePasswordInput.$nextTick()
    },
    triggerEvent  (evnt: Event & { type: 'input' | 'change' | 'click' | 'focus' | 'blur' }) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const { inputValue } = reactData
      $xePasswordInput.dispatchEvent(evnt.type, { value: inputValue }, evnt)
    },
    emitInputEvent (value: any, evnt: Event) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      reactData.inputValue = value
      $xePasswordInput.dispatchEvent('input', { value }, evnt)
    },
    inputEvent (evnt: Event & { type: 'input' }) {
      const $xePasswordInput = this

      const inputElem = evnt.target as HTMLInputElement
      const value = inputElem.value
      $xePasswordInput.emitInputEvent(value, evnt)
    },
    handleChange (value: string, evnt: Event | { type: string }) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const reactData = $xePasswordInput.reactData
      const $xeForm = $xePasswordInput.$xeForm
      const formItemInfo = $xePasswordInput.formItemInfo

      reactData.inputValue = value
      $xePasswordInput.emitModel(value)
      $xePasswordInput.dispatchEvent('input', { value }, evnt as any)
      if (XEUtils.toValueString(props.value) !== value) {
        $xePasswordInput.dispatchEvent('change', { value }, evnt as any)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },
    changeEvent (evnt: Event & { type: 'change' }) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData
      const $xeForm = $xePasswordInput.$xeForm
      const formItemInfo = $xePasswordInput.formItemInfo

      $xePasswordInput.triggerEvent(evnt)
      const { inputValue } = reactData
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, inputValue)
      }
    },
    focusEvent (evnt: Event & { type: 'focus' }) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      reactData.isActivated = true
      $xePasswordInput.triggerEvent(evnt)
    },
    blurEvent (evnt: Event & { type: 'blur' }) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData
      const $xeForm = $xePasswordInput.$xeForm
      const formItemInfo = $xePasswordInput.formItemInfo

      const { inputValue } = reactData
      const value = inputValue
      $xePasswordInput.dispatchEvent('blur', { value }, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },
    passwordToggleEvent  (evnt: Event) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const reactData = $xePasswordInput.reactData

      const { readonly, disabled } = props
      const { showPwd } = reactData
      if (!disabled && !readonly) {
        reactData.showPwd = !showPwd
      }
      $xePasswordInput.dispatchEvent('toggle-visible', { visible: reactData.showPwd }, evnt)
    },
    clickEvent  (evnt: Event & { type: 'click' }) {
      const $xePasswordInput = this

      $xePasswordInput.triggerEvent(evnt)
    },
    clearValueEvent  (evnt: Event, value: VxePasswordInputPropTypes.ModelValue) {
      const $xePasswordInput = this

      $xePasswordInput.focus()
      $xePasswordInput.handleChange('', evnt)
      $xePasswordInput.dispatchEvent('clear', { value }, evnt)
    },
    clickSuffixEvent  (evnt: Event) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const reactData = $xePasswordInput.reactData

      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        $xePasswordInput.dispatchEvent('suffix-click', { value: inputValue }, evnt)
      }
    },
    clickPrefixEvent (evnt: Event) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const reactData = $xePasswordInput.reactData

      const { disabled } = props
      if (!disabled) {
        const { inputValue } = reactData
        $xePasswordInput.dispatchEvent('prefix-click', { value: inputValue }, evnt)
      }
    },

    //
    // Render
    //
    renderPasswordIcon (h: CreateElement) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      const { showPwd } = reactData
      return h('div', {
        class: 'vxe-password-input--control-icon',
        on: {
          click: $xePasswordInput.passwordToggleEvent
        }
      }, [
        h('i', {
          class: ['vxe-password-input--password-icon', showPwd ? getIcon().PASSWORD_INPUT_SHOW_PWD : getIcon().PASSWORD_INPUT_HIDE_PWD]
        })
      ])
    },
    renderPrefixIcon (h: CreateElement) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const slots = $xePasswordInput.$scopedSlots

      const { prefixIcon } = props
      const prefixSlot = slots.prefix
      return prefixSlot || prefixIcon
        ? h('div', {
          class: 'vxe-password-input--prefix',
          on: {
            click: $xePasswordInput.clickPrefixEvent
          }
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
    },
    renderSuffixIcon  (h: CreateElement) {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const slots = $xePasswordInput.$scopedSlots
      const reactData = $xePasswordInput.reactData

      const { disabled, suffixIcon, controls } = props
      const { inputValue } = reactData
      const suffixSlot = slots.suffix
      const isClearable = $xePasswordInput.computeIsClearable
      return isClearable || controls || suffixSlot || suffixIcon
        ? h('div', {
          class: ['vxe-password-input--suffix', {
            'is--clear': isClearable && !disabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
          }]
        }, [
          isClearable
            ? h('div', {
              class: 'vxe-password-input--clear-icon',
              on: {
                click: $xePasswordInput.clearValueEvent
              }
            }, [
              h('i', {
                class: getIcon().INPUT_CLEAR
              })
            ])
            : renderEmptyElement($xePasswordInput),
          controls ? $xePasswordInput.renderPasswordIcon(h) : renderEmptyElement($xePasswordInput),
          suffixSlot || suffixIcon
            ? h('div', {
              class: 'vxe-password-input--suffix-icon',
              on: {
                click: $xePasswordInput.clickSuffixEvent
              }
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
    },
    renderVN (h: CreateElement): VNode {
      const $xePasswordInput = this
      const props = $xePasswordInput
      const reactData = $xePasswordInput.reactData

      const { className, name, disabled, readonly, autocomplete, autoComplete, maxLength } = props
      const { inputValue, isActivated } = reactData
      const vSize = $xePasswordInput.computeSize
      const inpReadonly = $xePasswordInput.computeInpReadonly
      const inputType = $xePasswordInput.computeInputType
      const inpPlaceholder = $xePasswordInput.computeInpPlaceholder
      const isClearable = $xePasswordInput.computeIsClearable
      const prefix = $xePasswordInput.renderPrefixIcon(h)
      const suffix = $xePasswordInput.renderSuffixIcon(h)
      return h('div', {
        ref: 'refElem',
        class: ['vxe-password-input', className, {
          [`size--${vSize}`]: vSize,
          'is--prefix': !!prefix,
          'is--suffix': !!suffix,
          'is--readonly': readonly,
          'is--disabled': disabled,
          'is--active': isActivated,
          'show--clear': isClearable && !disabled && !(inputValue === '' || XEUtils.eqNull(inputValue))
        }],
        attrs: {
          spellcheck: false
        }
      }, [
        prefix || renderEmptyElement($xePasswordInput),
        h('div', {
          class: 'vxe-password-input--wrapper'
        }, [
          h('input', {
            ref: 'refInputTarget',
            class: 'vxe-password-input--inner',
            domProps: {
              value: inputValue
            },
            attrs: {
              name,
              type: inputType,
              placeholder: inpPlaceholder,
              readonly: inpReadonly,
              disabled,
              autocomplete: autocomplete || autoComplete,
              maxlength: maxLength
            },
            on: {
              click: $xePasswordInput.clickEvent,
              input: $xePasswordInput.inputEvent,
              change: $xePasswordInput.changeEvent,
              focus: $xePasswordInput.focusEvent,
              blur: $xePasswordInput.blurEvent
            }
          })
        ]),
        suffix || renderEmptyElement($xePasswordInput)
      ])
    }
  },
  watch: {
    value (val) {
      const $xePasswordInput = this
      const reactData = $xePasswordInput.reactData

      reactData.inputValue = val
    }
  },
  created () {
    const $xePasswordInput = this
    const props = $xePasswordInput
    const reactData = $xePasswordInput.reactData

    reactData.inputValue = props.value
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
