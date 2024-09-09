import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createEvent } from '../../ui'
import XEUtils from 'xe-utils'

import type { VxeLayoutFooterPropTypes, LayoutFooterReactData, VxeLayoutFooterEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLayoutFooter',
  props: {
    fixed: Boolean as PropType<VxeLayoutFooterPropTypes.Fixed>,
    align: String as PropType<VxeLayoutFooterPropTypes.Align>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: LayoutFooterReactData = {
    }
    return {
      xID,
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeLayoutFooterEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutFooter = this
      $xeLayoutFooter.$emit(type, createEvent(evnt, { $layoutFooter: $xeLayoutFooter }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutFooter = this
      const props = $xeLayoutFooter
      const slots = $xeLayoutFooter.$scopedSlots

      const { fixed, align } = props
      const defaultSlot = slots.default

      return h('footer', {
        class: ['vxe-layout-footer', align ? `align--${align}` : '', {
          'is--fixed': fixed
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
