import { h, computed, reactive, inject, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, useSize, renderEmptyElement } from '../../ui'

import type { VxeCheckboxButtonPropTypes, VxeCheckboxGroupConstructor, CheckboxButtonReactData, CheckboxButtonPrivateMethods, VxeCheckboxButtonConstructor, VxeCheckboxButtonEmits, VxeCheckboxGroupPrivateMethods, CheckboxButtonMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCheckboxButton',
  props: {
    modelValue: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.ModelValue>,
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
      default: undefined
    },
    uncheckedValue: {
      type: [String, Number, Boolean] as PropType<VxeCheckboxButtonPropTypes.UncheckedValue>,
      default: false
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
  emits: [
    'update:modelValue',
    'change'
  ] as VxeCheckboxButtonEmits,
  setup (props, context) {
    const { slots, emit } = context

    const $xeForm = inject<VxeFormConstructor & VxeFormPrivateMethods | null>('$xeForm', null)
    const formItemInfo = inject<VxeFormDefines.ProvideItemInfo | null>('xeFormItemInfo', null)
    const $xeCheckboxGroup = inject<(VxeCheckboxGroupConstructor & VxeCheckboxGroupPrivateMethods) | null>('$xeCheckboxGroup', null)

    const xID = XEUtils.uniqueId()

    const reactData = reactive<CheckboxButtonReactData>({
    })

    const { computeSize } = useSize(props)

    const $xeCheckboxButton = {
      xID,
      props,
      context,
      reactData
    } as unknown as VxeCheckboxButtonConstructor

    const computeCheckValue = computed(() => {
      const { checkedValue, label } = props
      return XEUtils.isUndefined(checkedValue) ? label : checkedValue
    })

    const computeIsChecked = computed(() => {
      const checkValue = computeCheckValue.value
      if ($xeCheckboxGroup) {
        return XEUtils.includes($xeCheckboxGroup.props.modelValue, checkValue)
      }
      return props.modelValue === checkValue
    })

    const computeIsDisabled = computed(() => {
      const { disabled } = props
      const isChecked = computeIsChecked.value
      if (disabled === null) {
        if ($xeCheckboxGroup) {
          const { computeIsDisabled: computeIsGroupDisabled, computeIsReadonly: computeIsGroupReadonly, computeIsMaximize: computeIsGroupMaximize } = $xeCheckboxGroup.getComputeMaps()
          const isGroupDisabled = computeIsGroupDisabled.value
          const isGroupReadonly = computeIsGroupReadonly.value
          const isGroupMaximize = computeIsGroupMaximize.value
          return isGroupDisabled || isGroupReadonly || (isGroupMaximize && !isChecked)
        }
      }
      return disabled
    })

    const changeEvent = (evnt: Event & { target: { checked: boolean } }) => {
      const { uncheckedValue } = props
      const isDisabled = computeIsDisabled.value
      const checkValue = computeCheckValue.value
      if (!isDisabled) {
        const checked = evnt.target.checked
        if ($xeCheckboxGroup) {
          const value = checkValue
          const params = { checked, value, label: value }
          $xeCheckboxGroup.handleChecked(params, evnt)
        } else {
          const value = checked ? checkValue : uncheckedValue
          const params = { checked, value, label: value }
          emit('update:modelValue', value)
          $xeCheckboxButton.dispatchEvent('change', params, evnt)
          // 自动更新校验状态
          if ($xeForm && formItemInfo) {
            $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
          }
        }
      }
    }

    const checkboxButtonMethods: CheckboxButtonMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $checkboxButton: $xeCheckboxButton }, params))
      }
    }

    const checkboxButtonPrivateMethods: CheckboxButtonPrivateMethods = {
    }

    Object.assign($xeCheckboxButton, checkboxButtonMethods, checkboxButtonPrivateMethods)

    const renderVN = () => {
      const { icon, content } = props
      const vSize = computeSize.value
      const isDisabled = computeIsDisabled.value
      const isChecked = computeIsChecked.value
      const checkValue = computeCheckValue.value
      const defaultSlot = slots.default

      if ($xeCheckboxGroup) {
        const { computeIsReadonly: computeIsGroupReadonly } = $xeCheckboxGroup.getComputeMaps()
        const isGroupReadonly = computeIsGroupReadonly.value
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

    $xeCheckboxButton.renderVN = renderVN

    return renderVN
  }
})
