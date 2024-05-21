import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { CardReactData, VxeCardEmits, CardPrivateRef, VxeCardPrivateComputed, VxeCardConstructor, VxeCardPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCard',
  props: {
  },
  emits: [
  ] as VxeCardEmits,
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CardReactData>({
    })

    const refMaps: CardPrivateRef = {
      refElem
    }

    const computeMaps: VxeCardPrivateComputed = {
    }

    const $xeCard = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCardConstructor & VxeCardPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-card']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCard.renderVN = renderVN

    return $xeCard
  },
  render () {
    return this.renderVN()
  }
})
