import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeCheckboxButtonPropTypes, CheckboxButtonReactData, CheckboxGroupPrivateComputed, VxeCheckboxGroupConstructor, ValueOf, VxeCheckboxButtonEmits, VxeCheckboxGroupPrivateMethods, VxeFormConstructor, VxeComponentPermissionInfo, VxeComponentSizeType, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCheckboxButton',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.ModelValue>,
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
      default: false
    },
    content: [String, Number] as PropType<VxeCheckboxButtonPropTypes.Content>,
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
    computeIsChecked () {
      const $xeCheckbox = this
      const props = $xeCheckbox
      const $xeCheckboxGroup = $xeCheckbox.$xeCheckboxGroup

      if ($xeCheckboxGroup) {
        return XEUtils.includes($xeCheckboxGroup.value, props.label)
      }
      return props.value === props.checkedValue
    },
    computeIsDisabled () {
      const $xeCheckbox = this
      const props = $xeCheckbox
      const $xeCheckboxGroup = $xeCheckbox.$xeCheckboxGroup

      const { disabled } = props
      const isChecked = $xeCheckbox.computeIsChecked
      if (disabled === null) {
        if ($xeCheckboxGroup) {
          const isGroupDisabled = $xeCheckboxGroup.computeIsDisabled
          const isGroupMaximize = $xeCheckboxGroup.computeIsMaximize
          return isGroupDisabled || (isGroupMaximize && !isChecked)
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
      const $xeCheckbox = this
      $xeCheckbox.$emit(type, createEvent(evnt, { $checkbox: $xeCheckbox }, params))
    },
    emitModel (value: any) {
      const $xeCheckbox = this

      const { _events } = $xeCheckbox as any
      $xeCheckbox.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeCheckbox.$emit('modelValue', value)
      } else {
        $xeCheckbox.$emit('model-value', value)
      }
    },
    changeEvent  (evnt: Event & { target: { checked: boolean } }) {
      const $xeCheckbox = this
      const props = $xeCheckbox
      const $xeCheckboxGroup = $xeCheckbox.$xeCheckboxGroup
      const $xeForm = $xeCheckbox.$xeForm
      const formItemInfo = $xeCheckbox.formItemInfo

      const { checkedValue, uncheckedValue } = props
      const isDisabled = $xeCheckbox.computeIsDisabled
      if (!isDisabled) {
        const checked = evnt.target.checked
        const value = checked ? checkedValue : uncheckedValue
        const params = { checked, value, label: props.label }
        if ($xeCheckboxGroup) {
          $xeCheckboxGroup.handleChecked(params, evnt)
        } else {
          $xeCheckbox.emitModel(value)
          $xeCheckbox.dispatchEvent('change', params, evnt)
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

      const { label } = props
      const vSize = $xeCheckboxButton.computeSize
      const isDisabled = $xeCheckboxButton.computeIsDisabled
      const isChecked = $xeCheckboxButton.computeIsChecked

      return h('label', {
        key: label,
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
          class: 'vxe-checkbox--label'
        }, slots.default ? slots.default({}) : getFuncText(props.content))
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
