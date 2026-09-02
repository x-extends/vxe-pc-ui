import { h, ref, nextTick, onBeforeUnmount, onMounted, computed, reactive, watch, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize, globalEvents } from '../../ui'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getPopupAppendElement, toCssUnit, updatePanelPlacement } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTooltipPropTypes, VxeTooltipConstructor, VxeTooltipEmits, TooltipInternalData, TooltipPrivateMethods, TooltipReactData, TooltipMethods, TooltipPrivateRef, VxeComponentStyleType, ValueOf } from '../../../types'

function createReactData (): TooltipReactData {
  return {
    target: null,
    isUpdate: false,
    visible: false,
    tipPos: null,
    tipContent: '',
    tipActive: false,
    tipTarget: null,
    tipZindex: 0,
    tipStore: {
      style: {},
      placement: '',
      arrowStyle: {}
    }
  }
}

function createInternalData (): TooltipInternalData {
  return {
    // showDelayTip: undefined
  }
}

export default defineVxeComponent({
  name: 'VxeTooltip',
  props: {
    modelValue: Boolean,
    size: {
      type: String as PropType<VxeTooltipPropTypes.Size>,
      default: () => getConfig().tooltip.size || getConfig().size
    },
    selector: [String, Element] as PropType<VxeTooltipPropTypes.Selector>,
    trigger: {
      type: String as PropType<VxeTooltipPropTypes.Trigger>,
      default: () => getConfig().tooltip.trigger || 'hover'
    },
    theme: {
      type: String as PropType<VxeTooltipPropTypes.Theme>,
      default: () => getConfig().tooltip.theme || 'dark'
    },
    content: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.Content>,
      default: null
    },
    useHtml: {
      type: Boolean as PropType<VxeTooltipPropTypes.UseHtml>,
      default: () => XEUtils.isBoolean(getConfig().tooltip.useHtml) ? getConfig().tooltip.useHtml : null
    },
    // 已废弃，请使用 useHtml
    useHTML: {
      type: Boolean as PropType<VxeTooltipPropTypes.UseHTML>,
      default: () => getConfig().tooltip.useHTML
    },
    zIndex: [String, Number] as PropType<VxeTooltipPropTypes.ZIndex>,
    popupClassName: [String, Function] as PropType<VxeTooltipPropTypes.PopupClassName>,
    width: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.Width>,
      default: () => getConfig().tooltip.Width
    },
    height: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.Height>,
      default: () => getConfig().tooltip.height
    },
    minWidth: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.MinWidth>,
      default: () => getConfig().tooltip.minWidth
    },
    minHeight: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.MinHeight>,
      default: () => getConfig().tooltip.minHeight
    },
    maxWidth: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.MaxWidth>,
      default: () => getConfig().tooltip.maxWidth
    },
    maxHeight: {
      type: [String, Number] as PropType<VxeTooltipPropTypes.MaxHeight>,
      default: () => getConfig().tooltip.maxHeight
    },
    placement: {
      type: String as PropType<VxeTooltipPropTypes.Placement>,
      default: () => getConfig().tooltip.placement
    },
    defaultPlacement: {
      type: String as PropType<VxeTooltipPropTypes.DefaultPlacement>,
      default: () => getConfig().tooltip.defaultPlacement
    },
    isArrow: {
      type: Boolean as PropType<VxeTooltipPropTypes.IsArrow>,
      default: () => getConfig().tooltip.isArrow
    },
    enterable: {
      type: Boolean as PropType<VxeTooltipPropTypes.Enterable>,
      default: () => getConfig().tooltip.enterable
    },
    enterDelay: {
      type: Number as PropType<VxeTooltipPropTypes.EnterDelay>,
      default: () => getConfig().tooltip.enterDelay
    },
    leaveDelay: {
      type: Number as PropType<VxeTooltipPropTypes.LeaveDelay>,
      default: () => getConfig().tooltip.leaveDelay
    },
    appendTo: {
      type: [String, Function] as PropType<VxeTooltipPropTypes.AppendTo>,
      default: () => getConfig().tooltip.appendTo
    }
  },
  emits: [
    'update:modelValue',
    'show',
    'hide'
  ] as VxeTooltipEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const refElem = ref<HTMLDivElement>()
    const contentWrapperfElem = ref<HTMLDivElement>()

    const computeWrapperStyle = computed(() => {
      const { width, height, minHeight, minWidth, maxHeight, maxWidth } = props
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
      return stys
    })

    const refMaps: TooltipPrivateRef = {
      refElem
    }

    const $xeTooltip = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeTooltipConstructor

    const dispatchEvent = (type: ValueOf<VxeTooltipEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tooltip: $xeTooltip }, params))
    }

    const updateValue = (value: VxeTooltipPropTypes.ModelValue) => {
      if (value !== reactData.visible) {
        reactData.visible = value
        reactData.isUpdate = true
        emit('update:modelValue', value)
      }
    }

    const updateZIndex = () => {
      const { zIndex } = props
      if (zIndex) {
        reactData.tipZindex = XEUtils.toNumber(zIndex)
      } else if (reactData.tipZindex < getLastZIndex()) {
        reactData.tipZindex = nextZIndex()
      }
    }

    const clickEvent = () => {
      if (reactData.visible) {
        $xeTooltip.close()
      } else {
        handleVisible(reactData.target || getSelectorEl(), props.content)
      }
    }

    const targetMouseenterEvent = () => {
      handleVisible(reactData.target || getSelectorEl(), props.content)
    }

    const targetMouseleaveEvent = () => {
      const { trigger, enterable, leaveDelay } = props
      reactData.tipActive = false
      if (enterable && trigger === 'hover') {
        setTimeout(() => {
          if (!reactData.tipActive) {
            $xeTooltip.close()
          }
        }, leaveDelay)
      } else {
        $xeTooltip.close()
      }
    }

    const wrapperMouseenterEvent = () => {
      reactData.tipActive = true
    }

    const wrapperMouseleaveEvent = () => {
      const { trigger, enterable, leaveDelay } = props
      reactData.tipActive = false
      if (enterable && trigger === 'hover') {
        setTimeout(() => {
          if (!reactData.tipActive) {
            $xeTooltip.close()
          }
        }, leaveDelay)
      }
    }

    const showTip = () => {
      const { appendTo } = props
      const { tipStore } = reactData
      const panelElem = refElem.value
      if (panelElem) {
        const parentNode = panelElem.parentNode
        if (!parentNode) {
          getPopupAppendElement(appendTo).appendChild(panelElem)
        }
      }
      updateValue(true)
      updateZIndex()
      tipStore.placement = 'top'
      tipStore.style = { width: 'auto', left: 0, top: 0, zIndex: props.zIndex || reactData.tipZindex }
      tipStore.arrowStyle = { left: '50%' }
      return $xeTooltip.updatePlacement()
    }

    const handleDelayFn = () => {
      internalData.showDelayTip = XEUtils.debounce(() => {
        if (reactData.tipActive) {
          showTip()
        }
      }, props.enterDelay, { leading: false, trailing: true })
    }

    const handleVisible = (target: HTMLElement | null, content?: VxeTooltipPropTypes.Content, evnt?: MouseEvent) => {
      const contentSlot = slots.content
      if (!contentSlot && (content === '' || XEUtils.eqNull(content))) {
        return nextTick()
      }
      if (target) {
        const { showDelayTip } = internalData
        const { trigger, enterDelay } = props
        if (evnt) {
          reactData.tipPos = {
            x: evnt.clientX,
            y: evnt.clientY,
            oLeft: evnt.offsetX,
            oTop: evnt.offsetY
          }
        } else {
          reactData.tipPos = null
        }
        reactData.tipActive = true
        reactData.tipTarget = target
        reactData.tipContent = content
        if (reactData.visible) {
          return $xeTooltip.updatePlacement()
        }
        if (enterDelay && trigger === 'hover') {
          if (showDelayTip) {
            showDelayTip()
          }
          dispatchEvent('show', {}, evnt || null)
        } else {
          const rest = showTip()
          dispatchEvent('show', {}, evnt || null)
          return rest
        }
      }
      return nextTick()
    }

    const getSelectorEl = () => {
      const { selector } = props
      if (selector) {
        if (XEUtils.isElement(selector)) {
          return selector as HTMLElement
        }
        if (XEUtils.isString(selector)) {
          return document.querySelector(selector) as HTMLElement
        }
      }
      return null
    }

    const updateTipStyle = () => {
      const { placement, defaultPlacement, isArrow } = props
      const { tipTarget: targetElem, tipStore, tipPos, tipZindex } = reactData
      const panelElem = refElem.value
      if (!targetElem || !panelElem) {
        return
      }
      const targetRect = targetElem.getBoundingClientRect()

      const targetWidth = targetElem.offsetWidth
      const targetHeight = targetElem.offsetHeight
      const panelWidth = panelElem.offsetWidth

      const targetLeft = targetRect.left
      const targetTop = targetRect.top

      // 支持特殊定位逻辑
      let left = 0
      let top = 0
      if (tipPos && (tipPos.oLeft || tipPos.oTop)) {
        left = targetLeft
        top = targetTop + targetHeight
        if (isArrow) {
          left = left + Math.max(8, Math.min(targetWidth - 8, tipPos.oLeft)) - panelWidth / 2
        } else {
          left = tipPos.x + 1
          top = tipPos.y + 1
        }
      }

      const ppObj = updatePanelPlacement(targetElem, panelElem, {
        defaultTop: top,
        defaultLeft: left,
        placement: placement,
        defaultPlacement: defaultPlacement,
        isMinWidth: false,
        teleportTo: true
      })
      const panelStyle = Object.assign(ppObj.style, {
        zIndex: tipZindex
      })
      tipStore.placement = ppObj.placement
      tipStore.style = panelStyle
      tipStore.arrowStyle.left = ppObj.arrowLeft ? `${ppObj.arrowLeft}px` : ''
    }

    const tooltipMethods: TooltipMethods = {
      dispatchEvent,
      openByEvent (evnt: Event, target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
        return handleVisible(target || reactData.target as HTMLElement || getSelectorEl(), content, evnt as MouseEvent)
      },
      open (target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
        return handleVisible(target || reactData.target as HTMLElement || getSelectorEl(), content)
      },
      close () {
        reactData.tipPos = null
        reactData.tipTarget = null
        reactData.tipActive = false
        Object.assign(reactData.tipStore, {
          style: {},
          placement: '',
          arrowStyle: null
        })
        updateValue(false)
        dispatchEvent('hide', {}, null)
        return nextTick()
      },
      toVisible (target: HTMLElement, content?: VxeTooltipPropTypes.Content) {
        return handleVisible(target, content)
      },
      updatePlacement () {
        updateTipStyle()
        return nextTick().then(updateTipStyle)
      },
      isActived () {
        return reactData.tipActive
      },
      setActived (active) {
        reactData.tipActive = !!active
      }
    }

    const wheelEvent = (evnt: Event) => {
      evnt.stopPropagation()
    }

    const handleGlobalScrollEvent = () => {
      if (reactData.visible) {
        $xeTooltip.updatePlacement()
      }
    }

    const handleGlobalBlurEvent = () => {
      $xeTooltip.close()
    }

    const tooltipPrivateMethods: TooltipPrivateMethods = {
      handleCloseEvent: targetMouseleaveEvent
    }

    Object.assign($xeTooltip, tooltipMethods, tooltipPrivateMethods)

    const renderContent = () => {
      const { useHtml, useHTML } = props
      const { tipContent } = reactData
      const wrapperStyle = computeWrapperStyle.value
      const contentSlot = slots.content
      const contVNs: VNode[] = []
      if (contentSlot) {
        contVNs.push(
          h('div', {
            key: 'ct'
          }, getSlotVNs(contentSlot({})))
        )
      } else if (XEUtils.isBoolean(useHtml) ? useHtml : useHTML) {
        contVNs.push(
          h('div', {
            key: 'ch',
            innerHTML: tipContent
          })
        )
      } else {
        contVNs.push(h('span', {
          key: 'cd'
        }, `${tipContent}`))
      }
      return h('div', {
        key: 3,
        ref: contentWrapperfElem,
        class: 'vxe-tooltip--content',
        style: wrapperStyle
      }, contVNs)
    }

    const renderVN = () => {
      const { popupClassName, theme, isArrow, enterable } = props
      const { tipActive, visible, tipStore } = reactData
      const defaultSlot = slots.default
      const vSize = computeSize.value
      let ons
      if (enterable) {
        ons = {
          onMouseenter: wrapperMouseenterEvent,
          onMouseleave: wrapperMouseleaveEvent
        }
      }
      return h('div', {
        ref: refElem,
        class: ['vxe-tooltip--wrapper', `theme--${theme}`, popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $tooltip: $xeTooltip }) : popupClassName) : '', {
          [`size--${vSize}`]: vSize,
          [`placement--${tipStore.placement}`]: tipStore.placement,
          'is--enterable': enterable,
          'is--visible': visible,
          'is--arrow': isArrow,
          'is--active': tipActive
        }],
        style: tipStore.style,
        ...ons
      }, [
        h('div', {
          key: 'tby',
          class: 'vxe-tooltip--body'
        }, [
          renderContent(),
          h('div', {
            class: 'vxe-tooltip--arrow',
            style: tipStore.arrowStyle
          })
        ]),
        ...(defaultSlot ? getSlotVNs(defaultSlot({})) : [])
      ])
    }

    watch(() => props.enterDelay, () => {
      handleDelayFn()
    })

    watch(() => props.content, (val) => {
      reactData.tipContent = val
    })

    watch(() => props.modelValue, (val) => {
      if (!reactData.isUpdate) {
        if (val) {
          handleVisible(reactData.target || getSelectorEl(), props.content)
        } else {
          $xeTooltip.close()
        }
      }
      reactData.isUpdate = false
    })

    handleDelayFn()

    onMounted(() => {
      const contentWrapperfEl = contentWrapperfElem.value
      if (contentWrapperfEl) {
        contentWrapperfEl.addEventListener('wheel', wheelEvent, { passive: false })
      }
      nextTick(() => {
        const { trigger, content } = props
        const panelElem = refElem.value
        if (panelElem) {
          const parentNode = panelElem.parentNode
          if (parentNode) {
            reactData.tipContent = content
            reactData.tipZindex = nextZIndex()
            XEUtils.arrayEach(panelElem.children, (elem, index) => {
              if (index) {
                parentNode.insertBefore(elem, panelElem)
                if (!reactData.target) {
                  reactData.target = elem as HTMLElement
                }
              }
            })
            parentNode.removeChild(panelElem)
            const { target } = reactData
            if (target) {
              if (trigger === 'hover') {
                target.onmouseenter = targetMouseenterEvent
                target.onmouseleave = targetMouseleaveEvent
              } else if (trigger === 'click') {
                target.onclick = clickEvent
              }
            }
            if (props.modelValue) {
              handleVisible(target || getSelectorEl(), content)
            }
          }
        }
      })
      globalEvents.on($xeTooltip, 'blur', handleGlobalBlurEvent)
      globalEvents.on($xeTooltip, 'scroll', handleGlobalScrollEvent)
    })

    onBeforeUnmount(() => {
      const { target } = reactData
      const panelElem = refElem.value
      if (target) {
        target.onmouseenter = null
        target.onmouseleave = null
        target.onclick = null
      }
      const contentWrapperfEl = contentWrapperfElem.value
      if (contentWrapperfEl) {
        contentWrapperfEl.removeEventListener('wheel', wheelEvent)
      }
      if (panelElem) {
        const parentNode = panelElem.parentNode
        if (parentNode) {
          parentNode.removeChild(panelElem)
        }
      }
      globalEvents.off($xeTooltip, 'blur')
      globalEvents.off($xeTooltip, 'scroll')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeTooltip.renderVN = renderVN

    return $xeTooltip
  },
  render () {
    return this.renderVN()
  }
})
