import { defineComponent, ref, h, reactive, PropType } from 'vue'
import XEUtils from 'xe-utils'

import type { VxeCarouselItemPropTypes, CarouselItemReactData, CarouselItemPrivateRef, VxeCarouselItemPrivateComputed, VxeCarouselItemConstructor, VxeCarouselItemPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCarouselItem',
  props: {
    name: String as PropType<VxeCarouselItemPropTypes.Name>,
    className: String as PropType<VxeCarouselItemPropTypes.ClassName>,
    url: String as PropType<VxeCarouselItemPropTypes.Url>
  },
  emits: [],
  setup (props, context) {
    const { slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CarouselItemReactData>({
    })

    const refMaps: CarouselItemPrivateRef = {
      refElem
    }

    const computeMaps: VxeCarouselItemPrivateComputed = {
    }

    const $xeCarouselItem = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCarouselItemConstructor & VxeCarouselItemPrivateMethods

    const renderVN = () => {
      const { className } = props
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: ['vxe-carousel-item', className || '']
      }, defaultSlot ? defaultSlot({}) : [])
    }

    $xeCarouselItem.renderVN = renderVN

    return $xeCarouselItem
  },
  render () {
    return this.renderVN()
  }
})
