import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { SliderReactData, VxeSliderEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSlider',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SliderReactData = {
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
    dispatchEvent (type: ValueOf<VxeSliderEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSlider = this
      $xeSlider.$emit(type, createEvent(evnt, { $watermark: $xeSlider }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeSlider = this
      const slots = $xeSlider.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-slider'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
