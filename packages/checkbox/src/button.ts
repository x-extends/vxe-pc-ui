import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'

import type { VxeCheckboxButtonPropTypes, CheckboxButtonReactData, CheckboxGroupPrivateComputed, VxeCheckboxGroupConstructor, ValueOf, VxeCheckboxButtonEmits, VxeCheckboxGroupPrivateMethods, VxeFormConstructor, VxeComponentPermissionInfo, VxeComponentSizeType, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCheckboxButton',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.ModelValue>,
    /**
     * 已废弃，被 checkedValue 替换
     */
    label: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.Label>,
      default: null
    },
    title: [String, Number] as PropType<VxeCheckboxButtonPropTypes.Title>,
    checkedValue: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.CheckedValue>,
      default: true
    },
    uncheckedValue: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.UncheckedValue>,
      default: undefined
    },
    content: [String, Number] as PropType<VxeCheckboxButtonPropTypes.Content>,
    icon: [String, Number] as PropType<VxeCheckboxButtonPropTypes.Icon>,
    disabled: {
      type: Boolean as PropType<VxeCheckboxButtonPropTypes.Disabled>,
      default: null
    },
    size: {
      type: String as PropType<VxeCheckboxButtonPropTypes.Size>,
      default: () => getConfig().checkboxButton.size || getConfig().size
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
    $xeCheckboxGroup: {
      default: null
    }
  },
  data () {
    const reactData: CheckboxButtonReactData = {
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
      $xeCheckboxGroup(): (VxeCheckboxGroupConstructor & CheckboxGroupPrivateComputed & VxeCheckboxGroupPrivateMethods) | null
    }),
    computeCheckValue () {
      const $xeCheckboxButton = this
      const props = $xeCheckboxButton

      const { checkedValue, label } = props
      return XEUtils.isUndefined(checkedValue) ? label : checkedValue
    },
    computeIsChecked () {
      const $xeCheckboxButton = this
      const props = $xeCheckboxButton
      const $xeCheckboxGroup = $xeCheckboxButton.$xeCheckboxGroup

      const checkValue = $xeCheckboxButton.computeCheckValue
      if ($xeCheckboxGroup) {
        return XEUtils.includes($xeCheckboxGroup.value, checkValue)
      }
      return props.value === checkValue
    },
    computeIsDisabled () {
      const $xeCheckboxButton = this
      const props = $xeCheckboxButton
      const $xeCheckboxGroup = $xeCheckboxButton.$xeCheckboxGroup

      const { disabled } = props
      const isChecked = $xeCheckboxButton.computeIsChecked
      if (disabled === null) {
        if ($xeCheckboxGroup) {
          const isGroupDisabled = $xeCheckboxGroup.computeIsDisabled
          const isGroupReadonly = $xeCheckboxGroup.computeIsReadonly
          const isGroupMaximize = $xeCheckboxGroup.computeIsMaximize
          return isGroupDisabled || isGroupReadonly || (isGroupMaximize && !isChecked)
        }
      }
      return disabled
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCheckboxButtonEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCheckboxButton = this
      $xeCheckboxButton.$emit(type, createEvent(evnt, { $checkboxButton: $xeCheckboxButton }, params))
    },
    emitModel (value: any) {
      const $xeCheckboxButton = this

      const { _events } = $xeCheckboxButton as any
      $xeCheckboxButton.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeCheckboxButton.$emit('modelValue', value)
      } else {
        $xeCheckboxButton.$emit('model-value', value)
      }
    },
    changeEvent  (evnt: Event & { target: { checked: boolean } }) {
      const $xeCheckboxButton = this
      const props = $xeCheckboxButton
      const $xeCheckboxGroup = $xeCheckboxButton.$xeCheckboxGroup
      const $xeForm = $xeCheckboxButton.$xeForm
      const formItemInfo = $xeCheckboxButton.formItemInfo

      const { uncheckedValue } = props
      const isDisabled = $xeCheckboxButton.computeIsDisabled
      const checkValue = $xeCheckboxButton.computeCheckValue
      if (!isDisabled) {
        const checked = evnt.target.checked
        if ($xeCheckboxGroup) {
          const value = checkValue
          const params = { checked, value, label: value }
          $xeCheckboxGroup.handleChecked(params, evnt)
        } else {
          const value = checked ? checkValue : uncheckedValue
          const params = { checked, value, label: value }
          $xeCheckboxButton.emitModel(value)
          $xeCheckboxButton.dispatchEvent('change', params, evnt)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCheckboxButton = this
      const props = $xeCheckboxButton
      const slots = $xeCheckboxButton.$scopedSlots
      const $xeCheckboxGroup = $xeCheckboxButton.$xeCheckboxGroup

      const { icon, content } = props
      const vSize = $xeCheckboxButton.computeSize
      const isDisabled = $xeCheckboxButton.computeIsDisabled
      const isChecked = $xeCheckboxButton.computeIsChecked
      const checkValue = $xeCheckboxButton.computeCheckValue
      const defaultSlot = slots.default

      if ($xeCheckboxGroup) {
        const isGroupReadonly = $xeCheckboxGroup.computeIsReadonly
        if (isGroupReadonly) {
          if (isChecked) {
            return h('label', {
              class: ['vxe-checkbox vxe-checkbox--button-view', {
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
                        class: 'vxe-checkbox--button-icon'
                      }, [
                        h('i', { class: icon })
                      ])
                      : renderEmptyElement($xeCheckboxButton),
                    content
                      ? h('span', {
                        class: 'vxe-checkbox--button-content'
                      }, getFuncText(content))
                      : renderEmptyElement($xeCheckboxButton)
                  ])
            ])
          }
          return renderEmptyElement($xeCheckboxButton)
        }
      }
      return h('label', {
        key: `${checkValue}`,
        class: ['vxe-checkbox vxe-checkbox--button', {
          [`size--${vSize}`]: vSize,
          'is--disabled': isDisabled
        }],
        attrs: {
          title: props.title
        }
      }, [
        h('input', {
          class: 'vxe-checkbox--input',
          domProps: {
            checked: isChecked
          },
          attrs: {
            type: 'checkbox',
            disabled: isDisabled
          },
          on: {
            change: $xeCheckboxButton.changeEvent
          }
        }),
        h('span', {
          class: ['vxe-checkbox--label', {
            'is--disabled': isDisabled
          }]
        }, defaultSlot
          ? defaultSlot({})
          : [
              icon
                ? h('span', {
                  class: 'vxe-checkbox--button-icon'
                }, [
                  h('i', { class: icon })
                ])
                : renderEmptyElement($xeCheckboxButton),
              content
                ? h('span', {
                  class: 'vxe-checkbox--button-content'
                }, getFuncText(content))
                : renderEmptyElement($xeCheckboxButton)
            ])
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
