import { h, provide, PropType, computed, inject, reactive } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, createEvent, useSize } from '../../ui'
import XEUtils from 'xe-utils'
import VxeCheckboxComponent from './checkbox'

import type { VxeCheckboxGroupConstructor, VxeCheckboxGroupEmits, ValueOf, CheckboxGroupReactData, VxeCheckboxGroupPrivateMethods, CheckboxGroupPrivateMethods, CheckboxGroupPrivateComputed, CheckboxGroupMethods, VxeCheckboxGroupPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCheckboxGroup',
  props: {
    modelValue: Array as PropType<VxeCheckboxGroupPropTypes.ModelValue>,
    options: Array as PropType<VxeCheckboxGroupPropTypes.Options>,
    optionProps: Object as PropType<VxeCheckboxGroupPropTypes.OptionProps>,
    disabled: {
      type: Boolean as PropType<VxeCheckboxGroupPropTypes.Disabled>,
      default: null
    },
    max: {
      type: [String, Number] as PropType<VxeCheckboxGroupPropTypes.Max>,
      default: null
    },
    size: {
      type: String as PropType<VxeCheckboxGroupPropTypes.Size>,
      default: () => getConfig().checkboxGroup.size || getConfig().size
    }
  },
  emits: [
    'update:modelValue',
    'change'
  ] as VxeCheckboxGroupEmits,
  setup (props, context) {
    const { slots, emit } = context
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const reactData: CheckboxGroupReactData = reactive({
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.props.readonly || $xeForm.props.disabled
        }
        return false
      }
      return disabled
    })

    const computeIsMaximize = computed(() => {
      const { modelValue, max } = props
      if (max) {
        return (modelValue ? modelValue.length : 0) >= XEUtils.toNumber(max)
      }
      return false
    })

    const computePropsOpts = computed(() => {
      return Object.assign({}, props.optionProps)
    })

    const computeLabelField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.label || 'label'
    })

    const computeValueField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.value || 'value'
    })

    const computeDisabledField = computed(() => {
      const propsOpts = computePropsOpts.value
      return propsOpts.disabled || 'disabled'
    })

    const computeMaps: CheckboxGroupPrivateComputed = {
      computeIsMaximize,
      computeIsDisabled
    }

    const $xeCheckboxGroup = {
      xID,
      props,
      context,
      reactData,

      getComputeMaps: () => computeMaps
    } as unknown as VxeCheckboxGroupConstructor & VxeCheckboxGroupPrivateMethods

    useSize(props)

    const dispatchEvent = (type: ValueOf<VxeCheckboxGroupEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $checkboxGroup: $xeCheckboxGroup }, params))
    }

    const checkboxGroupMethods: CheckboxGroupMethods = {
      dispatchEvent
    }

    const checkboxGroupPrivateMethods: CheckboxGroupPrivateMethods = {
      handleChecked (params, evnt) {
        const { checked, label } = params
        const checklist = props.modelValue || []
        const checkIndex = checklist.indexOf(label)
        if (checked) {
          if (checkIndex === -1) {
            checklist.push(label)
          }
        } else {
          checklist.splice(checkIndex, 1)
        }
        emit('update:modelValue', checklist)
        $xeCheckboxGroup.dispatchEvent('change', Object.assign({ checklist }, params), evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, checklist)
        }
      }
    }

    Object.assign($xeCheckboxGroup, checkboxGroupMethods, checkboxGroupPrivateMethods)

    const renderVN = () => {
      const { options } = props
      const defaultSlot = slots.default
      const valueField = computeValueField.value as 'value'
      const labelField = computeLabelField.value as 'label'
      const disabledField = computeDisabledField.value as 'disabled'
      return h('div', {
        class: 'vxe-checkbox-group'
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map(item => {
              return h(VxeCheckboxComponent, {
                key: item[valueField],
                label: item[valueField],
                content: item[labelField],
                disabled: item[disabledField]
              })
            })
            : []))
    }

    provide('$xeCheckboxGroup', $xeCheckboxGroup)

    $xeCheckboxGroup.renderVN = renderVN

    return renderVN
  }
})
