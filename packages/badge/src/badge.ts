import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'

import type { BadgeReactData, VxeBadgeEmits, BadgeMethods, BadgePrivateMethods, ValueOf, BadgePrivateRef, VxeBadgePrivateComputed, VxeBadgeConstructor, VxeBadgePrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeBadge',
  props: {
  },
  emits: [
  ] as VxeBadgeEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<BadgeReactData>({
    })

    const refMaps: BadgePrivateRef = {
      refElem
    }

    const computeMaps: VxeBadgePrivateComputed = {
    }

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

    const collapsePaneMethods: BadgeMethods = {
      dispatchEvent
    }

    const collapsePanePrivateMethods: BadgePrivateMethods = {
    }

    Object.assign($xeBadge, collapsePaneMethods, collapsePanePrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-badge'
      }, [])
    }

    $xeBadge.renderVN = renderVN

    return $xeBadge
  },
  render () {
    return this.renderVN()
  }
})
