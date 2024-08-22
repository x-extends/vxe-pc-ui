import { defineComponent, ref, h, reactive, PropType, inject, watch, onMounted, onUnmounted } from 'vue'
import { assembleCarouselItem, destroyCarouselItem } from './util'
import XEUtils from 'xe-utils'

import type { VxeCarouselItemPropTypes, CarouselItemReactData, CarouselItemPrivateRef, VxeCarouselItemEmits, VxeCarouselDefines, VxeCarouselItemPrivateComputed, VxeCarouselItemConstructor, VxeCarouselItemPrivateMethods, VxeCarouselConstructor, VxeCarouselPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'VxeCarouselItem',
  props: {
    name: [String, Number] as PropType<VxeCarouselItemPropTypes.Name>,
    className: String as PropType<VxeCarouselItemPropTypes.ClassName>,
    url: String as PropType<VxeCarouselItemPropTypes.Url>
  },
  emits: [
  ] as VxeCarouselItemEmits,
  setup (props, context) {
    const { slots } = context

    const $xeCarousel = inject<(VxeCarouselConstructor & VxeCarouselPrivateMethods) | null>('$xeCarousel', null)

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<CarouselItemReactData>({
    })

    const itemConfig = reactive<VxeCarouselDefines.ItemConfig>({
      id: xID,
      name: props.name,
      url: props.url,
      className: props.className,
      slots
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
      return h('div', {
        ref: refElem
      })
    }

    watch(() => props.name, (val) => {
      itemConfig.name = val
    })

    watch(() => props.url, (val) => {
      itemConfig.url = val
    })

    onMounted(() => {
      if ($xeCarousel && refElem.value) {
        assembleCarouselItem($xeCarousel, refElem.value, itemConfig)
      }
    })

    onUnmounted(() => {
      if ($xeCarousel) {
        destroyCarouselItem($xeCarousel, itemConfig)
      }
    })

    $xeCarouselItem.renderVN = renderVN

    return $xeCarouselItem
  },
  render () {
    return this.renderVN()
  }
})
