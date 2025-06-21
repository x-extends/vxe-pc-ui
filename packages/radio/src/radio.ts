import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getFuncText } from '../../ui/src/utils'
import { getConfig, createEvent, globalMixins, getIcon } from '../../ui'

import type { VxeRadioPropTypes, RadioReactData, VxeRadioEmits, RadioGroupPrivateComputed, VxeRadioGroupConstructor, VxeRadioGroupPrivateMethods, VxeFormConstructor, VxeFormPrivateMethods, VxeComponentPermissionInfo, VxeComponentSizeType, VxeFormDefines, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeRadio',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeRadioPropTypes.ModelValue>,
    label: {
      type: [String, Number, Boolean] as PropType<VxeRadioPropTypes.Label>,
      default: null
    },
    title: [String, Number] as PropType<VxeRadioPropTypes.Title>,
    content: [String, Number] as PropType<VxeRadioPropTypes.Content>,
    disabled: {
      type: Boolean as PropType<VxeRadioPropTypes.Disabled>,
      default: null
    },
    name: String as PropType<VxeRadioPropTypes.Name>,
    strict: {
      type: Boolean as PropType<VxeRadioPropTypes.Strict>,
      default: () => getConfig().radio.strict
    },
    size: {
      type: String as PropType<VxeRadioPropTypes.Size>,
      default: () => getConfig().radio.size || getConfig().size
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
    const reactData: RadioReactData = {
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
      const $xeRadio = this
      const $xeRadioGroup = $xeRadio.$xeRadioGroup
      const { disabled } = $xeRadio
      if (disabled === null) {
        if ($xeRadioGroup) {
          const isDisabled = $xeRadioGroup.computeIsDisabled
          return isDisabled
        }
      }
      return disabled
    },
    computeName () {
      const $xeRadio = this
      const props = $xeRadio

      const $xeRadioGroup = $xeRadio.$xeRadioGroup
      return $xeRadioGroup ? $xeRadioGroup.name : props.name
    },
    computeStrict () {
      const $xeRadio = this
      const props = $xeRadio

      const $xeRadioGroup = $xeRadio.$xeRadioGroup
      return $xeRadioGroup ? $xeRadioGroup.strict : props.strict
    },
    computeChecked () {
      const $xeRadio = this
      const props = $xeRadio

      const $xeRadioGroup = $xeRadio.$xeRadioGroup
      const { label } = props
      return $xeRadioGroup ? $xeRadioGroup.value === label : props.value === label
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRadioEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRadio = this
      $xeRadio.$emit(type, createEvent(evnt, { $radio: $xeRadio }, params))
    },
    emitModel  (value: any) {
      const $xeRadio = this

      const { _events } = $xeRadio as any
      $xeRadio.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeRadio.$emit('modelValue', value)
      } else {
        $xeRadio.$emit('model-value', value)
      }
    },
    handleValue  (label: VxeRadioPropTypes.Label, evnt: Event) {
      const $xeRadio = this
      const formItemInfo = $xeRadio.formItemInfo
      const $xeForm = $xeRadio.$xeForm
      const $xeRadioGroup = $xeRadio.$xeRadioGroup

      if ($xeRadioGroup) {
        $xeRadioGroup.handleChecked({ label }, evnt)
      } else {
        $xeRadio.emitModel(label)
        $xeRadio.dispatchEvent('change', { value: label, label }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, label)
        }
      }
    },
    changeEvent  (evnt: Event) {
      const $xeRadio = this
      const props = $xeRadio

      const isDisabled = $xeRadio.computeIsDisabled
      if (!isDisabled) {
        $xeRadio.handleValue(props.label, evnt)
      }
    },
    clickEvent  (evnt: Event) {
      const $xeRadio = this
      const props = $xeRadio
      const $xeRadioGroup = $xeRadio.$xeRadioGroup

      const isDisabled = $xeRadio.computeIsDisabled
      const isStrict = $xeRadio.computeStrict
      if (!isDisabled && !isStrict) {
        if (props.label === ($xeRadioGroup ? $xeRadioGroup.value : props.value)) {
          $xeRadio.handleValue(null, evnt)
        }
      }
    },

    //
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRadio = this
      const props = $xeRadio

      const { label } = props
      const slots = $xeRadio.$scopedSlots
      const vSize = $xeRadio.computeSize
      const isDisabled = $xeRadio.computeIsDisabled
      const name = $xeRadio.computeName
      const isChecked = $xeRadio.computeChecked

      return h('label', {
        key: label,
        class: ['vxe-radio vxe-radio--default', {
          [`size--${vSize}`]: vSize,
          'is--checked': isChecked,
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
            change: $xeRadio.changeEvent,
            click: $xeRadio.clickEvent
          }
        }),
        h('span', {
          class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : (isDisabled ? getIcon().RADIO_DISABLED_UNCHECKED : getIcon().RADIO_UNCHECKED)]
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
}) /* define-vxe-component end */
