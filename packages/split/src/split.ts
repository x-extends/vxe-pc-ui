import { defineComponent, PropType, ref, h, reactive, provide, VNode, computed, watch, nextTick, onMounted, onActivated } from 'vue'
import { getConfig, createEvent, renderEmptyElement } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, addClass, removeClass } from '../../ui/src/dom'
import { getGlobalDefaultConfig } from '../../ui/src/utils'
import XEUtils from 'xe-utils'

import type { SplitReactData, SplitPrivateRef, VxeSplitPropTypes, SplitInternalData, SplitMethods, VxeSplitDefines, VxeSplitPrivateComputed, SplitPrivateMethods, VxeSplitEmits, VxeSplitConstructor, ValueOf, VxeSplitPrivateMethods } from '../../../types'

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
    itemConfig: Object as PropType<VxeSplitPropTypes.ItemConfig>
  },
  emits: [
  ] as VxeSplitEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<SplitReactData>({
      staticItems: []
    })

    const internalData: SplitInternalData = {
    }

    const computeItemOpts = computed(() => {
      return Object.assign({}, getConfig().split.itemConfig, props.itemConfig)
    })

    const computeMaps: VxeSplitPrivateComputed = {
      computeItemOpts
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

    const recalculate = () => {
      return nextTick().then(() => {
        const { vertical } = props
        const { staticItems } = reactData
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
    }

    const dragEvent = (evnt: MouseEvent) => {
      evnt.preventDefault()
      const { vertical } = props
      const { staticItems } = reactData
      const handleEl = evnt.currentTarget as HTMLDivElement
      const el = refElem.value
      if (!el) {
        return
      }
      const itemId = handleEl.getAttribute('xid')
      const itemIndex = XEUtils.findIndexOf(staticItems, item => item.id === itemId)
      const item = staticItems[itemIndex]
      if (!item) {
        return
      }
      const itemOpts = computeItemOpts.value
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
    }

    const splitMethods: SplitMethods = {
      dispatchEvent,
      recalculate
    }

    const splitPrivateMethods: SplitPrivateMethods = {
    }

    Object.assign($xeSplit, splitMethods, splitPrivateMethods)

    const renderItems = () => {
      const { border, vertical } = props
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
            xid: id,
            class: ['vxe-split-item', vertical ? 'is--vertical' : 'is--horizontal', {
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
                xid: id,
                class: 'vxe-split-item-handle',
                onMousedown: dragEvent
              })
              : renderEmptyElement($xeSplit),
            h('div', {
              xid: id,
              class: 'vxe-split-item--wrapper'
            }, defaultSlot ? callSlot(defaultSlot, { }) : [])
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

    watch(() => reactData.staticItems, () => {
      recalculate()
    })

    onMounted(() => {
      recalculate()
    })

    onActivated(() => {
      recalculate()
    })

    provide('$xeSplit', $xeSplit)

    $xeSplit.renderVN = renderVN

    return $xeSplit
  },
  render () {
    return this.renderVN()
  }
})
