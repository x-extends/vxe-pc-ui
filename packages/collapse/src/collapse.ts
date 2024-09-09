import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { CollapseReactData, VxeCollapseEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCollapse',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CollapseReactData = {
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
    dispatchEvent (type: ValueOf<VxeCollapseEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCollapse = this
      $xeCollapse.$emit(type, createEvent(evnt, { $collapse: $xeCollapse }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCollapse = this
      const slots = $xeCollapse.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-collapse']
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
