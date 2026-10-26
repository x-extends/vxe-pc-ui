import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'

import type { BadgeReactData, VxeBadgeEmits, VxeBadgePropTypes, ValueOf, VxeComponentSizeType } from '../../../types'

const { getConfig, createEvent, globalMixins, renderEmptyElement } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeBadge',
  mixins: [globalMixins.sizeMixin],
  props: {
    count: [String, Number] as PropType<VxeBadgePropTypes.Count>,
    text: [String, Number] as PropType<VxeBadgePropTypes.Text>,
    dot: Boolean as PropType<VxeBadgePropTypes.Dot>,
    content: [String, Number] as PropType<VxeBadgePropTypes.Content>,
    max: {
      type: [String, Number] as PropType<VxeBadgePropTypes.Content>,
      default: () => getConfig().badge.max
    },
    size: {
      type: String as PropType<VxeBadgePropTypes.Size>,
      default: () => getConfig().badge.size || getConfig().size
    }
  },
  data() {
    const xID = XEUtils.uniqueId()
    const reactData: BadgeReactData = {}
    return {
      xID,
      reactData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeCountNum() {
      const $xeAvatar = this
      const props = $xeAvatar

      const { count } = props
      return count ? XEUtils.toNumber(count) : 0
    },
    computeLabel() {
      const $xeAvatar = this
      const props = $xeAvatar

      const { text, max } = props
      if (text) {
        return `${text}`
      }
      const countNum = $xeAvatar.computeCountNum as number
      if (countNum) {
        const maxNum = max ? XEUtils.toNumber(max) : 99
        return countNum > maxNum ? `${maxNum}+` : `${countNum}`
      }
      return ''
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent(type: ValueOf<VxeBadgeEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeBadge = this
      $xeBadge.$emit(type, createEvent(evnt, { $badge: $xeBadge }, params))
    },

    //
    // Render
    //
    renderVN(h: CreateElement): VNode {
      const $xeBadge = this
      const props = $xeBadge
      const slots = $xeBadge.$scopedSlots

      const { dot, content } = props
      const vSize = $xeBadge.computeSize
      const label = $xeBadge.computeLabel
      const defaultSlot = slots.default
      return h(
        'div',
        {
          ref: 'refElem',
          class: [
            'vxe-badge',
            {
              [`size--${vSize}`]: vSize,
              'is--dot': dot
            }
          ]
        },
        [
          defaultSlot || content
            ? h(
              'div',
              {
                class: 'vxe-badge--content'
              },
              defaultSlot ? defaultSlot({}) : `${content || ''}`
            )
            : [],
          label
            ? h(
              'span',
              {
                class: 'vxe-badge--label'
              },
              label
            )
            : renderEmptyElement($xeBadge)
        ]
      )
    }
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
