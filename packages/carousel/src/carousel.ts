import { defineComponent, ref, h, reactive } from 'vue'
import XEUtils from 'xe-utils'

import type { CarouselReactData, CarouselPrivateRef, VxeCarouselPrivateComputed, VxeCarouselConstructor, VxeCarouselPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCarousel',
  props: {
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CarouselReactData>({
    })

    const refMaps: CarouselPrivateRef = {
      refElem
    }

    const computeMaps: VxeCarouselPrivateComputed = {
    }

    const $xeCarousel = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCarouselConstructor & VxeCarouselPrivateMethods

    const renderVN = () => {
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-carousel']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCarousel.renderVN = renderVN

    return $xeCarousel
  },
  render () {
    return this.renderVN()
  }
})
