import { ref, h, reactive, computed, PropType, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getThumbOffsetSize, getThumbSize, getScrollFromClick, getScrollFromDrag } from './util'
import VxeLoadingComponent from '../../loading'

import type { ScrollbarReactData, ScrollbarInternalData, VxeScrollbarEmits, ScrollbarMethods, ScrollbarPrivateMethods, VxeScrollbarPropTypes, ValueOf, ScrollbarPrivateRef, VxeScrollbarPrivateComputed, VxeScrollbarConstructor, VxeScrollbarPrivateMethods, VxeComponentStyleType } from '../../../types'

const { getConfig, createEvent, domUtils, globalResize, renderEmptyElement } = VxeUI

function createReactData (): ScrollbarReactData {
  return {
    yThumbHeight: 0,
    xThumbWidth: 0
  }
}

function createInternalData (): ScrollbarInternalData {
  return {
    // resizeObserver: undefined,
    // isThumbDrag: false,
    thumbDragOffset: 0,
    yThumbTop: 0,
    xThumbLeft: 0,
    lastScrollTop: 0,
    lastScrollLeft: 0
  }
}

export default defineVxeComponent({
  name: 'VxeScrollbar',
  props: {
    width: [String, Number] as PropType<VxeScrollbarPropTypes.Width>,
    height: [String, Number] as PropType<VxeScrollbarPropTypes.Height>,
    minWidth: [String, Number] as PropType<VxeScrollbarPropTypes.MinWidth>,
    minHeight: [String, Number] as PropType<VxeScrollbarPropTypes.MinHeight>,
    maxWidth: [String, Number] as PropType<VxeScrollbarPropTypes.MaxWidth>,
    maxHeight: [String, Number] as PropType<VxeScrollbarPropTypes.MaxHeight>,
    loading: Boolean as PropType<VxeScrollbarPropTypes.Loading>,
    native: {
      type: Boolean as PropType<VxeScrollbarPropTypes.Native>,
      default: () => getConfig().scrollbar.native
    },
    xConfig: Object as PropType<VxeScrollbarPropTypes.XConfig>,
    yConfig: Object as PropType<VxeScrollbarPropTypes.YConfig>,
    className: String as PropType<VxeScrollbarPropTypes.ClassName>,
    viewClassName: String as PropType<VxeScrollbarPropTypes.ViewClassName>,
    autoResize: {
      type: Boolean as PropType<VxeScrollbarPropTypes.AutoResize>,
      default: () => getConfig().scrollbar.autoResize
    },
    syncResize: [Boolean, String, Number] as PropType<VxeScrollbarPropTypes.SyncResize>
  },
  emits: [
    'scroll',
    'scroll-boundary'
  ] as VxeScrollbarEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refViewElem = ref<HTMLDivElement>()
    const refViewInnerElem = ref<HTMLDivElement>()
    const refTrackXElem = ref<HTMLDivElement>()
    const refTrackYElem = ref<HTMLDivElement>()
    const refThumbXElem = ref<HTMLDivElement>()
    const refThumbYElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const computeWrapperStyle = computed(() => {
      const { width, height, minWidth, minHeight, maxWidth, maxHeight } = props
      const xOpts = computeXOpts.value
      const yOpts = computeYOpts.value
      const stys: VxeComponentStyleType = {}
      if (width) {
        stys.width = toCssUnit(width)
      }
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (minWidth) {
        stys.minWidth = toCssUnit(minWidth)
      }
      if (minHeight) {
        stys.minHeight = toCssUnit(minHeight)
      }
      if (maxWidth) {
        stys.maxWidth = toCssUnit(maxWidth)
      }
      if (maxHeight) {
        stys.maxHeight = toCssUnit(maxHeight)
      }
      if (yOpts.width) {
        stys['--vxe-ui-scrollbar-y-width'] = toCssUnit(yOpts.width)
      }
      if (xOpts.height) {
        stys['--vxe-ui-scrollbar-x-height'] = toCssUnit(xOpts.height)
      }
      return stys
    })

    const computeWrapperClss = computed(() => {
      const { native, className } = props
      const xOpts = computeXOpts.value
      const yOpts = computeYOpts.value
      return domUtils.buildClass([
        'vxe-scrollbar',
        `ov-x--${xOpts.visible || 'visible'}`,
        `ov-y--${yOpts.visible || 'visible'}`,
        native ? 'is--native' : 'is--virtual',
        className
      ], {
        'ov-x--auto-hide': xOpts.autoHide,
        'ov-y--auto-hide': yOpts.autoHide
      })
    })

    const computeViewClss = computed(() => {
      const { viewClassName } = props
      return domUtils.buildClass([
        'vxe-scrollbar--view',
        viewClassName
      ])
    })

    const computeXOpts = computed(() => {
      return Object.assign({}, getConfig().scrollbar.xConfig, props.xConfig)
    })

    const computeYOpts = computed(() => {
      return Object.assign({}, getConfig().scrollbar.yConfig, props.yConfig)
    })

    const refMaps: ScrollbarPrivateRef = {
      refElem
    }

    const computeMaps: VxeScrollbarPrivateComputed = {
    }

    const $xeScrollbar = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeScrollbarConstructor & VxeScrollbarPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeScrollbarEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $scrollbar: $xeScrollbar }, params))
    }

    const scrollbarMethods: ScrollbarMethods = {
      dispatchEvent,
      scrollTo (left: ScrollToOptions | number, top?: number) {
        const viewEl = refViewElem.value
        if (viewEl) {
          if (XEUtils.isNumber(left)) {
            viewEl.scrollTo(left, top || 0)
          } else {
            viewEl.scrollTo(left)
          }
        }
      },
      scrollIntoView () {
        const viewEl = refViewElem.value
        if (viewEl) {
          viewEl.scrollIntoView()
        }
      },
      recalculate () {
        updateThumbSize()
        updateThumbOffset()
        return nextTick()
      }
    }

    const updateThumbSize = () => {
      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const trackXEl = refTrackXElem.value
      const xThumbWidth = trackXEl ? getThumbSize(viewEl.clientWidth, viewEl.scrollWidth, trackXEl.clientWidth) : 0
      const thumbXElem = refThumbXElem.value
      if (thumbXElem) {
        thumbXElem.style.width = xThumbWidth + 'px'
      }
      reactData.xThumbWidth = xThumbWidth

      const trackYEl = refTrackYElem.value
      const yThumbHeight = trackYEl ? getThumbSize(viewEl.clientHeight, viewEl.scrollHeight, trackYEl.clientHeight) : 0
      const thumbYElem = refThumbYElem.value
      if (thumbYElem) {
        thumbYElem.style.height = yThumbHeight + 'px'
      }
      reactData.yThumbHeight = yThumbHeight
    }

    const updateThumbOffset = () => {
      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const { xThumbWidth, yThumbHeight } = reactData
      const trackXEl = refTrackXElem.value
      const thumbXElem = refThumbXElem.value
      const xThumbLeft = trackXEl && xThumbWidth ? getThumbOffsetSize(viewEl.scrollLeft, viewEl.clientWidth, viewEl.scrollWidth, trackXEl.clientWidth, xThumbWidth) : 0
      internalData.xThumbLeft = xThumbLeft
      if (thumbXElem && xThumbWidth) {
        thumbXElem.style.width = xThumbWidth + 'px'
        thumbXElem.style.transform = `translateX(${xThumbLeft}px)`
      }

      const trackYEl = refTrackYElem.value
      const thumbYElem = refThumbYElem.value
      const yThumbTop = trackYEl && yThumbHeight ? getThumbOffsetSize(viewEl.scrollTop, viewEl.clientHeight, viewEl.scrollHeight, trackYEl.clientHeight, yThumbHeight) : 0
      internalData.yThumbTop = yThumbTop
      if (thumbYElem && yThumbHeight) {
        thumbYElem.style.height = yThumbHeight + 'px'
        thumbYElem.style.transform = `translateY(${yThumbTop}px)`
      }
    }

    const scrollEvent = (evnt: Event) => {
      const { xThumbWidth, yThumbHeight } = reactData
      const { lastScrollTop, lastScrollLeft } = internalData
      const xOpts = computeXOpts.value
      const yOpts = computeYOpts.value
      const viewEl = evnt.currentTarget as HTMLDivElement
      const { scrollTop, scrollLeft, clientWidth, clientHeight, scrollHeight, scrollWidth } = viewEl
      let direction = ''
      let isTopBoundary = false
      let isBottomBoundary = false
      let isLeftBoundary = false
      let isRightBoundary = false
      if (lastScrollTop !== scrollTop) {
        const yThreshold = XEUtils.toNumber(yOpts.threshold) || 1
        if (lastScrollTop < scrollTop) {
          direction = 'bottom'
          if (yThumbHeight > 0 && scrollTop + clientHeight >= scrollHeight - yThreshold) {
            isBottomBoundary = true
          }
        } else {
          direction = 'top'
          if (yThumbHeight > 0 && scrollTop <= yThreshold) {
            isTopBoundary = true
          }
        }
      }
      if (lastScrollLeft !== scrollLeft) {
        const xThreshold = XEUtils.toNumber(xOpts.threshold) || 1
        if (lastScrollLeft < scrollLeft) {
          direction = 'right'
          if (xThumbWidth > 0 && scrollLeft + clientWidth >= scrollWidth - xThreshold) {
            isRightBoundary = true
          }
        } else {
          direction = 'left'
          if (xThumbWidth > 0 && scrollLeft <= xThreshold) {
            isLeftBoundary = true
          }
        }
      }
      updateThumbOffset()
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (isBottomBoundary || isTopBoundary || isRightBoundary || isLeftBoundary) {
        dispatchEvent('scroll-boundary', {
          direction: direction,
          isTop: isTopBoundary,
          isBottom: isBottomBoundary,
          isLeft: isLeftBoundary,
          isRight: isRightBoundary,
          scrollTop: scrollTop,
          scrollLeft: scrollLeft,
          clientWidth: clientWidth,
          clientHeight: clientHeight,
          scrollHeight: scrollHeight,
          scrollWidth: scrollWidth
        }, evnt)
      }
      dispatchEvent('scroll', {
        direction: direction,
        isTop: yThumbHeight > 0 && scrollTop <= 0,
        isBottom: yThumbHeight > 0 && scrollTop + clientHeight >= scrollHeight,
        isLeft: xThumbWidth > 0 && scrollLeft <= 0,
        isRight: xThumbWidth > 0 && scrollLeft + clientWidth >= scrollWidth,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft,
        clientWidth: clientWidth,
        clientHeight: clientHeight,
        scrollHeight: scrollHeight,
        scrollWidth: scrollWidth
      }, evnt)
    }

    const clickTrackXEvent = (evnt: MouseEvent) => {
      const trackEl = evnt.currentTarget as HTMLDivElement
      if (trackEl !== evnt.target) {
        return
      }
      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const { xThumbWidth } = reactData
      const trackRect = trackEl.getBoundingClientRect()
      viewEl.scrollTo({
        left: getScrollFromClick(evnt.clientX - trackRect.left, viewEl.clientWidth, viewEl.scrollWidth, trackEl.clientWidth, xThumbWidth),
        behavior: 'auto'
      })
    }

    const clickTrackYEvent = (evnt: MouseEvent) => {
      const trackEl = evnt.currentTarget as HTMLDivElement
      if (trackEl !== evnt.target) {
        return
      }
      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const { yThumbHeight } = reactData
      const trackRect = trackEl.getBoundingClientRect()
      viewEl.scrollTo({
        top: getScrollFromClick(evnt.clientY - trackRect.top, viewEl.clientHeight, viewEl.scrollHeight, trackEl.clientHeight, yThumbHeight),
        behavior: 'auto'
      })
    }

    const pointerdownThumbXEvent = (evnt: PointerEvent) => {
      const thumbEl = evnt.currentTarget as HTMLDivElement
      internalData.isThumbDrag = true
      thumbEl.setPointerCapture(evnt.pointerId)

      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const { xThumbWidth } = reactData
      const trackEl = thumbEl.parentElement as HTMLDivElement
      const trackRect = trackEl.getBoundingClientRect()
      const pointerPosition = evnt.clientX - trackRect.left
      // 记录 thumb 的偏移
      const thumbOffset = getThumbOffsetSize(viewEl.scrollLeft, viewEl.clientWidth, viewEl.scrollWidth, trackEl.clientWidth, xThumbWidth)
      internalData.thumbDragOffset = pointerPosition - thumbOffset
    }

    const pointermoveThumbXEvent = (evnt: PointerEvent) => {
      const thumbEl = evnt.currentTarget as HTMLDivElement
      if (!thumbEl.hasPointerCapture(evnt.pointerId)) {
        return
      }
      const { isThumbDrag, thumbDragOffset } = internalData
      if (isThumbDrag) {
        const viewEl = refViewElem.value
        if (!viewEl) {
          return
        }
        const { xThumbWidth } = reactData
        const thumbEl = evnt.currentTarget as HTMLDivElement
        const trackEl = thumbEl.parentElement as HTMLDivElement
        const trackRect = trackEl.getBoundingClientRect()
        // 更新偏移
        viewEl.scrollLeft = getScrollFromDrag(evnt.clientX - trackRect.left, thumbDragOffset, viewEl.clientWidth, viewEl.scrollWidth, trackEl.clientWidth, xThumbWidth)
      }
    }

    const cleatPointerThumbEvent = (evnt: PointerEvent) => {
      const thumbEl = evnt.currentTarget as HTMLDivElement
      thumbEl.releasePointerCapture(evnt.pointerId)
      internalData.isThumbDrag = false
    }

    const pointerdownThumbYEvent = (evnt: PointerEvent) => {
      const thumbEl = evnt.currentTarget as HTMLDivElement
      internalData.isThumbDrag = true
      thumbEl.setPointerCapture(evnt.pointerId)

      const viewEl = refViewElem.value
      if (!viewEl) {
        return
      }
      const { yThumbHeight } = reactData
      const trackEl = thumbEl.parentElement as HTMLDivElement
      const trackRect = trackEl.getBoundingClientRect()
      const pointerPosition = evnt.clientY - trackRect.top
      // 记录 thumb 的偏移
      const thumbOffset = getThumbOffsetSize(viewEl.scrollTop, viewEl.clientHeight, viewEl.scrollHeight, trackEl.clientHeight, yThumbHeight)
      internalData.thumbDragOffset = pointerPosition - thumbOffset
    }

    const pointermoveThumbYEvent = (evnt: PointerEvent) => {
      const thumbEl = evnt.currentTarget as HTMLDivElement
      if (!thumbEl.hasPointerCapture(evnt.pointerId)) {
        return
      }
      const { isThumbDrag, thumbDragOffset } = internalData
      if (isThumbDrag) {
        const viewEl = refViewElem.value
        if (!viewEl) {
          return
        }
        const { yThumbHeight } = reactData
        const thumbEl = evnt.currentTarget as HTMLDivElement
        const trackEl = thumbEl.parentElement as HTMLDivElement
        const trackRect = trackEl.getBoundingClientRect()
        // 更新偏移
        viewEl.scrollTop = getScrollFromDrag(evnt.clientY - trackRect.top, thumbDragOffset, viewEl.clientHeight, viewEl.scrollHeight, trackEl.clientHeight, yThumbHeight)
      }
    }

    const scrollbarPrivateMethods: ScrollbarPrivateMethods = {
    }

    Object.assign($xeScrollbar, scrollbarMethods, scrollbarPrivateMethods)

    const renderVN = () => {
      const { native, loading } = props
      const wrapperStyle = computeWrapperStyle.value
      const wrapperClss = computeWrapperClss.value
      const viewClss = computeViewClss.value
      const xOpts = computeXOpts.value
      const yOpts = computeYOpts.value
      const defaultSlot = slots.default
      return h('div', {
        ref: refElem,
        class: wrapperClss,
        style: wrapperStyle
      }, [
        h('div', {
          ref: refViewElem,
          class: viewClss,
          onScroll: scrollEvent
        }, [
          h('div', {
            ref: refViewInnerElem,
            class: 'vxe-scrollbar--view-inner'
          }, defaultSlot ? defaultSlot({}) : [])
        ]),
        native || xOpts.visible === 'hidden'
          ? renderEmptyElement($xeScrollbar)
          : h('div', {
            ref: refTrackXElem,
            class: 'vxe-scrollbar--track-x',
            onClick: clickTrackXEvent
          }, [
            h('div', {
              ref: refThumbXElem,
              class: 'vxe-scrollbar--thumb-x',
              onPointerdown: pointerdownThumbXEvent,
              onPointermove: pointermoveThumbXEvent,
              onPointerup: cleatPointerThumbEvent,
              onPointercancel: cleatPointerThumbEvent,
              onLostpointercapture: cleatPointerThumbEvent
            })
          ]),
        native || yOpts.visible === 'hidden'
          ? renderEmptyElement($xeScrollbar)
          : h('div', {
            ref: refTrackYElem,
            class: 'vxe-scrollbar--track-y',
            onClick: clickTrackYEvent
          }, [
            h('div', {
              ref: refThumbYElem,
              class: 'vxe-scrollbar--thumb-y',
              onPointerdown: pointerdownThumbYEvent,
              onPointermove: pointermoveThumbYEvent,
              onPointerup: cleatPointerThumbEvent,
              onPointercancel: cleatPointerThumbEvent,
              onLostpointercapture: cleatPointerThumbEvent
            })
          ]),
        h(VxeLoadingComponent, {
          class: 'vxe-scrollbar--loading',
          modelValue: loading
        })
      ])
    }

    const reFlag = ref(0)

    watch(() => props.native, () => {
      reFlag.value++
    })
    watch(() => props.syncResize, () => {
      reFlag.value++
    })
    watch(reFlag, () => {
      $xeScrollbar.recalculate().then(() => {
        $xeScrollbar.recalculate()
      })
    })

    onMounted(() => {
      const { autoResize } = props
      const viewInnerEl = refViewInnerElem.value
      if (autoResize && viewInnerEl) {
        const resizeObserver = globalResize.create(() => {
          if (props.autoResize) {
            reFlag.value++
          }
        })
        resizeObserver.observe(viewInnerEl)
        internalData.resizeObserver = resizeObserver
      }

      nextTick(() => {
        $xeScrollbar.recalculate()
      })
    })

    onBeforeUnmount(() => {
      const { resizeObserver } = internalData
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    })

    $xeScrollbar.renderVN = renderVN

    return $xeScrollbar
  },
  render () {
    return this.renderVN()
  }
})
