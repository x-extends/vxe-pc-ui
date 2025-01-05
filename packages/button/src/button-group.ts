import { CreateElement, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '@vxe-ui/core'
import VxeButtonComponent from './button'

import type { VxeButtonGroupPropTypes, VxeButtonGroupEmits, VxeComponentPermissionInfo, ButtonGroupReactData, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeButtonGroup',
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.permissionMixin
  ],
  props: {
    options: Array as PropType<VxeButtonGroupPropTypes.Options>,
    mode: String as PropType<VxeButtonGroupPropTypes.Mode>,
    status: String as PropType<VxeButtonGroupPropTypes.Status>,
    round: Boolean as PropType<VxeButtonGroupPropTypes.Round>,
    vertical: Boolean as PropType<VxeButtonGroupPropTypes.Vertical>,
    circle: Boolean as PropType<VxeButtonGroupPropTypes.Circle>,
    align: String as PropType<VxeButtonGroupPropTypes.Align>,
    className: [String, Function] as PropType<VxeButtonGroupPropTypes.ClassName>,
    disabled: Boolean as PropType<VxeButtonGroupPropTypes.Disabled>,
    permissionCode: [String, Number] as PropType<VxeButtonGroupPropTypes.PermissionCode>,
    size: {
      type: String as PropType<VxeButtonGroupPropTypes.Size>,
      default: () => getConfig().buttonGroup.size || getConfig().size
    }
  },
  provide () {
    const $xeButtonGroup = this
    return {
      $xeButtonGroup
    }
  },
  data () {
    const reactData: ButtonGroupReactData = {
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
  })
  },
  methods: {
    // Method
    dispatchEvent (type: ValueOf<VxeButtonGroupEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeButtonGroup = this
      $xeButtonGroup.$emit(type, createEvent(evnt, { $buttonGroup: $xeButtonGroup }, params))
    },

    //
    // Private
    //
    handleClick (params: any, evnt: any) {
      const $xeButtonGroup = this
      const props = $xeButtonGroup

      const { options } = props
      const { name } = params
      const option = options ? options.find(item => item.name === name) : null
      $xeButtonGroup.dispatchEvent('click', { ...params, option }, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement) {
      const $xeButtonGroup = this
      const props = $xeButtonGroup
      const slots = $xeButtonGroup.$scopedSlots

      const { className, options, vertical } = props
      const permissionInfo = $xeButtonGroup.computePermissionInfo
      const defaultSlot = slots.default
      if (!permissionInfo.visible) {
        return renderEmptyElement($xeButtonGroup)
      }

      return h('div', {
        class: ['vxe-button-group', className ? (XEUtils.isFunction(className) ? className({ $buttonGroup: $xeButtonGroup }) : className) : '', {
          'is--vertical': vertical
        }]
      }, defaultSlot
        ? defaultSlot({})
        : (options
            ? options.map((item, index) => {
              return h(VxeButtonComponent, {
                key: index,
                props: item
              })
            })
            : []))
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
