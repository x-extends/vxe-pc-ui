import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, createEvent, globalMixins, renderEmptyElement } from '../../ui'
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
    itemConfig: Object as PropType<VxeSplitPropTypes.ItemConfig>
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
      const handleEl = evnt.currentTarget as HTMLDivElement
      const el = $xeSplit.$refs.refElem as HTMLDivElement
      if (!el) {
        return
      }
      const itemId = handleEl.getAttribute('xid')
      const itemIndex = XEUtils.findIndexOf(staticItems, item => item.id === itemId)
      const item = staticItems[itemIndex]
      if (!item) {
        return
      }
      const itemOpts = $xeSplit.computeItemOpts
      const allMinWidth = XEUtils.toNumber(itemOpts.minWidth)
      const allMinHeight = XEUtils.toNumber(itemOpts.minHeight)
      const prevItem = staticItems[itemIndex - 1]
      const prevItemEl = prevItem ? el.querySelector<HTMLDivElement>(`.vxe-split-item[xid="${prevItem.id}"]`) : null
      const currItemEl = item ? el.querySelector<HTMLDivElement>(`.vxe-split-item[xid="${item.id}"]`) : null
      const prevWidth = prevItemEl ? prevItemEl.clientWidth : 0
      const currWidth = currItemEl ? currItemEl.clientWidth : 0
      const prevHeight = prevItemEl ? prevItemEl.clientHeight : 0
      const currHeight = currItemEl ? currItemEl.clientHeight : 0
      const prevMinWidth = XEUtils.toNumber(prevItem ? getGlobalDefaultConfig(prevItem.minWidth, allMinWidth) : allMinWidth)
      const currMinWidth = XEUtils.toNumber(getGlobalDefaultConfig(item.minWidth, allMinWidth))
      const prevMinHeight = XEUtils.toNumber(prevItem ? getGlobalDefaultConfig(prevItem.minHeight, allMinHeight) : allMinHeight)
      const currMinHeight = XEUtils.toNumber(getGlobalDefaultConfig(item.minHeight, allMinHeight))
      const disX = evnt.clientX
      const disY = evnt.clientY
      addClass(el, 'is--drag')
      document.onmousemove = evnt => {
        evnt.preventDefault()
        if (vertical) {
          const offsetTop = evnt.clientY - disY
          if (offsetTop > 0) {
            if (prevItem) {
              if (currHeight - offsetTop >= currMinHeight) {
                prevItem.renderHeight = prevHeight + offsetTop
                item.renderHeight = currHeight - offsetTop
              }
            }
          } else {
            if (prevItem) {
              if (prevHeight + offsetTop >= prevMinHeight) {
                prevItem.renderHeight = prevHeight + offsetTop
                item.renderHeight = currHeight - offsetTop
              }
            }
          }
        } else {
          const offsetLeft = evnt.clientX - disX
          if (offsetLeft > 0) {
            if (prevItem) {
              if (currWidth - offsetLeft >= currMinWidth) {
                prevItem.renderWidth = prevWidth + offsetLeft
                item.renderWidth = currWidth - offsetLeft
              }
            }
          } else {
            if (prevItem) {
              if (prevWidth + offsetLeft >= prevMinWidth) {
                prevItem.renderWidth = prevWidth + offsetLeft
                item.renderWidth = currWidth - offsetLeft
              }
            }
          }
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        removeClass(el, 'is--drag')
      }
    },

    //
    // Render
    //
    renderItems (h: CreateElement) {
      const $xeSplit = this
      const props = $xeSplit
      const reactData = $xeSplit.reactData

      const { border, padding, vertical } = props
      const { staticItems } = reactData
      const itemVNs: VNode[] = []
      staticItems.forEach((item, index) => {
        const { id, slots, renderHeight, renderWidth } = item
        const defaultSlot = slots ? slots.default : null
        const stys: Record<string, string | number> = {}
        if (vertical) {
          if (renderHeight) {
            stys.height = toCssUnit(renderHeight)
          }
        } else {
          if (renderWidth) {
            stys.width = toCssUnit(renderWidth)
          }
        }
        itemVNs.push(
          h('div', {
            attrs: {
              xid: id
            },
            class: ['vxe-split-item', vertical ? 'is--vertical' : 'is--horizontal', {
              'is--padding': padding,
              'is--border': border,
              'is--height': renderHeight,
              'is--width': renderWidth,
              'is--fill': !renderHeight && !renderWidth,
              'is--handle': index > 0
            }],
            style: stys
          }, [
            index
              ? h('div', {
                attrs: {
                  xid: id
                },
                class: 'vxe-split-item-handle',
                on: {
                  mousedown: $xeSplit.dragEvent
                }
              })
              : renderEmptyElement($xeSplit),
            h('div', {
              attrs: {
                xid: id
              },
              class: 'vxe-split-item--wrapper'
            }, [
              h('div', {
                class: 'vxe-split-item--inner'
              }, defaultSlot ? $xeSplit.callSlot(defaultSlot, { }) : [])
            ])
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
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
