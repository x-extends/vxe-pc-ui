import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { WatermarkReactData, VxeWatermarkEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeWatermark',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: WatermarkReactData = {
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
    dispatchEvent (type: ValueOf<VxeWatermarkEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeWatermark = this
      $xeWatermark.$emit(type, createEvent(evnt, { $watermark: $xeWatermark }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeWatermark = this
      const slots = $xeWatermark.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-watermark'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
