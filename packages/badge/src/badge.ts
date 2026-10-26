import { ref, h, computed, reactive, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'

import type { BadgeReactData, VxeBadgeEmits, VxeBadgePropTypes, BadgeMethods, BadgePrivateMethods, ValueOf, BadgePrivateRef, VxeBadgePrivateComputed, VxeBadgeConstructor, VxeBadgePrivateMethods } from '../../../types'

const { getConfig, createEvent, useFns, renderEmptyElement } = VxeUI

export default defineVxeComponent({
  name: 'VxeBadge',
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
  emits: [] as VxeBadgeEmits,
  setup(props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const { computeSize } = useFns.useSize(props)

    const reactData = reactive<BadgeReactData>({})

    const refMaps: BadgePrivateRef = {
      refElem
    }

    const computeCountNum = computed(() => {
      const { count } = props
      return count ? XEUtils.toNumber(count) : 0
    })

    const computeLabel = computed(() => {
      const { text, max } = props
      if (text) {
        return `${text}`
      }
      const countNum = computeCountNum.value
      if (countNum) {
        const maxNum = max ? XEUtils.toNumber(max) : 99
        return countNum > maxNum ? `${maxNum}+` : `${countNum}`
      }
      return ''
    })

    const computeMaps: VxeBadgePrivateComputed = {}

    const $xeBadge = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeBadgeConstructor & VxeBadgePrivateMethods

    const dispatchEvent = (type: ValueOf<VxeBadgeEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $badge: $xeBadge }, params))
    }

    const badgeMethods: BadgeMethods = {
      dispatchEvent
    }

    const badgePrivateMethods: BadgePrivateMethods = {}

    Object.assign($xeBadge, badgeMethods, badgePrivateMethods)

    const renderVN = () => {
      const { dot, content } = props
      const vSize = computeSize.value
      const label = computeLabel.value
      const defaultSlot = slots.default
      return h(
        'div',
        {
          ref: refElem,
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

    $xeBadge.renderVN = renderVN

    return $xeBadge
  },
  render() {
    return this.renderVN()
  }
})
