import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins, getIcon, renderEmptyElement } from '../../ui'
import { createComponentLog } from '../../ui/src/log'

import type { VxeCheckboxGroupConstructor, VxeCheckboxEmits, ValueOf, CheckboxReactData, VxeComponentSizeType, VxeCheckboxGroupPrivateMethods, VxeCheckboxPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

const { warnLog } = createComponentLog('checkbox')

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCheckbox',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.ModelValue>,
    /**
     * 已废弃，被 checkedValue 替换
     * @deprecated
     */
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
    computeCheckValue () {
      const $xeCheckbox = this
      const props = $xeCheckbox

      const { checkedValue, label } = props
      return XEUtils.isUndefined(checkedValue) ? label : checkedValue
    },
    computeIsChecked () {
      const $xeCheckbox = this
      const props = $xeCheckbox
      const $xeCheckboxGroup = $xeCheckbox.$xeCheckboxGroup

      const checkValue = $xeCheckbox.computeCheckValue
      if ($xeCheckboxGroup) {
        return XEUtils.includes($xeCheckboxGroup.value, checkValue)
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

      const { uncheckedValue } = props
      const isDisabled = $xeCheckbox.computeIsDisabled
      const checkValue = $xeCheckbox.computeCheckValue
      if (!isDisabled) {
        const checked = evnt.target.checked
        if ($xeCheckboxGroup) {
          const value = checkValue
          const params = { checked, value, label: value }
          $xeCheckboxGroup.handleChecked(params, evnt)
        } else {
          const value = checked ? checkValue : uncheckedValue
          const params = { checked, value, label: value }
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
      const $xeCheckboxGroup = $xeCheckbox.$xeCheckboxGroup

      const { content } = props
      const vSize = $xeCheckbox.computeSize
      const isDisabled = $xeCheckbox.computeIsDisabled
      const isChecked = $xeCheckbox.computeIsChecked
      const checkValue = $xeCheckbox.computeCheckValue
      const indeterminate = !isChecked && props.indeterminate
      const defaultSlot = slots.default

      if ($xeCheckboxGroup) {
        const isGroupReadonly = $xeCheckboxGroup.computeIsReadonly
        if (isGroupReadonly) {
          if (isChecked) {
            return h('label', {
              class: ['vxe-checkbox vxe-checkbox--view', {
                [`size--${vSize}`]: vSize,
                'is--readonly': isGroupReadonly
              }]
            }, [
              h('span', {
                class: 'vxe-checkbox--label'
              }, defaultSlot ? defaultSlot({}) : getFuncText(content))
            ])
          }
          return renderEmptyElement($xeCheckbox)
        }
      }
      return h('label', {
        key: `${checkValue}`,
        class: ['vxe-checkbox vxe-checkbox--default', {
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
          class: ['vxe-checkbox--icon', indeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : (isDisabled ? getIcon().CHECKBOX_DISABLED_UNCHECKED : getIcon().CHECKBOX_UNCHECKED))]
        }),
        h('span', {
          class: 'vxe-checkbox--label'
        }, defaultSlot ? defaultSlot({}) : getFuncText(content))
      ])
    }
  },
  mounted () {
    const $xeCheckbox = this
    const props = $xeCheckbox

    if (props.label !== null) {
      warnLog('vxe.error.delProp', ['label', 'checked-value'])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
