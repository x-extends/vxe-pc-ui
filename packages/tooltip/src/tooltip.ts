import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins } from '../../ui'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getAbsolutePos, getDomNode } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTooltipPropTypes, VxeTooltipEmits, TooltipReactData, TooltipInternalData, VxeComponentSizeType, ValueOf } from '../../../types'

export default defineVxeComponent({
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
    })
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
    open (target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

      return $xeTooltip.handleVisible(target || reactData.target as HTMLElement || $xeTooltip.getSelectorEl(), content)
    },
    close () {
      const $xeTooltip = this
      const reactData = $xeTooltip.reactData

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

      return $xeTooltip.$nextTick().then(() => {
        const { tipTarget } = reactData
        const el = $xeTooltip.$refs.refElem as HTMLElement
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
      const reactData = $xeTooltip.reactData

      const { tipTarget, tipStore } = reactData
      if (tipTarget) {
        const { scrollTop, scrollLeft, visibleWidth } = getDomNode()
        const { top, left } = getAbsolutePos(tipTarget)
        const el = $xeTooltip.$refs.refElem as HTMLElement
        const marginSize = 6
        const offsetHeight = el.offsetHeight
        const offsetWidth = el.offsetWidth
        let tipLeft = left
        let tipTop = top - offsetHeight - marginSize
        tipLeft = Math.max(marginSize, left + Math.floor((tipTarget.offsetWidth - offsetWidth) / 2))
        if (tipLeft + offsetWidth + marginSize > scrollLeft + visibleWidth) {
          tipLeft = scrollLeft + visibleWidth - offsetWidth - marginSize
        }
        if (top - offsetHeight < scrollTop + marginSize) {
          tipStore.placement = 'bottom'
          tipTop = top + tipTarget.offsetHeight + marginSize
        }
        tipStore.style.top = `${tipTop}px`
        tipStore.style.left = `${tipLeft}px`
        tipStore.arrowStyle.left = `${left - tipLeft + tipTarget.offsetWidth / 2}px`
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
    showTip  () {
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
    handleDelayFn  () {
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
    handleVisible  (target: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
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
        reactData.tipActive = true
        reactData.tipTarget = target
        reactData.tipContent = content
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

    //
    // Render
    //
    renderContent  (h: CreateElement) {
      const $xeTooltip = this
      const props = $xeTooltip
      const slots = $xeTooltip.$scopedSlots
      const reactData = $xeTooltip.reactData

      const { useHTML } = props
      const { tipContent } = reactData
      const contentSlot = slots.content
      if (contentSlot) {
        return h('div', {
          key: 1,
          class: 'vxe-table--tooltip-content'
        }, getSlotVNs(contentSlot({})))
      }
      if (useHTML) {
        return h('div', {
          key: 2,
          class: 'vxe-table--tooltip-content',
          domProps: {
            innerHTML: tipContent
          }
        })
      }
      return h('div', {
        key: 3,
        class: 'vxe-table--tooltip-content'
      }, `${tipContent}`)
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
        class: ['vxe-table--tooltip-wrapper', `theme--${theme}`, popupClassName ? (XEUtils.isFunction(popupClassName) ? popupClassName({ $tooltip: $xeTooltip }) : popupClassName) : '', {
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
        $xeTooltip.renderContent(h),
        h('div', {
          class: 'vxe-table--tooltip-arrow',
          style: tipStore.arrowStyle
        }),
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

    $xeTooltip.$nextTick(() => {
      const { trigger, content } = props
      const wrapperElem = $xeTooltip.$refs.refElem as HTMLElement
      if (wrapperElem) {
        const parentNode = wrapperElem.parentNode
        if (parentNode) {
          reactData.tipContent = content
          reactData.tipZindex = nextZIndex()
          XEUtils.arrayEach(wrapperElem.children, (elem, index) => {
            if (index > 1) {
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
})
