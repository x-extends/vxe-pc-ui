import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'

import type { BadgeReactData, VxeBadgeEmits, VxeBadgePropTypes, ValueOf, VxeComponentSizeType } from '../../../types'

export default defineVxeComponent({
  name: 'VxeBadge',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    count: [String, Number] as PropType<VxeBadgePropTypes.Count>,
    dot: Boolean as PropType<VxeBadgePropTypes.Dot>,
    content: [String, Number] as PropType<VxeBadgePropTypes.Content>,
    size: {
      type: String as PropType<VxeBadgePropTypes.Size>,
      default: () => getConfig().badge.size || getConfig().size
    }
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
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeCountNum () {
      const $xeAvatar = this
      const props = $xeAvatar

      const { count } = props
      return count ? XEUtils.toNumber(count) : 0
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
      const props = $xeBadge
      const slots = $xeBadge.$scopedSlots

      const { dot, content } = props
      const vSize = $xeBadge.computeSize
      const countNum = $xeBadge.computeCountNum
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-badge', {
          [`size--${vSize}`]: vSize,
          'is--dot': dot
        }]
      }, [
        defaultSlot || content
          ? h('div', {
            class: 'vxe-badge--content'
          }, defaultSlot ? defaultSlot({}) : `${content || ''}`)
          : [],
        countNum
          ? h('span', {
            class: 'vxe-badge--count'
          }, countNum > 99 ? '99+' : `${countNum}`)
          : renderEmptyElement($xeBadge)
      ])
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})
