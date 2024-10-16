import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { StepsReactData, VxeStepsEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSteps',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: StepsReactData = {
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
    dispatchEvent (type: ValueOf<VxeStepsEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSteps = this
      $xeSteps.$emit(type, createEvent(evnt, { $steps: $xeSteps }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeSteps = this
      const slots = $xeSteps.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-steps'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
