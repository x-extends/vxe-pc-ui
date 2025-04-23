import { defineComponent, PropType, ref, h, reactive, provide, VNode, computed, watch, nextTick, onMounted, onUnmounted, onActivated } from 'vue'
import { getConfig, getIcon, createEvent, globalEvents, globalResize, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, addClass, removeClass } from '../../ui/src/dom'
import { getGlobalDefaultConfig } from '../../ui/src/utils'
import { errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'

import type { SplitReactData, SplitPrivateRef, VxeSplitPropTypes, SplitInternalData, SplitMethods, VxeSplitDefines, VxeSplitPaneProps, VxeSplitPrivateComputed, SplitPrivateMethods, VxeSplitEmits, VxeSplitConstructor, ValueOf, VxeSplitPrivateMethods } from '../../../types'

export default defineComponent({
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
    actionConfig: Object as PropType<VxeSplitPropTypes.ActionConfig>
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

    const reactData = reactive<SplitReactData>({
      staticItems: [],
      itemList: []
    })

    const internalData: SplitInternalData = {
    }

    const computeItemOpts = computed(() => {
      return Object.assign({}, getConfig().split.itemConfig, props.itemConfig)
    })

    const computeBarOpts = computed(() => {
      return Object.assign({}, getConfig().split.barConfig, props.barConfig)
    })

    const computeActionOpts = computed(() => {
      return Object.assign({}, getConfig().split.actionConfig, props.actionConfig)
    })

    const computeIsFoldNext = computed(() => {
      const actionOpts = computeActionOpts.value
      return actionOpts.direction === 'next'
    })

    const computeVisibleItems = computed(() => {
      return reactData.itemList.filter(item => item.isVisible)
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
      computeActionOpts,
      computeIsFoldNext
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

    const getDefaultActionIcon = (item: VxeSplitDefines.PaneConfig) => {
      const { vertical } = props
      const { showAction, isExpand } = item
      const isFoldNext = computeIsFoldNext.value
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
    }

    const reset = () => {
      const { itemList } = reactData
      itemList.forEach(item => {
        item.isExpand = true
        item.isVisible = true
        item.foldHeight = 0
        item.foldWidth = 0
        item.resizeHeight = 0
        item.resizeWidth = 0
      })
      return nextTick()
    }

    const handleLoadItem = (list: VxeSplitPaneProps[], isReset: boolean) => {
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
        if (!el) {
          return
        }
        const wrapperWidth = el.clientWidth
        const wrapperHeight = el.clientHeight
        if (!wrapperWidth || !wrapperHeight) {
          return
        }
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
                itemHeight = wrapperHeight * XEUtils.toNumber(height)
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
            const reMeanHeight = (wrapperHeight - countHeight) / residueItems.length
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
                itemWidth = wrapperWidth * XEUtils.toNumber(width)
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
            const reMeanWidth = (wrapperWidth - countWidth) / residueItems.length
            residueItems.forEach(item => {
              item.renderWidth = Math.max(XEUtils.toNumber(getGlobalDefaultConfig(item.minWidth, allMinWidth)), reMeanWidth)
            })
          }
        }
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
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]
      if (!item) {
        return
      }
      if (!item.isExpand) {
        return
      }
      const isFoldNext = computeIsFoldNext.value
      const itemOpts = computeItemOpts.value
      const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
      const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)
      const targetItem = itemList[itemIndex + (isFoldNext ? 1 : -1)]
      const targetItemEl = targetItem ? el.querySelector<HTMLDivElement>(`.vxe-split-pane[itemid="${targetItem.id}"]`) : null
      const currItemEl = item ? el.querySelector<HTMLDivElement>(`.vxe-split-pane[itemid="${item.id}"]`) : null
      const targetWidth = targetItemEl ? targetItemEl.clientWidth : 0
      const currWidth = currItemEl ? currItemEl.clientWidth : 0
      const targetHeight = targetItemEl ? targetItemEl.clientHeight : 0
      const currHeight = currItemEl ? currItemEl.clientHeight : 0
      const targetMinWidth = XEUtils.toNumber(targetItem ? getGlobalDefaultConfig(targetItem.minWidth, allMinWidth) : allMinWidth)
      const currMinWidth = XEUtils.toNumber(getGlobalDefaultConfig(item.minWidth, allMinWidth))
      const targetMinHeight = XEUtils.toNumber(targetItem ? getGlobalDefaultConfig(targetItem.minHeight, allMinHeight) : allMinHeight)
      const currMinHeight = XEUtils.toNumber(getGlobalDefaultConfig(item.minHeight, allMinHeight))
      const disX = evnt.clientX
      const disY = evnt.clientY
      addClass(el, 'is--drag')
      document.onmousemove = (evnt) => {
        evnt.preventDefault()
        if (vertical) {
          const offsetTop = isFoldNext ? (disY - evnt.clientY) : (evnt.clientY - disY)
          if (offsetTop > 0) {
            if (targetItem) {
              if (currHeight - offsetTop >= currMinHeight) {
                const reHeight = currHeight - offsetTop
                targetItem.resizeHeight = targetHeight + offsetTop
                item.resizeHeight = reHeight
                dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: offsetTop, resizeHeight: reHeight, offsetWidth: 0, resizeWidth: 0 }, evnt)
              }
            }
          } else {
            if (targetItem) {
              if (targetHeight + offsetTop >= targetMinHeight) {
                const reHeight = currHeight - offsetTop
                targetItem.resizeHeight = targetHeight + offsetTop
                item.resizeHeight = reHeight
                dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: offsetTop, resizeHeight: reHeight, offsetWidth: 0, resizeWidth: 0 }, evnt)
              }
            }
          }
        } else {
          const offsetLeft = isFoldNext ? (disX - evnt.clientX) : (evnt.clientX - disX)
          if (offsetLeft > 0) {
            if (targetItem) {
              if (currWidth - offsetLeft >= currMinWidth) {
                const reWidth = currWidth - offsetLeft
                targetItem.resizeWidth = targetWidth + offsetLeft
                item.resizeWidth = reWidth
                dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: 0, resizeHeight: 0, offsetWidth: offsetLeft, resizeWidth: reWidth }, evnt)
              }
            }
          } else {
            if (targetItem) {
              if (targetWidth + offsetLeft >= targetMinWidth) {
                const reWidth = currWidth - offsetLeft
                targetItem.resizeWidth = targetWidth + offsetLeft
                item.resizeWidth = reWidth
                dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: 0, resizeHeight: 0, offsetWidth: offsetLeft, resizeWidth: reWidth }, evnt)
              }
            }
          }
        }
      }
      document.onmouseup = (evnt: MouseEvent) => {
        document.onmousemove = null
        document.onmouseup = null
        removeClass(el, 'is--drag')
        dispatchEvent('resize-end', { item, name: item.name, resizeHeight: item.resizeHeight, resizeWidth: item.resizeWidth }, evnt)
        recalculate()
      }
      dispatchEvent('resize-start', { item, name: item.name }, evnt)
    }

    const handleItemActionEvent = (evnt: MouseEvent) => {
      const el = refElem.value
      if (!el) {
        return
      }
      const { vertical } = props
      const { itemList } = reactData
      const isFoldNext = computeIsFoldNext.value
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
          dispatchEvent('toggle-expand', { item, name: item.name, targetItem, targetName: targetItem ? targetItem.name : '', expanded: item.isExpand }, evnt)
          recalculate()
        }
      }
    }

    const handleActionDblclickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]

      if (actionOpts.trigger === 'dblclick') {
        handleItemActionEvent(evnt)
      }
      dispatchEvent('action-dblclick', { item, name: item ? item.name : '' }, evnt)
    }

    const handleActionClickEvent = (evnt: MouseEvent) => {
      const { itemList } = reactData
      const actionOpts = computeActionOpts.value
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(itemList, item => item.id === itemId)
      const item = itemList[itemIndex]

      if (actionOpts.trigger !== 'dblclick') {
        handleItemActionEvent(evnt)
      }
      dispatchEvent('action-click', { item, name: item ? item.name : '' }, evnt)
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

    const renderHandleBar = (item: VxeSplitDefines.PaneConfig) => {
      const barStyle = computeBarStyle.value
      const actionOpts = computeActionOpts.value
      const isFoldNext = computeIsFoldNext.value
      const { id, isExpand, showAction } = item

      return h('div', {
        itemid: id,
        class: ['vxe-split-pane-handle', isFoldNext ? 'to--next' : 'to--prev']
      }, [
        h('div', {
          class: 'vxe-split-pane-handle-bar',
          style: barStyle,
          onMousedown: dragEvent
        }),
        showAction
          ? h('span', {
            class: 'vxe-split-pane-action-btn',
            onDblclick: handleActionDblclickEvent,
            onClick: handleActionClickEvent
          }, [
            h('i', {
              class: (isExpand ? actionOpts.openIcon : actionOpts.closeIcon) || getDefaultActionIcon(item)
            })
          ])
          : renderEmptyElement($xeSplit)
      ])
    }

    const renderItems = () => {
      const { border, padding, resize, vertical } = props
      const { itemList } = reactData
      const visibleItems = computeVisibleItems.value
      const isFoldNext = computeIsFoldNext.value
      const itemVNs: VNode[] = []
      itemList.forEach((item, index) => {
        const { id, name, slots, renderHeight, resizeHeight, foldHeight, renderWidth, resizeWidth, foldWidth, isVisible, isExpand } = item
        const defaultSlot = slots ? slots.default : null
        const stys: Record<string, string | number> = {}
        let itemWidth = isVisible ? (foldWidth || resizeWidth || renderWidth) : 0
        let itemHeight = isVisible ? (foldHeight || resizeHeight || renderHeight) : 0
        // 至少存在一个自适应
        if (vertical) {
          if (!item.height) {
            itemHeight = 0
          }
        } else {
          if (!item.width) {
            itemWidth = 0
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
            itemid: id,
            class: ['vxe-split-pane', vertical ? 'is--vertical' : 'is--horizontal', {
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
            index && !isFoldNext ? renderHandleBar(item) : renderEmptyElement($xeSplit),
            h('div', {
              itemid: id,
              class: 'vxe-split-pane--wrapper'
            }, [
              h('div', {
                class: 'vxe-split-pane--inner'
              }, defaultSlot ? callSlot(defaultSlot, { name, isVisible, isExpand }) : [])
            ]),
            isFoldNext && index < itemList.length - 1 ? renderHandleBar(item) : renderEmptyElement($xeSplit)
          ])
        )
      })
      return h('div', {
        class: 'vxe-split-wrapper'
      }, itemVNs)
    }

    const renderVN = () => {
      const { vertical, width, height } = props
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
        class: ['vxe-split', vertical ? 'is--vertical' : 'is--horizontal'],
        style: stys
      }, [
        h('div', {
          class: 'vxe-split-slots'
        }, defaultSlot ? defaultSlot({}) : []),
        renderItems()
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
      if (props.items && props.items.length) {
        errLog('vxe.error.errConflicts', ['<vxe-split-pane ...>', 'items'])
      }
      reactData.itemList = val
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
