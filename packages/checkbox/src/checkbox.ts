import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins, getIcon } from '../../ui'

import type { VxeCheckboxGroupConstructor, VxeCheckboxEmits, ValueOf, CheckboxReactData, VxeComponentSizeType, VxeCheckboxGroupPrivateMethods, VxeCheckboxPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCheckbox',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.ModelValue>,
    label: {
      type: [String, Number] as PropType<VxeCheckboxPropTypes.Label>,
      default: null
    },
    indeterminate: Boolean as PropType<VxeCheckboxPropTypes.Indeterminate>,
    title: [String, Number] as PropType<VxeCheckboxPropTypes.Title>,
    checkedValue: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.CheckedValue>,
      default: true
    },
    uncheckedValue: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.UncheckedValue>,
      default: false
    },
    content: [String, Number] as PropType<VxeCheckboxPropTypes.Content>,
    disabled: {
      type: Boolean as PropType<VxeCheckboxPropTypes.Disabled>,
      default: null
    },
    size: {
      type: String as PropType<VxeCheckboxPropTypes.Size>,
      default: () => getConfig().checkbox.size || getConfig().size
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
    const reactData: CheckboxReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
      $xeCheckboxGroup(): (VxeCheckboxGroupConstructor & VxeCheckboxGroupPrivateMethods) | null
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
    dispatchEvent (type: ValueOf<VxeCheckboxEmits>, params: Record<string, any>, evnt: Event | null) {
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
      const $xeCheckbox = this
      const props = $xeCheckbox
      const slots = $xeCheckbox.$scopedSlots

      const { label } = props
      const vSize = $xeCheckbox.computeSize
      const isDisabled = $xeCheckbox.computeIsDisabled
      const isChecked = $xeCheckbox.computeIsChecked
      const indeterminate = !isChecked && props.indeterminate
      return h('label', {
        key: label,
        class: ['vxe-checkbox', {
          [`size--${vSize}`]: vSize,
          'is--indeterminate': indeterminate,
          'is--disabled': isDisabled,
          'is--checked': isChecked
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
            change: $xeCheckbox.changeEvent
          }
        }),
        h('span', {
          class: ['vxe-checkbox--icon', indeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
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
