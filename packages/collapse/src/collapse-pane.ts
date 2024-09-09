import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { CollapsePaneReactData, VxeCollapsePaneEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCollapsePane',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CollapsePaneReactData = {
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
    dispatchEvent (type: ValueOf<VxeCollapsePaneEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCollapsePane = this
      $xeCollapsePane.$emit(type, createEvent(evnt, { $collapsePane: $xeCollapsePane }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCollapsePane = this
      const slots = $xeCollapsePane.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-collapse-pane']
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
