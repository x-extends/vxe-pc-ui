import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getConfig, globalEvents, globalResize, createEvent, globalMixins } from '../../ui'
import { browse, isScale } from '../../ui/src/dom'
import { getSlotVNs } from '../../ui/src/vn'
import VxeLoadingComponent from '../../loading/src/loading'

import type { VxeListPropTypes, VxeListEmits, VxeComponentSizeType, ListReactData, ValueOf, ListInternalData } from '../../../types'

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeList',
  mixins: [
    globalMixins.sizeMixin
  ],
  props: {
    data: Array as PropType<VxeListPropTypes.Data>,
    height: [Number, String] as PropType<VxeListPropTypes.Height>,
    maxHeight: [Number, String] as PropType<VxeListPropTypes.MaxHeight>,
    loading: Boolean as PropType<VxeListPropTypes.Loading>,
    className: [String, Function] as PropType<VxeListPropTypes.ClassName>,
    size: { type: String as PropType<VxeListPropTypes.Size>, default: () => getConfig().list.size || getConfig().size },
    autoResize: { type: Boolean as PropType<VxeListPropTypes.AutoResize>, default: () => getConfig().list.autoResize },
    syncResize: [Boolean, String, Number] as PropType<VxeListPropTypes.SyncResize>,
    scrollY: Object as PropType<VxeListPropTypes.ScrollY>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: ListReactData = {
      scrollYLoad: false,
      bodyHeight: 0,
      customHeight: 0,
      customMaxHeight: 0,
      parentHeight: 0,
      topSpaceHeight: 0,
      items: []
    }
    const internalData: ListInternalData = {
      resizeObserver: undefined,
      fullData: [],
      lastScrollLeft: 0,
      lastScrollTop: 0,
      scrollYStore: {
        startIndex: 0,
        endIndex: 0,
        visibleSize: 0,
        offsetSize: 0,
        rowHeight: 0
      }
    }
    return {
      xID,
      reactData,
      internalData
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeSYOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({} as { gt: number }, getConfig().list.scrollY, props.scrollY)
    },
    computeStyles () {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData

      const { height, maxHeight } = props
      const { customHeight, customMaxHeight } = reactData
      const style: { [key: string]: string | number } = {}
      if (height) {
        style.height = `${customHeight}px`
      } else if (maxHeight) {
        style.height = 'auto'
        style.maxHeight = `${customMaxHeight}px`
      }
      return style
    }

  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeListEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeList = this
      $xeList.$emit(type, createEvent(evnt, { $list: $xeList }, params))
    },
    callSlot  (slotFunc: ((params: any, h: CreateElement) => any) | string | null, params: any, h: CreateElement) {
      const $xeList = this
      const slots = $xeList.$scopedSlots

      if (slotFunc) {
        if (XEUtils.isString(slotFunc)) {
          slotFunc = slots[slotFunc] || null
        }
        if (XEUtils.isFunction(slotFunc)) {
          return getSlotVNs(slotFunc.call($xeList, params, h))
        }
      }
      return []
    },
    /**
       * 加载数据
       * @param {Array} datas 数据
       */
    loadData (datas: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { scrollYStore } = internalData
      const sYOpts = $xeList.computeSYOpts
      const fullData = datas || []
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0
      })
      internalData.fullData = fullData
      // 如果gt为0，则总是启用
      reactData.scrollYLoad = !!sYOpts.enabled && sYOpts.gt > -1 && (sYOpts.gt === 0 || sYOpts.gt <= fullData.length)
      $xeList.handleData()
      return $xeList.computeScrollLoad().then(() => {
        $xeList.refreshScroll()
      })
    },
    /**
     * 重新加载数据
     * @param {Array} datas 数据
     */
    reloadData (datas: any) {
      const $xeList = this

      $xeList.clearScroll()
      return $xeList.loadData(datas)
    },
    calcTableHeight (key: 'height' | 'maxHeight') {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData

      const { parentHeight } = reactData
      const val = props[key]
      let num = 0
      if (val) {
        if (val === '100%' || val === 'auto') {
          num = parentHeight
        } else {
          if (isScale(val)) {
            num = Math.floor((XEUtils.toInteger(val) || 1) / 100 * parentHeight)
          } else {
            num = XEUtils.toNumber(val)
          }
          num = Math.max(40, num)
        }
      }
      return num
    },
    updateHeight () {
      const $xeList = this
      const reactData = $xeList.reactData

      reactData.customHeight = $xeList.calcTableHeight('height')
      reactData.customMaxHeight = $xeList.calcTableHeight('maxHeight')
    },
    updateYSpace  () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { scrollYLoad } = reactData
      const { scrollYStore, fullData } = internalData
      reactData.bodyHeight = scrollYLoad ? fullData.length * scrollYStore.rowHeight : 0
      reactData.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0
    },
    handleData () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { scrollYLoad } = reactData
      const { fullData, scrollYStore } = internalData
      reactData.items = scrollYLoad ? fullData.slice(scrollYStore.startIndex, scrollYStore.endIndex) : fullData.slice(0)
      return $xeList.$nextTick()
    },
    updateYData () {
      const $xeList = this

      $xeList.handleData()
      $xeList.updateYSpace()
    },
    computeScrollLoad  () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      return $xeList.$nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = $xeList.$refs.refVirtualBody as HTMLDivElement
        const sYOpts = $xeList.computeSYOpts
        let rowHeight = 0
        let firstItemElem: HTMLElement | undefined
        if (virtualBodyElem) {
          if (sYOpts.sItem) {
            firstItemElem = virtualBodyElem.querySelector(sYOpts.sItem) as HTMLElement
          }
          if (!firstItemElem) {
            firstItemElem = virtualBodyElem.children[0] as HTMLElement
          }
        }
        if (firstItemElem) {
          rowHeight = firstItemElem.offsetHeight
        }
        rowHeight = Math.max(12, rowHeight)
        scrollYStore.rowHeight = rowHeight
        // 计算 Y 逻辑
        if (scrollYLoad) {
          const scrollBodyElem = $xeList.$refs.refVirtualWrapper as HTMLElement
          const visibleYSize = Math.max(8, Math.ceil(scrollBodyElem.clientHeight / rowHeight))
          const offsetYSize = sYOpts.oSize ? XEUtils.toNumber(sYOpts.oSize) : (browse.edge ? 10 : 0)
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(scrollYStore.startIndex + visibleYSize + offsetYSize, scrollYStore.endIndex)
          $xeList.updateYData()
        } else {
          $xeList.updateYSpace()
        }
      })
    },
    /**
     * 清除滚动条
     */
    clearScroll () {
      const $xeList = this

      const scrollBodyElem = $xeList.$refs.refVirtualWrapper as HTMLElement
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
      }
      return $xeList.$nextTick()
    },
    /**
     * 如果有滚动条，则滚动到对应的位置
     * @param {Number} scrollLeft 左距离
     * @param {Number} scrollTop 上距离
     */
    scrollTo (scrollLeft: number | null, scrollTop?: number | null) {
      const $xeList = this
      const reactData = $xeList.reactData

      const scrollBodyElem = $xeList.$refs.refVirtualWrapper as HTMLElement
      if (XEUtils.isNumber(scrollLeft)) {
        scrollBodyElem.scrollLeft = scrollLeft
      }
      if (XEUtils.isNumber(scrollTop)) {
        scrollBodyElem.scrollTop = scrollTop
      }
      if (reactData.scrollYLoad) {
        return new Promise<void>(resolve => {
          setTimeout(() => {
            $xeList.$nextTick(() => {
              resolve()
            })
          }, 50)
        })
      }
      return $xeList.$nextTick()
    },
    /**
     * 刷新滚动条
     */
    refreshScroll  () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { lastScrollLeft, lastScrollTop } = internalData
      return $xeList.clearScroll().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          internalData.lastScrollLeft = 0
          internalData.lastScrollTop = 0
          return scrollTo(lastScrollLeft, lastScrollTop)
        }
      })
    },
    /**
     * 重新计算列表
     */
    recalculate  () {
      const $xeList = this
      const reactData = $xeList.reactData

      const el = $xeList.$refs.refElem as HTMLDivElement
      if (el) {
        const parentEl = el.parentElement
        reactData.parentHeight = parentEl ? parentEl.clientHeight : 0
        $xeList.updateHeight()
        if (el.clientWidth && el.clientHeight) {
          return $xeList.computeScrollLoad()
        }
      }
      return $xeList.$nextTick()
    },
    loadYData  (evnt: Event) {
      const $xeList = this
      const internalData = $xeList.internalData

      const { scrollYStore } = internalData
      const { startIndex, endIndex, visibleSize, offsetSize, rowHeight } = scrollYStore
      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const toVisibleIndex = Math.floor(scrollTop / rowHeight)
      const offsetStartIndex = Math.max(0, toVisibleIndex - 1 - offsetSize)
      const offsetEndIndex = toVisibleIndex + visibleSize + offsetSize
      if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
        if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
          scrollYStore.startIndex = offsetStartIndex
          scrollYStore.endIndex = offsetEndIndex
          $xeList.updateYData()
        }
      }
    },
    scrollEvent (evnt: Event) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const scrollLeft = scrollBodyElem.scrollLeft
      const isX = scrollLeft !== internalData.lastScrollLeft
      const isY = scrollTop !== internalData.lastScrollTop
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (reactData.scrollYLoad) {
        $xeList.loadYData(evnt)
      }
      $xeList.dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const slots = $xeList.$scopedSlots

      const { className, loading } = props
      const { bodyHeight, topSpaceHeight, items } = reactData
      const defaultSlot = slots.default
      const vSize = $xeList.computeSize
      const styles = $xeList.computeStyles
      return h('div', {
        ref: 'refElem',
        class: ['vxe-list', className ? (XEUtils.isFunction(className) ? className({ $list: $xeList }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--loading': loading
        }]
      }, [
        h('div', {
          ref: 'refVirtualWrapper',
          class: 'vxe-list--virtual-wrapper',
          style: styles,
          on: {
            scroll: $xeList.scrollEvent
          }
        }, [
          h('div', {
            class: 'vxe-list--y-space',
            style: {
              height: bodyHeight ? `${bodyHeight}px` : ''
            }
          }),
          h('div', {
            ref: 'refVirtualBody',
            class: 'vxe-list--body',
            style: {
              marginTop: topSpaceHeight ? `${topSpaceHeight}px` : ''
            }
          }, defaultSlot ? $xeList.callSlot(defaultSlot, { items }, h) : [])
        ]),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list--loading',
          props: {
            value: loading
          }
        })
      ])
    }
  },
  watch: {
    data () {
      const $xeList = this
      const props = $xeList

      $xeList.loadData(props.data || [])
    },
    height () {
      const $xeList = this

      $xeList.recalculate()
    },
    maxHeight () {
      const $xeList = this

      $xeList.recalculate()
    },
    syncResize (val) {
      const $xeList = this

      if (val) {
        $xeList.recalculate()
        $xeList.$nextTick(() => setTimeout(() => $xeList.recalculate()))
      }
    }
  },
  created () {
    const $xeList = this
    const props = $xeList

    $xeList.loadData(props.data || [])
  },
  mounted () {
    const $xeList = this
    const props = $xeList
    const internalData = $xeList.internalData

    $xeList.recalculate()
    if (props.autoResize) {
      const el = $xeList.$refs.refElem as HTMLDivElement
      const resizeObserver = globalResize.create(() => $xeList.recalculate())
      resizeObserver.observe(el)
      if (el) {
        resizeObserver.observe(el.parentElement as HTMLDivElement)
      }
      internalData.resizeObserver = resizeObserver
    }
    globalEvents.on($xeList, 'resize', $xeList.recalculate)
  },
  activated () {
    const $xeList = this

    $xeList.recalculate().then(() => $xeList.refreshScroll())
  },
  beforeDestroy () {
    const $xeList = this
    const internalData = $xeList.internalData

    const { resizeObserver } = internalData
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    globalEvents.off($xeList, 'resize')
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
