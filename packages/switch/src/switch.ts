import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getFuncText } from '../../ui/src/utils'

import type { VxeSwitchPropTypes, VxeSwitchEmits, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, SwitchReactData, SwitchInternalData, VxeComponentPermissionInfo, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSwitch',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeSwitchPropTypes.ModelValue>,
    disabled: {
      type: Boolean as PropType<VxeSwitchPropTypes.Disabled>,
      default: null
    },
    size: {
      type: String as PropType<VxeSwitchPropTypes.Size>,
      default: () => getConfig().switch.size || getConfig().size
    },
    openLabel: String as PropType<VxeSwitchPropTypes.OpenLabel>,
    closeLabel: String as PropType<VxeSwitchPropTypes.CloseLabel>,
    openValue: {
      type: [String, Number, Boolean] as PropType<VxeSwitchPropTypes.OpenValue>,
      default: true
    },
    closeValue: {
      type: [String, Number, Boolean] as PropType<VxeSwitchPropTypes.CloseValue>,
      default: false
    },
    openIcon: String as PropType<VxeSwitchPropTypes.OpenIcon>,
    closeIcon: String as PropType<VxeSwitchPropTypes.CloseIcon>,
    openActiveIcon: String as PropType<VxeSwitchPropTypes.OpenActiveIcon>,
    closeActiveIcon: String as PropType<VxeSwitchPropTypes.CloseActiveIcon>
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
    const reactData: SwitchReactData = {
      isActivated: false,
      hasAnimat: false,
      offsetLeft: 0
    }
    const internalData: SwitchInternalData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeIsDisabled  () {
      const $xeSwitch = this
      const props = $xeSwitch
      const $xeForm = $xeSwitch.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.readonly || $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeOnShowLabel  () {
      const $xeSwitch = this
      const props = $xeSwitch

      return getFuncText(props.openLabel)
    },
    computeOffShowLabel  () {
      const $xeSwitch = this
      const props = $xeSwitch

      return getFuncText(props.closeLabel)
    },
    computeIsChecked  () {
      const $xeSwitch = this
      const props = $xeSwitch

      return props.value === props.openValue
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSwitchEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSwitch = this
      this.$emit(type, createEvent(evnt, { $switch: $xeSwitch }, params))
    },
    focus () {
      const $xeSwitch = this
      const reactData = $xeSwitch.reactData

      const btnElem = $xeSwitch.$refs.refButton as HTMLButtonElement
      reactData.isActivated = true
      if (btnElem) {
        btnElem.focus()
      }
      return $xeSwitch.$nextTick()
    },
    blur () {
      const $xeSwitch = this
      const reactData = $xeSwitch.reactData

      const btnElem = $xeSwitch.$refs.refButton as HTMLButtonElement
      if (btnElem) {
        btnElem.blur()
      }
      reactData.isActivated = false
      return $xeSwitch.$nextTick()
    },
    clickEvent  (evnt: Event) {
      const $xeSwitch = this
      const props = $xeSwitch
      const reactData = $xeSwitch.reactData
      const internalData = $xeSwitch.internalData
      const $xeForm = $xeSwitch.$xeForm
      const formItemInfo = $xeSwitch.formItemInfo

      const isDisabled = $xeSwitch.computeIsDisabled
      if (!isDisabled) {
        const isChecked = $xeSwitch.computeIsChecked
        clearTimeout(internalData.atTimeout)
        const value = isChecked ? props.closeValue : props.openValue
        reactData.hasAnimat = true
        $xeSwitch.$emit('input', value)
        $xeSwitch.dispatchEvent('change', { value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
        internalData.atTimeout = setTimeout(() => {
          reactData.hasAnimat = false
          internalData.atTimeout = undefined
        }, 400)
      }
    },
    focusEvent  (evnt: Event) {
      const $xeSwitch = this
      const props = $xeSwitch
      const reactData = $xeSwitch.reactData

      reactData.isActivated = true
      $xeSwitch.dispatchEvent('focus', { value: props.value }, evnt)
    },
    blurEvent  (evnt: Event) {
      const $xeSwitch = this
      const props = $xeSwitch
      const reactData = $xeSwitch.reactData

      reactData.isActivated = false
      $xeSwitch.dispatchEvent('blur', { value: props.value }, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeSwitch = this
      const props = $xeSwitch
      const reactData = $xeSwitch.reactData

      const { openIcon, closeIcon, openActiveIcon, closeActiveIcon } = props
      const vSize = $xeSwitch.computeSize
      const isChecked = $xeSwitch.computeIsChecked
      const onShowLabel = $xeSwitch.computeOnShowLabel
      const offShowLabel = $xeSwitch.computeOffShowLabel
      const isDisabled = $xeSwitch.computeIsDisabled

      return h('div', {
        class: ['vxe-switch', isChecked ? 'is--on' : 'is--off', {
          [`size--${vSize}`]: vSize,
          'is--disabled': isDisabled,
          'is--animat': reactData.hasAnimat
        }]
      }, [
        h('button', {
          ref: 'refButton',
          class: 'vxe-switch--button',
          attrs: {
            type: 'button',
            disabled: isDisabled
          },
          on: {
            click: $xeSwitch.clickEvent,
            focus: $xeSwitch.focusEvent,
            blur: $xeSwitch.blurEvent
          }
        }, [
          h('span', {
            class: 'vxe-switch--label vxe-switch--label-on'
          }, [
            openIcon
              ? h('i', {
                class: ['vxe-switch--label-icon', openIcon]
              })
              : renderEmptyElement($xeSwitch),
            onShowLabel
          ]),
          h('span', {
            class: 'vxe-switch--label vxe-switch--label-off'
          }, [
            closeIcon
              ? h('i', {
                class: ['vxe-switch--label-icon', closeIcon]
              })
              : renderEmptyElement($xeSwitch),
            offShowLabel
          ]),
          h('span', {
            class: ['vxe-switch--icon']
          }, openActiveIcon || closeActiveIcon
            ? [
                h('i', {
                  class: isChecked ? openActiveIcon : closeActiveIcon
                })
              ]
            : [])
        ])
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
