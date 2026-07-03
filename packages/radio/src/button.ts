import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { createComponentLog } from '../../ui/src/log'

import type { VxeRadioButtonPropTypes, RadioButtonReactData, RadioGroupPrivateComputed, VxeRadioGroupConstructor, ValueOf, VxeRadioButtonEmits, VxeRadioGroupPrivateMethods, VxeFormConstructor, VxeComponentPermissionInfo, VxeComponentSizeType, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

const { warnLog } = createComponentLog('radio-button')

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeRadioButton',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.ModelValue>,
    checkedValue: {
      type: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.CheckedValue>,
      default: undefined
    },
    title: [String, Number] as PropType<VxeRadioButtonPropTypes.Title>,
    content: [String, Number] as PropType<VxeRadioButtonPropTypes.Content>,
    icon: String as PropType<VxeRadioButtonPropTypes.Icon>,
    disabled: {
      type: Boolean as PropType<VxeRadioButtonPropTypes.Disabled>,
      default: null
    },
    strict: {
      type: Boolean as PropType<VxeRadioButtonPropTypes.Strict>,
      default: () => getConfig().radioButton.strict
    },
    size: {
      type: String as PropType<VxeRadioButtonPropTypes.Size>,
      default: () => getConfig().radioButton.size || getConfig().size
    },

    /**
     * 已废弃，被 checkedValue 替换
     * @deprecated
     */
    label: {
      type: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.Label>,
      default: null
    }
  },
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    },
    $xeRadioGroup: {
      default: null
    }
  },
  data () {
    const reactData: RadioButtonReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
      $xeRadioGroup(): (VxeRadioGroupConstructor & RadioGroupPrivateComputed & VxeRadioGroupPrivateMethods) | null
    }),
    computeCheckValue () {
      const $xeRadioButton = this
      const props = $xeRadioButton

      const { checkedValue, label } = props
      return XEUtils.isUndefined(checkedValue) ? label : checkedValue
    },
    computeIsDisabled () {
      const $xeRadioButton = this
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup
      const { disabled } = $xeRadioButton
      if (disabled === null) {
        if ($xeRadioGroup) {
          const isGroupDisabled = $xeRadioGroup.computeIsDisabled
          const isGroupReadonly = $xeRadioGroup.computeIsReadonly
          return isGroupDisabled || isGroupReadonly
        }
      }
      return disabled
    },
    computeName  () {
      const $xeRadioButton = this
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      return $xeRadioGroup ? $xeRadioGroup.name : null
    },
    computeStrict () {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      return $xeRadioGroup ? $xeRadioGroup.strict : props.strict
    },
    computeIsChecked  () {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      const checkValue = $xeRadioButton.computeCheckValue
      if ($xeRadioGroup) {
        return $xeRadioGroup.value === checkValue
      }
      return props.value === checkValue
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRadioButtonEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRadioButton = this
      $xeRadioButton.$emit(type, createEvent(evnt, { $radioButton: $xeRadioButton }, params))
    },
    emitModel  (value: any) {
      const $xeRadioButton = this

      const { _events } = $xeRadioButton as any
      $xeRadioButton.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeRadioButton.$emit('modelValue', value)
      } else {
        $xeRadioButton.$emit('model-value', value)
      }
    },
    handleValue (checkedValue: VxeRadioButtonPropTypes.CheckedValue, evnt: Event) {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeForm = $xeRadioButton.$xeForm
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup
      const formItemInfo = $xeRadioButton.formItemInfo

      const { content } = props
      if ($xeRadioGroup) {
        $xeRadioGroup.handleChecked({ label: checkedValue, checkedValue, checkedLabel: content }, evnt)
      } else {
        $xeRadioButton.emitModel(checkedValue)
        $xeRadioButton.dispatchEvent('change', { value: checkedValue, label: checkedValue, checkedValue, checkedLabel: content }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, checkedValue)
        }
      }
    },
    changeEvent (evnt: Event) {
      const $xeRadioButton = this

      const isDisabled = $xeRadioButton.computeIsDisabled
      if (!isDisabled) {
        const checkValue = $xeRadioButton.computeCheckValue
        $xeRadioButton.handleValue(checkValue, evnt)
      }
    },
    clickEvent  (evnt: Event) {
      const $xeRadioButton = this

      const isDisabled = $xeRadioButton.computeIsDisabled
      const isStrict = $xeRadioButton.computeStrict
      if (!isDisabled && !isStrict) {
        const isChecked = $xeRadioButton.computeIsChecked
        if (isChecked) {
          $xeRadioButton.handleValue(null, evnt)
        }
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const slots = $xeRadioButton.$scopedSlots
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      const { icon, content } = props
      const vSize = $xeRadioButton.computeSize
      const isDisabled = $xeRadioButton.computeIsDisabled
      const name = $xeRadioButton.computeName
      const isChecked = $xeRadioButton.computeIsChecked
      const checkValue = $xeRadioButton.computeCheckValue
      const defaultSlot = slots.default

      if ($xeRadioGroup) {
        const isGroupReadonly = $xeRadioGroup.computeIsReadonly
        if (isGroupReadonly) {
          if (isChecked) {
            return h('label', {
              class: ['vxe-radio vxe-radio--button-view', {
                [`size--${vSize}`]: vSize,
                'is--readonly': isGroupReadonly
              }]
            }, [
              h('span', {
                class: 'vxe-checkbox--label'
              }, defaultSlot
                ? defaultSlot({})
                : [
                    icon
                      ? h('span', {
                        class: 'vxe-radio--button-icon'
                      }, [
                        h('i', { class: icon })
                      ])
                      : renderEmptyElement($xeRadioButton),
                    content
                      ? h('span', {
                        class: 'vxe-radio--button-content'
                      }, getFuncText(content))
                      : renderEmptyElement($xeRadioButton)
                  ])
            ])
          }
          return renderEmptyElement($xeRadioButton)
        }
      }
      return h('label', {
        key: `${checkValue}`,
        class: ['vxe-radio vxe-radio--button', {
          [`size--${vSize}`]: vSize,
          'is--disabled': isDisabled
        }],
        attrs: {
          title: props.title
        }
      }, [
        h('input', {
          class: 'vxe-radio--input',
          domProps: {
            checked: isChecked
          },
          attrs: {
            type: 'radio',
            name,
            disabled: isDisabled
          },
          on: {
            change: $xeRadioButton.changeEvent,
            click: $xeRadioButton.clickEvent
          }
        }),
        h('span', {
          class: ['vxe-radio--label', {
            'is--disabled': isDisabled
          }]
        }, defaultSlot
          ? defaultSlot({})
          : [
              icon
                ? h('span', {
                  class: 'vxe-radio--button-icon'
                }, [
                  h('i', { class: icon })
                ])
                : renderEmptyElement($xeRadioButton),
              content
                ? h('span', {
                  class: 'vxe-radio--button-content'
                }, getFuncText(content))
                : renderEmptyElement($xeRadioButton)
            ])
      ])
    }
  },
  mounted () {
    const $xeRadioButton = this
    const props = $xeRadioButton

    if (props.label !== null) {
      warnLog('vxe.error.delProp', ['label', 'checked-value'])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
