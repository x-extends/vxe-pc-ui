import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { TimelineItemReactData, VxeTimelineItemEmits, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTimelineItem',
  props: {
  },
  data () {
    const reactData: TimelineItemReactData = {}
    return {
      xID: XEUtils.uniqueId(),
      reactData
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTimelineItemEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTimelineItem = this
      $xeTimelineItem.$emit(type, createEvent(evnt, { $timelineItem: $xeTimelineItem }, params))
    },

    //
    // Render
    //
    renderVN  (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem',
        class: 'vxe-timeline-item'
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
