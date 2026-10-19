import { CreateElement, VNode, PropType } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, globalMixins } from '../../ui'
import { toCssUnit } from '../../ui/src/dom'
import { getDefaultConfig } from '../../ui/src/utils'

import VxeLoadingComponent from '../../loading'

import type { ScrollbarReactData, ScrollbarInternalData, VxeScrollbarEmits, ValueOf, VxeScrollbarPropTypes, VxeComponentStyleType, VxeUseSizeComputed, VxeUseInitVScrollbarComputed } from '../../../types'

const { getConfig, createEvent, domUtils, globalResize, globalEvents, renderEmptyElement } = VxeUI

function createReactData (): ScrollbarReactData {
  return {
    yThumbHeight: 0,
    xThumbWidth: 0
  }
}

function createInternalData (): ScrollbarInternalData {
  return {
    // scrollObserver: undefined,
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
  mixins: [
    globalMixins.sizeMixin,
    globalMixins.initVScrollbarMixin
  ],
  props: {
    id: [String, Number] as PropType<VxeScrollbarPropTypes.Id>,
    viewId: [String, Number] as PropType<VxeScrollbarPropTypes.ViewId>,
    theme: {
      type: String as PropType<VxeScrollbarPropTypes.Theme>,
      default: () => getConfig().scrollbar.theme
    },
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
    fluentOverlay: {
      type: Boolean as PropType<VxeScrollbarPropTypes.FluentOverlay>,
      default: () => getConfig().scrollbar.fluentOverlay
    },
    padding: {
      type: Boolean as PropType<VxeScrollbarPropTypes.Padding>,
      default: () => getConfig().scrollbar.padding
    },
    autoHide: {
      type: Boolean as PropType<VxeScrollbarPropTypes.AutoHide>,
      default: () => getConfig().scrollbar.autoHide
    },
    visible: {
      type: Boolean as PropType<VxeScrollbarPropTypes.Visible>,
      default: () => getConfig().scrollbar.visible
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
    viewStyle: {
      type: Object as PropType<VxeScrollbarPropTypes.ViewStyle>,
      default: () => getConfig().scrollbar.viewStyle
    },
    viewClassName: {
      type: String as PropType<VxeScrollbarPropTypes.ViewClassName>,
      default: () => getConfig().scrollbar.viewClassName
    },
    viewInnerClassName: {
      type: String as PropType<VxeScrollbarPropTypes.ViewInnerClassName>,
      default: () => getConfig().scrollbar.viewInnerClassName
    },
    size: {
      type: String as PropType<VxeScrollbarPropTypes.Size>,
      default: () => getConfig().scrollbar.size || getConfig().size
    },
    /**
     * 已废弃
     * @deprecated
     */
    autoResize: {
      type: Boolean as PropType<VxeScrollbarPropTypes.AutoResize>,
      default: () => getConfig().scrollbar.autoResize
    },
    /**
     * 已废弃
     * @deprecated
     */
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
    ...({} as VxeUseSizeComputed & VxeUseInitVScrollbarComputed),
    computeWrapperStyle () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { width, height, minWidth, minHeight, maxWidth, maxHeight } = props
      const barWidth = $xeScrollbar.computeYWidth
      const barHeight = $xeScrollbar.computeXHeight
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
      if (barWidth || barHeight) {
        stys['--vxe-ui-scrollbar-y-width'] = toCssUnit(barWidth || barHeight)
        stys['--vxe-ui-scrollbar-x-height'] = toCssUnit(barHeight || barWidth)
      }
      return stys
    },
    computeXHeight () {
      const $xeScrollbar = this

      const xOpts = ($xeScrollbar as any).computeXOpts as VxeScrollbarPropTypes.XConfig
      return xOpts.height
    },
    computeYWidth () {
      const $xeScrollbar = this

      const yOpts = ($xeScrollbar as any).computeYOpts as VxeScrollbarPropTypes.YConfig
      return yOpts.width
    },
    computeXVisible () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { visible } = props
      const xOpts = ($xeScrollbar as any).computeXOpts as VxeScrollbarPropTypes.XConfig
      return getDefaultConfig(xOpts.visible, visible)
    },
    computeYVisible () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { visible } = props
      const yOpts = ($xeScrollbar as any).computeYOpts as VxeScrollbarPropTypes.YConfig
      return getDefaultConfig(yOpts.visible, visible)
    },
    computeXAutoHide () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { autoHide } = props
      const xOpts = ($xeScrollbar as any).computeXOpts as VxeScrollbarPropTypes.XConfig
      return getDefaultConfig(xOpts.autoHide, autoHide)
    },
    computeYAutoHide () {
      const $xeScrollbar = this
      const props = $xeScrollbar

      const { autoHide } = props
      const yOpts = ($xeScrollbar as any).computeYOpts as VxeScrollbarPropTypes.YConfig
      return getDefaultConfig(yOpts.autoHide, autoHide)
    },
    computeWrapperClss () {
      const $xeScrollbar = this
      const props = $xeScrollbar
      const reactData = $xeScrollbar.reactData

      const { native, theme, className, padding, fluentOverlay } = props
      const { yThumbHeight, xThumbWidth } = reactData
      const vSize = $xeScrollbar.computeSize
      const xToTop = ($xeScrollbar as any).computeXToTop as boolean
      const yToLeft = ($xeScrollbar as any).computeYToLeft as boolean
      const xVisible = ($xeScrollbar as any).computeXVisible
      const yVisible = ($xeScrollbar as any).computeYVisible
      const xAutoHide = ($xeScrollbar as any).computeXAutoHide
      const yAutoHide = ($xeScrollbar as any).computeYAutoHide
      return domUtils.buildClass([
        'vxe-scrollbar',
        vSize ? `size--${vSize}` : '',
        theme ? `theme--${theme}` : '',
        fluentOverlay ? 'is--fluent-overlay' : 'is--default-mode',
        `ov-x--${xVisible === false ? 'hidden' : 'visible'}`,
        `ov-y--${yVisible === false ? 'hidden' : 'visible'}`,
        `sx-pos--${xToTop ? 'top' : 'bottom'}`,
        `sy-pos--${yToLeft ? 'left' : 'right'}`,
        native ? 'is--native' : 'is--virtual',
        className
      ], {
        'is--padding': padding,
        'ov-x--auto-hide': xAutoHide,
        'ov-y--auto-hide': yAutoHide,
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
    },
    computeXToTop () {
      const $xeScrollbar = this

      const xOpts = $xeScrollbar.computeXOpts as VxeScrollbarPropTypes.XConfig
      return xOpts.position === 'top'
    },
    computeYToLeft () {
      const $xeScrollbar = this

      const yOpts = $xeScrollbar.computeYOpts as VxeScrollbarPropTypes.YConfig
      return yOpts.position === 'left'
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
    getScrollViewElem () {
      const $xeScrollbar = this

      const viewEl = $xeScrollbar.$refs.refViewElem as HTMLDivElement
      return viewEl || null
    },
    getScrollViewInnerElem () {
      const $xeScrollbar = this

      const viewInnerEl = $xeScrollbar.$refs.refViewInnerElem as HTMLDivElement
      return viewInnerEl || null
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

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeScrollbar = this
      const props = $xeScrollbar
      const slots = $xeScrollbar.$scopedSlots

      const { id, native, loading, viewId, viewAttrs, viewStyle } = props
      const wrapperStyle = $xeScrollbar.computeWrapperStyle
      const wrapperClss = $xeScrollbar.computeWrapperClss
      const viewClss = $xeScrollbar.computeViewClss
      const viewInnerClss = $xeScrollbar.computeViewInnerClss
      const xVisible = $xeScrollbar.computeXVisible
      const yVisible = $xeScrollbar.computeYVisible
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
          style: viewStyle,
          attrs: {
            id: viewId || null,
            ...viewAttrs
          },
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
        native || xVisible === false
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
        native || yVisible === false
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
    computeYWidth () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    computeXHeight () {
      const $xeScrollbar = this

      $xeScrollbar.reFlag++
    },
    computeXVisible () {
      const $xeScrollbar = this

      $xeScrollbar.$nextTick(() => {
        $xeScrollbar.reFlag++
      })
    },
    computeYVisible () {
      const $xeScrollbar = this

      $xeScrollbar.$nextTick(() => {
        $xeScrollbar.reFlag++
      })
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
      const scrollObserver = globalResize.create(() => {
        if (props.autoResize) {
          $xeScrollbar.reFlag++
        }
      })
      if (viewEl) {
        scrollObserver.observe(viewEl)
      }
      if (viewInnerEl) {
        scrollObserver.observe(viewInnerEl)
      }
      internalData.scrollObserver = scrollObserver
    }

    $xeScrollbar.reFlag++
    globalEvents.on($xeScrollbar, 'resize', () => {
      $xeScrollbar.reFlag++
    })
  },
  beforeDestroy () {
    const $xeScrollbar = this
    const internalData = $xeScrollbar.internalData

    const { scrollObserver } = internalData
    if (scrollObserver) {
      scrollObserver.disconnect()
    }
    globalEvents.off($xeScrollbar, 'resize')
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
