import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeRadioButtonPropTypes, RadioButtonReactData, RadioGroupPrivateComputed, VxeRadioGroupConstructor, ValueOf, VxeRadioButtonEmits, VxeRadioGroupPrivateMethods, VxeFormConstructor, VxeComponentPermissionInfo, VxeComponentSizeType, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeRadioButton',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeRadioButtonPropTypes.ModelValue>,
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
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    },
    $xeRadioGroup: {
      default: null
    }
  },
  data () {
    const reactData: RadioButtonReactData = {
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
      $xeRadioGroup(): (VxeRadioGroupConstructor & RadioGroupPrivateComputed & VxeRadioGroupPrivateMethods) | null
    }),
    computeIsDisabled () {
      const $xeRadioButton = this
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup
      const { disabled } = $xeRadioButton
      if (disabled === null) {
        if ($xeRadioGroup) {
          const isDisabled = $xeRadioGroup.computeIsDisabled
          return isDisabled
        }
      }
      return disabled
    },
    computeName  () {
      const $xeRadioButton = this
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      return $xeRadioGroup ? $xeRadioGroup.name : null
    },
    computeStrict () {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      return $xeRadioGroup ? $xeRadioGroup.strict : props.strict
    },
    computeChecked  () {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      const { label } = props
      return $xeRadioGroup ? $xeRadioGroup.value === label : props.value === label
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRadioButtonEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRadioButton = this
      $xeRadioButton.$emit(type, createEvent(evnt, { $radioButton: $xeRadioButton }, params))
    },
    emitModel  (value: any) {
      const $xeRadioButton = this

      const { _events } = $xeRadioButton as any
      $xeRadioButton.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeRadioButton.$emit('modelValue', value)
      } else {
        $xeRadioButton.$emit('model-value', value)
      }
    },
    handleValue (label: VxeRadioButtonPropTypes.Label, evnt: Event) {
      const $xeRadioButton = this
      const $xeForm = $xeRadioButton.$xeForm
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup
      const formItemInfo = $xeRadioButton.formItemInfo

      if ($xeRadioGroup) {
        $xeRadioGroup.handleChecked({ label }, evnt)
      } else {
        $xeRadioButton.emitModel(label)
        $xeRadioButton.dispatchEvent('change', { label }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, label)
        }
      }
    },
    changeEvent (evnt: Event) {
      const $xeRadioButton = this
      const props = $xeRadioButton

      const isDisabled = $xeRadioButton.computeIsDisabled
      if (!isDisabled) {
        $xeRadioButton.handleValue(props.label, evnt)
      }
    },
    clickEvent  (evnt: Event) {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const $xeRadioGroup = $xeRadioButton.$xeRadioGroup

      const isDisabled = $xeRadioButton.computeIsDisabled
      const isStrict = $xeRadioButton.computeStrict
      if (!isDisabled && !isStrict) {
        if (props.label === ($xeRadioGroup ? $xeRadioGroup.value : props.value)) {
          $xeRadioButton.handleValue(null, evnt)
        }
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRadioButton = this
      const props = $xeRadioButton
      const slots = $xeRadioButton.$scopedSlots

      const { label } = props
      const vSize = $xeRadioButton.computeSize
      const isDisabled = $xeRadioButton.computeIsDisabled
      const name = $xeRadioButton.computeName
      const isChecked = $xeRadioButton.computeChecked

      return h('label', {
        key: label,
        class: ['vxe-radio', 'vxe-radio-button', {
          [`size--${vSize}`]: vSize,
          'is--disabled': isDisabled
        }],
        attrs: {
          title: props.title
        }
      }, [
        h('input', {
          class: 'vxe-radio--input',
          domProps: {
            checked: isChecked
          },
          attrs: {
            type: 'radio',
            name,
            disabled: isDisabled
          },
          on: {
            change: $xeRadioButton.changeEvent,
            click: $xeRadioButton.clickEvent
          }
        }),
        h('span', {
          class: 'vxe-radio--label'
        }, slots.default ? slots.default({}) : getFuncText(props.content))
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
