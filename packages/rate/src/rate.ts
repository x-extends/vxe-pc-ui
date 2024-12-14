import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalMixins } from '../../ui'

import type { RateReactData, VxeRateEmits, VxeRatePropTypes, ValueOf, VxeFormDefines, VxeFormConstructor, VxeFormPrivateMethods, VxeComponentSizeType, VxeComponentPermissionInfo } from '../../../types'

export default defineVxeComponent({
  name: 'VxeRate',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    value: [Number, String] as PropType<VxeRatePropTypes.ModelValue>,
    disabled: {
      type: Boolean as PropType<VxeRatePropTypes.Disabled>,
      default: null
    },
    readonly: {
      type: Boolean as PropType<VxeRatePropTypes.Readonly>,
      default: null
    },
    size: {
      type: String as PropType<VxeRatePropTypes.Size>,
      default: () => getConfig().rate.size || getConfig().size
    },
    status: String as PropType<VxeRatePropTypes.Status>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: RateReactData = {
      activeValue: null
    }
    return {
      xID,
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
      const $xeRate = this
      const props = $xeRate
      const $xeForm = $xeRate.$xeForm

      const { disabled } = props
      if (disabled === null) {
        if ($xeForm) {
          return $xeForm.readonly || $xeForm.disabled
        }
        return false
      }
      return disabled
    },
    computeIsReadonly () {
      const $xeRate = this
      const props = $xeRate
      const $xeForm = $xeRate.$xeForm

      const { readonly } = props
      if (readonly === null) {
        if ($xeForm) {
          return $xeForm.readonly || $xeForm.disabled
        }
        return false
      }
      return readonly
    },
    computeNumVal () {
      const $xeRate = this
      const props = $xeRate
      const reactData = ($xeRate as any).reactData as RateReactData

      const { value } = props
      const { activeValue } = reactData
      return XEUtils.toNumber(activeValue === null ? value : activeValue)
    },
    computeItemList () {
      return [1, 2, 3, 4, 5].map(num => {
        return {
          value: num,
          label: num
        }
      })
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeRateEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeRate = this
      $xeRate.$emit(type, createEvent(evnt, { $rate: $xeRate }, params))
    },
    emitModel (value: any) {
      const $xeRate = this

      $xeRate.$emit('input', value)
    },
    mouseenterEvent (evnt: MouseEvent, item: any) {
      const $xeRate = this
      const reactData = $xeRate.reactData

      const isDisabled = $xeRate.computeIsDisabled
      const isReadonly = $xeRate.computeIsReadonly
      if (!(isDisabled || isReadonly)) {
        const value = item.value
        reactData.activeValue = value
      }
    },
    mouseleaveEvent () {
      const $xeRate = this
      const reactData = $xeRate.reactData

      reactData.activeValue = null
    },
    clickEvent (evnt: Event, item: any) {
      const $xeRate = this
      const $xeForm = $xeRate.$xeForm
      const formItemInfo = $xeRate.formItemInfo

      const isDisabled = $xeRate.computeIsDisabled
      const isReadonly = $xeRate.computeIsReadonly
      if (!(isDisabled || isReadonly)) {
        const value = item.value
        $xeRate.emitModel(value)
        $xeRate.dispatchEvent('change', { value }, evnt)
        // 自动更新校验状态
        if ($xeForm && formItemInfo) {
          $xeForm.triggerItemEvent(evnt, formItemInfo.itemConfig.field, value)
        }
      }
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeRate = this
      const props = $xeRate

      const { status } = props
      const isDisabled = $xeRate.computeIsDisabled
      const isReadonly = $xeRate.computeIsReadonly
      const itemList = $xeRate.computeItemList
      const vSize = $xeRate.computeSize
      const numVal = $xeRate.computeNumVal

      return h('div', {
        ref: 'refElem',
        class: ['vxe-rate', {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          'is--disabled': isDisabled,
          'is--readonly': isReadonly
        }]
      }, itemList.map(item => {
        const isChecked = numVal >= item.value
        return h('div', {
          class: ['vxe-rte--item', {
            'is--checked': isChecked
          }],
          on: {
            mouseenter (evnt: MouseEvent) {
              if (!(isDisabled || isReadonly)) {
                $xeRate.mouseenterEvent(evnt, item)
              }
            },
            mouseleave: $xeRate.mouseleaveEvent,
            click (evnt: MouseEvent) {
              if (!(isDisabled || isReadonly)) {
                $xeRate.clickEvent(evnt, item)
              }
            }
          }
        }, [
          h('i', {
            class: isChecked ? getIcon().RATE_CHECKED : getIcon().RATE_UNCHECKED
          })
        ])
      }))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
