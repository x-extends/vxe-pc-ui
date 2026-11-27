import { ref, h, reactive, provide, PropType, watch, nextTick, onMounted, computed, onUnmounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { VxeUI } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../../ui/src/dom'
import { openPreviewImage } from '../../image/src/util'
import VxeLoadingComponent from '../../loading'
import XEUtils from 'xe-utils'

import type { CarouselReactData, CarouselPrivateRef, VxeCarouselPropTypes, CarouselInternalData, CarouselMethods, CarouselPrivateMethods, VxeCarouselEmits, VxeCarouselDefines, VxeCarouselPrivateComputed, VxeCarouselConstructor, ValueOf, VxeCarouselPrivateMethods } from '../../../types'

const { getConfig, getIcon, createEvent, renderEmptyElement } = VxeUI

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeCarousel',
  props: {
    modelValue: [String, Number] as PropType<VxeCarouselPropTypes.ModelValue>,
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
  emits: [
    'update:modelValue',
    'click',
    'change'
  ] as VxeCarouselEmits,
  setup(props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refWrapperElem = ref<HTMLDivElement>()

    const startName = XEUtils.uniqueId('carousel_start')
    const endName = XEUtils.uniqueId('carousel_end')

    const reactData = reactive<CarouselReactData>({
      activeName: '',
      staticItems: [],
      itemWidth: 0,
      itemHeight: 0,
      isTransition: false
    })

    const internalData: CarouselInternalData = {
      // apTimeout: undefined,
      // stopFlag: false,
      // animating: false
    }

    const refMaps: CarouselPrivateRef = {
      refElem
    }

    const computeItemList = computed(() => {
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
    })

    /**
     * 真实列表：去掉首尾克隆项
     */
    const computeRealList = computed(() => {
      const { loop } = props
      const itemList = computeItemList.value
      if (loop && itemList.length > 2) {
        return itemList.slice(1, -1)
      }
      return itemList
    })

    const computeImgList = computed(() => {
      const realList = computeRealList.value
      return realList.map(item => {
        return {
          url: item.url,
          alt: ''
        }
      })
    })

    /**
     * 当前激活项在真实列表中的索引（用于指示器高亮）
     */
    const computeActiveIndex = computed(() => {
      const { activeName } = reactData
      const realList = computeRealList.value
      if (activeName === startName) {
        return realList.length - 1
      }
      if (activeName === endName) {
        return 0
      }
      return Math.max(0, XEUtils.findIndexOf(realList, (item) => item.name === activeName))
    })

    const computeListStyle = computed(() => {
      const { vertical } = props
      const { activeName, itemWidth, itemHeight, isTransition } = reactData
      const itemList = computeItemList.value
      const activeIndex = Math.max(0, XEUtils.findIndexOf(itemList, (item) => item.name === activeName))
      const stys: Record<string, any> = {}
      // 边界重置/初始化时关闭过渡，瞬间回到真实项位置
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
    })

    const computeMaps: VxeCarouselPrivateComputed = {}

    const $xeCarousel = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeCarouselConstructor & VxeCarouselPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeCarouselEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $carousel: $xeCarousel }, params))
    }

    const emitModel = (value: any) => {
      emit('update:modelValue', value)
    }

    /**
     * 获取对外真实值
     */
    const getItemValue = (item: VxeCarouselDefines.ItemObj) => {
      return item._value ?? item.name
    }

    /**
     * 测量容器尺寸
     * - 第一层 nextTick：等 DOM 挂载完成，读取 clientWidth/Height 并赋值
     * - 第二层 nextTick：等尺寸驱动的重渲染落地，transform 更新完成
     */
    const updateStyle = () => {
      return nextTick().then(() => {
        const wrapperElem = refWrapperElem.value
        if (wrapperElem) {
          reactData.itemWidth = wrapperElem.clientWidth
          reactData.itemHeight = wrapperElem.clientHeight
        }
        return nextTick()
      })
    }

    const clickIndicatorsEvent = (evnt: Event, item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option) => {
      const { loop } = props
      const { animating } = internalData
      if (animating) {
        return
      }
      const itemList = computeItemList.value
      const realList = computeRealList.value
      const idx = XEUtils.findIndexOf(realList, (it) => it.name === item.name)
      if (idx < 0) {
        return
      }
      // 映射回克隆列表中的真实项
      const targetItem = loop && itemList.length > 2 ? itemList[idx + 1] : itemList[idx]
      if (!targetItem || targetItem.name === reactData.activeName) {
        return
      }
      const value = getItemValue(targetItem)
      internalData.animating = true
      reactData.activeName = targetItem.name
      emitModel(value)
      emit('change', { value }, evnt)
      updateStyle()
    }

    const clickItemEvent = (evnt: Event, item: VxeCarouselDefines.ItemConfig | VxeCarouselPropTypes.Option) => {
      const { showPreview, showPrintButton, showDownloadButton } = props
      const imgList = computeImgList.value
      if (showPreview) {
        openPreviewImage({
          urlList: imgList,
          showPrintButton,
          showDownloadButton
        })
      }
      dispatchEvent('click', { item }, evnt)
    }

    const initDefaultActive = () => {
      const { modelValue, loop } = props
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
        emitModel(activeName)
      }
      if (loop && realList.length > 1) {
        const itemList = computeItemList.value
        const idx = XEUtils.findIndexOf(realList, (item) => item.name === activeName)
        const targetItem = itemList[idx + 1]
        reactData.activeName = targetItem ? targetItem.name : ''
      } else {
        reactData.activeName = activeName
      }
    }

    /**
     * 无动画重置
     * 把 activeName 直接定位到真实第一张/最后一张
     */
    const resetPosition = (targetIndex: number) => {
      const itemList = computeItemList.value
      const targetItem = itemList[targetIndex]
      if (!targetItem) {
        internalData.animating = false
        return
      }
      reactData.isTransition = false
      reactData.activeName = targetItem.name
      emitModel(getItemValue(targetItem))
      nextTick(() => {
        const wrapperElem = refWrapperElem.value
        if (wrapperElem) {
          // 代码本身无作用，目的是强制 reflow，确保 transition: none 先被浏览器应用
          // eslint-disable-next-line no-unused-expressions
          wrapperElem.offsetHeight
        }
        reactData.isTransition = true
        internalData.animating = false
      })
    }

    const listTransitionendEvent = (evnt: TransitionEvent) => {
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
      const itemList = computeItemList.value
      const realCount = itemList.length - 2
      if (activeName === endName) {
        // 滚到“第一张克隆”，回到真实第一张
        resetPosition(1)
      } else if (activeName === startName) {
        // 滚到“最后一张克隆”，回到真实最后一张
        resetPosition(realCount)
      } else {
        internalData.animating = false
      }
    }

    const handlePrevNext = (isNext: boolean) => {
      const { loop } = props
      const { activeName } = reactData
      const { animating } = internalData
      if (animating) {
        return false
      }
      const itemList = computeItemList.value
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
      emitModel(getItemValue(targetItem))
      return true
    }

    const carouselMethods: CarouselMethods = {
      dispatchEvent,
      prev() {
        if (handlePrevNext(false)) {
          handleAutoPlay()
        }
        return nextTick()
      },
      next() {
        if (handlePrevNext(true)) {
          handleAutoPlay()
        }
        return nextTick()
      }
    }

    const prevEvent = (evnt: Event) => {
      if (handlePrevNext(false)) {
        const { activeName } = reactData
        const itemList = computeItemList.value
        const currentItem = itemList[XEUtils.findIndexOf(itemList, (item) => item.name === activeName)]
        if (currentItem) {
          emit('change', { value: getItemValue(currentItem) }, evnt)
        }
      }
    }

    const nextEvent = (evnt: Event) => {
      if (handlePrevNext(true)) {
        const { activeName } = reactData
        const itemList = computeItemList.value
        const currentItem = itemList[XEUtils.findIndexOf(itemList, (item) => item.name === activeName)]
        if (currentItem) {
          emit('change', { value: getItemValue(currentItem) }, evnt)
        }
      }
    }

    const stopAutoPlay = () => {
      const { apTimeout } = internalData
      internalData.stopFlag = true
      if (apTimeout) {
        clearTimeout(apTimeout)
        internalData.apTimeout = undefined
      }
    }

    const handleAutoPlay = () => {
      const { autoPlay, interval } = props
      stopAutoPlay()
      if (autoPlay) {
        internalData.stopFlag = false
        internalData.apTimeout = setTimeout(() => {
          const { stopFlag } = internalData
          if (!stopFlag) {
            handlePrevNext(true)
            // 重新调度，保证自动播放持续进行
            if (!internalData.stopFlag) {
              handleAutoPlay()
            }
          }
        }, XEUtils.toNumber(interval) || 300)
      }
    }

    const mouseenterEvent = () => {
      stopAutoPlay()
    }

    const mouseleaveEvent = () => {
      handleAutoPlay()
    }

    const carouselPrivateMethods: CarouselPrivateMethods = {}

    const callSlot = (slotFunc: any, params: any) => {
      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    }

    Object.assign($xeCarousel, carouselMethods, carouselPrivateMethods)

    const renderItemWrapper = (list: VxeCarouselDefines.ItemConfig[] | VxeCarouselPropTypes.Options) => {
      const { height } = props
      const { activeName } = reactData
      const listStyle = computeListStyle.value

      return h('div', {
        class: 'vxe-carousel--list',
        style: listStyle,
        onTransitionend: listTransitionendEvent
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
            : null,
          onClick (evnt) {
            clickItemEvent(evnt, item)
          }
        },
        defaultSlot
          ? callSlot(defaultSlot, {})
          : [
              h('img', {
                class: 'vxe-carousel--item-img',
                src: url
              })
            ]
        )
      }))
    }

    const renderIndicators = () => {
      const realList = computeRealList.value
      const activeIndex = computeActiveIndex.value
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
          onClick(evnt) {
            clickIndicatorsEvent(evnt, item)
          }
        })
      }))
    }

    const renderVN = () => {
      const { loading, height, width, showIndicators, vertical } = props
      const defaultSlot = slots.default
      const itemList = computeItemList.value

      return h('div', {
        ref: refElem,
        class: ['vxe-carousel', `is--${vertical ? 'vertical' : 'horizontal'}`],
        style: width
          ? {
              width: toCssUnit(width)
            }
          : null,
        onMouseenter: mouseenterEvent,
        onMouseleave: mouseleaveEvent
      },
      [h('div', {
        class: 'vxe-carousel--slots'
      }, defaultSlot ? defaultSlot({}) : []),
      h('div', {
        ref: refWrapperElem,
        class: 'vxe-carousel--item-wrapper',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [renderItemWrapper(itemList)]),
      showIndicators ? renderIndicators() : renderEmptyElement($xeCarousel),
      h('div', {
        class: 'vxe-carousel--btn-wrapper'
      },
      [
        h('div', {
          class: 'vxe-carousel--previous-btn',
          onClick: prevEvent
        },
        [
          h('i', {
            class: vertical ? getIcon().CAROUSEL_VERTICAL_PREVIOUS : getIcon().CAROUSEL_HORIZONTAL_PREVIOUS
          })
        ]
        ),
        h('div', {
          class: 'vxe-carousel--next-btn',
          onClick: nextEvent
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
        modelValue: loading
      })
      ]
      )
    }

    const optsFlag = ref(0)
    watch(() => (props.options ? props.options.length : -1), () => {
      optsFlag.value++
    })
    watch(() => props.options, () => {
      optsFlag.value++
    })
    watch(() => (reactData.staticItems ? reactData.staticItems.length : -1), () => {
      optsFlag.value++
    })
    watch(() => reactData.staticItems, () => {
      optsFlag.value++
    })
    watch(() => props.loop, () => {
      optsFlag.value++
    })
    watch(optsFlag, () => {
      initDefaultActive()
    })

    watch(() => props.autoPlay, () => {
      handleAutoPlay()
    })

    watch(() => props.modelValue, (val) => {
      const { loop } = props
      const { animating } = internalData
      if (animating) {
        return
      }
      const realList = computeRealList.value
      const index = XEUtils.findIndexOf(realList, (item) => item.name === val)
      if (index < 0) {
        return
      }
      const itemList = computeItemList.value
      const targetItem = loop && itemList.length > 2 ? itemList[index + 1] : itemList[index]
      if (targetItem && targetItem.name !== reactData.activeName) {
        reactData.activeName = targetItem.name
      }
    })

    initDefaultActive()

    onMounted(() => {
      updateStyle().then(() => {
        // 移除初始化时的动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            reactData.isTransition = true
            handleAutoPlay()
          })
        })
      })
    })

    onUnmounted(() => {
      stopAutoPlay()
    })

    provide('$xeCarousel', $xeCarousel)

    $xeCarousel.renderVN = renderVN

    return $xeCarousel
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
