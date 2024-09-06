import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeRadioComponent from './radio'
import VxeRadioButtonComponent from './button'

import type { VxeRadioGroupPropTypes, VxeRadioGroupEmits, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeComponentPermissionInfo, VxeComponentSizeType, RadioGroupReactData, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeRadioGroup',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [String, Number, Boolean] as PropType<VxeRadioGroupPropTypes.ModelValue>,
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
  inject: {
    $xeForm: {
      default: null
    },
    formItemInfo: {
      from: 'xeFormItemInfo',
      default: null
    }
  },
  provide () {
    const $xeRadioGroup = this
    return {
      $xeRadioGroup
    }
  },
  data () {
    const reactData: RadioGroupReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      name: XEUtils.uniqueId('xe_group_'),
      reactData
    }
  },
  computed: {
    ...({} as {
      computePermissionInfo(): VxeComponentPermissionInfo
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeIsDisabled () {
      const $xeRadioGroup = this
      const props = $xeRadioGroup
      const $xeForm = $xeRadioGroup.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.readonly || $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computePropsOpts () {
      const $xeRadioGroup = this
      const props = $xeRadioGroup

      return Object.assign({}, props.optionProps)
    },
    computeLabelField  () {
      const $xeRadioGroup = this

      const propsOpts: VxeRadioGroupPropTypes.OptionProps = $xeRadioGroup.computePropsOpts
      return propsOpts.label || 'label'
    },
    computeValueField  () {
      const $xeRadioGroup = this

      const propsOpts: VxeRadioGroupPropTypes.OptionProps = $xeRadioGroup.computePropsOpts
      return propsOpts.value || 'value'
    },
    computeDisabledField  () {
      const $xeRadioGroup = this

      const propsOpts: VxeRadioGroupPropTypes.OptionProps = $xeRadioGroup.computePropsOpts
      return propsOpts.disabled || 'disabled'
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRadioGroupEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRadioGroup = this

      $xeRadioGroup.$emit(type, createEvent(evnt, { $radioGroup: $xeRadioGroup }, params))
    },
    handleChecked (params: {
      label: any
    }, evnt: Event) {
      const $xeRadioGroup = this
      const $xeForm = $xeRadioGroup.$xeForm
      const formItemInfo = $xeRadioGroup.formItemInfo

      const value = params.label
      $xeRadioGroup.$emit('input', value)
      $xeRadioGroup.$emit('modelValue', value)
      $xeRadioGroup.dispatchEvent('change', params, evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRadioGroup = this
      const props = $xeRadioGroup
      const slots = $xeRadioGroup.$scopedSlots

      const { options, type } = props
      const defaultSlot = slots.default
      const valueField = $xeRadioGroup.computeValueField as 'value'
      const labelField = $xeRadioGroup.computeLabelField as 'label'
      const disabledField = $xeRadioGroup.computeDisabledField as 'disabled'
      const btnComp = type === 'button' ? VxeRadioButtonComponent : VxeRadioComponent

      return h('div', {
        class: 'vxe-radio-group'
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map(item => {
              return h(btnComp, {
                props: {
                  label: item[valueField],
                  content: item[labelField],
                  disabled: item[disabledField]
                }
              })
            })
            : []))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
