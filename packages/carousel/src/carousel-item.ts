import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { globalMixins, createEvent } from '../../ui'
import { assembleCarouselItem, destroyCarouselItem } from './util'

import type { VxeCarouselItemPropTypes, CarouselItemReactData, VxeCarouselItemEmits, VxeCarouselDefines, VxeComponentSizeType, ValueOf, VxeCarouselConstructor, VxeCarouselPrivateMethods } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCarouselItem',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    name: [String, Number] as PropType<VxeCarouselItemPropTypes.Name>,
    className: String as PropType<VxeCarouselItemPropTypes.ClassName>,
    url: String as PropType<VxeCarouselItemPropTypes.Url>
  },
  inject: {
    $xeCarousel: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CarouselItemReactData = {
      currentDate: null
    }
    const itemConfig: VxeCarouselDefines.ItemConfig = {
      id: xID,
      name: '',
      url: '',
      className: '',
      slots: {}
    }
    return {
      xID,
      reactData,
      itemConfig
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
      $xeCarousel(): (VxeCarouselConstructor & VxeCarouselPrivateMethods) | null
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCarouselItemEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCarouselItem = this
      $xeCarouselItem.$emit(type, createEvent(evnt, { $carouselItem: $xeCarouselItem }, params))
    },
    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      return h('div', {
        ref: 'refElem'
      })
    }
  },
  watch: {
    name (val) {
      const $xeCarouselItem = this
      const itemConfig = $xeCarouselItem.itemConfig

      itemConfig.name = val
    },
    url (val) {
      const $xeCarouselItem = this
      const itemConfig = $xeCarouselItem.itemConfig

      itemConfig.url = val
    }
  },
  created () {
    const $xeCarouselItem = this
    const props = $xeCarouselItem
    const slots = $xeCarouselItem.$scopedSlots
    const itemConfig = $xeCarouselItem.itemConfig

    Object.assign(itemConfig, {
      name: props.name,
      url: props.url,
      className: props.className,
      slots
    })
  },
  mounted () {
    const $xeCarouselItem = this
    const slots = $xeCarouselItem.$scopedSlots
    const itemConfig = $xeCarouselItem.itemConfig
    const $xeCarousel = $xeCarouselItem.$xeCarousel

    itemConfig.slots = slots

    const elem = $xeCarouselItem.$refs.refElem as HTMLElement
    if ($xeCarousel && elem) {
      assembleCarouselItem($xeCarousel, elem, itemConfig)
    }
  },
  beforeDestroy () {
    const $xeCarouselItem = this
    const itemConfig = $xeCarouselItem.itemConfig
    const $xeCarousel = $xeCarouselItem.$xeCarousel

    if ($xeCarousel) {
      destroyCarouselItem($xeCarousel, itemConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
