import { defineComponent, h, ref, Ref, nextTick, onBeforeUnmount, onMounted, reactive, watch, PropType } from 'vue'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, useSize } from '../../ui'
import { getLastZIndex, nextZIndex } from '../../ui/src/utils'
import { getAbsolutePos, getDomNode } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'

import type { VxeTooltipPropTypes, VxeTooltipConstructor, VxeTooltipEmits, TooltipInternalData, TooltipReactData, TooltipMethods, TooltipPrivateRef } from '../../../types'

export default defineComponent({
  name: 'VxeTooltip',
  props: {
    modelValue: Boolean,
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
  emits: [
    'update:modelValue'
  ] as VxeTooltipEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const reactData = reactive<TooltipReactData>({
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
    })

    const internalData: TooltipInternalData = {
    }

    const refElem = ref() as Ref<HTMLDivElement>

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

    let tooltipMethods = {} as TooltipMethods

    const updateTipStyle = () => {
      const { tipTarget, tipStore } = reactData
      if (tipTarget) {
        const { scrollTop, scrollLeft, visibleWidth } = getDomNode()
        const { top, left } = getAbsolutePos(tipTarget)
        const el = refElem.value
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
    }

    const updateValue = (value: VxeTooltipPropTypes.ModelValue) => {
      if (value !== reactData.visible) {
        reactData.visible = value
        reactData.isUpdate = true
        emit('update:modelValue', value)
      }
    }

    const updateZindex = () => {
      if (reactData.tipZindex < getLastZIndex()) {
        reactData.tipZindex = nextZIndex()
      }
    }

    const clickEvent = () => {
      if (reactData.visible) {
        tooltipMethods.close()
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
            tooltipMethods.close()
          }
        }, leaveDelay)
      } else {
        tooltipMethods.close()
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
            tooltipMethods.close()
          }
        }, leaveDelay)
      }
    }

    const showTip = () => {
      const { tipStore } = reactData
      const el = refElem.value
      if (el) {
        const parentNode = el.parentNode
        if (!parentNode) {
          document.body.appendChild(el)
        }
      }
      updateValue(true)
      updateZindex()
      tipStore.placement = 'top'
      tipStore.style = { width: 'auto', left: 0, top: 0, zIndex: props.zIndex || reactData.tipZindex }
      tipStore.arrowStyle = { left: '50%' }
      return tooltipMethods.updatePlacement()
    }

    const handleDelayFn = () => {
      internalData.showDelayTip = XEUtils.debounce(() => {
        if (reactData.tipActive) {
          showTip()
        }
      }, props.enterDelay, { leading: false, trailing: true })
    }

    const handleVisible = (target: HTMLElement | null, content?: VxeTooltipPropTypes.Content) => {
      const contentSlot = slots.content
      if (!contentSlot && (content === '' || XEUtils.eqNull(content))) {
        return nextTick()
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
          return showTip()
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

    tooltipMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, createEvent(evnt, { $tooltip: $xeTooltip }, params))
      },
      open (target?: HTMLElement | null, content?: VxeTooltipPropTypes.Content) {
        return handleVisible(target || reactData.target as HTMLElement || getSelectorEl(), content)
      },
      close () {
        reactData.tipTarget = null
        reactData.tipActive = false
        Object.assign(reactData.tipStore, {
          style: {},
          placement: '',
          arrowStyle: null
        })
        updateValue(false)
        return nextTick()
      },
      toVisible (target: HTMLElement, content?: VxeTooltipPropTypes.Content) {
        return handleVisible(target, content)
      },
      updatePlacement () {
        return nextTick().then(() => {
          const { tipTarget } = reactData
          const el = refElem.value
          if (tipTarget && el) {
            updateTipStyle()
            return nextTick().then(() => {
              updateTipStyle()
            })
          }
        })
      },
      isActived () {
        return reactData.tipActive
      },
      setActived (active) {
        reactData.tipActive = !!active
      }
    }

    Object.assign($xeTooltip, tooltipMethods)

    const renderContent = () => {
      const { useHTML } = props
      const { tipContent } = reactData
      const contentSlot = slots.content
      if (contentSlot) {
        return h('div', {
          key: 1,
          class: 'vxe-tooltip--content'
        }, getSlotVNs(contentSlot({})))
      }
      if (useHTML) {
        return h('div', {
          key: 2,
          class: 'vxe-tooltip--content',
          innerHTML: tipContent
        })
      }
      return h('div', {
        key: 3,
        class: 'vxe-tooltip--content'
      }, `${tipContent}`)
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
        renderContent(),
        h('div', {
          class: 'vxe-tooltip--arrow',
          style: tipStore.arrowStyle
        }),
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
          tooltipMethods.close()
        }
      }
      reactData.isUpdate = false
    })

    onMounted(() => {
      nextTick(() => {
        const { trigger, content } = props
        const wrapperElem = refElem.value
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
    })

    onBeforeUnmount(() => {
      const { target } = reactData
      const wrapperElem = refElem.value
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
    })

    handleDelayFn()

    $xeTooltip.renderVN = renderVN

    return $xeTooltip
  },
  render () {
    return this.renderVN()
  }
})
