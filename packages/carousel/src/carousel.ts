import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../../ui/src/dom'
import VxeLoadingComponent from '../../loading/src/loading'

import type { CarouselReactData, VxeComponentSizeType, VxeCarouselPropTypes, CarouselInternalData, VxeCarouselEmits, VxeCarouselDefines, ValueOf } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCarousel',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: [String, Number] as PropType<VxeCarouselPropTypes.ModelValue>,
    options: Array as PropType<VxeCarouselPropTypes.Options>,
    loading: Boolean as PropType<VxeCarouselPropTypes.Loading>,
    height: {
      type: [Number, String] as PropType<VxeCarouselPropTypes.Height>,
      default: () => getConfig().carousel.height
    },
    width: {
      type: [Number, String] as PropType<VxeCarouselPropTypes.Width>,
      default: () => getConfig().carousel.width
    },
    autoPlay: {
      type: Boolean as PropType<VxeCarouselPropTypes.AutoPlay>,
      default: () => getConfig().carousel.autoPlay
    },
    interval: {
      type: [Number, String] as PropType<VxeCarouselPropTypes.Interval>,
      default: () => getConfig().carousel.interval
    },
    loop: {
      type: Boolean as PropType<VxeCarouselPropTypes.Loop>,
      default: () => getConfig().carousel.loop
    },
    vertical: {
      type: Boolean as PropType<VxeCarouselPropTypes.Vertical>,
      default: () => getConfig().carousel.vertical
    },
    showIndicators: {
      type: Boolean as PropType<VxeCarouselPropTypes.ShowIndicators>,
      default: () => getConfig().carousel.showIndicators
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CarouselReactData = {
      activeName: '',
      staticItems: [],
      itemWidth: 0,
      itemHeight: 0
    }
    const internalData: CarouselInternalData = {
      apTimeout: undefined,
      stopFlag: false
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  provide () {
    const $xeCarousel = this
    return {
      $xeCarousel
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeListStyle () {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { vertical, options } = props
      const { activeName, itemWidth, itemHeight, staticItems } = reactData
      const list = (staticItems && staticItems.length ? staticItems : options) || []
      const activeIndex = Math.max(0, XEUtils.findIndexOf(list, item => item.name === activeName))
      const stys: Record<string, any> = {}
      if (vertical) {
        stys.transform = `translateY(-${activeIndex * itemHeight}px)`
      } else {
        stys.width = `${itemWidth * list.length}px`
        stys.transform = `translateX(-${activeIndex * itemWidth}px)`
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCarouselEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCarousel = this
      $xeCarousel.$emit(type, createEvent(evnt, { $carousel: $xeCarousel }, params))
    },
    prev () {
      const $xeCarousel = this

      if ($xeCarousel.handlePrevNext(false)) {
        $xeCarousel.handleAutoPlay()
      }
      return $xeCarousel.$nextTick()
    },
    next () {
      const $xeCarousel = this

      if ($xeCarousel.handlePrevNext(true)) {
        $xeCarousel.handleAutoPlay()
      }
      return $xeCarousel.$nextTick()
    },
    updateStyle () {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      $xeCarousel.$nextTick(() => {
        const wrapperElem = $xeCarousel.$refs.refWrapperElem as HTMLElement
        if (wrapperElem) {
          reactData.itemWidth = wrapperElem.clientWidth
          reactData.itemHeight = wrapperElem.clientHeight
        }
      })
    },
    clickItemEvent  (evnt: Event, item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      const value = item.name
      reactData.activeName = item.name
      $xeCarousel.$emit('input', value)
      $xeCarousel.$emit('change', { value }, evnt)
      $xeCarousel.updateStyle()
    },
    initDefaultActive  (list?: VxeCarouselDefines.ItemConfig[] | VxeCarouselPropTypes.Options) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      let activeName: VxeCarouselPropTypes.ModelValue | undefined = null
      if (list && list.length) {
        let validVal = false
        activeName = props.value
        list.forEach((item) => {
          if (activeName === item.name) {
            validVal = true
          }
        })
        if (!validVal) {
          activeName = list[0].name
          $xeCarousel.$emit('input', activeName)
        }
      }
      reactData.activeName = activeName
    },
    handlePrevNext  (isNext: boolean) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { options, loop } = props
      const { activeName, staticItems } = reactData
      const list = (staticItems && staticItems.length ? staticItems : options) || []
      const index = Math.max(0, XEUtils.findIndexOf(list, item => item.name === activeName))
      if (index > -1) {
        let item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option | null = null
        if (isNext) {
          if (index < list.length - 1) {
            item = list[index + 1]
          } else {
            if (loop) {
              item = list[0]
            }
          }
        } else {
          if (index > 0) {
            item = list[index - 1]
          } else {
            if (loop) {
              item = list[list.length - 1]
            }
          }
        }
        if (item) {
          const name = item.name
          const value = name
          reactData.activeName = name
          $xeCarousel.$emit('input', value)
          return true
        }
      }
      return false
    },
    prevEvent (evnt: Event) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      if ($xeCarousel.handlePrevNext(false)) {
        const value = reactData.activeName
        $xeCarousel.$emit('change', { value }, evnt)
      }
    },
    nextEvent  (evnt: Event) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      if ($xeCarousel.handlePrevNext(true)) {
        const value = reactData.activeName
        $xeCarousel.$emit('change', { value }, evnt)
      }
    },
    stopAutoPlay () {
      const $xeCarousel = this
      const internalData = $xeCarousel.internalData

      const { apTimeout } = internalData
      internalData.stopFlag = true
      if (apTimeout) {
        clearTimeout(apTimeout)
        internalData.apTimeout = undefined
      }
    },
    handleAutoPlay  () {
      const $xeCarousel = this
      const props = $xeCarousel
      const internalData = $xeCarousel.internalData

      const { autoPlay, interval } = props
      const { stopFlag } = internalData
      $xeCarousel.stopAutoPlay()
      if (autoPlay) {
        internalData.stopFlag = false
        internalData.apTimeout = setTimeout(() => {
          if (!stopFlag) {
            $xeCarousel.handlePrevNext(true)
          }
        }, XEUtils.toNumber(interval) || 300)
      }
    },
    mouseenterEvent () {
      const $xeCarousel = this

      $xeCarousel.stopAutoPlay()
    },
    mouseleaveEvent  () {
      const $xeCarousel = this

      $xeCarousel.handleAutoPlay()
    },
    callSlot  (slotFunc: any, params: any) {
      const $xeCarousel = this
      const slots = $xeCarousel.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    },

    //
    // Render
    //
    renderItemWrapper (h: CreateElement, list: VxeCarouselDefines.ItemConfig[] | VxeCarouselPropTypes.Options) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { height } = props
      const { activeName } = reactData
      const listStyle = $xeCarousel.computeListStyle

      return h('div', {
        class: 'vxe-carousel--list',
        style: listStyle
      }, list.map(item => {
        const { name, url, slots } = item
        const defaultSlot = slots ? slots.default : null
        return h('div', {
          key: `${name}`,
          class: ['vxe-carousel--item-inner', {
            'is--active': activeName === name
          }],
          style: height
            ? {
                height: toCssUnit(height)
              }
            : {}
        }, defaultSlot
          ? $xeCarousel.callSlot(defaultSlot, {})
          : [
              h('img', {
                class: 'vxe-carousel--item-img',
                attrs: {
                  src: url
                }
              })
            ])
      }))
    },
    renderIndicators  (h: CreateElement, list: VxeCarouselDefines.ItemConfig[] | VxeCarouselPropTypes.Options) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      const { activeName } = reactData
      return h('div', {
        class: 'vxe-carousel--indicators'
      }, list.map((item) => {
        const { name } = item
        return h('div', {
          key: `${name}`,
          class: ['vxe-carousel--indicators-item', {
            'is--active': activeName === name
          }],
          on: {
            click (evnt: MouseEvent) {
              $xeCarousel.clickItemEvent(evnt, item)
            }
          }
        })
      }))
    },
    renderVN (h: CreateElement): VNode {
      const $xeCarousel = this
      const props = $xeCarousel
      const slots = $xeCarousel.$scopedSlots
      const reactData = $xeCarousel.reactData

      const { loading, height, width, showIndicators, vertical, options } = props
      const { staticItems } = reactData
      const defaultSlot = slots.default
      const list = (staticItems && staticItems.length ? staticItems : options) || []

      return h('div', {
        ref: 'refElem',
        class: ['vxe-carousel', `is--${vertical ? 'vertical' : 'horizontal'}`],
        style: width
          ? {
              width: toCssUnit(width)
            }
          : {},
        on: {
          mouseenter: $xeCarousel.mouseenterEvent,
          mouseleave: $xeCarousel.mouseleaveEvent
        }
      }, [
        h('div', {
          class: 'vxe-carousel--slots'
        }, defaultSlot ? defaultSlot({}) : []),
        h('div', {
          ref: 'refWrapperElem',
          class: 'vxe-carousel--item-wrapper',
          style: height
            ? {
                height: toCssUnit(height)
              }
            : {}
        }, [
          $xeCarousel.renderItemWrapper(h, list)
        ]),
        showIndicators ? $xeCarousel.renderIndicators(h, list) : renderEmptyElement($xeCarousel),
        h('div', {
          class: 'vxe-carousel--btn-wrapper'
        }, [
          h('div', {
            class: 'vxe-carousel--previous-btn',
            on: {
              click: $xeCarousel.prevEvent
            }
          }, [
            h('i', {
              class: vertical ? getIcon().CAROUSEL_VERTICAL_PREVIOUS : getIcon().CAROUSEL_HORIZONTAL_PREVIOUS
            })
          ]),
          h('div', {
            class: 'vxe-carousel--next-btn',
            on: {
              click: $xeCarousel.nextEvent
            }
          }, [
            h('i', {
              class: vertical ? getIcon().CAROUSEL_VERTICAL_NEXT : getIcon().CAROUSEL_HORIZONTAL_NEXT
            })
          ])
        ]),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-carousel--loading',
          props: {
            value: loading
          }
        })
      ])
    }
  },
  watch: {
    options () {
      const $xeCarousel = this
      const props = $xeCarousel

      $xeCarousel.initDefaultActive(props.options)
    },
    'reactData.staticItems' () {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      $xeCarousel.initDefaultActive(reactData.staticItems)
    },
    autoPlay () {
      const $xeCarousel = this

      $xeCarousel.handleAutoPlay()
    }
  },
  created () {
    const $xeCarousel = this
    const props = $xeCarousel
    const reactData = $xeCarousel.reactData

    $xeCarousel.initDefaultActive(reactData.staticItems.length ? reactData.staticItems : props.options)
  },
  mounted () {
    const $xeCarousel = this

    $xeCarousel.handleAutoPlay()
    $xeCarousel.updateStyle()
  },
  beforeDestroy () {
    const $xeCarousel = this

    $xeCarousel.stopAutoPlay()
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
