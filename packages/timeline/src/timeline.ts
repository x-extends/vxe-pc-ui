import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeTimelinePropTypes, TimelineReactData, VxeTimelineEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTimeline',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    size: {
      type: String as PropType<VxeTimelinePropTypes.Size>,
      default: () => getConfig().timeline.size || getConfig().size
    }
  },
  data () {
    const reactData: TimelineReactData = {
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
    dispatchEvent (type: ValueOf<VxeTimelineEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTimeline = this
      $xeTimeline.$emit(type, createEvent(evnt, { $timeline: $xeTimeline }, params))
    },

    //
    // Render
    //
    renderVN  (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem',
        class: 'vxe-timeline'
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
