import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeIconPropTypes, VxeComponentSizeType, IconReactData, VxeIconEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeIcon',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    name: String as PropType<VxeIconPropTypes.Name>,
    className: String as PropType<VxeIconPropTypes.ClassName>,
    roll: Boolean as PropType<VxeIconPropTypes.Roll>,
    status: String as PropType<VxeIconPropTypes.Status>,
    size: {
      type: String as PropType<VxeIconPropTypes.Size>,
      default: () => getConfig().icon.size || getConfig().size
    }
  },
  data () {
    const reactData: IconReactData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeIconEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeIcon = this
      $xeIcon.$emit(type, createEvent(evnt, { $icon: $xeIcon }, params))
    },
    clickEvent  (evnt: KeyboardEvent) {
      const $xeIcon = this

      $xeIcon.dispatchEvent('click', {}, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeIcon = this
      const props = $xeIcon

      const { name, roll, status, className } = props
      const vSize = $xeIcon.computeSize

      return h('i', {
        class: ['vxe-icon', `vxe-icon-${name}`, `${className || ''}`, {
          [`size--${vSize}`]: vSize,
          [`theme--${status}`]: status,
          roll: roll
        }],
        on: {
          click: $xeIcon.clickEvent
        }
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
