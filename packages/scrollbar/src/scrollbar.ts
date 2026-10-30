import { ref, h, reactive, computed, PropType, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI } from '@vxe-ui/core'
import { toCssUnit } from '../../ui/src/dom'
import { getDefaultConfig } from '../../ui/src/utils'
import VxeLoadingComponent from '../../loading'

import type { ScrollbarReactData, ScrollbarInternalData, VxeScrollbarEmits, ScrollbarMethods, ScrollbarPrivateMethods, VxeScrollbarPropTypes, ValueOf, ScrollbarPrivateRef, VxeScrollbarPrivateComputed, VxeScrollbarConstructor, VxeScrollbarPrivateMethods, VxeComponentStyleType } from '../../../types'

const { getConfig, createEvent, useFns, domUtils, globalResize, globalEvents, renderEmptyElement } = VxeUI

function createReactData(): ScrollbarReactData {
  return {
    yThumbHeight: 0,
    xThumbWidth: 0
  }
}

function createInternalData(): ScrollbarInternalData {
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
  emits: ['scroll', 'scroll-boundary'] as VxeScrollbarEmits,
  setup(props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refViewElem = ref<HTMLDivElement>()
    const refViewInnerElem = ref<HTMLDivElement>()

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const { computeSize } = useFns.useSize(props)

    const computeWrapperStyle = computed(() => {
      const { width, height, minWidth, minHeight, maxWidth, maxHeight } = props
      const barWidth = computeYWidth.value
      const barHeight = computeXHeight.value
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
    })

    const computeXHeight = computed(() => {
      const xOpts = computeXOpts.value
      return xOpts.height
    })

    const computeYWidth = computed(() => {
      const yOpts = computeYOpts.value
      return yOpts.width
    })

    const computeXVisible = computed(() => {
      const { visible } = props
      const xOpts = computeXOpts.value
      return getDefaultConfig(xOpts.visible, visible)
    })

    const computeYVisible = computed(() => {
      const { visible } = props
      const yOpts = computeYOpts.value
      return getDefaultConfig(yOpts.visible, visible)
    })

    const computeXAutoHide = computed(() => {
      const { autoHide } = props
      const xOpts = computeXOpts.value
      return getDefaultConfig(xOpts.autoHide, autoHide)
    })

    const computeYAutoHide = computed(() => {
      const { autoHide } = props
      const yOpts = computeYOpts.value
      return getDefaultConfig(yOpts.autoHide, autoHide)
    })

    const computeWrapperClss = computed(() => {
      const { native, theme, className, padding, fluentOverlay } = props
      const { yThumbHeight, xThumbWidth } = reactData
      const vSize = computeSize.value
      const xToTop = computeXToTop.value
      const yToLeft = computeYToLeft.value
      const xVisible = computeXVisible.value
      const yVisible = computeYVisible.value
      const xAutoHide = computeXAutoHide.value
      const yAutoHide = computeYAutoHide.value
      return domUtils.buildClass(
        [
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
        ],
        {
          'is--padding': padding,
          'ov-x--auto-hide': xAutoHide,
          'ov-y--auto-hide': yAutoHide,
          'overflow-y': yThumbHeight,
          'overflow-x': xThumbWidth
        }
      )
    })

    const computeViewClss = computed(() => {
      const { viewClassName } = props
      return domUtils.buildClass(['vxe-scrollbar--view', viewClassName])
    })

    const computeViewInnerClss = computed(() => {
      const { viewInnerClassName } = props
      return domUtils.buildClass(['vxe-scrollbar--view-inner', viewInnerClassName])
    })

    const computeXOpts = computed(() => {
      return Object.assign({}, getConfig().scrollbar.xConfig, props.xConfig)
    })

    const computeYOpts = computed(() => {
      return Object.assign({}, getConfig().scrollbar.yConfig, props.yConfig)
    })

    const computeXToTop = computed(() => {
      const xOpts = computeXOpts.value
      return xOpts.position === 'top'
    })

    const computeYToLeft = computed(() => {
      const yOpts = computeYOpts.value
      return yOpts.position === 'left'
    })

    const refMaps: ScrollbarPrivateRef = {
      refElem
    }

    const computeMaps: VxeScrollbarPrivateComputed = {}

    const $xeScrollbar = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeScrollbarConstructor & VxeScrollbarPrivateMethods

    const { refTrackXElem, refTrackYElem, refThumbXElem, refThumbYElem, updateThumbSize, updateThumbOffset, clickTrackXEvent, clickTrackYEvent, pointerdownThumbXEvent, pointermoveThumbXEvent, cleatPointerThumbEvent, pointerdownThumbYEvent, pointermoveThumbYEvent } = useFns.useInitVScrollbar($xeScrollbar)

    const dispatchEvent = (type: ValueOf<VxeScrollbarEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $scrollbar: $xeScrollbar }, params))
    }

    const scrollbarMethods: ScrollbarMethods = {
      dispatchEvent,
      getScrollViewElem() {
        const viewEl = refViewElem.value
        return viewEl || null
      },
      getScrollViewInnerElem() {
        const viewInnerEl = refViewInnerElem.value
        return viewInnerEl || null
      },
      scrollTo(left: ScrollToOptions | number, top?: number) {
        const viewEl = refViewElem.value
        if (viewEl) {
          if (XEUtils.isNumber(left)) {
            viewEl.scrollTo(left, top || 0)
          } else {
            viewEl.scrollTo(left)
          }
        }
      },
      scrollIntoView() {
        const viewEl = refViewElem.value
        if (viewEl) {
          viewEl.scrollIntoView()
        }
      },
      setScrollTop(top) {
        const viewEl = refViewElem.value
        if (viewEl) {
          viewEl.scrollTop = top
        }
      },
      setScrollLeft(left) {
        const viewEl = refViewElem.value
        if (viewEl) {
          viewEl.scrollLeft = left
        }
      },
      getScrollTop() {
        const viewEl = refViewElem.value
        if (viewEl) {
          return viewEl.scrollTop
        }
        return 0
      },
      getScrollLeft() {
        const viewEl = refViewElem.value
        if (viewEl) {
          return viewEl.scrollLeft
        }
        return 0
      },
      clearScroll() {
        const viewEl = refViewElem.value
        if (viewEl) {
          viewEl.scrollTop = 0
          viewEl.scrollLeft = 0
        }
      },
      recalculate() {
        updateThumbSize()
        updateThumbOffset()
        return nextTick()
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
        dispatchEvent(
          'scroll-boundary',
          {
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
          },
          evnt
        )
      }
      dispatchEvent(
        'scroll',
        {
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
        },
        evnt
      )
    }

    const scrollbarPrivateMethods: ScrollbarPrivateMethods = {}

    Object.assign($xeScrollbar, scrollbarMethods, scrollbarPrivateMethods)

    const renderVN = () => {
      const { id, native, loading, viewId, viewAttrs, viewStyle } = props
      const wrapperStyle = computeWrapperStyle.value
      const wrapperClss = computeWrapperClss.value
      const viewClss = computeViewClss.value
      const viewInnerClss = computeViewInnerClss.value
      const xVisible = computeXVisible.value
      const yVisible = computeYVisible.value
      const defaultSlot = slots.default
      return h(
        'div',
        {
          ref: refElem,
          id: id || null,
          class: wrapperClss,
          style: wrapperStyle
        },
        [
          h(
            'div',
            {
              ref: refViewElem,
              class: viewClss,
              onScroll: scrollEvent,
              id: viewId || null,
              style: viewStyle,
              ...viewAttrs
            },
            [
              h(
                'div',
                {
                  key: 'vi',
                  ref: refViewInnerElem,
                  class: viewInnerClss
                },
                defaultSlot ? defaultSlot({}) : []
              )
            ]
          ),
          native || xVisible === false
            ? renderEmptyElement($xeScrollbar)
            : h(
              'div',
              {
                ref: refTrackXElem,
                class: 'vxe-scrollbar--track-x',
                onClick: clickTrackXEvent
              },
              [
                h('div', {
                  ref: refThumbXElem,
                  class: 'vxe-scrollbar--thumb-x',
                  onPointerdown: pointerdownThumbXEvent,
                  onPointermove: pointermoveThumbXEvent,
                  onPointerup: cleatPointerThumbEvent,
                  onPointercancel: cleatPointerThumbEvent,
                  onLostpointercapture: cleatPointerThumbEvent
                })
              ]
            ),
          native || yVisible === false
            ? renderEmptyElement($xeScrollbar)
            : h(
              'div',
              {
                ref: refTrackYElem,
                class: 'vxe-scrollbar--track-y',
                onClick: clickTrackYEvent
              },
              [
                h('div', {
                  ref: refThumbYElem,
                  class: 'vxe-scrollbar--thumb-y',
                  onPointerdown: pointerdownThumbYEvent,
                  onPointermove: pointermoveThumbYEvent,
                  onPointerup: cleatPointerThumbEvent,
                  onPointercancel: cleatPointerThumbEvent,
                  onLostpointercapture: cleatPointerThumbEvent
                })
              ]
            ),
          h(VxeLoadingComponent, {
            class: 'vxe-scrollbar--loading',
            modelValue: loading
          })
        ]
      )
    }

    const reFlag = ref(0)

    watch(
      () => props.height,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.width,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.minHeight,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.minWidth,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.maxHeight,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.maxWidth,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.native,
      () => {
        reFlag.value++
      }
    )
    watch(
      () => props.syncResize,
      () => {
        reFlag.value++
      }
    )
    watch(computeYWidth, () => {
      reFlag.value++
    })
    watch(computeXHeight, () => {
      reFlag.value++
    })
    watch(computeXVisible, () => {
      nextTick(() => {
        reFlag.value++
      })
    })
    watch(computeYVisible, () => {
      nextTick(() => {
        reFlag.value++
      })
    })
    watch(reFlag, () => {
      $xeScrollbar.recalculate().then(() => {
        $xeScrollbar.recalculate()
      })
    })

    onMounted(() => {
      const { autoResize } = props
      const viewEl = refViewElem.value
      const viewInnerEl = refViewInnerElem.value
      if (autoResize) {
        const scrollObserver = globalResize.create(() => {
          if (props.autoResize) {
            reFlag.value++
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

      reFlag.value++
      globalEvents.on($xeScrollbar, 'resize', () => {
        reFlag.value++
      })
    })

    onBeforeUnmount(() => {
      const { scrollObserver } = internalData
      if (scrollObserver) {
        scrollObserver.disconnect()
      }
      globalEvents.off($xeScrollbar, 'resize')
    })

    $xeScrollbar.renderVN = renderVN

    return $xeScrollbar
  },
  render() {
    return this.renderVN()
  }
}) /* define-vxe-component end */
