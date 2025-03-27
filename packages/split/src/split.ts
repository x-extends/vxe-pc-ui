import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, getIcon, createEvent, globalEvents, globalMixins, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, addClass, removeClass } from '../../ui/src/dom'
import { getGlobalDefaultConfig } from '../../ui/src/utils'

import type { SplitReactData, VxeSplitPropTypes, VxeComponentSizeType, SplitInternalData, VxeSplitEmits, ValueOf, VxeSplitDefines } from '../../../types'

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
    itemConfig: Object as PropType<VxeSplitPropTypes.ItemConfig>,
    barConfig: Object as PropType<VxeSplitPropTypes.BarConfig>,
    actionConfig: Object as PropType<VxeSplitPropTypes.ActionConfig>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: SplitReactData = {
      staticItems: []
    }
    const internalData: SplitInternalData = {
    }
    return {
      xID,
      reactData,
      internalData
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
    recalculate () {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      return $xeSplit.$nextTick().then(() => {
        const { vertical } = props
        const { staticItems } = reactData
        const el = $xeSplit.$refs.refElem as HTMLDivElement
        if (!el) {
          return
        }
        const wrapperWidth = el.clientWidth
        const wrapperHeight = el.clientHeight
        if (!wrapperWidth || !wrapperHeight) {
          return
        }
        const itemOpts = $xeSplit.computeItemOpts
        const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
        const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)
        const residueItems: VxeSplitDefines.ChunkConfig[] = []
        if (vertical) {
          let countHeight = 0
          staticItems.forEach(item => {
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
          staticItems.forEach(item => {
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
    },
    dragEvent (evnt: MouseEvent) {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      evnt.preventDefault()
      const { vertical } = props
      const { staticItems } = reactData
      const barEl = evnt.currentTarget as HTMLDivElement
      const handleEl = barEl.parentElement as HTMLDivElement
      const el = $xeSplit.$refs.refElem as HTMLDivElement
      if (!el) {
        return
      }
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(staticItems, item => item.id === itemId)
      const item = staticItems[itemIndex]
      if (!item) {
        return
      }
      if (!item.isExpand) {
        return
      }
      const isFoldNext = $xeSplit.computeIsFoldNext
      const itemOpts = $xeSplit.computeItemOpts
      const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
      const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)
      const targetItem = staticItems[itemIndex + (isFoldNext ? 1 : -1)]
      const targetItemEl = targetItem ? el.querySelector<HTMLDivElement>(`.vxe-split-item[itemid="${targetItem.id}"]`) : null
      const currItemEl = item ? el.querySelector<HTMLDivElement>(`.vxe-split-item[itemid="${item.id}"]`) : null
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
                $xeSplit.dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: offsetTop, resizeHeight: reHeight, offsetWidth: 0, resizeWidth: 0 }, evnt)
              }
            }
          } else {
            if (targetItem) {
              if (targetHeight + offsetTop >= targetMinHeight) {
                const reHeight = currHeight - offsetTop
                targetItem.resizeHeight = targetHeight + offsetTop
                item.resizeHeight = reHeight
                $xeSplit.dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: offsetTop, resizeHeight: reHeight, offsetWidth: 0, resizeWidth: 0 }, evnt)
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
                $xeSplit.dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: 0, resizeHeight: 0, offsetWidth: offsetLeft, resizeWidth: reWidth }, evnt)
              }
            }
          } else {
            if (targetItem) {
              if (targetWidth + offsetLeft >= targetMinWidth) {
                const reWidth = currWidth - offsetLeft
                targetItem.resizeWidth = targetWidth + offsetLeft
                item.resizeWidth = reWidth
                $xeSplit.dispatchEvent('resize-drag', { item, name: item.name, offsetHeight: 0, resizeHeight: 0, offsetWidth: offsetLeft, resizeWidth: reWidth }, evnt)
              }
            }
          }
        }
      }
      document.onmouseup = (evnt: MouseEvent) => {
        document.onmousemove = null
        document.onmouseup = null
        removeClass(el, 'is--drag')
        $xeSplit.dispatchEvent('resize-end', { item, name: item.name, resizeHeight: item.resizeHeight, resizeWidth: item.resizeWidth }, evnt)
      }
      $xeSplit.dispatchEvent('resize-start', { item, name: item.name }, evnt)
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
      const { staticItems } = reactData
      const isFoldNext = $xeSplit.computeIsFoldNext
      const btnEl = evnt.currentTarget as HTMLDivElement
      const handleEl = btnEl.parentElement as HTMLDivElement
      const itemId = handleEl.getAttribute('itemid')
      const itemIndex = XEUtils.findIndexOf(staticItems, item => item.id === itemId)
      const item = staticItems[itemIndex]
      const targetItem = staticItems[itemIndex + (isFoldNext ? 1 : -1)]
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
          $xeSplit.dispatchEvent(evnt.type === 'dblclick' ? 'action-dblclick' : 'action-click', { item, name: item.name, targetItem, targetName: targetItem ? targetItem.name : '', expanded: item.isExpand }, evnt)
        }
      }
    },
    handleGlobalResizeEvent () {
      const $xeSplit = this

      $xeSplit.recalculate()
    },
    getDefaultActionIcon (item: VxeSplitDefines.ChunkConfig) {
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
    renderHandleBar (h: CreateElement, item: VxeSplitDefines.ChunkConfig) {
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
        class: ['vxe-split-item-handle', isFoldNext ? 'to--next' : 'to--prev']
      }, [
        h('div', {
          class: 'vxe-split-item-handle-bar',
          style: barStyle,
          on: {
            mousedown: $xeSplit.dragEvent
          }
        }),
        showAction
          ? h('span', {
            class: 'vxe-split-item-action-btn',
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

      const { border, padding, vertical } = props
      const { staticItems } = reactData
      const isFoldNext = $xeSplit.computeIsFoldNext
      const itemVNs: VNode[] = []
      staticItems.forEach((item, index) => {
        const { id, slots, renderHeight, resizeHeight, foldHeight, renderWidth, resizeWidth, foldWidth, isVisible, isExpand } = item
        const defaultSlot = slots ? slots.default : null
        const stys: Record<string, string | number> = {}
        const itemWidth = isVisible ? (foldWidth || resizeWidth || renderWidth) : 0
        const itemHeight = isVisible ? (foldHeight || resizeHeight || renderHeight) : 0
        if (vertical) {
          if (itemHeight) {
            stys.height = toCssUnit(itemHeight)
          }
        } else {
          if (itemWidth) {
            stys.width = toCssUnit(itemWidth)
          }
        }
        itemVNs.push(
          h('div', {
            attrs: {
              itemid: id
            },
            class: ['vxe-split-item', vertical ? 'is--vertical' : 'is--horizontal', {
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
              class: 'vxe-split-item--wrapper'
            }, [
              h('div', {
                class: 'vxe-split-item--inner'
              }, defaultSlot ? $xeSplit.callSlot(defaultSlot, { }) : [])
            ]),
            isFoldNext && index < staticItems.length - 1 ? $xeSplit.renderHandleBar(h, item) : renderEmptyElement($xeSplit)
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
        $xeSplit.renderItems(h)
      ])
    }
  },
  created () {
    const $xeSplit = this

    globalEvents.on($xeSplit, 'resize', $xeSplit.handleGlobalResizeEvent)
  },
  mounted () {
    const $xeSplit = this

    $xeSplit.$nextTick(() => {
      $xeSplit.recalculate()
    })
  },
  beforeDestroy () {
    const $xeSplit = this

    globalEvents.off($xeSplit, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
