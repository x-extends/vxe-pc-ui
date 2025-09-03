import { h, provide, PropType, inject, computed, reactive } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize } from '../../ui'
import VxeRadioComponent from './radio'
import VxeRadioButtonComponent from './button'

import type { VxeRadioGroupPropTypes, VxeRadioGroupConstructor, RadioGroupReactData, VxeRadioGroupEmits, VxeRadioGroupPrivateMethods, RadioGroupPrivateMethods, RadioGroupPrivateComputed, RadioGroupMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeRadioGroup',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeRadioGroupPropTypes.ModelValue>,
    disabled: {
      type: Boolean as PropType<VxeRadioGroupPropTypes.Disabled>,
      default: null
    },
    type: String as PropType<VxeRadioGroupPropTypes.Type>,
    options: Array as PropType<VxeRadioGroupPropTypes.Options>,
    optionProps: Object as PropType<VxeRadioGroupPropTypes.OptionProps>,
    strict: {
      type: Boolean as PropType<VxeRadioGroupPropTypes.Strict>,
      default: () => getConfig().radioGroup.strict
    },
    size: {
      type: String as PropType<VxeRadioGroupPropTypes.Size>,
      default: () => getConfig().radioGroup.size || getConfig().size
    }
  },
  emits: [
    'update:modelValue',
    'change'
  ] as VxeRadioGroupEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<RadioGroupReactData>({
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

    const computeMaps: RadioGroupPrivateComputed = {
      computeIsDisabled
    }

    const $xeRadioGroup = {
      xID,
      props,
      context,
      reactData,
      name: XEUtils.uniqueId('xe_group_'),

      getComputeMaps: () => computeMaps
    } as unknown as VxeRadioGroupConstructor & VxeRadioGroupPrivateMethods

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

    const dispatchEvent = (type: ValueOf<VxeRadioGroupEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $radioGroup: $xeRadioGroup }, params))
    }

    const radioGroupMethods: RadioGroupMethods = {
      dispatchEvent
    }

    const radioGroupPrivateMethods: RadioGroupPrivateMethods = {
      handleChecked (params, evnt) {
        const value = params.checkedValue
        emit('update:modelValue', value)
        dispatchEvent('change', { value, label: value, checkedValue: value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    }

    Object.assign($xeRadioGroup, radioGroupMethods, radioGroupPrivateMethods)

    const renderVN = () => {
      const { options, type } = props
      const vSize = computeSize.value
      const defaultSlot = slots.default
      const valueField = computeValueField.value as 'value'
      const labelField = computeLabelField.value as 'label'
      const disabledField = computeDisabledField.value as 'disabled'
      const btnComp = type === 'button' ? VxeRadioButtonComponent : VxeRadioComponent

      return h('div', {
        class: ['vxe-radio-group', {
          [`size--${vSize}`]: vSize
        }]
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map(item => {
              return h(btnComp, {
                key: item[valueField],
                checkedValue: item[valueField],
                content: item[labelField],
                disabled: item[disabledField]
              })
            })
            : []))
    }

    provide('$xeRadioGroup', $xeRadioGroup)

    $xeRadioGroup.renderVN = renderVN

    return $xeRadioGroup
  },
  render () {
    return this.renderVN()
  }
})
