import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeCheckboxComponent from './checkbox'

import type { VxeCheckboxGroupEmits, CheckboxGroupInternalData, VxeCheckboxPropTypes, ValueOf, CheckboxGroupReactData, VxeComponentSizeType, VxeCheckboxGroupPropTypes, VxeFormConstructor, VxeFormPrivateMethods, VxeFormDefines } from '../../../types'

function createInternalData (): CheckboxGroupInternalData {
  return {
    // isLoaded: false
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
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
    },
    defaultConfig: Object as PropType<VxeCheckboxGroupPropTypes.DefaultConfig>
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
    const internalData = createInternalData()
    return {
      xID: XEUtils.uniqueId(),
      reactData,
      internalData
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
    computeDefaultOpts () {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup

      return Object.assign({}, props.defaultConfig)
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
    emitModel (value: any) {
      const $xeCheckboxGroup = this

      const { _events } = $xeCheckboxGroup as any
      $xeCheckboxGroup.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeCheckboxGroup.$emit('modelValue', value)
      } else {
        $xeCheckboxGroup.$emit('model-value', value)
      }
    },
    emitDefaultValue (value: any) {
      const $xeCheckboxGroup = this

      $xeCheckboxGroup.emitModel(value)
      $xeCheckboxGroup.dispatchEvent('default-change', { value }, null)
    },
    loadData (datas: any[]) {
      const $xeCheckboxGroup = this
      const props = $xeCheckboxGroup
      const internalData = $xeCheckboxGroup.internalData

      const { isLoaded } = internalData
      const defaultOpts = $xeCheckboxGroup.computeDefaultOpts
      const valueField = $xeCheckboxGroup.computeValueField
      if (!isLoaded) {
        const { selectMode } = defaultOpts
        if (datas.length > 0 && XEUtils.eqNull(props.value)) {
          if (selectMode === 'all') {
            $xeCheckboxGroup.$nextTick(() => {
              $xeCheckboxGroup.emitDefaultValue(datas.map(item => item[valueField]))
            })
          } else if (selectMode === 'first' || selectMode === 'last') {
            const selectItem = XEUtils[selectMode](datas)
            if (selectItem) {
              $xeCheckboxGroup.$nextTick(() => {
                if (XEUtils.eqNull(props.value)) {
                  $xeCheckboxGroup.emitDefaultValue([selectItem[valueField]])
                }
              })
            }
          }
          internalData.isLoaded = true
        }
      }
      return $xeCheckboxGroup.$nextTick()
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
      $xeCheckboxGroup.emitModel(checklist)
      $xeCheckboxGroup.dispatchEvent('change', Object.assign({ }, params, { checklist, value: checklist }), evnt)
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
                key: item[valueField],
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
  watch: {
    options (val) {
      const $xeCheckboxGroup = this

      $xeCheckboxGroup.loadData(val)
    }
  },
  mounted () {
    const $xeCheckboxGroup = this
    const props = $xeCheckboxGroup

    $xeCheckboxGroup.$nextTick(() => {
      const { options } = props
      if (options) {
        $xeCheckboxGroup.loadData(options)
      }
    })
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
