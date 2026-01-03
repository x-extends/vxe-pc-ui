import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'

import type { VxeMentionPropTypes, MentionReactData, VxeMentionEmits, VxeComponentSizeType, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeMention',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    size: {
      type: String as PropType<VxeMentionPropTypes.Size>,
      default: () => getConfig().mention.size || getConfig().size
    }
  },
  data () {
    const reactData: MentionReactData = {
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
    dispatchEvent (type: ValueOf<VxeMentionEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeMention = this
      $xeMention.$emit(type, createEvent(evnt, { $mention: $xeMention }, params))
    },

    //
    // Render
    //
    renderVN  (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem',
        class: 'vxe-mention'
      })
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
