import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createEvent } from '../../ui'
import XEUtils from 'xe-utils'

import type { VxeLayoutHeaderPropTypes, LayoutHeaderReactData, VxeLayoutHeaderEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeLayoutHeader',
  props: {
    fixed: Boolean as PropType<VxeLayoutHeaderPropTypes.Fixed>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: LayoutHeaderReactData = {
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
    dispatchEvent (type: ValueOf<VxeLayoutHeaderEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeLayoutHeader = this
      $xeLayoutHeader.$emit(type, createEvent(evnt, { $layoutHeader: $xeLayoutHeader }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeLayoutHeader = this
      const slots = $xeLayoutHeader.$scopedSlots
      const { fixed } = $xeLayoutHeader
      const defaultSlot = slots.default

      return h('header', {
        class: ['vxe-layout-header', {
          'is--fixed': fixed
        }]
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
