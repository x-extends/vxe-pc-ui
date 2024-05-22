import { defineComponent, h, computed, inject, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, useSize } from '@vxe-ui/core'

import type { VxeRadioPropTypes, VxeRadioConstructor, VxeRadioEmits, VxeRadioGroupConstructor, VxeRadioGroupPrivateMethods, RadioMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineComponent({
  name: 'VxeRadio',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeRadioPropTypes.ModelValue>,
    label: { type: [String, Number, Boolean] as PropType<VxeRadioPropTypes.Label>, default: null },
    title: [String, Number] as PropType<VxeRadioPropTypes.Title>,
    content: [String, Number] as PropType<VxeRadioPropTypes.Content>,
    disabled: Boolean as PropType<VxeRadioPropTypes.Disabled>,
    name: String as PropType<VxeRadioPropTypes.Name>,
    strict: { type: Boolean as PropType<VxeRadioPropTypes.Strict>, default: () => getConfig().radio.strict },
    size: { type: String as PropType<VxeRadioPropTypes.Size>, default: () => getConfig().radio.size || getConfig().size }
  },
  emits: [
    'update:modelValue',
    'change'
  ] as VxeRadioEmits,
  setup (props, context) {
    const { slots, emit } = context
    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)

    const xID = XEUtils.uniqueId()

    const $xeradio = {
      xID,
      props,
      context
    } as unknown as VxeRadioConstructor

    const { computeSize } = useSize(props)

    const $xeradiogroup = inject('$xeRadioGroup', null as (VxeRadioGroupConstructor & VxeRadioGroupPrivateMethods) | null)

    let radioMethods = {} as RadioMethods

    const computeDisabled = computed(() => {
      return props.disabled || ($xeradiogroup && $xeradiogroup.props.disabled)
    })

    const computeName = computed(() => {
      return $xeradiogroup ? $xeradiogroup.name : props.name
    })

    const computeStrict = computed(() => {
      return $xeradiogroup ? $xeradiogroup.props.strict : props.strict
    })

    const computeChecked = computed(() => {
      const { modelValue, label } = props
      return $xeradiogroup ? $xeradiogroup.props.modelValue === label : modelValue === label
    })

    const handleValue = (label: VxeRadioPropTypes.Label, evnt: Event) => {
      if ($xeradiogroup) {
        $xeradiogroup.handleChecked({ label }, evnt)
      } else {
        emit('update:modelValue', label)
        radioMethods.dispatchEvent('change', { label }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, label)
        }
      }
    }

    const changeEvent = (evnt: Event) => {
      const isDisabled = computeDisabled.value
      if (!isDisabled) {
        handleValue(props.label, evnt)
      }
    }

    const clickEvent = (evnt: Event) => {
      const isDisabled = computeDisabled.value
      const isStrict = computeStrict.value
      if (!isDisabled && !isStrict) {
        if (props.label === ($xeradiogroup ? $xeradiogroup.props.modelValue : props.modelValue)) {
          handleValue(null, evnt)
        }
      }
    }

    radioMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $radio: $xeradio }, params))
      }
    }

    Object.assign($xeradio, radioMethods)

    const renderVN = () => {
      const vSize = computeSize.value
      const isDisabled = computeDisabled.value
      const name = computeName.value
      const isChecked = computeChecked.value
      return h('label', {
        class: ['vxe-radio', {
          [`size--${vSize}`]: vSize,
          'is--checked': isChecked,
          'is--disabled': isDisabled
        }],
        title: props.title
      }, [
        h('input', {
          class: 'vxe-radio--input',
          type: 'radio',
          name,
          checked: isChecked,
          disabled: isDisabled,
          onChange: changeEvent,
          onClick: clickEvent
        }),
        h('span', {
          class: ['vxe-radio--icon', isChecked ? 'vxe-icon-radio-checked' : 'vxe-icon-radio-unchecked']
        }),
        h('span', {
          class: 'vxe-radio--label'
        }, slots.default ? slots.default({}) : getFuncText(props.content))
      ])
    }

    $xeradio.renderVN = renderVN

    return $xeradio
  },
  render () {
    return this.renderVN()
  }
})
