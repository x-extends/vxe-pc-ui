import { h, computed, reactive, inject, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, useSize } from '../../ui'

import type { VxeRadioButtonPropTypes, VxeRadioGroupConstructor, RadioButtonReactData, RadioButtonPrivateMethods, VxeRadioButtonConstructor, VxeRadioButtonEmits, VxeRadioGroupPrivateMethods, RadioButtonMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeRadioButton',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.ModelValue>,
    label: {
      type: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.Label>,
      default: null
    },
    title: [String, Number] as PropType<VxeRadioButtonPropTypes.Title>,
    content: [String, Number] as PropType<VxeRadioButtonPropTypes.Content>,
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
    }
  },
  emits: [
    'update:modelValue',
    'change'
  ] as VxeRadioButtonEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)
    const $xeRadioGroup = inject<(VxeRadioGroupConstructor & VxeRadioGroupPrivateMethods) | null>('$xeRadioGroup', null)

    const xID = XEUtils.uniqueId()

    const reactData = reactive<RadioButtonReactData>({
    })

    const { computeSize } = useSize(props)

    const $xeRadioButton = {
      xID,
      props,
      context,
      reactData
    } as unknown as VxeRadioButtonConstructor

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeRadioGroup) {
          const { computeIsDisabled } = $xeRadioGroup.getComputeMaps()
          return computeIsDisabled.value
        }
      }
      return disabled
    })

    const computeName = computed(() => {
      return $xeRadioGroup ? $xeRadioGroup.name : null
    })

    const computeStrict = computed(() => {
      return $xeRadioGroup ? $xeRadioGroup.props.strict : props.strict
    })

    const computeChecked = computed(() => {
      const { label } = props
      return $xeRadioGroup ? $xeRadioGroup.props.modelValue === label : props.modelValue === label
    })

    const radioButtonMethods: RadioButtonMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $radioButton: $xeRadioButton }, params))
      }
    }

    const radioButtonPrivateMethods: RadioButtonPrivateMethods = {
    }

    Object.assign($xeRadioButton, radioButtonMethods, radioButtonPrivateMethods)

    const handleValue = (label: VxeRadioButtonPropTypes.Label, evnt: Event) => {
      if ($xeRadioGroup) {
        $xeRadioGroup.handleChecked({ label }, evnt)
      } else {
        emit('update:modelValue', label)
        radioButtonMethods.dispatchEvent('change', { value: label, label }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, label)
        }
      }
    }

    const changeEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        handleValue(props.label, evnt)
      }
    }

    const clickEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      const isStrict = computeStrict.value
      if (!isDisabled && !isStrict) {
        if (props.label === ($xeRadioGroup ? $xeRadioGroup.props.modelValue : props.modelValue)) {
          handleValue(null, evnt)
        }
      }
    }

    const renderVN = () => {
      const { label } = props
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const name = computeName.value
      const isChecked = computeChecked.value

      return h('label', {
        key: label,
        class: ['vxe-radio vxe-radio--button', {
          [`size--${vSize}`]: vSize,
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
          class: 'vxe-radio--label'
        }, slots.default ? slots.default({}) : getFuncText(props.content))
      ])
    }

    $xeRadioButton.renderVN = renderVN

    return renderVN
  }
})
