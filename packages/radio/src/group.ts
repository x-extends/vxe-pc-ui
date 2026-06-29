import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import VxeRadioComponent from './radio'
import VxeRadioButtonComponent from './button'

import type { VxeRadioGroupPropTypes, RadioGroupInternalData, VxeRadioGroupEmits, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeComponentPermissionInfo, VxeComponentSizeType, RadioGroupReactData, ValueOf } from '../../../types'

function createReactData (): RadioGroupReactData {
  return {}
}

function createInternalData (): RadioGroupInternalData {
  return {
    // isLoaded: false
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
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
    readonly: {
      type: Boolean as PropType<VxeRadioGroupPropTypes.Readonly>,
      default: null
    },
    type: String as PropType<VxeRadioGroupPropTypes.Type>,
    status: {
      type: String as PropType<VxeRadioGroupPropTypes.Status>,
      default: () => getConfig().radioGroup.status
    },
    options: Array as PropType<VxeRadioGroupPropTypes.Options>,
    optionProps: Object as PropType<VxeRadioGroupPropTypes.OptionProps>,
    strict: {
      type: Boolean as PropType<VxeRadioGroupPropTypes.Strict>,
      default: () => getConfig().radioGroup.strict
    },
    size: {
      type: String as PropType<VxeRadioGroupPropTypes.Size>,
      default: () => getConfig().radioGroup.size || getConfig().size
    },
    defaultConfig: Object as PropType<VxeRadioGroupPropTypes.DefaultConfig>
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
    const reactData: RadioGroupReactData = createReactData()
    return {
      ...({} as {
        internalData: RadioGroupInternalData
      }),
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
    computeIsReadonly () {
      const $xeRadioGroup = this
      const props = $xeRadioGroup
      const $xeForm = $xeRadioGroup.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly
        }
        return false
      }
      return readonly
    },
    computeIsDisabled () {
      const $xeRadioGroup = this
      const props = $xeRadioGroup
      const $xeForm = $xeRadioGroup.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.disabled
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
    computeDefaultOpts () {
      const $xeRadioGroup = this
      const props = $xeRadioGroup

      return Object.assign({}, props.defaultConfig)
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
    emitModel  (value: any) {
      const $xeRadioGroup = this

      const { _events } = $xeRadioGroup as any
      $xeRadioGroup.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeRadioGroup.$emit('modelValue', value)
      } else {
        $xeRadioGroup.$emit('model-value', value)
      }
    },
    emitDefaultValue (value: any) {
      const $xeRadioGroup = this

      $xeRadioGroup.emitModel(value)
      $xeRadioGroup.dispatchEvent('default-change', { value }, null)
    },
    loadData (datas: any[]) {
      const $xeRadioGroup = this
      const props = $xeRadioGroup
      const internalData = $xeRadioGroup.internalData

      const { isLoaded } = internalData
      const defaultOpts = $xeRadioGroup.computeDefaultOpts
      const valueField = $xeRadioGroup.computeValueField
      if (!isLoaded) {
        const { selectMode } = defaultOpts
        if (datas.length > 0 && XEUtils.eqNull(props.value)) {
          if (selectMode === 'first' || selectMode === 'last') {
            const selectItem = XEUtils[selectMode](datas)
            if (selectItem) {
              $xeRadioGroup.$nextTick(() => {
                if (XEUtils.eqNull(props.value)) {
                  $xeRadioGroup.emitDefaultValue(selectItem[valueField])
                }
              })
            }
          }
          internalData.isLoaded = true
        }
      }
      return $xeRadioGroup.$nextTick()
    },
    handleChecked (params: {
      checkedValue: any
      checkedLabel: any
    }, evnt: Event) {
      const $xeRadioGroup = this
      const $xeForm = $xeRadioGroup.$xeForm
      const formItemInfo = $xeRadioGroup.formItemInfo

      const { checkedValue, checkedLabel } = params
      const value = checkedValue
      $xeRadioGroup.emitModel(value)
      $xeRadioGroup.dispatchEvent('change', { value, label: value, checkedValue, checkedLabel }, evnt)
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

      const { options, type, status } = props
      const vSize = $xeRadioGroup.computeSize
      const defaultSlot = slots.default
      const valueField = $xeRadioGroup.computeValueField as 'value'
      const labelField = $xeRadioGroup.computeLabelField as 'label'
      const disabledField = $xeRadioGroup.computeDisabledField as 'disabled'
      const btnComp = type === 'button' ? VxeRadioButtonComponent : VxeRadioComponent

      return h('div', {
        class: ['vxe-radio-group', {
          [`theme--${status}`]: status,
          [`size--${vSize}`]: vSize
        }]
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map(item => {
              return h(btnComp, {
                key: item[valueField],
                props: {
                  checkedValue: item[valueField],
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
      const $xeRadioGroup = this

      $xeRadioGroup.loadData(val)
    }
  },
  created () {
    const $xeRadioGroup = this

    $xeRadioGroup.internalData = createInternalData()
  },
  mounted () {
    const $xeRadioGroup = this
    const props = $xeRadioGroup

    $xeRadioGroup.$nextTick(() => {
      const { options } = props
      if (options) {
        $xeRadioGroup.loadData(options)
      }
    })
  },
  beforeDestroy () {
    const $xeRadioGroup = this
    const reactData = $xeRadioGroup.reactData
    const internalData = $xeRadioGroup.internalData

    XEUtils.assign(internalData, createInternalData())
    XEUtils.assign(reactData, createReactData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
