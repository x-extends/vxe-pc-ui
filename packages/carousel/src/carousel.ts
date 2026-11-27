import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { getSlotVNs, handleEmitModelVal } from '../../ui/src/vn'
import { toCssUnit } from '../../ui/src/dom'
import { openPreviewImage } from '../../image/src/util'
import VxeLoadingComponent from '../../loading'

import type { CarouselReactData, VxeComponentSizeType, VxeCarouselPropTypes, CarouselInternalData, VxeCarouselEmits, VxeCarouselDefines, ValueOf } from '../../../types'

const { getConfig, getIcon, createEvent, globalMixins, renderEmptyElement } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCarousel',
  mixins: [globalMixins.sizeMixin],
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
    },
    showPreview: {
      type: Boolean as PropType<VxeCarouselPropTypes.ShowPreview>,
      default: () => getConfig().carousel.showPreview
    },
    showPrintButton: {
      type: Boolean as PropType<VxeCarouselPropTypes.ShowPrintButton>,
      default: () => getConfig().carousel.showPrintButton
    },
    showDownloadButton: {
      type: Boolean as PropType<VxeCarouselPropTypes.ShowDownloadButton>,
      default: () => getConfig().carousel.showDownloadButton
    }
  },
  data() {
    const xID = XEUtils.uniqueId()
    const reactData: CarouselReactData = {
      activeName: '',
      staticItems: [],
      itemWidth: 0,
      itemHeight: 0,
      isTransition: false
    }
    const internalData: CarouselInternalData = {
      // apTimeout: undefined,
      // stopFlag: false,
      // animating: false
    }

    const startName = XEUtils.uniqueId('carousel_start')
    const endName = XEUtils.uniqueId('carousel_end')
    return {
      xID,
      reactData,
      internalData,

      optsFlag: 0,
      startName,
      endName
    }
  },
  provide() {
    const $xeCarousel = this
    return {
      $xeCarousel
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeItemList () {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData
      const startName = $xeCarousel.startName
      const endName = $xeCarousel.endName

      const { options, loop } = props
      const { staticItems } = reactData
      const list = ((staticItems && staticItems.length ? staticItems : options) || []) as VxeCarouselDefines.ItemObj[]
      if (loop && list.length > 1) {
        return [
          Object.assign({}, list[list.length - 1], { name: startName, _value: list[list.length - 1].name }),
          ...list,
          Object.assign({}, list[0], { name: endName, _value: list[0].name })
        ]
      }
      return list
    },
    computeRealList () {
      const $xeCarousel = this
      const props = $xeCarousel

      const { loop } = props
      const itemList = $xeCarousel.computeItemList as VxeCarouselDefines.ItemObj[]
      if (loop && itemList.length > 2) {
        return itemList.slice(1, -1)
      }
      return itemList
    },
    computeImgList () {
      const $xeCarousel = this

      const realList = $xeCarousel.computeRealList as VxeCarouselDefines.ItemObj[]
      return realList.map(item => {
        return {
          url: item.url,
          alt: ''
        }
      })
    },
    /**
     * 当前激活项在真实列表中的索引（用于指示器高亮）
     */
    computeActiveIndex () {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData
      const startName = $xeCarousel.startName
      const endName = $xeCarousel.endName

      const { activeName } = reactData
      const realList = $xeCarousel.computeRealList as VxeCarouselDefines.ItemObj[]
      if (activeName === startName) {
        return realList.length - 1
      }
      if (activeName === endName) {
        return 0
      }
      return Math.max(0, XEUtils.findIndexOf(realList, (item) => item.name === activeName))
    },
    computeListStyle() {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { vertical } = props
      const { activeName, itemWidth, itemHeight, isTransition } = reactData
      const itemList = $xeCarousel.computeItemList
      const activeIndex = Math.max(0, XEUtils.findIndexOf(itemList, (item) => item.name === activeName))
      const stys: Record<string, any> = {}
      // 边界重置时关闭过渡，瞬间回到真实项位置
      if (!isTransition) {
        stys.transition = 'none'
      }
      if (vertical) {
        stys.transform = `translateY(-${activeIndex * itemHeight}px)`
      } else {
        stys.width = `${itemWidth * itemList.length}px`
        stys.transform = `translateX(-${activeIndex * itemWidth}px)`
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent(type: ValueOf<VxeCarouselEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCarousel = this
      $xeCarousel.$emit(type, createEvent(evnt, { $carousel: $xeCarousel }, params))
    },
    emitModel(value: any) {
      const $xeCarousel = this

      $xeCarousel.$emit('input', value)
      handleEmitModelVal($xeCarousel, value)
    },
    prev() {
      const $xeCarousel = this

      if ($xeCarousel.handlePrevNext(false)) {
        $xeCarousel.handleAutoPlay()
      }
      return $xeCarousel.$nextTick()
    },
    next() {
      const $xeCarousel = this

      if ($xeCarousel.handlePrevNext(true)) {
        $xeCarousel.handleAutoPlay()
      }
      return $xeCarousel.$nextTick()
    },
    /**
     * 真实列表：去掉首尾克隆项
     */
    getRealList () {
      const $xeCarousel = this
      const props = $xeCarousel

      const { loop } = props
      const itemList = $xeCarousel.computeItemList
      if (loop && itemList.length > 2) {
        return itemList.slice(1, -1)
      }
      return itemList
    },
    /**
     * 获取对外真实值
     */
    getItemValue (item: VxeCarouselDefines.ItemObj) {
      return item._value ?? item.name
    },
    updateStyle() {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      return $xeCarousel.$nextTick().then(() => {
        const wrapperElem = $xeCarousel.$refs.refWrapperElem as HTMLElement
        if (wrapperElem) {
          reactData.itemWidth = wrapperElem.clientWidth
          reactData.itemHeight = wrapperElem.clientHeight
        }
        return $xeCarousel.$nextTick()
      })
    },
    clickIndicatorsEvent(evnt: Event, item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData
      const internalData = $xeCarousel.internalData

      const { loop } = props
      const { animating } = internalData
      if (animating) {
        return
      }
      const itemList = $xeCarousel.computeItemList
      const realList = $xeCarousel.computeRealList
      const idx = XEUtils.findIndexOf(realList, (it) => it.name === item.name)
      if (idx < 0) {
        return
      }
      // 映射回克隆列表中的真实项
      const targetItem = loop && itemList.length > 2 ? itemList[idx + 1] : itemList[idx]
      if (!targetItem || targetItem.name === reactData.activeName) {
        return
      }
      const value = $xeCarousel.getItemValue(targetItem)
      internalData.animating = true
      reactData.activeName = targetItem.name
      $xeCarousel.emitModel(value)
      $xeCarousel.$emit('change', { value }, evnt)
      $xeCarousel.updateStyle()
    },
    clickItemEvent (evnt: Event, item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option) {
      const $xeCarousel = this
      const props = $xeCarousel

      const { showPreview, showPrintButton, showDownloadButton } = props
      const imgList = $xeCarousel.computeImgList
      if (showPreview) {
        openPreviewImage({
          urlList: imgList,
          showPrintButton,
          showDownloadButton
        })
      }
      $xeCarousel.dispatchEvent('click', { item }, evnt)
    },
    initDefaultActive() {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { value: modelValue, loop } = props
      const { staticItems } = reactData
      const realList = (staticItems && staticItems.length ? staticItems : props.options) || []
      if (!realList.length) {
        reactData.activeName = ''
        return
      }
      let activeName: VxeCarouselPropTypes.ModelValue = modelValue
      const validVal = realList.some((item) => item.name === activeName)
      if (!validVal) {
        activeName = realList[0].name
        $xeCarousel.emitModel(activeName)
      }
      if (loop && realList.length > 1) {
        const itemList = $xeCarousel.computeItemList
        const idx = XEUtils.findIndexOf(realList, (item) => item.name === activeName)
        const targetItem = itemList[idx + 1]
        reactData.activeName = targetItem ? targetItem.name : ''
      } else {
        reactData.activeName = activeName
      }
    },
    /**
     * 无动画重置
     * 把 activeName 直接定位到真实第一张/最后一张
     */
    resetPosition (targetIndex: number) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData
      const internalData = $xeCarousel.internalData

      const itemList = $xeCarousel.computeItemList
      const targetItem = itemList[targetIndex]
      if (!targetItem) {
        internalData.animating = false
        return
      }
      reactData.isTransition = false
      reactData.activeName = targetItem.name
      $xeCarousel.emitModel($xeCarousel.getItemValue(targetItem))
      $xeCarousel.$nextTick(() => {
        const wrapperElem = $xeCarousel.$refs.refWrapperElem as HTMLElement
        if (wrapperElem) {
          // 代码本身无作用，目的是强制 reflow，确保 transition: none 先被浏览器应用
          // eslint-disable-next-line no-unused-expressions
          wrapperElem.offsetHeight
        }
        reactData.isTransition = true
        internalData.animating = false
      })
    },
    listTransitionendEvent (evnt: TransitionEvent) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData
      const internalData = $xeCarousel.internalData
      const startName = $xeCarousel.startName
      const endName = $xeCarousel.endName

      if (evnt.propertyName !== 'transform') {
        return
      }
      if (evnt.target !== evnt.currentTarget) {
        return
      }
      const { loop } = props
      if (!loop) {
        internalData.animating = false
        return
      }
      const { activeName } = reactData
      const itemList = $xeCarousel.computeItemList
      const realCount = itemList.length - 2
      if (activeName === endName) {
        // 滚到“第一张克隆”，回到真实第一张
        $xeCarousel.resetPosition(1)
      } else if (activeName === startName) {
        // 滚到“最后一张克隆”，回到真实最后一张
        $xeCarousel.resetPosition(realCount)
      } else {
        internalData.animating = false
      }
    },
    handlePrevNext(isNext: boolean) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData
      const internalData = $xeCarousel.internalData

      const { loop } = props
      const { activeName } = reactData
      const { animating } = internalData
      if (animating) {
        return false
      }
      const itemList = $xeCarousel.computeItemList
      if (itemList.length <= 1) {
        return false
      }
      const index = XEUtils.findIndexOf(itemList, (item) => item.name === activeName)
      if (index < 0) {
        return false
      }
      let targetIndex = -1
      if (isNext) {
        if (index < itemList.length - 1) {
          targetIndex = index + 1
        } else if (loop) {
          targetIndex = 0
        }
      } else {
        if (index > 0) {
          targetIndex = index - 1
        } else if (loop) {
          targetIndex = itemList.length - 1
        }
      }
      if (targetIndex < 0) {
        return false
      }
      const targetItem = itemList[targetIndex]
      internalData.animating = true
      reactData.activeName = targetItem.name
      $xeCarousel.emitModel($xeCarousel.getItemValue(targetItem))
      return true
    },
    prevEvent(evnt: Event) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      if ($xeCarousel.handlePrevNext(false)) {
        const { activeName } = reactData
        const itemList = $xeCarousel.computeItemList
        const currentItem = itemList[XEUtils.findIndexOf(itemList, (item) => item.name === activeName)]
        if (currentItem) {
          $xeCarousel.$emit('change', { value: $xeCarousel.getItemValue(currentItem) }, evnt)
        }
      }
    },
    nextEvent(evnt: Event) {
      const $xeCarousel = this
      const reactData = $xeCarousel.reactData

      if ($xeCarousel.handlePrevNext(true)) {
        const { activeName } = reactData
        const itemList = $xeCarousel.computeItemList
        const currentItem = itemList[XEUtils.findIndexOf(itemList, (item) => item.name === activeName)]
        if (currentItem) {
          $xeCarousel.$emit('change', { value: $xeCarousel.getItemValue(currentItem) }, evnt)
        }
      }
    },
    stopAutoPlay() {
      const $xeCarousel = this
      const internalData = $xeCarousel.internalData

      const { apTimeout } = internalData
      internalData.stopFlag = true
      if (apTimeout) {
        clearTimeout(apTimeout)
        internalData.apTimeout = undefined
      }
    },
    handleAutoPlay() {
      const $xeCarousel = this
      const props = $xeCarousel
      const internalData = $xeCarousel.internalData

      const { autoPlay, interval } = props
      $xeCarousel.stopAutoPlay()
      if (autoPlay) {
        internalData.stopFlag = false
        internalData.apTimeout = setTimeout(() => {
          const { stopFlag } = internalData
          if (!stopFlag) {
            $xeCarousel.handlePrevNext(true)
            // 重新调度，保证自动播放持续进行
            if (!internalData.stopFlag) {
              $xeCarousel.handleAutoPlay()
            }
          }
        }, XEUtils.toNumber(interval) || 300)
      }
    },
    mouseenterEvent() {
      const $xeCarousel = this

      $xeCarousel.stopAutoPlay()
    },
    mouseleaveEvent() {
      const $xeCarousel = this

      $xeCarousel.handleAutoPlay()
    },
    callSlot(slotFunc: any, params: any) {
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
    renderItemWrapper(h: CreateElement, list: VxeCarouselDefines.ItemConfig[] | VxeCarouselPropTypes.Options) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData

      const { height } = props
      const { activeName } = reactData
      const listStyle = $xeCarousel.computeListStyle

      return h('div', {
        class: 'vxe-carousel--list',
        style: listStyle,
        on: {
          transitionend: $xeCarousel.listTransitionendEvent
        }
      },
      list.map((item) => {
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
            : {},
          on: {
            click (evnt: MouseEvent) {
              $xeCarousel.clickItemEvent(evnt, item)
            }
          }
        },
        defaultSlot
          ? $xeCarousel.callSlot(defaultSlot, {})
          : [
              h('img', {
                class: 'vxe-carousel--item-img',
                attrs: {
                  src: url
                }
              })
            ]
        )
      }))
    },
    renderIndicators(h: CreateElement) {
      const $xeCarousel = this

      const realList = $xeCarousel.getRealList()
      const activeIndex = $xeCarousel.computeActiveIndex
      return h('div', {
        class: 'vxe-carousel--indicators'
      }, realList.map((item, index) => {
        return h('div', {
          key: `${item.name}`,
          class: [
            'vxe-carousel--indicators-item',
            {
              'is--active': index === activeIndex
            }
          ],
          on: {
            click(evnt: MouseEvent) {
              $xeCarousel.clickIndicatorsEvent(evnt, item)
            }
          }
        })
      }))
    },
    renderVN(h: CreateElement): VNode {
      const $xeCarousel = this
      const props = $xeCarousel
      const slots = $xeCarousel.$scopedSlots

      const { loading, height, width, showIndicators, vertical } = props
      const defaultSlot = slots.default
      const itemList = $xeCarousel.computeItemList

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
      },
      [h('div', {
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
      }, [$xeCarousel.renderItemWrapper(h, itemList)]),
      showIndicators ? $xeCarousel.renderIndicators(h) : renderEmptyElement($xeCarousel),
      h('div', {
        class: 'vxe-carousel--btn-wrapper'
      },
      [
        h('div', {
          class: 'vxe-carousel--previous-btn',
          on: {
            click: $xeCarousel.prevEvent
          }
        },
        [
          h('i', {
            class: vertical ? getIcon().CAROUSEL_VERTICAL_PREVIOUS : getIcon().CAROUSEL_HORIZONTAL_PREVIOUS
          })
        ]
        ),
        h('div', {
          class: 'vxe-carousel--next-btn',
          on: {
            click: $xeCarousel.nextEvent
          }
        },
        [
          h('i', {
            class: vertical ? getIcon().CAROUSEL_VERTICAL_NEXT : getIcon().CAROUSEL_HORIZONTAL_NEXT
          })
        ]
        )
      ]
      ),
      /**
           * 加载中
           */
      h(VxeLoadingComponent, {
        class: 'vxe-carousel--loading',
        props: {
          value: loading
        }
      })
      ]
      )
    }
  },
  watch: {
    options() {
      const $xeCarousel = this

      $xeCarousel.optsFlag++
    },
    'reactData.staticItems'() {
      const $xeCarousel = this

      $xeCarousel.optsFlag++
    },
    loop() {
      const $xeCarousel = this

      $xeCarousel.optsFlag++
    },
    optsFlag () {
      const $xeCarousel = this

      $xeCarousel.initDefaultActive()
    },
    autoPlay() {
      const $xeCarousel = this

      $xeCarousel.handleAutoPlay()
    },
    value(val) {
      const $xeCarousel = this
      const props = $xeCarousel
      const reactData = $xeCarousel.reactData
      const internalData = $xeCarousel.internalData

      const { loop } = props
      const { animating } = internalData
      if (animating) {
        return
      }
      const realList = $xeCarousel.computeRealList
      const index = XEUtils.findIndexOf(realList, (item) => item.name === val)
      if (index < 0) {
        return
      }
      const itemList = $xeCarousel.computeItemList
      const targetItem = loop && itemList.length > 2 ? itemList[index + 1] : itemList[index]
      if (targetItem && targetItem.name !== reactData.activeName) {
        reactData.activeName = targetItem.name
      }
    }
  },
  created() {
    const $xeCarousel = this

    $xeCarousel.initDefaultActive()
  },
  mounted() {
    const $xeCarousel = this
    const reactData = $xeCarousel.reactData

    $xeCarousel.updateStyle().then(() => {
      // 移除初始化时的动画
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reactData.isTransition = true
          $xeCarousel.handleAutoPlay()
        })
      })
    })
  },
  beforeDestroy() {
    const $xeCarousel = this

    $xeCarousel.stopAutoPlay()
  },
  render(this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
