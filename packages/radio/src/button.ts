import { h, computed, reactive, inject, PropType, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, useSize, renderEmptyElement } from '../../ui'
import { createComponentLog } from '../../ui/src/log'

import type { VxeRadioButtonPropTypes, VxeRadioGroupConstructor, RadioButtonReactData, RadioButtonPrivateMethods, VxeRadioButtonConstructor, VxeRadioButtonEmits, VxeRadioGroupPrivateMethods, RadioButtonMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines, ValueOf } from '../../../types'

const { warnLog } = createComponentLog('radio-button')

export default defineVxeComponent({
  name: 'VxeRadioButton',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.ModelValue>,
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

    const computeCheckValue = computed(() => {
      const { checkedValue, label } = props
      return XEUtils.isUndefined(checkedValue) ? label : checkedValue
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      if (disabled === null) {
        if ($xeRadioGroup) {
          const { computeIsDisabled: computeIsGroupDisabled, computeIsReadonly: computeIsGroupReadonly } = $xeRadioGroup.getComputeMaps()
          const isGroupDisabled = computeIsGroupDisabled.value
          const isGroupReadonly = computeIsGroupReadonly.value
          return isGroupDisabled || isGroupReadonly
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

    const computeIsChecked = computed(() => {
      const checkValue = computeCheckValue.value
      if ($xeRadioGroup) {
        return $xeRadioGroup.props.modelValue === checkValue
      }
      return props.modelValue === checkValue
    })

    const dispatchEvent = (type: ValueOf<VxeRadioButtonEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $radioGroup: $xeRadioGroup }, params))
    }

    const radioButtonMethods: RadioButtonMethods = {
      dispatchEvent
    }

    const radioButtonPrivateMethods: RadioButtonPrivateMethods = {
    }

    Object.assign($xeRadioButton, radioButtonMethods, radioButtonPrivateMethods)

    const handleValue = (checkedValue: VxeRadioButtonPropTypes.CheckedValue, evnt: Event) => {
      const { content } = props
      if ($xeRadioGroup) {
        $xeRadioGroup.handleChecked({ label: checkedValue, checkedValue, checkedLabel: content }, evnt)
      } else {
        emit('update:modelValue', checkedValue)
        dispatchEvent('change', { value: checkedValue, label: checkedValue, checkedValue, checkedLabel: content }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, checkedValue)
        }
      }
    }

    const changeEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      if (!isDisabled) {
        const checkValue = computeCheckValue.value
        handleValue(checkValue, evnt)
      }
    }

    const clickEvent = (evnt: Event) => {
      const isDisabled = computeIsDisabled.value
      const isStrict = computeStrict.value
      if (!isDisabled && !isStrict) {
        const isChecked = computeIsChecked.value
        if (isChecked) {
          handleValue(null, evnt)
        }
      }
    }

    const renderVN = () => {
      const { icon, content } = props
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const name = computeName.value
      const isChecked = computeIsChecked.value
      const checkValue = computeCheckValue.value
      const defaultSlot = slots.default

      if ($xeRadioGroup) {
        const { computeIsReadonly: computeIsGroupReadonly } = $xeRadioGroup.getComputeMaps()
        const isGroupReadonly = computeIsGroupReadonly.value
        if (isGroupReadonly) {
          if (isChecked) {
            return h('label', {
              class: ['vxe-radio vxe-radio--button-view', {
                [`size--${vSize}`]: vSize,
                'is--readonly': isGroupReadonly
              }]
            }, [
              h('span', {
                class: 'vxe-radio--label'
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

    onMounted(() => {
      if (props.label !== null) {
        warnLog('vxe.error.delProp', ['label', 'checked-value'])
      }
    })

    $xeRadioButton.renderVN = renderVN

    return renderVN
  }
})
