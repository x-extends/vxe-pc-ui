import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { GanttReactData, VxeGanttEmits, GanttInternalData, VxeGanttPropTypes, ValueOf, VxeComponentSizeType } from '../../../types'

function createInternalData (): GanttInternalData {
  return {
  }
}

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeGantt',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    size: {
      type: String as PropType<VxeGanttPropTypes.Size>,
      default: () => getConfig().gantt.size || getConfig().size
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: GanttReactData = {
    }
    const internalData = createInternalData()
    return {
      xID,
      reactData,
      internalData
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
    dispatchEvent (type: ValueOf<VxeGanttEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeGantt = this
      $xeGantt.$emit(type, createEvent(evnt, { $gantt: $xeGantt }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem',
        class: 'vxe-gantt'
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
