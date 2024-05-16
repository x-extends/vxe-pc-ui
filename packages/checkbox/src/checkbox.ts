import { defineComponent, h, computed, inject, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import globalConfigStore from '../../ui/src/globalStore'
import { useSize } from '../../hooks/size'

import { VxeCheckboxConstructor, VxeCheckboxGroupConstructor, VxeCheckboxEmits, VxeCheckboxGroupPrivateMethods, CheckboxMethods, VxeCheckboxPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineComponent({
  name: 'VxeCheckbox',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.ModelValue>,
    label: { type: [String, Number] as PropType<VxeCheckboxPropTypes.Label>, default: null },
    indeterminate: Boolean as PropType<VxeCheckboxPropTypes.Indeterminate>,
    title: [String, Number] as PropType<VxeCheckboxPropTypes.Title>,
    checkedValue: { type: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.CheckedValue>, default: true },
    uncheckedValue: { type: [String, Number, Boolean] as PropType<VxeCheckboxPropTypes.UncheckedValue>, default: false },
    content: [String, Number] as PropType<VxeCheckboxPropTypes.Content>,
    disabled: Boolean as PropType<VxeCheckboxPropTypes.Disabled>,
    size: { type: String as PropType<VxeCheckboxPropTypes.Size>, default: () => globalConfigStore.checkbox.size || globalConfigStore.size }
  },
  emits: [
    'update:modelValue',
    'change'
  ] as VxeCheckboxEmits,
  setup (props, context) {
    const { slots, emit } = context
    const $xeform = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const $xecheckbox = {
      xID,
      props,
      context
    } as unknown as VxeCheckboxConstructor

    let checkboxMethods = {} as CheckboxMethods

    const computeSize = useSize(props)

    const $xeCheckboxGroup = inject('$xeCheckboxGroup', null as (VxeCheckboxGroupConstructor & VxeCheckboxGroupPrivateMethods) | null)

    const computeIsChecked = computed(() => {
      if ($xeCheckboxGroup) {
        return XEUtils.includes($xeCheckboxGroup.props.modelValue, props.label)
      }
      return props.modelValue === props.checkedValue
    })

    const computeIsDisabled = computed(() => {
      if (props.disabled) {
        return true
      }
      if ($xeCheckboxGroup) {
        const { props: groupProps } = $xeCheckboxGroup
        const { computeIsMaximize } = $xeCheckboxGroup.getComputeMaps()
        const isMaximize = computeIsMaximize.value
        const isChecked = computeIsChecked.value
        return groupProps.disabled || (isMaximize && !isChecked)
      }
      return false
    })

    const changeEvent = (evnt: Event & { target: { checked: boolean } }) => {
      const { checkedValue, uncheckedValue } = props
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const checked = evnt.target.checked
        const value = checked ? checkedValue : uncheckedValue
        const params = { checked, value, label: props.label }
        if ($xeCheckboxGroup) {
          $xeCheckboxGroup.handleChecked(params, evnt)
        } else {
          emit('update:modelValue', value)
          checkboxMethods.dispatchEvent('change', params, evnt)
          // 自动更新校验状态
          if ($xeform && formItemInfo) {
            $xeform.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    }

    checkboxMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $checkbox: $xecheckbox, $event: evnt }, params))
      }
    }

    Object.assign($xecheckbox, checkboxMethods)

    const renderVN = () => {
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const isChecked = computeIsChecked.value
      const indeterminate = props.indeterminate
      return h('label', {
        class: ['vxe-checkbox', {
          [`size--${vSize}`]: vSize,
          'is--indeterminate': indeterminate,
          'is--disabled': isDisabled,
          'is--checked': isChecked
        }],
        title: props.title
      }, [
        h('input', {
          class: 'vxe-checkbox--input',
          type: 'checkbox',
          disabled: isDisabled,
          checked: isChecked,
          onChange: changeEvent
        }),
        h('span', {
          class: ['vxe-checkbox--icon', indeterminate ? 'vxe-icon-checkbox-indeterminate' : (isChecked ? 'vxe-icon-checkbox-checked' : 'vxe-icon-checkbox-unchecked')]
        }),
        h('span', {
          class: 'vxe-checkbox--label'
        }, slots.default ? slots.default({}) : getFuncText(props.content))
      ])
    }

    $xecheckbox.renderVN = renderVN

    return $xecheckbox
  },
  render () {
    return this.renderVN()
  }
})
