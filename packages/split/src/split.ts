import { PropType, ref, h, reactive, provide, VNode, computed, watch, nextTick, onMounted, onUnmounted, onActivated } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getConfig, getIcon, createEvent, globalEvents, globalResize, useSize, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, addClass, removeClass } from '../../ui/src/dom'
import { getGlobalDefaultConfig } from '../../ui/src/utils'
import { warnLog, errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'

import type { SplitReactData, SplitPrivateRef, VxeSplitPropTypes, SplitInternalData, SplitMethods, VxeSplitDefines, VxeSplitPaneProps, VxeSplitPrivateComputed, SplitPrivateMethods, VxeSplitEmits, VxeSplitConstructor, ValueOf, VxeSplitPrivateMethods } from '../../../types'

export default defineVxeComponent({
  name: 'VxeSplit',
  props: {
    width: [Number, String] as PropType<VxeSplitPropTypes.Width>,
    height: [Number, String] as PropType<VxeSplitPropTypes.Height>,
    vertical: {
      type: Boolean as PropType<VxeSplitPropTypes.Vertical>,
      default: () => getConfig().split.vertical
    },
    border: {
      type: Boolean as PropType<VxeSplitPropTypes.Border>,
      default: () => getConfig().split.border
    },
    padding: {
      type: Boolean as PropType<VxeSplitPropTypes.Padding>,
      default: () => getConfig().split.padding
    },
    resize: {
      type: Boolean as PropType<VxeSplitPropTypes.Resize>,
      default: () => getConfig().split.resize
    },
    items: Array as PropType<VxeSplitPropTypes.Items>,
    itemConfig: Object as PropType<VxeSplitPropTypes.ItemConfig>,
    barConfig: Object as PropType<VxeSplitPropTypes.BarConfig>,
    resizeConfig: Object as PropType<VxeSplitPropTypes.ResizeConfig>,
    actionConfig: Object as PropType<VxeSplitPropTypes.ActionConfig>,
    size: {
      type: String as PropType<VxeSplitPropTypes.Size>,
      default: () => getConfig().split.size || getConfig().size
    }
  },
  emits: [
    'action-dblclick',
    'action-click',
    'toggle-expand',
    'resize-start',
    'resize-drag',
    'resize-end'
  ] as VxeSplitEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()
    const refBarInfoElem = ref<HTMLDivElement>()
    const refResizableSplitTip = ref<HTMLDivElement>()

    const { computeSize } = useSize(props)

    const reactData = reactive<SplitReactData>({
      staticItems: [],
      itemList: [],
      barWidth: 0,
      barHeight: 0
    })

    const internalData: SplitInternalData = {
      wrapperWidth: 0,
      wrapperHeight: 0
    }

    const computeItemOpts = computed(() => {
      return Object.assign({}, getConfig().split.itemConfig, props.itemConfig)
    })

    const computeBarOpts = computed(() => {
      return Object.assign({}, getConfig().split.barConfig, props.barConfig)
    })

    const computeResizeOpts = computed(() => {
      return Object.assign({}, getConfig().split.resizeConfig, props.resizeConfig)
    })

    const computeActionOpts = computed(() => {
      return Object.assign({}, getConfig().split.actionConfig, props.actionConfig)
    })

    const computeVisibleItems = computed(() => {
      return reactData.itemList.filter(item => item.isExpand)
    })

    const computeAutoItems = computed(() => {
      const { vertical } = props
      const autoItems: VxeSplitDefines.PaneConfig[] = []
      let heightCount = 0
      let widthCount = 0
      reactData.itemList.forEach(vertical
        ? item => {
          const { renderHeight, resizeHeight, foldHeight, isExpand, height } = item
          const itemHeight = isExpand ? (foldHeight || resizeHeight || renderHeight) : 0
          if (!height) {
            autoItems.push(item)
          }
          heightCount += itemHeight
        }
        : item => {
          const { renderWidth, resizeWidth, foldWidth, isExpand, width } = item
          const itemWidth = isExpand ? (foldWidth || resizeWidth || renderWidth) : 0
          if (!width) {
            autoItems.push(item)
          }
          widthCount += itemWidth
        })
      return {
        autoItems,
        heightCount,
        heightRatio: heightCount / 100,
        widthCount,
        widthRatio: widthCount / 100
      }
    })

    const computeBarStyle = computed(() => {
      const barOpts = computeBarOpts.value
      const { width, height } = barOpts
      const stys: Record<string, string | number> = {}
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (width) {
        stys.width = toCssUnit(width)
      }
      return stys
    })

    const computeMaps: VxeSplitPrivateComputed = {
      computeItemOpts,
      computeBarOpts,
      computeActionOpts
    }

    const refMaps: SplitPrivateRef = {
      refElem
    }

    const $xeSplit = {
      xID,
      props,
      context,
      reactData,
      internalData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeSplitConstructor & VxeSplitPrivateMethods

    const dispatchEvent = (type: ValueOf<VxeSplitEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $split: $xeSplit }, params))
    }

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

    const getActionIcon = (prevItem: VxeSplitDefines.PaneConfig, nextItem: VxeSplitDefines.PaneConfig, isNext: boolean) => {
      const { vertical } = props
      const topIcon = 'SPLIT_TOP_ACTION'
      const bottomIcon = 'SPLIT_BOTTOM_ACTION'
      const leftIcon = 'SPLIT_LEFT_ACTION'
      const rightIcon = 'SPLIT_RIGHT_ACTION'
      let iconName: 'SPLIT_TOP_ACTION' | 'SPLIT_BOTTOM_ACTION' | 'SPLIT_LEFT_ACTION' | 'SPLIT_RIGHT_ACTION' | '' = ''
      if (vertical) {
        if (isNext) {
          iconName = nextItem.isExpand ? bottomIcon : topIcon
        } else {
          iconName = prevItem.isExpand ? topIcon : bottomIcon
        }
      } else {
        if (isNext) {
          iconName = nextItem.isExpand ? rightIcon : leftIcon
        } else {
          iconName = prevItem.isExpand ? leftIcon : rightIcon
        }
      }
      if (iconName) {
        return getIcon()[iconName]
      }
      return ''
    }

    const reset = () => {
      const { itemList } = reactData
      itemList.forEach(item => {
        item.isExpand = true
        item.foldHeight = 0
        item.foldWidth = 0
        item.resizeHeight = 0
        item.resizeWidth = 0
      })
      return nextTick()
    }

    const handleLoadItem = (list: VxeSplitPaneProps[], isReset: boolean) => {
      const { staticItems } = reactData
      const actionOpts = computeActionOpts.value
      const { showPrevButton, showNextButton } = actionOpts
      const itemDef = {
        isExpand: true,
        renderWidth: 0,
        resizeWidth: 0,
        foldWidth: 0,
        renderHeight: 0,
        resizeHeight: 0,
        foldHeight: 0
      }
      reactData.itemList = list.map(item => {
        if (item.showAction) {
          warnLog('vxe.error.removeProp', ['showAction'])
        }
        if (item.slots) {
          XEUtils.each(item.slots, (func) => {
            if (!XEUtils.isFunction(func)) {
              if (!slots[func]) {
                errLog('vxe.error.notSlot', [func])
              }
            }
          })
        }
        return Object.assign({}, isReset ? null : itemDef, item, isReset ? itemDef : null, {
          id: XEUtils.uniqueId()
        })
      })
      if (staticItems.length) {
        errLog('vxe.error.errConflicts', ['<vxe-split-pane ...>', 'items'])
      }
      if ((showPrevButton || showNextButton) && reactData.itemList.length > 2) {
        errLog('vxe.error.errConflicts', ['action-config.showPrevButton | action-config.showNextButton', 'Only supports 2 item'])
      }
      return recalculate()
    }

    const loadItem = (list: VxeSplitPaneProps[]) => {
      return handleLoadItem(list || [], false)
    }

    const reloadItem = (list: VxeSplitPaneProps[]) => {
      return handleLoadItem(list || [], true)
    }

    const recalculate = () => {
      return nextTick().then(() => {
        const { vertical } = props
        const { itemList } = reactData
        const el = refElem.value
        const barInfoElem = refBarInfoElem.value
        if (!el) {
          return
        }
        const wWidth = el.clientWidth
        const wHeight = el.clientHeight
        if (!wWidth || !wHeight) {
          return
        }
        if (barInfoElem) {
          reactData.barWidth = barInfoElem.offsetWidth
          reactData.barHeight = barInfoElem.offsetHeight
        }
        const contentWidth = wWidth - (vertical ? 0 : reactData.barWidth * (itemList.length - 1))
        const contentHeight = wHeight - (vertical ? reactData.barHeight * (itemList.length - 1) : 0)
        const itemOpts = computeItemOpts.value
        const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
        const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)
        const residueItems: VxeSplitDefines.PaneConfig[] = []
        if (vertical) {
          let countHeight = 0
          itemList.forEach(item => {
            const { height } = item
            let itemHeight = 0
            if (height) {
              if (isScale(height)) {
                itemHeight = contentHeight * XEUtils.toNumber(height) / 100
              } else {
                itemHeight = XEUtils.toNumber(height)
              }
              item.renderHeight = itemHeight
            } else {
              residueItems.push(item)
            }
            countHeight += itemHeight
          })
          if (residueItems.length) {
            const reMeanHeight = (contentHeight - countHeight) / residueItems.length
            residueItems.forEach(item => {
              item.renderHeight = Math.max(XEUtils.toNumber(getGlobalDefaultConfig(item.minHeight, allMinHeight)), reMeanHeight)
            })
          }
        } else {
          let countWidth = 0
          itemList.forEach(item => {
            const { width } = item
            let itemWidth = 0
            if (width) {
              if (isScale(width)) {
                itemWidth = contentWidth * XEUtils.toNumber(width) / 100
              } else {
                itemWidth = XEUtils.toNumber(width)
              }
              item.renderWidth = itemWidth
            } else {
              residueItems.push(item)
            }
            countWidth += itemWidth
          })
          if (residueItems.length) {
            const reMeanWidth = (contentWidth - countWidth) / residueItems.length
            residueItems.forEach(item => {
              item.renderWidth = Math.max(XEUtils.toNumber(getGlobalDefaultConfig(item.minWidth, allMinWidth)), reMeanWidth)
            })
          }
        }
        internalData.wrapperWidth = contentWidth
        internalData.wrapperHeight = contentHeight
      })
    }

    const dragEvent = (evnt: MouseEvent) => {
      const { resize, vertical } = props
      const { itemList } = reactData
      if (!resize) {
        return
      }
      evnt.preventDefault()
      const barEl = evnt.currentTarget as HTMLDivElement
      const handleEl = barEl.parentElement as HTMLDivElement
      const el = refElem.value
      if (!el) {
        return
      }
      const prevEl = handleEl.previousElementSibling as HTMLDivElement
      const nextEl = handleEl.nextElementSibling as HTMLDivElement
      if (!prevEl || !nextEl) {
        return
      }
      const prevId = prevEl.getAttribute('itemid')
      const nextId = nextEl.getAttribute('itemid')
      const prevItem = itemList.find(item => item.id === prevId)
      const nextItem = itemList.find(item => item.id === nextId)
      if (!prevItem || !nextItem) {
        return
      }
      const containerRect = el.getBoundingClientRect()
      const barRect = barEl.getBoundingClientRect()
      const rsSplitLineEl = refResizableSplitTip.value
      const rsSplitTipEl = rsSplitLineEl ? rsSplitLineEl.children[0] as HTMLDivElement : null
      const itemOpts = computeItemOpts.value
      const resizeOpts = computeResizeOpts.value
      const { immediate } = resizeOpts
      const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
      const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)

      const barOffsetX = Math.ceil(barRect.width - (evnt.clientX - barRect.left))
      const barOffsetY = Math.ceil(evnt.clientY - barRect.top)

      const prevWidth = prevEl.offsetWidth
      const nextWidth = nextEl.offsetWidth
      const prevMinWidth = XEUtils.toNumber(prevItem ? getGlobalDefaultConfig(prevItem.minWidth, allMinWidth) : allMinWidth)
      const nextMinWidth = XEUtils.toNumber(nextItem ? getGlobalDefaultConfig(nextItem.minWidth, allMinWidth) : allMinWidth)
      const minOffsetLeft = prevEl.offsetLeft + prevMinWidth - barOffsetX
      const maxOffsetLeft = nextEl.offsetLeft + nextEl.offsetWidth - nextMinWidth - barOffsetX
      const startOffsetLeft = evnt.clientX - containerRect.left
      let targetOffsetWidth = -1
      let prevResizeWidth = 0
      let nextResizeWidth = 0
      let offsetLeft = startOffsetLeft

      const prevHeight = prevEl.offsetHeight
      const nextHeight = nextEl.offsetHeight
      const prevMinHeight = XEUtils.toNumber(prevItem ? getGlobalDefaultConfig(prevItem.minHeight, allMinHeight) : allMinHeight)
      const nextMinHeight = XEUtils.toNumber(nextItem ? getGlobalDefaultConfig(nextItem.minHeight, allMinHeight) : allMinHeight)
      const minOffsetTop = prevEl.offsetTop + prevMinHeight + barOffsetY
      const maxOffsetTop = nextEl.offsetTop + nextEl.offsetHeight - nextMinHeight + barOffsetY
      const startOffsetTop = evnt.clientY - containerRect.top
      let targetOffsetHeight = -1
      let prevResizeHeight = 0
      let nextResizeHeight = 0
      let offsetTop = startOffsetTop

      const handleReStyle = (evnt: MouseEvent) => {
        if (!rsSplitLineEl) {
          return
        }
        const rsNumPrevEl = rsSplitTipEl ? rsSplitTipEl.children[0] as HTMLDivElement : null
        const rsNumNextEl = rsSplitTipEl ? rsSplitTipEl.children[1] as HTMLDivElement : null
        if (vertical) {
          let tipWidth = 0
          if (rsNumPrevEl) {
            if (targetOffsetHeight < 0) {
              rsNumPrevEl.style.display = 'none'
            } else {
              rsNumPrevEl.textContent = `${Math.floor(prevResizeHeight)}px`
              rsNumPrevEl.style.display = 'block'
              tipWidth = rsNumPrevEl.offsetWidth
            }
          }
          if (rsNumNextEl) {
            if (targetOffsetHeight < 0) {
              rsNumNextEl.textContent = `${Math.floor(nextResizeHeight)}px`
              rsNumNextEl.style.display = 'block'
              tipWidth = rsNumNextEl.offsetWidth
            } else {
              rsNumNextEl.style.display = 'none'
            }
          }
          let rsLeft = Math.max(1, evnt.clientX - containerRect.left - tipWidth / 2)
          if (rsLeft > containerRect.width - tipWidth - 1) {
            rsLeft = containerRect.width - tipWidth - 1
          }
          rsSplitLineEl.style.left = '0'
          rsSplitLineEl.style.top = `${offsetTop}px`
          if (rsSplitTipEl) {
            rsSplitTipEl.style.left = `${rsLeft}px`
          }
        } else {
          let tipHeight = 0
          if (rsNumPrevEl) {
            if (targetOffsetWidth < 0) {
              rsNumPrevEl.style.display = 'none'
            } else {
              rsNumPrevEl.textContent = `${Math.floor(prevResizeWidth)}px`
              rsNumPrevEl.style.display = 'block'
              tipHeight = rsNumPrevEl.offsetHeight
            }
          }
          if (rsNumNextEl) {
            if (targetOffsetWidth < 0) {
              rsNumNextEl.textContent = `${Math.floor(nextResizeWidth)}px`
              rsNumNextEl.style.display = 'block'
              tipHeight = rsNumNextEl.offsetHeight
            } else {
              rsNumNextEl.style.display = 'none'
            }
          }
          let rsTop = Math.max(1, evnt.clientY - containerRect.top - tipHeight / 2)
          if (rsTop > containerRect.height - tipHeight - 1) {
            rsTop = containerRect.height - tipHeight - 1
          }
          rsSplitLineEl.style.top = '0'
          rsSplitLineEl.style.left = `${offsetLeft}px`
          if (rsSplitTipEl) {
            rsSplitTipEl.style.top = `${rsTop}px`
          }
        }
      }

      const handleUpdate = () => {
        if (vertical) {
          prevItem.resizeHeight = prevResizeHeight
          nextItem.resizeHeight = nextResizeHeight
        } else {
          prevItem.resizeWidth = prevResizeWidth
          nextItem.resizeWidth = nextResizeWidth
        }
      }

      const handleDrag = (evnt: MouseEvent) => {
        if (vertical) {
          offsetTop = evnt.clientY - containerRect.top
          if (offsetTop < minOffsetTop) {
            offsetTop = minOffsetTop
          }
          if (offsetTop > maxOffsetTop) {
            offsetTop = maxOffsetTop
          }
          targetOffsetHeight = offsetTop - startOffsetTop
          prevResizeHeight = prevHeight + targetOffsetHeight
          nextResizeHeight = nextHeight - targetOffsetHeight
        } else {
          offsetLeft = evnt.clientX - containerRect.left
          if (offsetLeft < minOffsetLeft) {
            offsetLeft = minOffsetLeft
          }
          if (offsetLeft > maxOffsetLeft) {
            offsetLeft = maxOffsetLeft
          }
          targetOffsetWidth = offsetLeft - startOffsetLeft
          prevResizeWidth = prevWidth + targetOffsetWidth
          nextResizeWidth = nextWidth - targetOffsetWidth
        }
        if (immediate) {
          if (vertical) {
            prevEl.style.height = toCssUnit(prevResizeHeight)
            nextEl.style.height = toCssUnit(nextResizeHeight)
          } else {
            prevEl.style.width = toCssUnit(prevResizeWidth)
            nextEl.style.width = toCssUnit(nextResizeWidth)
          }
        }
        if (rsSplitLineEl) {
          handleReStyle(evnt)
        }
        dispatchEvent('resize-drag', { prevItem, nextItem, offsetHeight: targetOffsetHeight, offsetWidth: targetOffsetWidth }, evnt)
      }

      document.onmousemove = (evnt) => {
        evnt.preventDefault()
        handleDrag(evnt)
      }
      document.onmouseup = (evnt) => {
        document.onmousemove = null
        document.onmouseup = null
        if (rsSplitLineEl) {
          rsSplitLineEl.style.display = ''
        }
        handleUpdate()
        removeClass(el, 'is--drag')
        dispatchEvent('resize-end', { prevItem, nextItem, offsetHeight: targetOffsetHeight, offsetWidth: targetOffsetWidth }, evnt)
        recalculate()
      }

      if (rsSplitLineEl) {
        rsSplitLineEl.style.display = 'block'
        handleReStyle(evnt)
      }
      handleDrag(evnt)
      addClass(el, 'is--drag')
      dispatchEvent('resize-start', { prevItem, nextItem }, evnt)
    }

    const handleItemActionEvent = (evnt: MouseEvent, prevItem: VxeSplitDefines.PaneConfig, nextItem: VxeSplitDefines.PaneConfig, isNext: boolean) => {
      const { vertical } = props
      let expanded = false
      let item = prevItem
      if (isNext) {
        item = nextItem
        expanded = !nextItem.isExpand
        nextItem.isExpand = expanded
      } else {
        expanded = !prevItem.isExpand
        prevItem.isExpand = expanded
      }
      if (vertical) {
        if (prevItem.isExpand && nextItem.isExpand) {
          prevItem.foldHeight = 0
          nextItem.foldHeight = 0
        } else if (prevItem.isExpand) {
          nextItem.foldHeight = 0
          prevItem.foldHeight = (prevItem.resizeHeight || prevItem.renderHeight) + (nextItem.resizeHeight || nextItem.renderHeight)
        } else {
          prevItem.foldHeight = 0
          nextItem.foldHeight = (prevItem.resizeHeight || prevItem.renderHeight) + (nextItem.resizeHeight || nextItem.renderHeight)
        }
      } else {
        if (prevItem.isExpand && nextItem.isExpand) {
          prevItem.foldWidth = 0
          nextItem.foldWidth = 0
        } else if (prevItem.isExpand) {
          nextItem.foldWidth = 0
          prevItem.foldWidth = (prevItem.resizeWidth || prevItem.renderWidth) + (nextItem.resizeWidth || nextItem.renderWidth)
        } else {
          prevItem.foldWidth = 0
          nextItem.foldWidth = (prevItem.resizeWidth || prevItem.renderWidth) + (nextItem.resizeWidth || nextItem.renderWidth)
        }
      }
      dispatchEvent('toggle-expand', { prevItem, nextItem, expanded, item }, evnt)
      recalculate()
    }

    const handlePrevActionDblclickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const btnWrapperEl = btnEl.parentElement as HTMLDivElement
      const handleEl = btnWrapperEl.parentElement as HTMLDivElement
      const prevEl = handleEl.previousElementSibling as HTMLDivElement
      const prevId = prevEl.getAttribute('itemid')
      const prevItem = itemList.find(item => item.id === prevId)
      const nextEl = handleEl.nextElementSibling as HTMLDivElement
      const nextId = nextEl.getAttribute('itemid')
      const nextItem = itemList.find(item => item.id === nextId)

      if (actionOpts.trigger === 'dblclick') {
        if (prevItem && nextItem && nextItem.isExpand) {
          handleItemActionEvent(evnt, prevItem, nextItem, false)
        }
      }
      dispatchEvent('action-dblclick', { prevItem, nextItem }, evnt)
    }

    const handlePrevActionClickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const btnWrapperEl = btnEl.parentElement as HTMLDivElement
      const handleEl = btnWrapperEl.parentElement as HTMLDivElement
      const prevEl = handleEl.previousElementSibling as HTMLDivElement
      const prevId = prevEl.getAttribute('itemid')
      const prevItem = itemList.find(item => item.id === prevId)
      const nextEl = handleEl.nextElementSibling as HTMLDivElement
      const nextId = nextEl.getAttribute('itemid')
      const nextItem = itemList.find(item => item.id === nextId)

      if (actionOpts.trigger !== 'dblclick') {
        if (prevItem && nextItem && nextItem.isExpand) {
          handleItemActionEvent(evnt, prevItem, nextItem, false)
        }
      }
      dispatchEvent('action-click', { prevItem, nextItem }, evnt)
    }

    const handleNextActionDblclickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const btnWrapperEl = btnEl.parentElement as HTMLDivElement
      const handleEl = btnWrapperEl.parentElement as HTMLDivElement
      const prevEl = handleEl.previousElementSibling as HTMLDivElement
      const prevId = prevEl.getAttribute('itemid')
      const prevItem = itemList.find(item => item.id === prevId)
      const nextEl = handleEl.nextElementSibling as HTMLDivElement
      const nextId = nextEl.getAttribute('itemid')
      const nextItem = itemList.find(item => item.id === nextId)

      if (actionOpts.trigger === 'dblclick') {
        if (prevItem && nextItem && prevItem.isExpand) {
          handleItemActionEvent(evnt, prevItem, nextItem, true)
        }
      }
      dispatchEvent('action-dblclick', { prevItem, nextItem }, evnt)
    }

    const handleNextActionClickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const btnWrapperEl = btnEl.parentElement as HTMLDivElement
      const handleEl = btnWrapperEl.parentElement as HTMLDivElement
      const prevEl = handleEl.previousElementSibling as HTMLDivElement
      const prevId = prevEl.getAttribute('itemid')
      const prevItem = itemList.find(item => item.id === prevId)
      const nextEl = handleEl.nextElementSibling as HTMLDivElement
      const nextId = nextEl.getAttribute('itemid')
      const nextItem = itemList.find(item => item.id === nextId)

      if (actionOpts.trigger !== 'dblclick') {
        if (prevItem && nextItem && prevItem.isExpand) {
          handleItemActionEvent(evnt, prevItem, nextItem, true)
        }
      }
      dispatchEvent('action-click', { prevItem, nextItem }, evnt)
    }

    const handleGlobalResizeEvent = () => {
      recalculate()
    }

    const splitMethods: SplitMethods = {
      dispatchEvent,
      recalculate,
      reset,
      loadItem,
      reloadItem
    }

    const splitPrivateMethods: SplitPrivateMethods = {
    }

    Object.assign($xeSplit, splitMethods, splitPrivateMethods)

    const renderHandleBar = (prevItem: VxeSplitDefines.PaneConfig, nextItem: VxeSplitDefines.PaneConfig) => {
      const { border, resize, vertical } = props
      const { itemList } = reactData
      const barStyle = computeBarStyle.value
      const actionOpts = computeActionOpts.value
      const { direction } = actionOpts
      const showPrevButton = XEUtils.isBoolean(actionOpts.showPrevButton) ? actionOpts.showPrevButton : (itemList.some(item => item.showAction))
      const showNextButton = XEUtils.isBoolean(actionOpts.showNextButton) ? actionOpts.showNextButton : (direction === 'next' && itemList.some(item => item.showAction))
      const resizeOpts = computeResizeOpts.value
      const { immediate } = resizeOpts
      return h('div', {
        class: ['vxe-split-pane-handle', vertical ? 'is--vertical' : 'is--horizontal', immediate ? 'is-resize--immediate' : 'is-resize--lazy', {
          'is--resize': resize,
          'is--border': border
        }]
      }, [
        h('div', {
          class: 'vxe-split-pane-handle-bar',
          style: barStyle,
          onMousedown: dragEvent
        }),
        itemList.length === 2
          ? h('div', {
            class: 'vxe-split-pane-action-btn-wrapper'
          }, [
            showPrevButton && nextItem.isExpand
              ? h('div', {
                class: 'vxe-split-pane-action-btn',
                onDblclick: handlePrevActionDblclickEvent,
                onClick: handlePrevActionClickEvent
              }, [
                h('i', {
                  class: getActionIcon(prevItem, nextItem, false)
                })
              ])
              : renderEmptyElement($xeSplit),
            showNextButton && prevItem.isExpand
              ? h('div', {
                class: 'vxe-split-pane-action-btn',
                onDblclick: handleNextActionDblclickEvent,
                onClick: handleNextActionClickEvent
              }, [
                h('i', {
                  class: getActionIcon(prevItem, nextItem, true)
                })
              ])
              : renderEmptyElement($xeSplit)
          ])
          : renderEmptyElement($xeSplit)
      ])
    }

    const renderItems = () => {
      const { border, padding, resize, vertical } = props
      const { itemList } = reactData
      const vSize = computeSize.value
      const resizeOpts = computeResizeOpts.value
      const { immediate } = resizeOpts
      const visibleItems = computeVisibleItems.value
      const { autoItems } = computeAutoItems.value
      const itemVNs: VNode[] = []
      itemList.forEach((prevItem, index) => {
        const { id, name, slots, renderHeight, resizeHeight, foldHeight, renderWidth, resizeWidth, foldWidth, isExpand } = prevItem
        const nextItem = itemList[index + 1]
        const defaultSlot = slots ? slots.default : null
        const stys: Record<string, string | number> = {}
        let itemWidth = isExpand ? (foldWidth || resizeWidth || renderWidth) : 0
        let itemHeight = isExpand ? (foldHeight || resizeHeight || renderHeight) : 0
        // 至少存在一个自适应
        if (autoItems.length === 1) {
          if (vertical) {
            if (!prevItem.height) {
              itemHeight = 0
            }
          } else {
            if (!prevItem.width) {
              itemWidth = 0
            }
          }
        }
        let isFill = true
        if (vertical) {
          if (itemHeight && visibleItems.length > 1) {
            isFill = false
            stys.height = toCssUnit(itemHeight)
          }
        } else {
          if (itemWidth && visibleItems.length > 1) {
            isFill = false
            stys.width = toCssUnit(itemWidth)
          }
        }

        itemVNs.push(
          h('div', {
            itemid: id,
            class: ['vxe-split-pane', vertical ? 'is--vertical' : 'is--horizontal', immediate ? 'is-resize--immediate' : 'is-resize--lazy', {
              [`size--${vSize}`]: vSize,
              'is--resize': resize,
              'is--padding': padding,
              'is--border': border,
              'is--height': itemHeight,
              'is--width': itemWidth,
              'is--visible': isExpand,
              'is--hidden': !isExpand,
              'is--fill': isExpand && isFill
            }],
            style: stys
          }, [
            h('div', {
              itemid: id,
              class: 'vxe-split-pane--wrapper'
            }, [
              h('div', {
                class: 'vxe-split-pane--inner'
              }, defaultSlot ? callSlot(defaultSlot, { name, isExpand }) : [])
            ])
          ])
        )

        if (nextItem) {
          itemVNs.push(renderHandleBar(prevItem, nextItem))
        }
      })
      return h('div', {
        class: 'vxe-split-wrapper'
      }, itemVNs)
    }

    const renderVN = () => {
      const { vertical, width, height } = props
      const vSize = computeSize.value
      const resizeOpts = computeResizeOpts.value
      const { immediate, showTip } = resizeOpts
      const defaultSlot = slots.default
      const stys: Record<string, string | number> = {}
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (width) {
        stys.width = toCssUnit(width)
      }
      return h('div', {
        ref: refElem,
        class: ['vxe-split', vertical ? 'is--vertical' : 'is--horizontal', immediate ? 'is-resize--immediate' : 'is-resize--lazy', {
          [`size--${vSize}`]: vSize
        }],
        style: stys
      }, [
        h('div', {
          class: 'vxe-split-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        renderItems(),
        h('div', {
          ref: refResizableSplitTip,
          class: ['vxe-split--resizable-split-tip', vertical ? 'is--vertical' : 'is--horizontal', immediate ? 'is-resize--immediate' : 'is-resize--lazy']
        }, showTip
          ? [
              h('div', {
                class: 'vxe-split--resizable-split-tip-number'
              }, [
                h('div', {
                  class: 'vxe-split--resizable-split-number-prev'
                }),
                h('div', {
                  class: 'vxe-split--resizable-split-number-next'
                })
              ])
            ]
          : []),
        h('div', {
          class: 'vxe-split--render-vars'
        }, [
          h('div', {
            ref: refBarInfoElem,
            class: 'vxe-split--handle-bar-info'
          })
        ])
      ])
    }

    const itemFlag = ref(0)
    watch(() => props.items ? props.items.length : -1, () => {
      itemFlag.value++
    })
    watch(() => props.items, () => {
      itemFlag.value++
    })
    watch(itemFlag, () => {
      loadItem(props.items || [])
    })

    watch(() => reactData.staticItems, (val) => {
      const actionOpts = computeActionOpts.value
      const { showPrevButton, showNextButton } = actionOpts
      if (props.items && props.items.length) {
        errLog('vxe.error.errConflicts', ['<vxe-split-pane ...>', 'items'])
      }
      reactData.itemList = val || []

      if ((showPrevButton || showNextButton) && reactData.itemList.length > 2) {
        errLog('vxe.error.modelConflicts', ['action-config.showPrevButton | action-config.showNextButton', '<vxe-split-pane ...> Only supports 2 panel'])
      }
      reactData.itemList.forEach(item => {
        if (item.showAction) {
          warnLog('vxe.error.removeProp', ['showAction'])
        }
      })
      recalculate()
    })

    let resizeObserver: ResizeObserver

    onMounted(() => {
      nextTick(() => {
        recalculate()
      })

      const el = refElem.value
      if (el) {
        resizeObserver = globalResize.create(() => {
          recalculate()
        })
        resizeObserver.observe(el)
      }

      const actionOpts = computeActionOpts.value
      if (actionOpts.direction) {
        errLog('vxe.error.delProp', ['action-config.direction', 'action-config.showPrevButton | action-config.showNextButton'])
      }

      globalEvents.on($xeSplit, 'resize', handleGlobalResizeEvent)
    })

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      globalEvents.off($xeSplit, 'resize')
    })

    onActivated(() => {
      recalculate()
    })

    if (props.items) {
      loadItem(props.items)
    }

    provide('$xeSplit', $xeSplit)

    $xeSplit.renderVN = renderVN

    return $xeSplit
  },
  render () {
    return this.renderVN()
  }
})
