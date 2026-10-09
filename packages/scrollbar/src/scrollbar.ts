import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getThumbOffsetSize, getThumbSize, getScrollFromClick, getScrollFromDrag } from './util'
import VxeLoadingComponent from '../../loading'

import type { ScrollbarReactData, ScrollbarInternalData, VxeScrollbarEmits, ValueOf, VxeScrollbarPropTypes, VxeComponentStyleType } from '../../../types'

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

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeScrollbar',
  props: {
    id: [String, Number] as PropType<VxeScrollbarPropTypes.Id>,
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
    className: {
      type: String as PropType<VxeScrollbarPropTypes.ClassName>,
      default: () => getConfig().scrollbar.className
    },
    viewAttrs: {
      type: Object as PropType<VxeScrollbarPropTypes.ViewAttrs>,
      default: () => getConfig().scrollbar.viewAttrs
    },
    viewClassName: {
      type: String as PropType<VxeScrollbarPropTypes.ViewClassName>,
      default: () => getConfig().scrollbar.viewClassName
    },
    viewInnerClassName: {
      type: String as PropType<VxeScrollbarPropTypes.ViewInnerClassName>,
      default: () => getConfig().scrollbar.viewInnerClassName
    },
    autoResize: {
      type: Boolean as PropType<VxeScrollbarPropTypes.AutoResize>,
      default: () => getConfig().scrollbar.autoResize
    },
    syncResize: [Boolean, String, Number] as PropType<VxeScrollbarPropTypes.SyncResize>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()

    return {
      ...({} as {
        internalData: ScrollbarInternalData
      }),
      xID,
      reactData,

      reFlag: 0
    }
  },
  computed: {
    computeWrapperStyle () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { width, height, minWidth, minHeight, maxWidth, maxHeight } = props
      const xOpts = $xeScrollbar.computeXOpts
      const yOpts = $xeScrollbar.computeYOpts
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
    },
    computeWrapperClss () {
      const $xeScrollbar = this
      const props = $xeScrollbar
      const reactData = $xeScrollbar.reactData

      const { native, className } = props
      const { yThumbHeight, xThumbWidth } = reactData
      const xOpts = ($xeScrollbar as any).computeXOpts as VxeScrollbarPropTypes.XConfig
      const yOpts = ($xeScrollbar as any).computeYOpts as VxeScrollbarPropTypes.YConfig
      return domUtils.buildClass([
        'vxe-scrollbar',
        `ov-x--${xOpts.visible || 'visible'}`,
        `ov-y--${yOpts.visible || 'visible'}`,
        native ? 'is--native' : 'is--virtual',
        className
      ], {
        'ov-x--auto-hide': xOpts.autoHide,
        'ov-y--auto-hide': yOpts.autoHide,
        'overflow-y': yThumbHeight,
        'overflow-x': xThumbWidth
      })
    },
    computeViewClss () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { viewClassName } = props
      return domUtils.buildClass([
        'vxe-scrollbar--view',
        viewClassName
      ])
    },
    computeViewInnerClss () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { viewInnerClassName } = props
      return domUtils.buildClass([
        'vxe-scrollbar--view-inner',
        viewInnerClassName
      ])
    },
    computeXOpts () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      return Object.assign({}, getConfig().scrollbar.xConfig, props.xConfig)
    },
    computeYOpts () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      return Object.assign({}, getConfig().scrollbar.yConfig, props.yConfig)
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeScrollbarEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeScrollbar = this
      $xeScrollbar.$emit(type, createEvent(evnt, { $scrollbar: $xeScrollbar }, params))
    },
    scrollTo (left: ScrollToOptions | number, top?: number) {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        if (XEUtils.isNumber(left)) {
          viewEl.scrollTo(left, top || 0)
        } else {
          viewEl.scrollTo(left)
        }
      }
    },
    scrollIntoView () {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        viewEl.scrollIntoView()
      }
    },
    setScrollTop (top: number) {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        viewEl.scrollTop = top
      }
    },
    setScrollLeft (left: number) {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        viewEl.scrollLeft = left
      }
    },
    getScrollTop () {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        return viewEl.scrollTop
      }
      return 0
    },
    getScrollLeft () {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        return viewEl.scrollLeft
      }
      return 0
    },
    clearScroll () {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (viewEl) {
        viewEl.scrollTop = 0
        viewEl.scrollLeft = 0
      }
    },
    recalculate () {
      const $xeScrollbar = this

      $xeScrollbar.updateThumbSize()
      $xeScrollbar.updateThumbOffset()
      return $xeScrollbar.$nextTick()
    },
    updateThumbSize () {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (!viewEl) {
        return
      }
      const trackXEl = $xeScrollbar.$refs.refTrackXElem as HTMLDivElement
      const xThumbWidth = trackXEl ? getThumbSize(viewEl.clientWidth, viewEl.scrollWidth, trackXEl.clientWidth) : 0
      const thumbXElem = $xeScrollbar.$refs.refThumbXElem as HTMLDivElement
      if (thumbXElem) {
        thumbXElem.style.width = xThumbWidth + 'px'
      }
      reactData.xThumbWidth = xThumbWidth

      const trackYEl = $xeScrollbar.$refs.refTrackYElem as HTMLDivElement
      const yThumbHeight = trackYEl ? getThumbSize(viewEl.clientHeight, viewEl.scrollHeight, trackYEl.clientHeight) : 0
      const thumbYElem = $xeScrollbar.$refs.refThumbYElem as HTMLDivElement
      if (thumbYElem) {
        thumbYElem.style.height = yThumbHeight + 'px'
      }
      reactData.yThumbHeight = yThumbHeight
    },
    updateThumbOffset () {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (!viewEl) {
        return
      }
      const { xThumbWidth, yThumbHeight } = reactData
      const trackXEl = $xeScrollbar.$refs.refTrackXElem as HTMLDivElement
      const thumbXElem = $xeScrollbar.$refs.refThumbXElem as HTMLDivElement
      const xThumbLeft = trackXEl && xThumbWidth ? getThumbOffsetSize(viewEl.scrollLeft, viewEl.clientWidth, viewEl.scrollWidth, trackXEl.clientWidth, xThumbWidth) : 0
      internalData.xThumbLeft = xThumbLeft
      if (thumbXElem && xThumbWidth) {
        thumbXElem.style.width = xThumbWidth + 'px'
        thumbXElem.style.transform = `translateX(${xThumbLeft}px)`
      }

      const trackYEl = $xeScrollbar.$refs.refTrackYElem as HTMLDivElement
      const thumbYElem = $xeScrollbar.$refs.refThumbYElem as HTMLDivElement
      const yThumbTop = trackYEl && yThumbHeight ? getThumbOffsetSize(viewEl.scrollTop, viewEl.clientHeight, viewEl.scrollHeight, trackYEl.clientHeight, yThumbHeight) : 0
      internalData.yThumbTop = yThumbTop
      if (thumbYElem && yThumbHeight) {
        thumbYElem.style.height = yThumbHeight + 'px'
        thumbYElem.style.transform = `translateY(${yThumbTop}px)`
      }
    },
    scrollEvent (evnt: Event) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const { xThumbWidth, yThumbHeight } = reactData
      const { lastScrollTop, lastScrollLeft } = internalData
      const xOpts = $xeScrollbar.computeXOpts
      const yOpts = $xeScrollbar.computeYOpts
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
      $xeScrollbar.updateThumbOffset()
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (isBottomBoundary || isTopBoundary || isRightBoundary || isLeftBoundary) {
        $xeScrollbar.dispatchEvent('scroll-boundary', {
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
      $xeScrollbar.dispatchEvent('scroll', {
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
    },
    clickTrackXEvent (evnt: MouseEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData

      const trackEl = evnt.currentTarget as HTMLDivElement
      if (trackEl !== evnt.target) {
        return
      }
      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (!viewEl) {
        return
      }
      const { xThumbWidth } = reactData
      const trackRect = trackEl.getBoundingClientRect()
      viewEl.scrollTo({
        left: getScrollFromClick(evnt.clientX - trackRect.left, viewEl.clientWidth, viewEl.scrollWidth, trackEl.clientWidth, xThumbWidth),
        behavior: 'auto'
      })
    },
    clickTrackYEvent (evnt: MouseEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData

      const trackEl = evnt.currentTarget as HTMLDivElement
      if (trackEl !== evnt.target) {
        return
      }
      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      if (!viewEl) {
        return
      }
      const { yThumbHeight } = reactData
      const trackRect = trackEl.getBoundingClientRect()
      viewEl.scrollTo({
        top: getScrollFromClick(evnt.clientY - trackRect.top, viewEl.clientHeight, viewEl.scrollHeight, trackEl.clientHeight, yThumbHeight),
        behavior: 'auto'
      })
    },
    pointerdownThumbXEvent (evnt: PointerEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const thumbEl = evnt.currentTarget as HTMLDivElement
      internalData.isThumbDrag = true
      thumbEl.setPointerCapture(evnt.pointerId)

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
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
    },
    pointermoveThumbXEvent (evnt: PointerEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const { isThumbDrag, thumbDragOffset } = internalData
      if (isThumbDrag) {
        const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
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
    },
    cleatPointerThumbEvent (evnt: PointerEvent) {
      const $xeScrollbar = this
      const internalData = $xeScrollbar.internalData

      const thumbEl = evnt.currentTarget as HTMLDivElement
      thumbEl.releasePointerCapture(evnt.pointerId)
      internalData.isThumbDrag = false
    },
    pointerdownThumbYEvent (evnt: PointerEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const thumbEl = evnt.currentTarget as HTMLDivElement
      internalData.isThumbDrag = true
      thumbEl.setPointerCapture(evnt.pointerId)

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
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
    },
    pointermoveThumbYEvent (evnt: PointerEvent) {
      const $xeScrollbar = this
      const reactData = $xeScrollbar.reactData
      const internalData = $xeScrollbar.internalData

      const { isThumbDrag, thumbDragOffset } = internalData
      if (isThumbDrag) {
        const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
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
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeScrollbar = this
      const props = $xeScrollbar
      const slots = $xeScrollbar.$scopedSlots

      const { id, native, loading, viewAttrs } = props
      const wrapperStyle = $xeScrollbar.computeWrapperStyle
      const wrapperClss = $xeScrollbar.computeWrapperClss
      const viewClss = $xeScrollbar.computeViewClss
      const viewInnerClss = $xeScrollbar.computeViewInnerClss
      const xOpts = $xeScrollbar.computeXOpts
      const yOpts = $xeScrollbar.computeYOpts
      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        attrs: {
          id: id || null
        },
        class: wrapperClss,
        style: wrapperStyle
      }, [
        h('div', {
          ref: 'refViewElem',
          class: viewClss,
          attrs: viewAttrs,
          on: {
            scroll: $xeScrollbar.scrollEvent
          }
        }, [
          h('div', {
            key: 'vi',
            ref: 'refViewInnerElem',
            class: viewInnerClss
          }, defaultSlot ? defaultSlot({}) : [])
        ]),
        native || xOpts.visible === 'hidden'
          ? renderEmptyElement($xeScrollbar)
          : h('div', {
            ref: 'refTrackXElem',
            class: 'vxe-scrollbar--track-x',
            on: {
              click: $xeScrollbar.clickTrackXEvent
            }
          }, [
            h('div', {
              ref: 'refThumbXElem',
              class: 'vxe-scrollbar--thumb-x',
              on: {
                pointerdown: $xeScrollbar.pointerdownThumbXEvent,
                pointermove: $xeScrollbar.pointermoveThumbXEvent,
                pointerup: $xeScrollbar.cleatPointerThumbEvent,
                pointercancel: $xeScrollbar.cleatPointerThumbEvent,
                lostpointercapture: $xeScrollbar.cleatPointerThumbEvent
              }
            })
          ]),
        native || yOpts.visible === 'hidden'
          ? renderEmptyElement($xeScrollbar)
          : h('div', {
            ref: 'refTrackYElem',
            class: 'vxe-scrollbar--track-y',
            on: {
              click: $xeScrollbar.clickTrackYEvent
            }
          }, [
            h('div', {
              ref: 'refThumbYElem',
              class: 'vxe-scrollbar--thumb-y',
              on: {
                pointerdown: $xeScrollbar.pointerdownThumbYEvent,
                pointermove: $xeScrollbar.pointermoveThumbYEvent,
                pointerup: $xeScrollbar.cleatPointerThumbEvent,
                pointercancel: $xeScrollbar.cleatPointerThumbEvent,
                lostpointercapture: $xeScrollbar.cleatPointerThumbEvent
              }
            })
          ]),
        h(VxeLoadingComponent, {
          class: 'vxe-scrollbar--loading',
          props: {
            value: loading
          }
        })
      ])
    }
  },
  watch: {
    height () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    width () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    minHeight () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    minWidth () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    maxHeight () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    maxWidth () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    native () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    syncResize () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    reFlag () {
      const $xeScrollbar = this

      $xeScrollbar.recalculate().then(() => {
        $xeScrollbar.recalculate()
      })
    }
  },
  created () {
    const $xeScrollbar = this

    $xeScrollbar.internalData = createInternalData()
  },
  mounted () {
    const $xeScrollbar = this
    const props = $xeScrollbar
    const internalData = $xeScrollbar.internalData

    const { autoResize } = props
    const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
    const viewInnerEl = $xeScrollbar.$refs.refViewInnerElem as HTMLDivElement
    if (autoResize) {
      const resizeObserver = globalResize.create(() => {
        if (props.autoResize) {
          $xeScrollbar.reFlag++
        }
      })
      if (viewEl) {
        resizeObserver.observe(viewEl)
      }
      if (viewInnerEl) {
        resizeObserver.observe(viewInnerEl)
      }
      internalData.resizeObserver = resizeObserver
    }

    $xeScrollbar.reFlag++
  },
  beforeDestroy () {
    const $xeScrollbar = this
    const internalData = $xeScrollbar.internalData

    const { resizeObserver } = internalData
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  },
  destroyed () {
    const $xeScrollbar = this
    const reactData = $xeScrollbar.reactData
    const internalData = $xeScrollbar.internalData

    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
