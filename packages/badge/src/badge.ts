import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { BadgeReactData, VxeBadgeEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeBadge',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: BadgeReactData = {
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
    dispatchEvent (type: ValueOf<VxeBadgeEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeBadge = this
      $xeBadge.$emit(type, createEvent(evnt, { $badge: $xeBadge }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeBadge = this
      const slots = $xeBadge.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-badge'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
