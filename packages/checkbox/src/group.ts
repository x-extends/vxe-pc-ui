import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeCheckboxComponent from './checkbox'

import type { VxeCheckboxGroupEmits, VxeCheckboxPropTypes, ValueOf, CheckboxGroupReactData, VxeComponentSizeType, VxeCheckboxGroupPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCheckboxGroup',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: Array as PropType<VxeCheckboxGroupPropTypes.ModelValue>,
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
    const $xeCheckboxGroup = this
    return {
      $xeCheckboxGroup
    }
  },
  data () {
    const reactData: CheckboxGroupReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeForm(): (VxeFormConstructor & VxeFormPrivateMethods) | null
      formItemInfo(): VxeFormDefines.ProvideItemInfo | null
    }),
    computeIsDisabled () {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup
      const $xeForm = $xeCheckboxGroup.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.readonly || $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeIsMaximize () {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup

      const { value, max } = props
      if (max) {
        return (value ? value.length : 0) >= XEUtils.toNumber(max)
      }
      return false
    },
    computePropsOpts () {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup

      return Object.assign({}, props.optionProps)
    },
    computeLabelField () {
      const $xeCheckboxGroup = this

      const propsOpts = $xeCheckboxGroup.computePropsOpts as VxeCheckboxGroupPropTypes.OptionProps
      return propsOpts.label || 'label'
    },
    computeValueField () {
      const $xeCheckboxGroup = this

      const propsOpts = $xeCheckboxGroup.computePropsOpts as VxeCheckboxGroupPropTypes.OptionProps
      return propsOpts.value || 'value'
    },
    computeDisabledField () {
      const $xeCheckboxGroup = this

      const propsOpts = $xeCheckboxGroup.computePropsOpts as VxeCheckboxGroupPropTypes.OptionProps
      return propsOpts.disabled || 'disabled'
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCheckboxGroupEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCheckboxGroup = this
      $xeCheckboxGroup.$emit(type, createEvent(evnt, { $checkboxGroup: $xeCheckboxGroup }, params))
    },
    handleChecked (params: {
      checked: boolean;
      value: VxeCheckboxPropTypes.ModelValue;
      label: VxeCheckboxPropTypes.Label;
  }, evnt: Event) {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup
      const $xeForm = $xeCheckboxGroup.$xeForm
      const formItemInfo = $xeCheckboxGroup.formItemInfo

      const { checked, label } = params
      const checklist = props.value || []
      const checkIndex = checklist.indexOf(label)
      if (checked) {
        if (checkIndex === -1) {
          checklist.push(label)
        }
      } else {
        checklist.splice(checkIndex, 1)
      }
      $xeCheckboxGroup.$emit('input', checklist)
      $xeCheckboxGroup.dispatchEvent('change', Object.assign({ checklist }, params), evnt)
      // 自动更新校验状态
      if ($xeForm && formItemInfo) {
        $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, checklist)
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup
      const slots = $xeCheckboxGroup.$scopedSlots

      const { options } = props
      const defaultSlot = slots.default
      const valueField = $xeCheckboxGroup.computeValueField as 'value'
      const labelField = $xeCheckboxGroup.computeLabelField as 'label'
      const disabledField = $xeCheckboxGroup.computeDisabledField as 'disabled'
      return h('div', {
        class: 'vxe-checkbox-group'
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map(item => {
              return h(VxeCheckboxComponent, {
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
