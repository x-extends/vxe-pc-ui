import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeTourPropTypes, TourReactData, VxeTourEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTour',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    size: {
      type: String as PropType<VxeTourPropTypes.Size>,
      default: () => getConfig().tour.size || getConfig().size
    }
  },
  data () {
    const reactData: TourReactData = {
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
    dispatchEvent (type: ValueOf<VxeTourEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTour = this
      $xeTour.$emit(type, createEvent(evnt, { $tour: $xeTour }, params))
    },

    //
    // Render
    //
    renderVN  (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem',
        class: 'vxe-tour'
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
