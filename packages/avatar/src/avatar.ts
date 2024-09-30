import { CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { AvatarReactData, VxeAvatarEmits, ValueOf } from '../../../types'

export default defineVxeComponent({
  name: 'VxeAvatar',
  props: {
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: AvatarReactData = {
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
    dispatchEvent (type: ValueOf<VxeAvatarEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeAvatar = this
      $xeAvatar.$emit(type, createEvent(evnt, { $avatar: $xeAvatar }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeAvatar = this
      const slots = $xeAvatar.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: 'vxe-avatar'
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
