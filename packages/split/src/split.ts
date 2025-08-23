import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalEvents, globalMixins, globalResize, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, addClass, removeClass } from '../../ui/src/dom'
import { getGlobalDefaultConfig } from '../../ui/src/utils'
import { errLog } from '../../ui/src/log'

import type { SplitReactData, VxeSplitPropTypes, VxeComponentSizeType, SplitInternalData, VxeSplitEmits, ValueOf, VxeSplitPaneProps, VxeSplitDefines } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeSplit',
  mixins: [
    globalMixins.sizeMixin
  ],
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
    actionConfig: Object as PropType<VxeSplitPropTypes.ActionConfig>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SplitReactData = {
      staticItems: [],
      itemList: []
    }
    const internalData: SplitInternalData = {
      wrapperWidth: 0,
      wrapperHeight: 0
    }
    return {
      xID,
      reactData,
      internalData,
      reFlag: 0
    }
  },
  provide () {
    const $xeSplit = this
    return {
      $xeSplit
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeItemOpts () {
      const $xeSplit = this
      const props = $xeSplit

      return Object.assign({}, getConfig().split.itemConfig, props.itemConfig)
    },
    computeBarOpts () {
      const $xeSplit = this
      const props = $xeSplit

      return Object.assign({}, getConfig().split.barConfig, props.barConfig)
    },
    computeResizeOpts () {
      const $xeSplit = this
      const props = $xeSplit

      return Object.assign({}, getConfig().split.resizeConfig, props.resizeConfig)
    },
    computeActionOpts () {
      const $xeSplit = this
      const props = $xeSplit

      return Object.assign({}, getConfig().split.actionConfig, props.actionConfig)
    },
    computeIsFoldNext () {
      const $xeSplit = this

      const actionOpts = $xeSplit.computeActionOpts as VxeSplitPropTypes.ActionConfig
      return actionOpts.direction === 'next'
    },
    computeVisibleItems () {
      const $xeSplit = this
      const reactData = $xeSplit.reactData as SplitReactData

      return reactData.itemList.filter(item => item.isVisible)
    },
    computeAutoItems () {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = ($xeSplit as any).reactData as SplitReactData

      const { vertical } = props
      const autoItems: VxeSplitDefines.PaneConfig[] = []
      reactData.itemList.forEach(vertical
        ? item => {
          if (!item.height) {
            autoItems.push(item)
          }
        }
        : item => {
          if (!item.width) {
            autoItems.push(item)
          }
        })
      return {
        autoItems
      }
    },
    computeBarStyle () {
      const $xeSplit = this

      const barOpts = $xeSplit.computeBarOpts
      const { width, height } = barOpts
      const stys: Record<string, string | number> = {}
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (width) {
        stys.width = toCssUnit(width)
      }
      return stys
    },
    computeSItemSize () {
      const $xeSplit = this
      const reactData = $xeSplit.reactData as SplitReactData

      return reactData.staticItems.length
    }
  },
  watch: {
    items (val) {
      const $xeSplit = this

      $xeSplit.loadItem(val || [])
    },
    computeSItemSize () {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      if (props.items && props.items.length) {
        errLog('vxe.error.errConflicts', ['<vxe-split-pane ...>', 'items'])
      }
      reactData.itemList = reactData.staticItems
      $xeSplit.recalculate()
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeSplitEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeSplit = this
      $xeSplit.$emit(type, createEvent(evnt, { $split: $xeSplit }, params))
    },
    callSlot  (slotFunc: any, params: any) {
      const $xeSplit = this
      const slots = $xeSplit.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc(params))
        }
      }
      return []
    },
    reset () {
      const $xeSplit = this
      const reactData = $xeSplit.reactData

      const { itemList } = reactData
      itemList.forEach(item => {
        item.isExpand = true
        item.isVisible = true
        item.foldHeight = 0
        item.foldWidth = 0
        item.resizeHeight = 0
        item.resizeWidth = 0
      })
      return $xeSplit.$nextTick()
    },
    handleLoadItem (list: VxeSplitPaneProps[], isReset: boolean) {
      const $xeSplit = this
      const slots = $xeSplit.$scopedSlots
      const reactData = $xeSplit.reactData

      const { staticItems } = reactData
      const itemDef = {
        isVisible: true,
        isExpand: true,
        renderWidth: 0,
        resizeWidth: 0,
        foldWidth: 0,
        renderHeight: 0,
        resizeHeight: 0,
        foldHeight: 0
      }
      reactData.itemList = list.map(item => {
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
      return $xeSplit.recalculate()
    },
    loadItem (list: VxeSplitPaneProps[]) {
      const $xeSplit = this

      return $xeSplit.handleLoadItem(list || [], false)
    },
    reloadItem (list: VxeSplitPaneProps[]) {
      const $xeSplit = this

      return $xeSplit.handleLoadItem(list || [], true)
    },
    recalculate () {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData
      const internalData = $xeSplit.internalData

      return $xeSplit.$nextTick().then(() => {
        const { vertical } = props
        const { itemList } = reactData
        const el = $xeSplit.$refs.refElem as HTMLDivElement
        if (!el) {
          return
        }
        const wWidth = el.clientWidth
        const wHeight = el.clientHeight
        if (!wWidth || !wHeight) {
          return
        }
        const itemOpts = $xeSplit.computeItemOpts
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
                itemHeight = wHeight * XEUtils.toNumber(height) / 100
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
            const reMeanHeight = (wHeight - countHeight) / residueItems.length
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
                itemWidth = wWidth * XEUtils.toNumber(width) / 100
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
            const reMeanWidth = (wWidth - countWidth) / residueItems.length
            residueItems.forEach(item => {
              item.renderWidth = Math.max(XEUtils.toNumber(getGlobalDefaultConfig(item.minWidth, allMinWidth)), reMeanWidth)
            })
          }
        }
        internalData.wrapperWidth = wWidth
        internalData.wrapperHeight = wHeight
      })
    },
    dragEvent (evnt: MouseEvent) {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      const { resize, vertical } = props
      const { itemList } = reactData
      if (!resize) {
        return
      }
      evnt.preventDefault()
      const barEl = evnt.currentTarget as HTMLDivElement
      const handleEl = barEl.parentElement as HTMLDivElement
      const el = $xeSplit.$refs.refElem as HTMLDivElement
      if (!el) {
        return
      }
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]
      if (!item) {
        return
      }
      if (!item.isExpand) {
        return
      }
      const containerRect = el.getBoundingClientRect()
      const barRect = barEl.getBoundingClientRect()
      const rsSplitLineEl = $xeSplit.$refs.refResizableSplitTip as HTMLDivElement
      const rsSplitTipEl = rsSplitLineEl ? rsSplitLineEl.children[0] as HTMLDivElement : null
      const isFoldNext = $xeSplit.computeIsFoldNext
      const itemOpts = $xeSplit.computeItemOpts
      const resizeOpts = $xeSplit.computeResizeOpts
      const { immediate } = resizeOpts
      const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
      const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)

      const targetItem = itemList[itemIndex + (isFoldNext ? 1 : -1)]

      const prevItem = itemList[itemIndex + (isFoldNext ? 0 : -1)]
      const nextItem = itemList[itemIndex + (isFoldNext ? 1 : 0)]
      const prevEl = targetItem ? el.querySelector<HTMLDivElement>(`.vxe-split-pane[itemid="${prevItem.id}"]`) : null
      const nextEl = item ? el.querySelector<HTMLDivElement>(`.vxe-split-pane[itemid="${nextItem.id}"]`) : null
      if (!prevEl || !nextEl) {
        return
      }

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
              rsNumPrevEl.textContent = `${Math.floor(prevResizeHeight)}px`
              rsNumPrevEl.style.display = 'block'
              tipWidth = rsNumPrevEl.offsetWidth
            } else {
              rsNumPrevEl.style.display = 'none'
            }
          }
          if (rsNumNextEl) {
            if (targetOffsetHeight < 0) {
              rsNumNextEl.style.display = 'none'
            } else {
              rsNumNextEl.textContent = `${Math.floor(nextResizeHeight)}px`
              rsNumNextEl.style.display = 'block'
              tipWidth = rsNumNextEl.offsetWidth
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
              rsNumPrevEl.textContent = `${Math.floor(prevResizeWidth)}px`
              rsNumPrevEl.style.display = 'block'
              tipHeight = rsNumPrevEl.offsetHeight
            } else {
              rsNumPrevEl.style.display = 'none'
            }
          }
          if (rsNumNextEl) {
            if (targetOffsetWidth < 0) {
              rsNumNextEl.style.display = 'none'
            } else {
              rsNumNextEl.textContent = `${Math.floor(nextResizeWidth)}px`
              rsNumNextEl.style.display = 'block'
              tipHeight = rsNumNextEl.offsetHeight
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
        $xeSplit.dispatchEvent('resize-drag', { item, name: item.name, prevItem, nextItem, offsetHeight: targetOffsetHeight, offsetWidth: targetOffsetWidth }, evnt)
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
        $xeSplit.dispatchEvent('resize-end', { item, name: item.name, prevItem, nextItem, offsetHeight: targetOffsetHeight, offsetWidth: targetOffsetWidth }, evnt)
        $xeSplit.recalculate()
      }

      if (rsSplitLineEl) {
        rsSplitLineEl.style.display = 'block'
        handleReStyle(evnt)
      }
      handleDrag(evnt)
      addClass(el, 'is--drag')
      $xeSplit.dispatchEvent('resize-start', { item, name: item.name, prevItem, nextItem }, evnt)
    },
    handleItemActionEvent (evnt: MouseEvent) {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      const el = $xeSplit.$refs.refElem as HTMLDivElement
      if (!el) {
        return
      }
      const { vertical } = props
      const { itemList } = reactData
      const isFoldNext = $xeSplit.computeIsFoldNext
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]
      const targetItem = itemList[itemIndex + (isFoldNext ? 1 : -1)]
      if (item) {
        const { showAction, isExpand } = item
        if (showAction) {
          if (vertical) {
            if (targetItem) {
              targetItem.isVisible = !isExpand
              targetItem.foldHeight = 0
              item.isExpand = !isExpand
              item.isVisible = true
              item.foldHeight = isExpand ? (targetItem.resizeHeight || targetItem.renderHeight) + (item.resizeHeight || item.renderHeight) : 0
            }
          } else {
            if (targetItem) {
              targetItem.isVisible = !isExpand
              targetItem.foldWidth = 0
              item.isExpand = !isExpand
              item.isVisible = true
              item.foldWidth = isExpand ? (targetItem.resizeWidth || targetItem.renderWidth) + (item.resizeWidth || item.renderWidth) : 0
            }
          }
          $xeSplit.dispatchEvent('toggle-expand', { item, name: item.name, targetItem, targetName: targetItem ? targetItem.name : '', expanded: item.isExpand }, evnt)
          $xeSplit.recalculate()
        }
      }
    },
    handleActionDblclickEvent (evnt: MouseEvent) {
      const $xeSplit = this
      const reactData = $xeSplit.reactData

      const { itemList } = reactData
      const actionOpts = $xeSplit.computeActionOpts
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]

      if (actionOpts.trigger === 'dblclick') {
        $xeSplit.handleItemActionEvent(evnt)
      }
      $xeSplit.dispatchEvent('action-dblclick', { item, name: item ? item.name : '' }, evnt)
    },
    handleActionClickEvent (evnt: MouseEvent) {
      const $xeSplit = this
      const reactData = $xeSplit.reactData

      const { itemList } = reactData
      const actionOpts = $xeSplit.computeActionOpts
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]

      if (actionOpts.trigger !== 'dblclick') {
        $xeSplit.handleItemActionEvent(evnt)
      }
      $xeSplit.dispatchEvent('action-click', { item, name: item ? item.name : '' }, evnt)
    },
    handleGlobalResizeEvent () {
      const $xeSplit = this

      $xeSplit.recalculate()
    },
    getDefaultActionIcon (item: VxeSplitDefines.PaneConfig) {
      const $xeSplit = this
      const props = $xeSplit

      const { vertical } = props
      const { showAction, isExpand } = item
      const isFoldNext = $xeSplit.computeIsFoldNext
      const topIcon = 'SPLIT_TOP_ACTION'
      const bottomIcon = 'SPLIT_BOTTOM_ACTION'
      const leftIcon = 'SPLIT_LEFT_ACTION'
      const rightIcon = 'SPLIT_RIGHT_ACTION'
      if (showAction) {
        let iconName: 'SPLIT_TOP_ACTION' | 'SPLIT_BOTTOM_ACTION' | 'SPLIT_LEFT_ACTION' | 'SPLIT_RIGHT_ACTION' | '' = ''
        if (isFoldNext) {
          if (vertical) {
            iconName = isExpand ? bottomIcon : topIcon
          } else {
            iconName = isExpand ? rightIcon : leftIcon
          }
        } else {
          if (vertical) {
            iconName = isExpand ? topIcon : bottomIcon
          } else {
            iconName = isExpand ? leftIcon : rightIcon
          }
        }
        if (iconName) {
          return getIcon()[iconName]
        }
      }
      return ''
    },

    //
    // Render
    //
    renderHandleBar (h: CreateElement, item: VxeSplitDefines.PaneConfig) {
      const $xeSplit = this

      const barStyle = $xeSplit.computeBarStyle
      const actionOpts = $xeSplit.computeActionOpts
      const isFoldNext = $xeSplit.computeIsFoldNext
      const { id, isExpand, showAction } = item

      const btnOns: {
        click?: (evnt: MouseEvent) => void
        dblclick?: (evnt: MouseEvent) => void
      } = {}
      if (actionOpts.trigger === 'dblclick') {
        btnOns.dblclick = $xeSplit.handleItemActionEvent
      } else {
        btnOns.click = $xeSplit.handleItemActionEvent
      }
      return h('div', {
        attrs: {
          itemid: id
        },
        class: ['vxe-split-pane-handle', isFoldNext ? 'to--next' : 'to--prev']
      }, [
        h('div', {
          class: 'vxe-split-pane-handle-bar',
          style: barStyle,
          on: {
            mousedown: $xeSplit.dragEvent
          }
        }),
        showAction
          ? h('span', {
            class: 'vxe-split-pane-action-btn',
            on: btnOns
          }, [
            h('i', {
              class: (isExpand ? actionOpts.openIcon : actionOpts.closeIcon) || $xeSplit.getDefaultActionIcon(item)
            })
          ])
          : renderEmptyElement($xeSplit)
      ])
    },
    renderItems (h: CreateElement) {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      const { border, padding, resize, vertical } = props
      const { itemList } = reactData
      const resizeOpts = $xeSplit.computeResizeOpts
      const { immediate } = resizeOpts
      const visibleItems = $xeSplit.computeVisibleItems
      const { autoItems } = $xeSplit.computeAutoItems
      const isFoldNext = $xeSplit.computeIsFoldNext
      const itemVNs: VNode[] = []
      itemList.forEach((item, index) => {
        const { id, name, slots, renderHeight, resizeHeight, foldHeight, renderWidth, resizeWidth, foldWidth, isVisible, isExpand } = item
        const defaultSlot = slots ? slots.default : null
        const stys: Record<string, string | number> = {}
        let itemWidth = isVisible ? (foldWidth || resizeWidth || renderWidth) : 0
        let itemHeight = isVisible ? (foldHeight || resizeHeight || renderHeight) : 0
        // 至少存在一个自适应
        if (autoItems.length === 1) {
          if (vertical) {
            if (!item.height) {
              itemHeight = 0
            }
          } else {
            if (!item.width) {
              itemWidth = 0
            }
          }
        }
        // 当只剩下一个可视区自动占用 100%
        if (vertical) {
          if (itemHeight) {
            stys.height = visibleItems.length === 1 ? '100%' : toCssUnit(itemHeight)
          }
        } else {
          if (itemWidth) {
            stys.width = visibleItems.length === 1 ? '100%' : toCssUnit(itemWidth)
          }
        }

        itemVNs.push(
          h('div', {
            attrs: {
              itemid: id
            },
            class: ['vxe-split-pane', vertical ? 'is--vertical' : 'is--horizontal', immediate ? 'is-resize--immediate' : 'is-resize--lazy', {
              'is--resize': resize,
              'is--padding': padding,
              'is--border': border,
              'is--height': itemHeight,
              'is--width': itemWidth,
              'is--fill': isVisible && !itemHeight && !itemWidth,
              'is--handle': index > 0,
              'is--expand': isExpand,
              'is--hidden': !isVisible
            }],
            style: stys
          }, [
            index && !isFoldNext ? $xeSplit.renderHandleBar(h, item) : renderEmptyElement($xeSplit),
            h('div', {
              attrs: {
                itemid: id
              },
              class: 'vxe-split-pane--wrapper'
            }, [
              h('div', {
                class: 'vxe-split-pane--inner'
              }, defaultSlot ? $xeSplit.callSlot(defaultSlot, { name, isVisible, isExpand }) : [])
            ]),
            isFoldNext && index < itemList.length - 1 ? $xeSplit.renderHandleBar(h, item) : renderEmptyElement($xeSplit)
          ])
        )
      })
      return h('div', {
        class: 'vxe-split-wrapper'
      }, itemVNs)
    },
    renderVN (h: CreateElement): VNode {
      const $xeSplit = this
      const props = $xeSplit
      const slots = $xeSplit.$scopedSlots

      const { vertical, width, height } = props
      const resizeOpts = $xeSplit.computeResizeOpts
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
        ref: 'refElem',
        class: ['vxe-split', vertical ? 'is--vertical' : 'is--horizontal'],
        style: stys
      }, [
        h('div', {
          class: 'vxe-split-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        $xeSplit.renderItems(h),
        h('div', {
          ref: 'refResizableSplitTip',
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
          : [])
      ])
    }
  },
  created () {
    const $xeSplit = this

    globalEvents.on($xeSplit, 'resize', $xeSplit.handleGlobalResizeEvent)
  },
  mounted () {
    const $xeSplit = this
    const props = $xeSplit

    const el = $xeSplit.$refs.refElem as HTMLDivElement
    if (el) {
      const resizeObserver = globalResize.create(() => {
        $xeSplit.recalculate()
      })
      resizeObserver.observe(el)
      ;(this as any).$resize = resizeObserver
    }
    if (props.items) {
      $xeSplit.loadItem(props.items)
    }
    $xeSplit.$nextTick(() => {
      $xeSplit.recalculate()
    })
  },
  beforeDestroy () {
    const $xeSplit = this

    if ((this as any).$resize) {
      (this as any).$resize.disconnect()
    }
    globalEvents.off($xeSplit, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
