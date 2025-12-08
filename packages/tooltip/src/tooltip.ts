import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { toCssUnit } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTooltipPropTypes, VxeTooltipEmits, TooltipReactData, TooltipInternalData, VxeComponentSizeType, ValueOf, VxeComponentStyleType } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTooltip',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    value: Boolean,
    size: {
      type: String as PropType<VxeTooltipPropTypes.Size>,
      default: () => getConfig().tooltip.size || getConfig().size
    },
    selector: String as PropType<VxeTooltipPropTypes.Selector>,
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
    useHTML: Boolean as PropType<VxeTooltipPropTypes.UseHTML>,
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
    }
  },
  data () {
    const reactData: TooltipReactData = {
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
    const internalData: TooltipInternalData = {
    }
    return {
      xID: XEUtils.uniqueId(),
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeWrapperStyle () {
      const $xeTooltip = this
      const props = $xeTooltip

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
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTooltipEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTooltip = this
      $xeTooltip.$emit(type, createEvent(evnt, { $tooltip: $xeTooltip }, params))
    },
    emitModel  (value: any) {
      const $xeTooltip = this

      const { _events } = $xeTooltip as any
      $xeTooltip.$emit('input', value)
      if (_events && _events.modelValue) {
        $xeTooltip.$emit('modelValue', value)
      } else {
        $xeTooltip.$emit('model-value', value)
      }
    },
    getSelectorEl  () {
      const $xeTooltip = this
      const props = $xeTooltip

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
    },
    openByEvent (evnt: Event, target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      return $xeTooltip.handleVisible(target || reactData.target as HTMLElement || $xeTooltip.getSelectorEl(), content, evnt as MouseEvent)
    },
    open (target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      return $xeTooltip.handleVisible(target || reactData.target as HTMLElement || $xeTooltip.getSelectorEl(), content)
    },
    close () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      reactData.tipPos = null
      reactData.tipTarget = null
      reactData.tipActive = false
      Object.assign(reactData.tipStore, {
        style: {},
        placement: '',
        arrowStyle: null
      })
      $xeTooltip.updateValue(false)
      return $xeTooltip.$nextTick()
    },
    toVisible (target: HTMLElement, content?: VxeTooltipPropTypes.Content) {
      const $xeTooltip = this

      return $xeTooltip.handleVisible(target, content)
    },
    updatePlacement () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      const { visible, tipTarget } = reactData
      let el = $xeTooltip.$refs.refElem as HTMLElement
      if (visible && tipTarget && el) {
        $xeTooltip.updateTipStyle()
      }
      return $xeTooltip.$nextTick().then(() => {
        const { tipTarget } = reactData
        el = $xeTooltip.$refs.refElem as HTMLElement
        if (tipTarget && el) {
          $xeTooltip.updateTipStyle()
          return $xeTooltip.$nextTick().then(() => {
            $xeTooltip.updateTipStyle()
          })
        }
      })
    },
    isActived () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      return reactData.tipActive
    },
    setActived (active: boolean) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      reactData.tipActive = !!active
    },
    updateTipStyle () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      const { isArrow } = props
      const { tipTarget: targetElem, tipStore, tipPos } = reactData
      let top: number | '' = ''
      let left: number | '' = ''
      let panelPlacement: 'top' | 'bottom' = 'bottom'
      let arrowLeft: number | '' = ''
      const panelElem = $xeTooltip.$refs.refElem as HTMLElement
      if (panelElem && targetElem) {
        const documentElement = document.documentElement
        const bodyElem = document.body
        const targetWidth = targetElem.offsetWidth
        const targetHeight = targetElem.offsetHeight
        const panelHeight = panelElem.offsetHeight
        const panelWidth = panelElem.offsetWidth

        const targetRect = targetElem.getBoundingClientRect()
        const visibleHeight = documentElement.clientHeight || bodyElem.clientHeight
        const visibleWidth = documentElement.clientWidth || bodyElem.clientWidth

        const marginSize = 6
        top = targetRect.top + targetHeight
        left = targetRect.left
        if (tipPos && (tipPos.oLeft || tipPos.oTop)) {
          if (isArrow) {
            left = left + Math.max(8, Math.min(targetWidth - 8, tipPos.oLeft)) - panelWidth / 2
          } else {
            left = tipPos.x + 1
            top = tipPos.y + 1
          }
        } else {
          left = targetRect.left + (targetWidth - panelWidth) / 2
        }
        // 如果下面不够放，则向上
        if (top + panelHeight + marginSize > visibleHeight) {
          panelPlacement = 'top'
          top = targetRect.top - panelHeight
        }
        // 如果上面不够放，则向下（优先）
        if (top < marginSize) {
          panelPlacement = 'bottom'
          top = targetRect.top + targetHeight
        }
        // 如果溢出右边
        if (left + panelWidth + marginSize > visibleWidth) {
          left -= left + panelWidth + marginSize - visibleWidth
        }
        // 如果溢出左边
        if (left < marginSize) {
          left = marginSize
        }

        // 箭头
        if (left === targetRect.left) {
          if (targetWidth <= panelWidth) {
            arrowLeft = targetWidth / 2
          }
        } else if (left < targetRect.left) {
          if (left + panelWidth > targetRect.left + targetWidth) {
            arrowLeft = (targetRect.left - left) + targetWidth / 2
          } else {
            arrowLeft = (targetRect.left - left) + (panelWidth - (targetRect.left - left)) / 2
          }
        }

        tipStore.placement = panelPlacement
        tipStore.style.top = `${top}px`
        tipStore.style.left = `${left}px`
        tipStore.arrowStyle.left = `${arrowLeft}px`
      }
    },
    updateValue (value: VxeTooltipPropTypes.ModelValue) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      if (value !== reactData.visible) {
        reactData.visible = value
        reactData.isUpdate = true
        $xeTooltip.emitModel(value)
      }
    },
    updateZindex () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      if (reactData.tipZindex < getLastZIndex()) {
        reactData.tipZindex = nextZIndex()
      }
    },
    clickEvent  () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      if (reactData.visible) {
        $xeTooltip.close()
      } else {
        $xeTooltip.handleVisible(reactData.target || $xeTooltip.getSelectorEl(), props.content)
      }
    },
    targetMouseenterEvent  () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      $xeTooltip.handleVisible(reactData.target || $xeTooltip.getSelectorEl(), props.content)
    },
    targetMouseleaveEvent () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

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
    },
    wrapperMouseenterEvent  () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      reactData.tipActive = true
    },
    wrapperMouseleaveEvent () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      const { trigger, enterable, leaveDelay } = props
      reactData.tipActive = false
      if (enterable && trigger === 'hover') {
        setTimeout(() => {
          if (!reactData.tipActive) {
            $xeTooltip.close()
          }
        }, leaveDelay)
      }
    },
    showTip () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      const { tipStore } = reactData
      const el = $xeTooltip.$refs.refElem as HTMLElement
      if (el) {
        const parentNode = el.parentNode
        if (!parentNode) {
          document.body.appendChild(el)
        }
      }
      $xeTooltip.updateValue(true)
      $xeTooltip.updateZindex()
      tipStore.placement = 'top'
      tipStore.style = { width: 'auto', left: 0, top: 0, zIndex: props.zIndex || reactData.tipZindex }
      tipStore.arrowStyle = { left: '50%' }
      return $xeTooltip.updatePlacement()
    },
    handleDelayFn () {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData
      const internalData = $xeTooltip.internalData

      internalData.showDelayTip = XEUtils.debounce(() => {
        if (reactData.tipActive) {
          $xeTooltip.showTip()
        }
      }, props.enterDelay, { leading: false, trailing: true })
    },
    handleVisible (target: HTMLElement | null, content?: VxeTooltipPropTypes.Content, evnt?: MouseEvent) {
      const $xeTooltip = this
      const props = $xeTooltip
      const slots = $xeTooltip.$scopedSlots
      const reactData = $xeTooltip.reactData
      const internalData = $xeTooltip.internalData

      const contentSlot = slots.content
      if (!contentSlot && (content === '' || XEUtils.eqNull(content))) {
        return $xeTooltip.$nextTick()
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
        } else {
          return $xeTooltip.showTip()
        }
      }
      return $xeTooltip.$nextTick()
    },
    wheelEvent (evnt: Event) {
      evnt.stopPropagation()
    },

    //
    // Render
    //
    renderContent (h: CreateElement) {
      const $xeTooltip = this
      const props = $xeTooltip
      const slots = $xeTooltip.$scopedSlots
      const reactData = $xeTooltip.reactData

      const { useHTML } = props
      const { tipContent } = reactData
      const wrapperStyle = $xeTooltip.computeWrapperStyle
      const contentSlot = slots.content
      const contVNs: VNode[] = []
      if (contentSlot) {
        contVNs.push(
          h('div', {
            key: 1
          }, getSlotVNs(contentSlot({})))
        )
      } else if (useHTML) {
        contVNs.push(
          h('div', {
            key: 2,
            props: {
              innerHTML: tipContent
            }
          })
        )
      } else {
        contVNs.push(h('span', {
          key: 3
        }, `${tipContent}`))
      }
      return h('div', {
        key: 3,
        ref: 'contentWrapperfElem',
        class: 'vxe-tooltip--content',
        style: wrapperStyle
      }, contVNs)
    },
    renderVN (h: CreateElement): VNode {
      const $xeTooltip = this
      const props = $xeTooltip
      const slots = $xeTooltip.$scopedSlots
      const reactData = $xeTooltip.reactData

      const { popupClassName, theme, isArrow, enterable } = props
      const { tipActive, visible, tipStore } = reactData
      const defaultSlot = slots.default
      const vSize = $xeTooltip.computeSize
      let ons
      if (enterable) {
        ons = {
          mouseenter: $xeTooltip.wrapperMouseenterEvent,
          mouseleave: $xeTooltip.wrapperMouseleaveEvent
        }
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-tooltip--wrapper', `theme--${theme}`, popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $tooltip: $xeTooltip }) : popupClassName) : '', {
          [`size--${vSize}`]: vSize,
          [`placement--${tipStore.placement}`]: tipStore.placement,
          'is--enterable': enterable,
          'is--visible': visible,
          'is--arrow': isArrow,
          'is--active': tipActive
        }],
        style: tipStore.style,
        on: ons
      }, [
        h('div', {
          key: 'tby',
          class: 'vxe-tooltip--body'
        }, [
          $xeTooltip.renderContent(h),
          h('div', {
            class: 'vxe-tooltip--arrow',
            style: tipStore.arrowStyle
          })
        ]),
        ...(defaultSlot ? getSlotVNs(defaultSlot({})) : [])
      ])
    }
  },
  watch: {
    content (val) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      reactData.tipContent = val
    },
    value (val) {
      const $xeTooltip = this
      const props = $xeTooltip
      const reactData = $xeTooltip.reactData

      if (!reactData.isUpdate) {
        if (val) {
          $xeTooltip.handleVisible(reactData.target || $xeTooltip.getSelectorEl(), props.content)
        } else {
          $xeTooltip.close()
        }
      }
      reactData.isUpdate = false
    },
    enterDelay () {
      const $xeTooltip = this

      $xeTooltip.handleDelayFn()
    }
  },
  created () {
    const $xeTooltip = this

    $xeTooltip.handleDelayFn()
  },
  mounted () {
    const $xeTooltip = this
    const props = $xeTooltip
    const reactData = $xeTooltip.reactData

    const contentWrapperfEl = $xeTooltip.$refs.contentWrapperfElem as HTMLElement
    if (contentWrapperfEl) {
      contentWrapperfEl.addEventListener('wheel', $xeTooltip.wheelEvent, { passive: false })
    }
    $xeTooltip.$nextTick(() => {
      const { trigger, content } = props
      const wrapperElem = $xeTooltip.$refs.refElem as HTMLElement
      if (wrapperElem) {
        const parentNode = wrapperElem.parentNode
        if (parentNode) {
          reactData.tipContent = content
          reactData.tipZindex = nextZIndex()
          XEUtils.arrayEach(wrapperElem.children, (elem, index) => {
            if (index) {
              parentNode.insertBefore(elem, wrapperElem)
              if (!reactData.target) {
                reactData.target = elem as HTMLElement
              }
            }
          })
          parentNode.removeChild(wrapperElem)
          const { target } = reactData
          if (target) {
            if (trigger === 'hover') {
              target.onmouseenter = $xeTooltip.targetMouseenterEvent
              target.onmouseleave = $xeTooltip.targetMouseleaveEvent
            } else if (trigger === 'click') {
              target.onclick = $xeTooltip.clickEvent
            }
          }
          if (props.value) {
            $xeTooltip.handleVisible(target || $xeTooltip.getSelectorEl(), content)
          }
        }
      }
    })
  },
  beforeDestroy () {
    const $xeTooltip = this
    const reactData = $xeTooltip.reactData

    const { target } = reactData
    const wrapperElem = $xeTooltip.$refs.refElem as HTMLElement
    if (target) {
      target.onmouseenter = null
      target.onmouseleave = null
      target.onclick = null
    }
    const contentWrapperfEl = $xeTooltip.$refs.contentWrapperfElem as HTMLElement
    if (contentWrapperfEl) {
      contentWrapperfEl.removeEventListener('wheel', $xeTooltip.wheelEvent)
    }
    if (wrapperElem) {
      const parentNode = wrapperElem.parentNode
      if (parentNode) {
        parentNode.removeChild(wrapperElem)
      }
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
