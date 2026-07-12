import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils, { XEBrowse } from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, menus, globalEvents, globalResize, createEvent, globalMixins, renderEmptyElement } from '../../ui'
import { crossListDragRowGlobal, getCrossListDragRowInfo } from './store'
import { addClass, getTpImg, isScale, removeClass, toCssUnit } from '../../ui/src/dom'
import { isEnableConf, getText, enModelValue, deModelValue } from '../../ui/src/utils'
import { getSlotVNs } from '../../ui/src/vn'
import { createComponentLog } from '../../ui/src/log'
import { moveRowAnimateToTb, clearRowAnimate } from '../../ui/src/anime'
import { getItemCacheObj } from './util'
import VxeLoadingComponent from '../../loading/src/loading'

import type { VxeListPropTypes, VxeListEmits, VxeComponentSizeType, ListReactData, VxeListDefines, ValueOf, ListInternalData, VxeListConstructor, VxeListPrivateMethods, VxeComponentStyleType } from '../../../types'

const { warnLog, errLog } = createComponentLog('tree')

let crossListDragRowObj: {
  $oldList: VxeListConstructor & VxeListPrivateMethods
  $newList: (VxeListConstructor & VxeListPrivateMethods) | null
} | null = null

function eqRowKey (rowKey1: any, rowKey2: any) {
  return ('' + rowKey1) === ('' + rowKey2)
}

function getRowKeyByField (row: any, keyField: string) {
  return row ? ('' + (row[keyField] || '')) : ''
}

function getRowIdByField (row: any, keyField: string) {
  if (!row) {
    return ''
  }
  const rowKey = getRowKeyByField(row, keyField)
  return enModelValue(rowKey)
}

function createReactData (): ListReactData {
  return {
    scrollYLoad: false,
    bodyHeight: 0,
    headHeight: 0,
    footHeight: 0,
    customHeight: 0,
    customMaxHeight: 0,
    parentHeight: 0,
    topSpaceHeight: 0,
    rowList: [],
    selectRadioRow: null,
    currRowFlag: 1,
    updateCheckboxFlag: 1,
    isAllChecked: false,
    isAllIndeterminate: false,
    insertRowFlag: 1,
    removeRowFlag: 1,
    dragRow: null,
    dragTipText: '',
    isCrossDragRow: false
  }
}

function createInternalData (): ListInternalData {
  return {
    resizeObserver: undefined,
    fullData: [],
    afterList: [],
    fullKeyMaps: {},
    rowMaps: {},
    lastScrollLeft: 0,
    lastScrollTop: 0,
    scrollYStore: {
      startIndex: 0,
      endIndex: 0,
      visibleSize: 0,
      offsetSize: 0,
      rowHeight: 0
    },
    currentRow: null,
    selectCheckboxMaps: {},
    insertRowMaps: {},
    removeRowMaps: {}
    // prevDragRow: null,
    // prevDragPos: ''
  }
}

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
    size: {
      type: String as PropType<VxeListPropTypes.Size>,
      default: () => getConfig().list.size || getConfig().size
    },
    autoResize: {
      type: Boolean as PropType<VxeListPropTypes.AutoResize>,
      default: () => getConfig().list.autoResize
    },
    syncResize: [Boolean, String, Number] as PropType<VxeListPropTypes.SyncResize>,
    showSeq: {
      type: Boolean as PropType<VxeListPropTypes.ShowSeq>,
      default: () => getConfig().list.showSeq
    },
    showRadio: {
      type: Boolean as PropType<VxeListPropTypes.ShowRadio>,
      default: () => getConfig().list.showRadio
    },
    checkRowKey: [String, Number] as PropType<VxeListPropTypes.CheckRowKey>,
    radioConfig: Object as PropType<VxeListPropTypes.RadioConfig>,
    showCheckbox: {
      type: Boolean as PropType<VxeListPropTypes.ShowCheckbox>,
      default: () => getConfig().list.showCheckbox
    },
    checkRowKeys: Array as PropType<VxeListPropTypes.CheckRowKeys>,
    checkboxConfig: Object as PropType<VxeListPropTypes.CheckboxConfig>,
    rowConfig: Object as PropType<VxeListPropTypes.RowConfig>,
    dragConfig: Object as PropType<VxeListPropTypes.DragConfig>,
    menuConfig: Object as PropType<VxeListPropTypes.MenuConfig>,
    virtualYConfig: Object as PropType<VxeListPropTypes.VirtualYConfig>,
    scrollY: Object as PropType<VxeListPropTypes.ScrollY>
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData = createReactData()
    return {
      ...({} as {
        internalData: ListInternalData,
        browseObj: XEBrowse
      }),
      xID,
      reactData,
      crossListDragRowInfo: crossListDragRowGlobal,

      reFlag: 0
    }
  },
  computed: {
    ...({} as {
      computeSize(): VxeComponentSizeType
    }),
    computeRowOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({}, getConfig().list.rowConfig, props.rowConfig)
    },
    computeDragOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({}, getConfig().list.dragConfig, props.dragConfig)
    },
    computeSYOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({} as { gt: number }, getConfig().list.virtualYConfig || getConfig().list.scrollY, props.virtualYConfig || props.scrollY)
    },
    computeKeyField () {
      const $xeList = this

      const rowOpts = $xeList.computeRowOpts as VxeListPropTypes.RowConfig
      const { keyField } = rowOpts
      return keyField || ''
    },
    computeIsDrag () {
      const $xeList = this
      const props = $xeList

      const { dragConfig } = props
      const dragOpts = $xeList.computeDragOpts as VxeListPropTypes.DragConfig
      return dragConfig && isEnableConf(dragOpts)
    },
    computeRowHeight () {
      const $xeList = this

      const rowOpts = $xeList.computeRowOpts as VxeListPropTypes.RowConfig
      const { height } = rowOpts
      return height
    },
    computeRadioOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({ showIcon: true }, getConfig().list.radioConfig, props.radioConfig)
    },
    computeCheckboxOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({ showIcon: true }, getConfig().list.checkboxConfig, props.checkboxConfig)
    },
    computeMenuOpts () {
      const $xeList = this
      const props = $xeList

      return Object.assign({}, getConfig().list.menuConfig, props.menuConfig)
    },
    computeWrapperStyles () {
      const $xeList = this

      const rowHeight = $xeList.computeRowHeight
      const style: VxeComponentStyleType = {}
      if (rowHeight) {
        style['--vxe-ui-list-row-height'] = toCssUnit(rowHeight)
      }
      return style
    },
    computeVirtualStyles () {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData

      const { height, maxHeight } = props
      const { customHeight, customMaxHeight, headHeight, footHeight } = reactData
      const style: VxeComponentStyleType = {}
      if (height) {
        style.height = toCssUnit(Math.max(20, customHeight - headHeight - footHeight))
      } else if (maxHeight) {
        style.height = 'auto'
        style.maxHeight = toCssUnit(Math.max(20, customMaxHeight - headHeight - footHeight))
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
    emitCheckboxMode (value: VxeListPropTypes.CheckRowKeys) {
      const $xeList = this

      $xeList.$emit('update:checkRowKeys', value)
    },
    emitRadioMode (value: VxeListPropTypes.CheckRowKey) {
      const $xeList = this

      $xeList.$emit('update:checkRowKey', value)
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
    getRowId (row: any) {
      const $xeList = this

      const keyField = $xeList.computeKeyField
      return getRowIdByField(row, keyField)
    },
    updateRadioModeValue () {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { checkRowKey } = props
      const { fullKeyMaps } = internalData
      if (checkRowKey) {
        const row = fullKeyMaps[checkRowKey]
        reactData.selectRadioRow = row || null
      } else {
        reactData.selectRadioRow = null
      }
    },
    updateCheckboxModeValue () {
      const $xeList = this
      const props = $xeList
      const internalData = $xeList.internalData

      const { checkRowKeys } = props
      const { fullKeyMaps } = internalData
      const keyField = $xeList.computeKeyField
      const selectMaps: Record<string, any> = {}
      if (checkRowKeys && checkRowKeys.length) {
        for (const rowKey of checkRowKeys) {
          const row = fullKeyMaps[rowKey as string]
          if (row) {
            const rowid = getRowIdByField(row, keyField)
            selectMaps[rowid] = row
          }
        }
      }
      internalData.selectCheckboxMaps = selectMaps
      $xeList.updateCheckboxStatus()
    },
    updateAfterDataIndex () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { afterList, rowMaps } = internalData
      const keyField = $xeList.computeKeyField
      let vtIndex = 0
      afterList.forEach((item, index) => {
        const roweid = getRowIdByField(item, keyField)
        const rowRest = rowMaps[roweid]
        if (rowRest) {
          rowRest._index = vtIndex
        } else {
          const rest = {
            item,
            index,
            $index: -1,
            _index: vtIndex
          }
          rowMaps[roweid] = rest
        }
        vtIndex++
      })
    },
    cacheRowMap () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { fullData } = internalData
      const keyField = $xeList.computeKeyField
      const keyMaps: Record<string, any> = {}
      fullData.forEach(row => {
        const rowKey = getRowKeyByField(row, keyField)
        keyMaps[rowKey] = row
      })
      internalData.fullKeyMaps = keyMaps
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
      const fullData = datas ? datas.slice(0) : []
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0
      })
      internalData.fullData = fullData
      internalData.insertRowMaps = {}
      reactData.insertRowFlag++
      internalData.removeRowMaps = {}
      reactData.removeRowFlag++
      // 如果gt为0，则总是启用
      reactData.scrollYLoad = !!sYOpts.enabled && sYOpts.gt > -1 && (sYOpts.gt === 0 || sYOpts.gt <= fullData.length)
      $xeList.cacheRowMap()
      $xeList.handleData(true)
      $xeList.updateRadioModeValue()
      $xeList.updateCheckboxModeValue()
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
    getFullData () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { fullData } = internalData
      return fullData
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

      const headEl = $xeList.$refs.refHeaderElem as HTMLDivElement
      const footEl = $xeList.$refs.refFooterElem as HTMLDivElement
      reactData.headHeight = headEl ? Math.floor(headEl.offsetHeight) : 0
      reactData.footHeight = footEl ? Math.floor(footEl.offsetHeight) : 0
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
    updateAfterFullData () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { fullData } = internalData
      internalData.afterList = fullData.slice(0)
      $xeList.updateAfterDataIndex()
    },
    handleData (force?: boolean) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { scrollYLoad } = reactData
      const { fullData, scrollYStore, rowMaps } = internalData
      const keyField = $xeList.computeKeyField
      if (force) {
        // 更新数据，处理筛选和排序
        $xeList.updateAfterFullData()
      }
      const rowList = scrollYLoad ? fullData.slice(scrollYStore.startIndex, scrollYStore.endIndex) : fullData.slice(0)
      if (keyField) {
        rowList.forEach((item, $index) => {
          const rowid = getRowIdByField(item, keyField)
          const rowRest = rowMaps[rowid]
          if (rowRest) {
            rowRest.$index = $index
          }
        })
      }
      reactData.rowList = rowList
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
      const browseObj = $xeList.browseObj

      return $xeList.$nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = $xeList.$refs.refVirtualBody as HTMLDivElement
        const sYOpts = $xeList.computeSYOpts
        let rowHeight = 0
        let firstRowElem: HTMLElement | undefined
        if (virtualBodyElem) {
          if (sYOpts.sItem) {
            firstRowElem = virtualBodyElem.querySelector(sYOpts.sItem) as HTMLElement
          }
          if (!firstRowElem) {
            firstRowElem = virtualBodyElem.children[0] as HTMLElement
          }
        }
        if (firstRowElem) {
          rowHeight = firstRowElem.offsetHeight
        }
        rowHeight = Math.max(12, rowHeight)
        scrollYStore.rowHeight = rowHeight
        // 计算 Y 逻辑
        if (scrollYLoad) {
          const scrollBodyElem = $xeList.$refs.refVirtualWrapper as HTMLElement
          const visibleYSize = Math.max(8, Math.ceil(scrollBodyElem.clientHeight / rowHeight))
          const offsetYSize = sYOpts.oSize ? XEUtils.toNumber(sYOpts.oSize) : (browseObj.edge ? 10 : 0)
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
     */
    scrollTo (scrollLeft: { top?: number | null; left?: number | null; } | number | null | undefined, scrollTop?: number | null) {
      const $xeList = this
      const reactData = $xeList.reactData

      const scrollBodyElem = $xeList.$refs.refVirtualWrapper as HTMLElement
      if (scrollLeft) {
        if (!XEUtils.isNumber(scrollLeft)) {
          scrollTop = scrollLeft.top
          scrollLeft = scrollLeft.left
        }
      }
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
        let parentHeight = 0
        if (parentEl) {
          const parentStyle = getComputedStyle(parentEl)
          parentHeight = parentEl.clientHeight - Math.ceil(XEUtils.toNumber(parentStyle.paddingLeft) + XEUtils.toNumber(parentStyle.paddingRight))
        }
        reactData.parentHeight = parentHeight
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
    getRowKey (row: any) {
      const $xeList = this

      const keyField = $xeList.computeKeyField
      return getRowKeyByField(row, keyField)
    },
    eqRowKey,
    eqRow (row1: any, row2: any) {
      const $xeList = this

      if (row1 && row2) {
        if (row1 === row2) {
          return true
        }
        return eqRowKey($xeList.getRowId(row1), $xeList.getRowId(row2))
      }
      return false
    },
    eqRowByKey (row: any, rowKey: string | number | null | undefined) {
      const $xeList = this

      return row && eqRowKey($xeList.getRowKey(row), rowKey)
    },
    findRow (list: any, row: any) {
      const $xeList = this

      return row ? XEUtils.find(list, obj => $xeList.eqRow(obj, row)) : null
    },
    findRowByKey (list: any, rowId: string | number | null | undefined) {
      const $xeList = this

      const keyField = $xeList.computeKeyField
      return XEUtils.find(list, obj => eqRowKey(getRowIdByField(obj, keyField), rowId))
    },
    findRowIndexOf (list: any, row: any) {
      const $xeList = this

      return row ? XEUtils.findIndexOf(list, obj => $xeList.eqRow(obj, row)) : -1
    },
    findRowIndexOfByKey (list: any, rowKey: string | number | null | undefined) {
      const $xeList = this

      const keyField = $xeList.computeKeyField
      return XEUtils.findIndexOf(list, obj => eqRowKey(getRowIdByField(obj, keyField), rowKey))
    },
    isCheckedByRadioRowKey (rowKey: string | number | null | undefined) {
      const $xeList = this
      const reactData = $xeList.reactData

      const { selectRadioRow } = reactData
      return $xeList.getRowKey(selectRadioRow) === rowKey
    },
    isCheckedByRadioRow (row: any) {
      const $xeList = this

      return $xeList.isCheckedByRadioRowKey($xeList.getRowKey(row))
    },
    isCheckedByCheckboxRowKey (rowid: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[rowid])
    },
    isCheckedByCheckboxRow (row: any) {
      const $xeList = this

      return $xeList.isCheckedByCheckboxRowKey($xeList.getRowKey(row))
    },
    setCurrentRow (row: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      internalData.currentRow = row
      reactData.currRowFlag++
      return $xeList.$nextTick()
    },
    setCurrentRowByKey (rowKey: string | number | null | undefined) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { fullData } = internalData
      internalData.currentRow = $xeList.findRowByKey(fullData, rowKey)
      reactData.currRowFlag++
      return $xeList.$nextTick()
    },
    getCurrentRow () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { currentRow } = internalData
      return currentRow
    },
    getCurrentRowKey () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { currentRow } = internalData
      return currentRow ? $xeList.getRowKey(currentRow) : null
    },
    clearCurrentRow () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      internalData.currentRow = null
      reactData.currRowFlag++
      return $xeList.$nextTick()
    },
    setRadioRow (row: any) {
      const $xeList = this
      const reactData = $xeList.reactData

      reactData.selectRadioRow = row
      const value = $xeList.getRowKey(row)
      $xeList.emitRadioMode(value)
      return $xeList.$nextTick()
    },
    setRadioRowByKey (rowKey: string | number | null | undefined) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { fullData } = internalData
      reactData.selectRadioRow = $xeList.findRowByKey(fullData, rowKey)
      const value = rowKey as string
      $xeList.emitRadioMode(value)
      return $xeList.$nextTick()
    },
    getRadioRow () {
      const $xeList = this
      const reactData = $xeList.reactData

      const { selectRadioRow } = reactData
      return selectRadioRow
    },
    getRadioRowKey () {
      const $xeList = this
      const reactData = $xeList.reactData

      const { selectRadioRow } = reactData
      return selectRadioRow ? $xeList.getRowKey(selectRadioRow) : null
    },
    clearRadioRow () {
      const $xeList = this
      const reactData = $xeList.reactData

      const value = null
      reactData.selectRadioRow = value
      $xeList.emitRadioMode(value)
      return $xeList.$nextTick()
    },
    setCheckboxRow (row: any | any[], checked: boolean) {
      const $xeList = this
      const internalData = $xeList.internalData

      const { selectCheckboxMaps } = internalData
      const keyField = $xeList.computeKeyField
      const rowList = row ? (XEUtils.isArray(row) ? row : [row]) : []
      rowList.forEach(checked
        ? (obj) => {
            const rowid = getRowIdByField(obj, keyField)
            if (!selectCheckboxMaps[rowid]) {
              selectCheckboxMaps[rowid] = obj
            }
          }
        : (obj) => {
            const rowid = getRowIdByField(obj, keyField)
            if (selectCheckboxMaps[rowid]) {
              delete selectCheckboxMaps[rowid]
            }
          })
      const value = $xeList.getCheckboxRowKeys()
      $xeList.emitCheckboxMode(value)
      return $xeList.updateCheckboxStatus()
    },
    setCheckboxRowByKey (rowKey: string | number | null | undefined | (string | number | null | undefined)[], checked: boolean) {
      const $xeList = this
      const internalData = $xeList.internalData

      const { selectCheckboxMaps, fullKeyMaps } = internalData
      const keyField = $xeList.computeKeyField
      const rowKeys = rowKey ? (XEUtils.isArray(rowKey) ? rowKey : [rowKey]) : []
      rowKeys.forEach(checked
        ? (key) => {
            const row = fullKeyMaps[key || '']
            if (row) {
              const rowid = getRowIdByField(row, keyField)
              if (row && !selectCheckboxMaps[rowid]) {
                selectCheckboxMaps[rowid] = row
              }
            }
          }
        : (key) => {
            const row = fullKeyMaps[key || '']
            if (row) {
              const rowid = getRowIdByField(row, keyField)
              if (selectCheckboxMaps[rowid]) {
                delete selectCheckboxMaps[rowid]
              }
            }
          })
      const value = $xeList.getCheckboxRowKeys()
      $xeList.emitCheckboxMode(value)
      return $xeList.updateCheckboxStatus()
    },
    getCheckboxRecords () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      const rowList: string[] = []
      if (updateCheckboxFlag) {
        XEUtils.each(selectCheckboxMaps, row => {
          if (row) {
            rowList.push(row)
          }
        })
      }
      return rowList
    },
    getCheckboxRows () {
      const $xeList = this

      return $xeList.getCheckboxRecords()
    },
    getCheckboxRowKeys () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      const keyField = $xeList.computeKeyField
      const rowKeys: string[] = []
      if (updateCheckboxFlag) {
        XEUtils.each(selectCheckboxMaps, row => {
          if (row) {
            const rowKey = getRowKeyByField(row, keyField)
            rowKeys.push(rowKey)
          }
        })
      }
      return rowKeys
    },
    clearCheckboxRow () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      reactData.isAllChecked = false
      reactData.isAllIndeterminate = false
      const value: string[] = []
      $xeList.emitCheckboxMode(value)
      return $xeList.$nextTick()
    },
    setAllCheckboxRow (checked: boolean) {
      const $xeList = this
      const internalData = $xeList.internalData

      const { fullData, selectCheckboxMaps } = internalData
      const keyField = $xeList.computeKeyField
      if (checked) {
        const value: string[] = []
        for (const row of fullData) {
          const rowKey = getRowKeyByField(row, keyField)
          const rowid = getRowIdByField(row, keyField)
          selectCheckboxMaps[rowid] = row
          value.push(rowKey)
        }
        $xeList.emitCheckboxMode(value)
        return $xeList.updateCheckboxStatus()
      }
      return $xeList.clearCheckboxRow()
    },
    updateCheckboxStatus () {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { selectCheckboxMaps, fullData } = internalData
      const keyField = $xeList.computeKeyField
      const checkboxOpts = $xeList.computeCheckboxOpts
      const { checkMethod } = checkboxOpts

      let hasChecked = false
      let hasUnchecked = false
      if (checkMethod) {
        for (const row of fullData) {
          if (checkMethod({ row, $list: $xeList })) {
            const rowid = getRowIdByField(row, keyField)
            if (selectCheckboxMaps[rowid]) {
              hasChecked = true
            } else {
              hasUnchecked = true
              if (hasChecked) {
                break
              }
            }
          }
        }
      } else {
        for (const row of fullData) {
          const rowid = getRowIdByField(row, keyField)
          if (selectCheckboxMaps[rowid]) {
            hasChecked = true
          } else {
            hasUnchecked = true
            if (hasChecked) {
              break
            }
          }
        }
      }

      reactData.isAllChecked = hasChecked && !hasUnchecked
      reactData.isAllIndeterminate = hasChecked && hasUnchecked
      reactData.updateCheckboxFlag++
      return $xeList.$nextTick()
    },
    changeCheckboxAllEvent (evnt: MouseEvent) {
      const $xeList = this
      const reactData = $xeList.reactData

      const { isAllChecked } = reactData
      const isChecked = !isAllChecked
      if (isChecked) {
        $xeList.setAllCheckboxRow(true)
      } else {
        $xeList.clearCheckboxRow()
      }
      $xeList.dispatchEvent('checkbox-all', { checked: isChecked }, evnt)
    },
    changeCheckboxEvent (evnt: MouseEvent, row: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      evnt.preventDefault()
      evnt.stopPropagation()
      const { selectCheckboxMaps } = internalData
      const checkboxOpts = $xeList.computeCheckboxOpts
      const { checkMethod } = checkboxOpts
      const rowid = $xeList.getRowKey(row)
      const isDisabled = checkMethod ? !checkMethod({ $list: $xeList, row }) : false
      if (isDisabled) {
        return
      }
      let isChecked = false
      if (selectCheckboxMaps[rowid]) {
        delete selectCheckboxMaps[rowid]
      } else {
        isChecked = true
        selectCheckboxMaps[rowid] = row
      }
      reactData.updateCheckboxFlag++
      $xeList.updateCheckboxStatus()
      const rowids = XEUtils.keys(selectCheckboxMaps)
      const value = rowids.map(deModelValue)
      $xeList.emitCheckboxMode(value)
      $xeList.dispatchEvent('checkbox-change', { row, value, checked: isChecked }, evnt)
    },
    changeCurrentEvent (evnt: MouseEvent, row: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      evnt.preventDefault()
      const rowOpts = $xeList.computeRowOpts
      const { currentMethod } = rowOpts
      let isDisabled = false
      if (currentMethod) {
        isDisabled = !currentMethod({ row })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      internalData.currentRow = row
      reactData.currRowFlag++
      $xeList.dispatchEvent('current-change', { row, checked: isChecked }, evnt)
    },
    changeRadioEvent (evnt: MouseEvent, row: any) {
      const $xeList = this
      const reactData = $xeList.reactData

      evnt.preventDefault()
      evnt.stopPropagation()
      const { selectRadioRow } = reactData
      const radioOpts = $xeList.computeRadioOpts
      const { strict, checkMethod } = radioOpts
      const rowKey = $xeList.getRowKey(row)
      const isDisabled = checkMethod ? !checkMethod({ $list: $xeList, row }) : false
      if (isDisabled) {
        return
      }
      const value = rowKey
      let isChecked = true
      if (strict) {
        if (selectRadioRow && rowKey === $xeList.getRowKey(selectRadioRow)) {
          isChecked = false
          reactData.selectRadioRow = null
        } else {
          reactData.selectRadioRow = row
        }
      } else {
        reactData.selectRadioRow = row
      }
      $xeList.emitRadioMode(value)
      $xeList.dispatchEvent('radio-change', { row, value, checked: isChecked }, evnt)
    },
    handleRowDragEndClearStatus () {
      const $xeList = this

      $xeList.clearRowDragData()
      $xeList.clearCrossListDragStatus()
      $xeList.recalculate()
    },
    clearRowDropOrigin () {
      const $xeList = this

      const el = $xeList.$refs.refElem as HTMLDivElement
      if (el) {
        const clss = 'row--drag-origin'
        XEUtils.arrayEach(el.querySelectorAll(`.${clss}`), (elem) => {
          (elem as HTMLTableCellElement).draggable = false
          removeClass(elem, clss)
        })
      }
    },
    updateRowDropOrigin (row: any) {
      const $xeList = this

      const sYOpts = $xeList.computeSYOpts
      const { sItem } = sYOpts
      const el = $xeList.$refs.refElem as HTMLDivElement
      if (el) {
        const clss = 'row--drag-origin'
        const rowid = $xeList.getRowId(row)
        XEUtils.arrayEach(el.querySelectorAll<HTMLDivElement>(`.vxe-list--row[rowid="${rowid}"]` + (sItem ? `${sItem}[rowid="${rowid}"]` : '')), (elem) => {
          addClass(elem, clss)
        })
      }
    },
    updateRowDropTipContent (rowEl: HTMLElement) {
      const $xeList = this
      const reactData = $xeList.reactData

      const { dragRow } = reactData
      const dragOpts = $xeList.computeDragOpts
      const { tooltipMethod } = dragOpts
      const rTooltipMethod = tooltipMethod
      let tipContent = ''
      if (rTooltipMethod) {
        const rtParams = {
          $list: $xeList,
          row: dragRow
        }
        tipContent = `${rTooltipMethod(rtParams) || ''}`
      } else {
        tipContent = getI18n('vxe.list.dragTip', [rowEl.textContent || ''])
      }
      reactData.dragTipText = tipContent
    },
    hideDropTip () {
      const $xeList = this

      const rdTipEl = $xeList.$refs.refDragTipElem as HTMLDivElement
      const rdLineEl = $xeList.$refs.refDragRowLineElem as HTMLDivElement
      if (rdTipEl) {
        rdTipEl.style.display = ''
      }
      if (rdLineEl) {
        rdLineEl.style.display = ''
      }
    },
    clearCrossListDragStatus () {
      const $xeList = this
      const crossListDragRowInfo = getCrossListDragRowInfo($xeList as VxeListConstructor & VxeListPrivateMethods)

      crossListDragRowObj = null
      crossListDragRowInfo.row = null
    },
    clearDragStatus () {
      const $xeList = this
      const reactData = $xeList.reactData

      const { dragRow } = reactData
      if (dragRow) {
        $xeList.hideDropTip()
        $xeList.clearRowDropOrigin()
        $xeList.clearCrossListDragStatus()
        reactData.dragRow = null
      }
    },
    handleRowDragMousedownEvent (evnt: MouseEvent, params: { row: any }) {
      const $xeList = this
      const reactData = $xeList.reactData
      const crossListDragRowInfo = getCrossListDragRowInfo($xeList as VxeListConstructor & VxeListPrivateMethods)

      evnt.stopPropagation()
      const { row } = params
      const dragConfig = $xeList.computeDragOpts
      const { isCrossListDrag, trigger, dragStartMethod } = dragConfig
      const dragEl = evnt.currentTarget as HTMLElement
      const rowEl = trigger === 'row' ? dragEl : (dragEl.parentElement as HTMLElement).parentElement as HTMLElement
      $xeList.clearRowDropOrigin()
      if (dragStartMethod && !dragStartMethod(params)) {
        rowEl.draggable = false
        reactData.dragRow = null
        $xeList.hideDropTip()
        return
      }
      if (isCrossListDrag) {
        crossListDragRowInfo.row = row
        crossListDragRowObj = { $oldList: $xeList, $newList: null }
      }
      const dragstartEventParams: VxeListDefines.RowDragstartEventParams = {
        row
      }
      reactData.dragRow = row
      rowEl.draggable = true
      $xeList.updateRowDropOrigin(row)
      $xeList.updateRowDropTipContent(rowEl)
      $xeList.dispatchEvent('row-dragstart', dragstartEventParams, evnt)
    },
    handleRowDragMouseupEvent () {
      const $xeList = this

      $xeList.clearDragStatus()
    },
    showDropTip (evnt: DragEvent | MouseEvent, rowEl: HTMLElement | null, showLine: boolean, dragPos: string) {
      const $xeList = this

      const wrapperEl = $xeList.$refs.refElem as HTMLDivElement
      if (!wrapperEl) {
        return
      }
      const wrapperRect = wrapperEl.getBoundingClientRect()
      const wrapperHeight = wrapperEl.clientHeight
      if (rowEl) {
        const rdLineEl = $xeList.$refs.refDragRowLineElem as HTMLDivElement
        if (rdLineEl) {
          if (showLine) {
            const trRect = rowEl.getBoundingClientRect()
            let rowHeight = rowEl.clientHeight
            const offsetTop = Math.max(1, trRect.y - wrapperRect.y)
            if (offsetTop + rowHeight > wrapperHeight) {
              rowHeight = wrapperHeight - offsetTop
            }
            rdLineEl.style.display = 'block'
            rdLineEl.style.top = `${offsetTop}px`
            rdLineEl.style.height = `${rowHeight}px`
            rdLineEl.setAttribute('drag-pos', dragPos)
          } else {
            rdLineEl.style.display = ''
          }
        }
      }
      const rdTipEl = $xeList.$refs.refDragTipElem as HTMLDivElement
      if (rdTipEl) {
        rdTipEl.style.display = 'block'
        rdTipEl.style.top = `${Math.min(wrapperEl.clientHeight - wrapperEl.scrollTop - rdTipEl.clientHeight, evnt.clientY - wrapperRect.y)}px`
        rdTipEl.style.left = `${Math.min(wrapperEl.clientWidth - wrapperEl.scrollLeft - rdTipEl.clientWidth - 1, evnt.clientX - wrapperRect.x)}px`
        rdTipEl.setAttribute('drag-status', showLine ? 'normal' : 'disabled')
      }
    },
    clearRowDragData () {
      const $xeList = this
      const reactData = $xeList.reactData

      const wrapperEl = $xeList.$refs.refElem as HTMLDivElement
      const dtClss = ['.vxe-list--row']
      $xeList.hideDropTip()
      $xeList.clearRowDropOrigin()
      clearRowAnimate(wrapperEl, dtClss)
      reactData.dragRow = null
    },
    handleRowDragSwapEvent (evnt: DragEvent | null, dragRow: any, prevDragRow: any, prevDragPos: '' | 'top' | 'bottom' | undefined) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { fullData } = internalData
      const dragConfig = $xeList.computeDragOpts
      const { animation, dragEndMethod } = dragConfig
      const dEndMethod = dragEndMethod || (dragConfig ? dragConfig.dragEndMethod : null)
      const dragOffsetIndex: 0 | 1 = prevDragPos === 'bottom' ? 1 : 0
      const el = $xeList.$refs.refElem as HTMLDivElement
      const errRest = {
        status: false
      }
      if (!(el && prevDragRow && dragRow)) {
        return Promise.resolve(errRest)
      }
      // 判断是否有拖动
      if (prevDragRow !== dragRow) {
        const dragParams = {
          oldRow: dragRow,
          newRow: prevDragRow,
          dragRow,
          dragPos: prevDragPos as 'top' | 'bottom',
          offsetIndex: dragOffsetIndex
        }

        const dragRowid = $xeList.getRowId(dragRow)
        const _dragRowIndex = $xeList.findRowIndexOfByKey(fullData, dragRowid)
        const newRowid = $xeList.getRowKey(prevDragRow)
        let dragRowHeight = 0
        let dragOffsetTop = -1
        if (animation) {
          const prevRowEl = el.querySelector<HTMLElement>(`.vxe-list--row[rowid="${newRowid}"]`)
          const oldRowEl = el.querySelector<HTMLElement>(`.vxe-list--row[rowid="${dragRowid}"]`)
          const targetRowEl = prevRowEl || oldRowEl
          if (targetRowEl) {
            dragRowHeight = targetRowEl.offsetHeight
          }
          if (oldRowEl) {
            dragOffsetTop = oldRowEl.offsetTop
          }
        }

        let oafIndex = -1
        let nafIndex = -1

        return Promise.resolve(dEndMethod ? dEndMethod(dragParams) : true).then((status) => {
          if (!status) {
            return errRest
          }

          // 移出
          oafIndex = $xeList.findRowIndexOf(fullData, dragRow)
          fullData.splice(oafIndex, 1)
          // 插入
          const pafIndex = $xeList.findRowIndexOf(fullData, prevDragRow)
          nafIndex = pafIndex + dragOffsetIndex
          fullData.splice(nafIndex, 0, dragRow)

          $xeList.handleData()
          if (reactData.scrollYLoad) {
            $xeList.updateYSpace()
          }

          if (evnt) {
            const dragendEventParams: VxeListDefines.RowDragendEventParams = {
              oldRow: dragRow,
              newRow: prevDragRow,
              dragRow,
              dragPos: prevDragPos as 'top' | 'bottom',
              offsetIndex: dragOffsetIndex,
              _index: {
                newIndex: nafIndex,
                oldIndex: oafIndex
              }
            }
            $xeList.dispatchEvent('row-dragend', dragendEventParams, evnt)
          }

          return $xeList.$nextTick().then(() => {
            if (animation) {
              const { rowList } = reactData
              const { fullData } = internalData
              const _newRowIndex = $xeList.findRowIndexOfByKey(fullData, dragRowid)
              const firstRow = fullData[0]
              const _firstRowIndex = $xeList.findRowIndexOf(fullData, firstRow)
              const wrapperEl = el
              if (_firstRowIndex > -1) {
                const _lastRowIndex = _firstRowIndex + fullData.length

                let rsIndex = -1
                let reIndex = -1
                let offsetRate = 1
                if (_dragRowIndex < _firstRowIndex) {
                  // 从上往下虚拟拖拽
                  rsIndex = 0
                  reIndex = _newRowIndex - _firstRowIndex
                } else if (_dragRowIndex > _lastRowIndex) {
                  // 从下往上虚拟拖拽
                  const $newRowIndex = $xeList.findRowIndexOfByKey(rowList, dragRowid)
                  rsIndex = $newRowIndex + 1
                  reIndex = fullData.length
                  offsetRate = -1
                } else {
                  if (_newRowIndex > _dragRowIndex) {
                    // 从上往下拖拽
                    rsIndex = _dragRowIndex - _firstRowIndex
                    reIndex = rsIndex + _newRowIndex - _dragRowIndex
                  } else {
                    // 从下往上拖拽
                    rsIndex = _newRowIndex - _firstRowIndex
                    reIndex = rsIndex + _dragRowIndex - _newRowIndex + 1
                    offsetRate = -1
                  }
                }

                const dragRangeList = fullData.slice(rsIndex, reIndex)
                if (dragRangeList.length) {
                  const dtClss: string[] = []
                  dragRangeList.forEach(obj => {
                    const rowid = $xeList.getRowId(obj)
                    dtClss.push(`.vxe-list--row[rowid="${rowid}"]`)
                  })
                  const dtTrList = wrapperEl.querySelectorAll<HTMLElement>(dtClss.join(','))
                  moveRowAnimateToTb(dtTrList, offsetRate * dragRowHeight)
                }
              }

              const drClss = [`.vxe-list--row[rowid="${dragRowid}"]`]
              const newDtTrList = wrapperEl.querySelectorAll<HTMLElement>(drClss.join(','))
              const newTrEl = newDtTrList[0]
              if (dragOffsetTop > -1 && newTrEl) {
                moveRowAnimateToTb(newDtTrList, dragOffsetTop - newTrEl.offsetTop)
              }
            }

            $xeList.recalculate()
          }).then(() => {
            return {
              status: true
            }
          })
        }).catch(() => {
          return errRest
        }).then((rest) => {
          $xeList.clearRowDragData()
          $xeList.clearCrossListDragStatus()
          return rest
        })
      }
      $xeList.clearRowDragData()
      $xeList.clearCrossListDragStatus()
      return Promise.resolve(errRest)
    },
    handleRowDragDragstartEvent (evnt: DragEvent) {
      if (evnt.dataTransfer) {
        evnt.dataTransfer.setDragImage(getTpImg(), 0, 0)
      }
    },
    handleRowDragDragendEvent (evnt: DragEvent) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { dragRow } = reactData
      const { prevDragRow, prevDragPos } = internalData
      const dragConfig = $xeList.computeDragOpts
      const { isCrossListDrag } = dragConfig
      // 跨列表拖拽
      if (isCrossListDrag && crossListDragRowObj) {
        const { $newList } = crossListDragRowObj
        if ($newList && $newList.xID !== $xeList.xID) {
          $newList.handleCrossListRowDragInsertEvent(evnt)
          return
        }
      }
      $xeList.handleRowDragSwapEvent(evnt, dragRow, prevDragRow, prevDragPos)
    },
    handleRowDragDragoverEvent (evnt: DragEvent) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { dragRow } = reactData
      const { fullData } = internalData
      if (!dragRow) {
        evnt.preventDefault()
      }
      const rowEl = evnt.currentTarget as HTMLElement
      const rowid = rowEl.getAttribute('rowid') || ''
      const row = $xeList.findRowByKey(fullData, rowid)
      if (row) {
        evnt.preventDefault()
        const offsetY = evnt.clientY - rowEl.getBoundingClientRect().y
        const dragPos = offsetY < rowEl.clientHeight / 2 ? 'top' : 'bottom'
        internalData.prevDragRow = row
        internalData.prevDragPos = dragPos
        if ((dragRow && $xeList.getRowId(dragRow) === rowid)) {
          $xeList.showDropTip(evnt, rowEl, false, dragPos)
          return
        }
        const dragOffsetIndex = dragPos === 'bottom' ? 1 : 0
        const offsetIndex = dragOffsetIndex
        const dragoverEventParams: VxeListDefines.RowDragoverEventParams = {
          oldRow: dragRow,
          targetRow: row,
          dragPos,
          dragRow,
          offsetIndex
        }
        $xeList.showDropTip(evnt, rowEl, true, dragPos)
        $xeList.dispatchEvent('row-dragover', dragoverEventParams, evnt)
      }
    },
    handleRowMousedownEvent (evnt: MouseEvent, row: any) {
      const $xeList = this

      const dragConfig = $xeList.computeDragOpts
      const isDrag = $xeList.computeIsDrag
      const { trigger, disabledMethod } = dragConfig
      let isRowDrag = false
      if (isDrag) {
        isRowDrag = trigger === 'row'
      }
      const params = { row, $list: $xeList }
      if (isRowDrag && !(disabledMethod && disabledMethod(params))) {
        $xeList.handleRowDragMousedownEvent(evnt, params)
      }
    },
    handleRowClickEvent (evnt: MouseEvent, row: any) {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { showRadio, showCheckbox } = props
      const { currentRow } = internalData
      const radioOpts = $xeList.computeRadioOpts
      const checkboxOpts = $xeList.computeCheckboxOpts
      const rowOpts = $xeList.computeRowOpts
      const { isCurrent } = rowOpts
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      if (isCurrent) {
        triggerCurrent = true
        $xeList.changeCurrentEvent(evnt, row)
      } else if (currentRow) {
        internalData.currentRow = null
        reactData.currRowFlag++
      }
      if (showRadio && radioOpts.trigger === 'row') {
        triggerRadio = true
        $xeList.changeRadioEvent(evnt, row)
      }
      if (showCheckbox && checkboxOpts.trigger === 'row') {
        triggerCheckbox = true
        $xeList.changeCheckboxEvent(evnt, row)
      }
      $xeList.dispatchEvent('row-click', { row, triggerCurrent, triggerRadio, triggerCheckbox }, evnt)
    },
    handleRowDblclickEvent (evnt: MouseEvent, row: any) {
      const $xeList = this

      $xeList.dispatchEvent('row-dblclick', { row }, evnt)
    },
    insertListRow (newRecords: any[], isAppend: boolean) {
      const $xeList = this
      const internalData = $xeList.internalData

      const { fullData, rowMaps } = internalData
      const keyField = $xeList.computeKeyField
      const funcName = isAppend ? 'push' : 'unshift'
      newRecords.forEach((item) => {
        const rowid = getRowIdByField(item, keyField)
        const rowRest = getItemCacheObj(item)
        fullData[funcName](item)
        rowMaps[rowid] = rowRest
      })
    },
    handleInsertRowAt (records: any[], targetRowOrRowKey: any, isInsertNextRow?: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { fullData, rowMaps, removeRowMaps, insertRowMaps } = internalData
      const keyField = $xeList.computeKeyField
      if (!keyField) {
        errLog('vxe.error.reqSupportProp', ['insert() | insertAt() | insertNextAt()', 'row-config.keyField'])
        return Promise.resolve({ row: null, rows: [] })
      }
      if (!XEUtils.isArray(records)) {
        records = [records]
      }
      let targetRow = targetRowOrRowKey
      if (XEUtils.isString(targetRowOrRowKey) || XEUtils.isNumber(targetRowOrRowKey)) {
        const rowRest = rowMaps[targetRowOrRowKey]
        if (rowRest) {
          targetRow = rowRest.item
        }
      }
      if (!records.length) {
        return Promise.resolve({ row: null, rows: [] })
      }
      const newRecords = records.map(record => XEUtils.assign({}, record))

      if (XEUtils.eqNull(targetRow)) {
        $xeList.insertListRow(newRecords, false)
      } else {
        if (targetRow === -1) {
          $xeList.insertListRow(newRecords, true)
        } else {
          const rowIndex = fullData.findIndex(item => targetRow[keyField] === item[keyField])
          if (rowIndex > -1) {
            newRecords.forEach(item => {
              const rowid = getRowIdByField(item, keyField)
              const rowRest = getItemCacheObj(item)
              rowMaps[rowid] = rowRest
            })
            let targetIndex = rowIndex
            if (isInsertNextRow) {
              targetIndex = targetIndex + 1
            }
            fullData.splice(targetIndex, 0, ...newRecords)
          } else {
            warnLog('vxe.error.unableInsert')
            $xeList.insertListRow(newRecords, true)
          }
        }
      }

      newRecords.forEach((newItem: any) => {
        const rowid = getRowIdByField(newItem, keyField)
        // 如果是被删除的数据，则还原状态
        if (removeRowMaps[rowid]) {
          delete removeRowMaps[rowid]
          if (insertRowMaps[rowid]) {
            delete insertRowMaps[rowid]
          }
        } else {
          insertRowMaps[rowid] = newItem
        }
      })

      reactData.removeRowFlag++
      reactData.insertRowFlag++
      $xeList.cacheRowMap()
      $xeList.handleData(true)
      $xeList.updateAfterDataIndex()
      $xeList.updateCheckboxStatus()
      if (reactData.scrollYLoad) {
        $xeList.updateYSpace()
      }
      return $xeList.$nextTick().then(() => {
        return {
          row: newRecords.length ? newRecords[newRecords.length - 1] : null,
          rows: newRecords
        }
      })
    },
    insert (records: any) {
      const $xeList = this

      return $xeList.handleInsertRowAt(records, null)
    },
    insertAt (records: any, targetRowOrRowKey?: any) {
      const $xeList = this

      return $xeList.handleInsertRowAt(records, targetRowOrRowKey)
    },
    insertNextAt (records: any, targetRowOrRowKey?: any) {
      const $xeList = this

      return $xeList.handleInsertRowAt(records, targetRowOrRowKey, true)
    },
    getInsertRecords () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { insertRowMaps } = internalData
      const insertRecords: any[] = []
      XEUtils.each(insertRowMaps, (item) => {
        insertRecords.push(item)
      })
      return insertRecords
    },
    isInsertByRow (row: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const rowid = $xeList.getRowId(row)
      return !!reactData.insertRowFlag && !!internalData.insertRowMaps[rowid]
    },
    remove (rows: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { fullData, insertRowMaps, removeRowMaps } = internalData
      const keyField = $xeList.computeKeyField
      if (!keyField) {
        errLog('vxe.error.reqSupportProp', ['insert() | insertAt() | insertNextAt()', 'row-config.keyField'])
        return Promise.resolve({ row: null, rows: [] })
      }
      let delList: any[] = []
      if (!rows) {
        rows = fullData
      } else if (!XEUtils.isArray(rows)) {
        rows = [rows]
      }
      if (!rows.length) {
        return Promise.resolve({ row: null, rows: [] })
      }

      // 如果是新增，则保存记录
      rows.forEach((item: any) => {
        if (!$xeList.isInsertByRow(item)) {
          const rowid = $xeList.getRowId(item)
          removeRowMaps[rowid] = item
        }
      })

      // 从数据源中移除
      if (fullData === rows) {
        rows = delList = fullData.slice(0)
        internalData.fullData = []
      } else {
        rows.forEach((item: any) => {
          const rowid = $xeList.getRowId(item)
          const rowIndex = XEUtils.findIndexOf(fullData, item => rowid === $xeList.getRowId(item))
          if (rowIndex > -1) {
            const rItems = fullData.splice(rowIndex, 1)
            delList.push(rItems[0])
          }
        })
      }

      // 从新增中移除已删除的数据
      rows.forEach((item: any) => {
        const rowid = $xeList.getRowId(item)
        if (insertRowMaps[rowid]) {
          delete insertRowMaps[rowid]
        }
      })

      reactData.removeRowFlag++
      reactData.insertRowFlag++
      $xeList.cacheRowMap()
      $xeList.handleData(true)
      $xeList.updateAfterDataIndex()
      $xeList.updateCheckboxStatus()
      if (reactData.scrollYLoad) {
        $xeList.updateYSpace()
      }
      return $xeList.$nextTick().then(() => {
        return $xeList.recalculate()
      }).then(() => {
        return { row: delList.length ? delList[delList.length - 1] : null, rows: delList }
      })
    },
    getRemoveRecords () {
      const $xeList = this
      const internalData = $xeList.internalData

      const { removeRowMaps } = internalData
      const removeRecords: any[] = []
      XEUtils.each(removeRowMaps, (item) => {
        removeRecords.push(item)
      })
      return removeRecords
    },
    isRemoveByRow (row: any) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const rowid = $xeList.getRowId(row)
      return !!reactData.removeRowFlag && !!internalData.removeRowMaps[rowid]
    },
    getRecordset () {
      const $xeList = this

      return {
        insertRecords: $xeList.getInsertRecords(),
        removeRecords: $xeList.getRemoveRecords()
      }
    },
    handleCrossListRowDragCancelEvent () {
      const $xeList = this

      $xeList.clearRowDragData()
      $xeList.clearCrossListDragStatus()
    },
    /**
       * 处理跨树拖拽完成
       */
    handleCrossListRowDragFinishEvent (evnt: DragEvent) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData
      const crossListDragRowInfo = getCrossListDragRowInfo($xeList as VxeListConstructor & VxeListPrivateMethods)

      const { rowList } = reactData
      const { rowMaps } = internalData
      const dragOpts = $xeList.computeDragOpts
      const { animation, isCrossListDrag } = dragOpts
      const el = $xeList.$refs.refElem as HTMLDivElement
      if (!el) {
        return
      }
      if (isCrossListDrag && crossListDragRowObj && crossListDragRowInfo) {
        const { row: dragRow } = crossListDragRowInfo
        if (dragRow) {
          const dragRowid = $xeList.getRowId(dragRow)
          const dragRowRest = rowMaps[dragRowid]
          let dragRowHeight = 0
          let rsIndex = -1
          if (dragRowRest) {
            if (animation) {
              const oldItemEl = el.querySelector<HTMLElement>(`.vxe-list--row[rowid="${dragRowid}"]`)
              const targetItemEl = oldItemEl
              if (targetItemEl) {
                dragRowHeight = targetItemEl.offsetHeight
              }
            }
            rsIndex = dragRowRest.$index
          }
          const dragRangeList = rsIndex > -1 && rsIndex < rowList.length - 1 ? rowList.slice(rsIndex + 1) : []
          const dragList = [dragRow]
          $xeList.remove(dragList).then(() => {
            if (animation && dragRowHeight && dragRangeList.length) {
              const wrapperEl = el
              const dtClss: string[] = []
              dragRangeList.forEach(item => {
                const rowid = $xeList.getRowId(item)
                dtClss.push(`.vxe-list--row[rowid="${rowid}"]`)
              })
              const dtTrList = wrapperEl.querySelectorAll<HTMLElement>(dtClss.join(','))
              moveRowAnimateToTb(dtTrList, dragRowHeight)
            }
          })
          $xeList.dispatchEvent('row-remove-dragend', {
            row: dragRow
          }, evnt)
          $xeList.handleRowDragEndClearStatus()
        }
      }
    },
    /**
       * 处理跨树拖至新的空树
       */
    handleCrossListRowDragoverEmptyEvent (evnt: DragEvent) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { rowList } = reactData
      const dragOpts = $xeList.computeDragOpts
      const { isCrossListDrag } = dragOpts
      if (isCrossListDrag && crossListDragRowObj && !rowList.length) {
        const { $oldList, $newList } = crossListDragRowObj
        if ($oldList) {
          const oldListReactData = $oldList as unknown as ListReactData
          if ($oldList.xID !== $xeList.xID) {
            if ($newList && $newList.xID !== $xeList.xID) {
              $newList.hideCrossListRowDropClearStatus()
            }
            evnt.preventDefault()
            $oldList.hideCrossListRowDropClearStatus()
            crossListDragRowObj.$newList = $xeList
            internalData.prevDragRow = null
            reactData.dragTipText = oldListReactData.dragTipText
            $xeList.showDropTip(evnt, evnt.currentTarget as HTMLDivElement, true, '')
          }
        }
      }
    },
    /**
       * 处理跨树拖插入
       */
    handleCrossListRowDragInsertEvent (evnt: DragEvent) {
      const $xeList = this
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData
      const crossListDragRowInfo = getCrossListDragRowInfo($xeList as VxeListConstructor & VxeListPrivateMethods)

      const { prevDragRow, prevDragPos } = internalData
      const dragOpts = $xeList.computeDragOpts
      const { animation, isCrossListDrag, dragEndMethod } = dragOpts
      // 跨表拖拽
      if (isCrossListDrag && crossListDragRowObj && crossListDragRowInfo) {
        const { row: oldRow } = crossListDragRowInfo
        const { $oldList } = crossListDragRowObj
        const el = $xeList.$refs.refElem as HTMLDivElement
        if (!el) {
          return
        }
        if ($oldList && oldRow) {
          const dragRow = oldRow
          let dragOffsetIndex = -1
          if (prevDragRow) {
            dragOffsetIndex = prevDragPos === 'bottom' ? 1 : 0
          }
          const dragParams = {
            oldRow: dragRow,
            newRow: prevDragRow,
            dragRow,
            dragPos: prevDragPos as 'top' | 'bottom',
            offsetIndex: dragOffsetIndex as 0 | 1
          }
          const errRest = {
            status: false
          }
          Promise.resolve(dragEndMethod ? dragEndMethod(dragParams) : true).then((status) => {
            if (!status) {
              if ($oldList) {
                if ($oldList.xID !== $xeList.xID) {
                  $oldList.handleCrossListRowDragCancelEvent(evnt)
                }
              }
              $xeList.handleRowDragEndClearStatus()
              return errRest
            }
            let insertRest: Promise<any> = Promise.resolve()
            const dragList = [dragRow]
            $oldList.handleCrossListRowDragFinishEvent(evnt)
            if (prevDragRow) {
              if (prevDragPos === 'bottom') {
                insertRest = $xeList.insertNextAt(dragList, prevDragRow)
              } else {
                insertRest = $xeList.insertAt(dragList, prevDragRow)
              }
            } else {
              insertRest = $xeList.insert(dragList)
            }
            $xeList.dispatchEvent('row-insert-dragend', {
              oldRow,
              newRow: prevDragRow,
              dragRow,
              dragPos: prevDragPos as any,
              offsetIndex: dragOffsetIndex
            }, evnt)
            $xeList.clearRowDragData()

            insertRest.then(() => {
              const { rowList } = reactData
              const { rowMaps } = internalData
              const oldRowid = $xeList.getRowId(dragRow)
              const oldRowRest = rowMaps[oldRowid]
              let dragRowHeight = 0
              let rsIndex = -1
              if (oldRowRest) {
                if (animation) {
                  const oldItemEl = el.querySelector<HTMLElement>(`.vxe-list--row[rowid="${oldRowid}"]`)
                  const targetItemEl = oldItemEl
                  if (targetItemEl) {
                    dragRowHeight = targetItemEl.offsetHeight
                  }
                }
                rsIndex = oldRowRest.$index
              }
              const dragRangeList = rsIndex > -1 ? rowList.slice(rsIndex) : []
              if (animation && dragRowHeight && dragRangeList.length) {
                const wrapperEl = el
                const dtClss: string[] = []
                dragRangeList.forEach(item => {
                  const rowid = $xeList.getRowId(item)
                  dtClss.push(`.vxe-list--row[rowid="${rowid}"]`)
                })
                const dtTrList = wrapperEl.querySelectorAll<HTMLElement>(dtClss.join(','))
                moveRowAnimateToTb(dtTrList, -dragRowHeight)
              }
            })
          })
        }
      }
    },
    hideCrossListRowDropClearStatus () {
      const $xeList = this

      $xeList.hideDropTip()
    },
    handleContextmenuEvent (evnt: MouseEvent, row: any) {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData

      const { menuConfig } = props
      const menuOpts = $xeList.computeMenuOpts
      const rowOpts = $xeList.computeRowOpts
      const { isCurrent } = rowOpts
      if (menuConfig ? isEnableConf(menuOpts) : menuOpts.enabled) {
        const { options, visibleMethod } = menuOpts
        if (!visibleMethod || visibleMethod({ $list: $xeList, options, row })) {
          if (isCurrent) {
            $xeList.changeCurrentEvent(evnt, row)
          } else if (internalData.currentRow) {
            internalData.currentRow = null
            reactData.currRowFlag++
          }
          if (VxeUI.contextMenu) {
            VxeUI.contextMenu.openByEvent(evnt, {
              options,
              events: {
                optionClick (eventParams) {
                  const { option } = eventParams
                  const gMenuOpts = menus.get(option.code)
                  const tmMethod = gMenuOpts ? gMenuOpts.listMenuMethod : null
                  const params = {
                    menu: option,
                    row,
                    $event: evnt,
                    $list: $xeList
                  }
                  if (tmMethod) {
                    tmMethod(params, evnt)
                  }
                  $xeList.dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      $xeList.dispatchEvent('row-menu', { row }, evnt)
    },

    //
    // Render
    //
    renderDragTip (h: CreateElement) {
      const $xeList = this
      const reactData = $xeList.reactData

      const { dragRow, dragTipText } = reactData
      const dragOpts = $xeList.computeDragOpts
      const isDrag = $xeList.computeIsDrag
      const dRow = dragRow
      if (isDrag) {
        return h('div', {
          class: 'vxe-list--drag-wrapper'
        }, [
          h('div', {
            ref: 'refDragRowLineElem',
            class: ['vxe-list--drag-row-line', {
              'is--guides': dragOpts.showGuidesStatus
            }]
          }),
          dRow && dragOpts.showDragTip
            ? h('div', {
              ref: 'refDragTipElem',
              class: 'vxe-list--drag-sort-tip'
            }, [
              h('div', {
                class: 'vxe-list--drag-sort-tip-wrapper'
              }, [
                h('div', {
                  class: 'vxe-list--drag-sort-tip-status'
                }, [
                  h('span', {
                    class: ['vxe-list--drag-sort-tip-normal-status', getIcon().LIST_DRAG_STATUS_NODE]
                  }),
                  h('span', {
                    class: ['vxe-list--drag-sort-tip-disabled-status', getIcon().LIST_DRAG_DISABLED]
                  })
                ]),
                h('div', {
                  class: 'vxe-list--drag-sort-tip-content'
                }, dragTipText)
              ])
            ])
            : renderEmptyElement($xeList)
        ])
      }
      return renderEmptyElement($xeList)
    },
    renderRadio (h: CreateElement, row: any, rowid: string, isChecked: boolean) {
      const $xeList = this
      const props = $xeList

      const { showRadio } = props
      const radioOpts = $xeList.computeRadioOpts
      const { showIcon, checkMethod, visibleMethod } = radioOpts
      const isVisible = !visibleMethod || visibleMethod({ $list: $xeList, row })
      if (showRadio && showIcon && isVisible) {
        const isDisabled = checkMethod ? !checkMethod({ $list: $xeList, row }) : false
        return h('div', {
          key: 'ct2',
          class: ['vxe-list--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          on: {
            click (evnt: MouseEvent) {
              if (!isDisabled) {
                $xeList.changeRadioEvent(evnt, row)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeList)
    },
    renderCheckbox (h: CreateElement, row: any, rowid: string, isChecked: boolean) {
      const $xeList = this
      const props = $xeList

      const { showCheckbox } = props
      const checkboxOpts = $xeList.computeCheckboxOpts
      const { showIcon, checkMethod, visibleMethod } = checkboxOpts
      const isVisible = !visibleMethod || visibleMethod({ $list: $xeList, row })
      if (showCheckbox && showIcon && isVisible) {
        const isDisabled = checkMethod ? !checkMethod({ $list: $xeList, row }) : false
        return h('div', {
          key: 'ct3',
          class: ['vxe-list--checkbox-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          on: {
            click (evnt: MouseEvent) {
              if (!isDisabled) {
                $xeList.changeCheckboxEvent(evnt, row)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeList)
    },
    renderRow (h: CreateElement, row: any, rowIndex: any) {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const internalData = $xeList.internalData
      const slots = $xeList.$scopedSlots

      const { showRadio, showCheckbox } = props
      const { selectRadioRow, currRowFlag, updateCheckboxFlag } = reactData
      const { selectCheckboxMaps, currentRow } = internalData
      const contentSlot = slots.content
      const extraSlot = slots.extra
      const dragOpts = $xeList.computeDragOpts
      const { trigger, icon, disabledMethod, visibleMethod } = dragOpts
      const rowOpts = $xeList.computeRowOpts
      const { useKey, contentField, className: rowClassName, isCurrent } = rowOpts
      const isDrag = $xeList.computeIsDrag
      const keyField = $xeList.computeKeyField
      const isRowFnCls = rowClassName && XEUtils.isFunction(rowClassName)

      const hasKey = keyField || useKey || isDrag || isCurrent || showRadio || showCheckbox

      const rowKey = hasKey && keyField ? getRowIdByField(row, keyField) : ''
      const rowid = enModelValue(rowKey)
      const rowParams = { row, $list: $xeList }

      let isRadioChecked = false
      if (showRadio) {
        isRadioChecked = selectRadioRow && (row === selectRadioRow || $xeList.eqRowByKey(selectRadioRow, rowKey))
      }

      let isCheckboxChecked = false
      if (showCheckbox) {
        isCheckboxChecked = !!(updateCheckboxFlag && selectCheckboxMaps[rowid])
      }

      const ctVNs: VNode[] = []
      if (showRadio) {
        ctVNs.push(
          $xeList.renderRadio(h, row, rowid, isRadioChecked)
        )
      }
      if (showCheckbox) {
        ctVNs.push(
          $xeList.renderCheckbox(h, row, rowid, isCheckboxChecked)
        )
      }
      let isDragDisabled = false
      if (isDrag && keyField && (!visibleMethod || visibleMethod(rowParams))) {
        const handleOns: {
          mousedown?: (evnt: MouseEvent) => void
          mouseup?: (evnt: MouseEvent) => void
        } = {}
        if (trigger !== 'row') {
          isDragDisabled = !!(disabledMethod && disabledMethod(rowParams))
          handleOns.mousedown = (evnt) => {
            if (!isDragDisabled) {
              $xeList.handleRowDragMousedownEvent(evnt, rowParams)
            }
          }
          handleOns.mouseup = $xeList.handleRowDragMouseupEvent
        }
        ctVNs.push(
          h('div', {
            key: 'ct1',
            class: 'vxe-list--row-drag'
          }, [
            h('span', {
              class: 'vxe-list--drag-handle',
              on: handleOns
            }, [
              h('i', {
                class: icon || getIcon().LIST_DRAG
              })
            ])
          ])
        )
      }
      ctVNs.push(
        h('div', {
          key: 'ct5',
          class: 'vxe-list--row-content'
        }, contentSlot ? contentSlot(rowParams) : (contentField ? getText(row[contentField]) : ''))
      )
      if (extraSlot) {
        ctVNs.push(
          h('div', {
            key: 'ct7',
            class: 'vxe-list--row-extra'
          }, extraSlot(rowParams))
        )
      }

      const rowOns: {
        mousedown: (evnt: MouseEvent) => void
        mouseup: (evnt: MouseEvent) => void
        click: (evnt: MouseEvent) => void
        dblclick: (evnt: MouseEvent) => void
        contextmenu?: (evnt: MouseEvent) => void
        dragstart?: (evnt: DragEvent) => void
        dragend?: (evnt: DragEvent) => void
        dragover?: (evnt: DragEvent) => void
      } = {
        mousedown (evnt: MouseEvent) {
          $xeList.handleRowMousedownEvent(evnt, row)
        },
        mouseup: $xeList.handleRowDragMouseupEvent,
        click (evnt: MouseEvent) {
          $xeList.handleRowClickEvent(evnt, row)
        },
        dblclick (evnt: MouseEvent) {
          $xeList.handleRowDblclickEvent(evnt, row)
        },
        contextmenu (evnt) {
          $xeList.handleContextmenuEvent(evnt, row)
        }
      }
      // 拖拽行事件
      if (isDrag) {
        rowOns.dragstart = $xeList.handleRowDragDragstartEvent
        rowOns.dragend = $xeList.handleRowDragDragendEvent
        rowOns.dragover = $xeList.handleRowDragDragoverEvent
      }

      return h('div', {
        key: hasKey && keyField ? rowid : rowIndex,
        class: ['vxe-list--row', isRowFnCls ? rowClassName(rowParams) : (rowClassName || ''), {
          'is--drag-disabled': isDragDisabled,
          'is--current': currRowFlag && currentRow && $xeList.eqRowByKey(currentRow, rowKey),
          'is-radio--checked': isRadioChecked,
          'is-checkbox--checked': isCheckboxChecked
        }],
        attrs: hasKey && keyField
          ? {
              rowid
            }
          : undefined,
        on: rowOns
      }, ctVNs)
    },
    renderVN (h: CreateElement): VNode {
      const $xeList = this
      const props = $xeList
      const reactData = $xeList.reactData
      const slots = $xeList.$scopedSlots

      const { showCheckbox, className, loading } = props
      const { bodyHeight, topSpaceHeight, rowList, isAllChecked, isAllIndeterminate } = reactData
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const vSize = $xeList.computeSize
      const wrapperStyles = $xeList.computeWrapperStyles
      const virtualStyles = $xeList.computeVirtualStyles
      const radioOpts = $xeList.computeRadioOpts
      const checkboxOpts = $xeList.computeCheckboxOpts
      const dragOpts = $xeList.computeDragOpts
      const { trigger, isCrossListDrag } = dragOpts
      const rowOpts = $xeList.computeRowOpts
      const { isHover, padding } = rowOpts
      const showDefChekboxHead = showCheckbox && checkboxOpts.showHeader !== false

      const leOns: {
        dragover?: (...args: any[]) => void
      } = { }
      if (isCrossListDrag && !rowList.length) {
        leOns.dragover = $xeList.handleCrossListRowDragoverEmptyEvent
      }
      return h('div', {
        ref: 'refElem',
        class: ['vxe-list', className ? (XEUtils.isFunction(className) ? className({ $list: $xeList }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--loading': loading
        }],
        on: leOns,
        style: wrapperStyles
      }, [
        headerSlot || showDefChekboxHead
          ? h('div', {
            ref: 'refHeaderElem',
            class: 'vxe-list--header-wrapper'
          }, [
            showDefChekboxHead
              ? h('div', {
                class: 'vxe-list--header-left'
              }, [
                h('div', {
                  class: ['vxe-list--checkbox-header', {
                    'is--checked': isAllChecked,
                    'is--indeterminate': isAllIndeterminate
                  }],
                  on: {
                    click: $xeList.changeCheckboxAllEvent
                  }
                }, [
                  h('span', {
                    class: ['vxe-checkbox--icon', isAllChecked ? getIcon().CHECKBOX_CHECKED : (isAllIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : getIcon().CHECKBOX_UNCHECKED)]
                  })
                ])
              ])
              : renderEmptyElement($xeList),
            headerSlot
              ? h('div', {
                class: 'vxe-list--header-content'
              }, headerSlot({ items: rowList, $list: $xeList }))
              : renderEmptyElement($xeList)
          ])
          : renderEmptyElement($xeList),
        h('div', {
          ref: 'refVirtualWrapper',
          class: 'vxe-list--virtual-wrapper',
          style: virtualStyles,
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
            class: ['vxe-list--body', {
              'trigger--row': trigger === 'row',
              'checkbox--highlight': checkboxOpts.highlight,
              'radio--highlight': radioOpts.highlight,
              'row--hover': isHover,
              'is--padding': padding
            }],
            style: {
              marginTop: topSpaceHeight ? `${topSpaceHeight}px` : ''
            }
          }, defaultSlot ? defaultSlot({ items: rowList, $list: $xeList }) : rowList.map((row, i) => $xeList.renderRow(h, row, i)))
        ]),
        footerSlot
          ? h('div', {
            ref: 'refFooterElem',
            class: 'vxe-list--footer-wrapper'
          }, footerSlot({ items: rowList, $list: $xeList }))
          : renderEmptyElement($xeList),
        /**
         * 拖拽提示
         */
        $xeList.renderDragTip(h),
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

      $xeList.reFlag++
    },
    maxHeight () {
      const $xeList = this

      $xeList.reFlag++
    },
    syncResize () {
      const $xeList = this

      $xeList.reFlag++
    },
    computeRowHeight () {
      const $xeList = this

      $xeList.reFlag++
    },
    reFlag () {
      const $xeList = this

      $xeList.$nextTick(() => {
        $xeList.recalculate()
      })
    },
    checkRowKey () {
      const $xeList = this

      $xeList.updateRadioModeValue()
    },
    checkRowKeys () {
      const $xeList = this

      $xeList.updateCheckboxModeValue()
    }
  },
  created () {
    const $xeList = this
    const props = $xeList

    $xeList.internalData = createInternalData()
    $xeList.browseObj = XEUtils.browse()

    $xeList.loadData(props.data || [])
  },
  mounted () {
    const $xeList = this
    const props = $xeList
    const internalData = $xeList.internalData

    const { showSeq, showRadio, showCheckbox } = props
    const rowOpts = $xeList.computeRowOpts
    const { useKey, keyField } = rowOpts
    const isDrag = $xeList.computeIsDrag
    if (!keyField) {
      if (showSeq) {
        errLog('vxe.error.reqSupportProp', ['show-seq', 'row-config.keyField'])
      }
      if (showRadio) {
        errLog('vxe.error.reqSupportProp', ['show-radio', 'row-config.keyField'])
      }
      if (showCheckbox) {
        errLog('vxe.error.reqSupportProp', ['show-checkbox', 'row-config.keyField'])
      }
      if (isDrag) {
        errLog('vxe.error.reqSupportProp', ['drag-config', 'row-config.keyField'])
      }
    }
    if (useKey && !keyField) {
      errLog('vxe.error.reqSupportProp', ['row-config.useKey', 'row-config.keyField'])
    }
    if (props.autoResize) {
      const el = $xeList.$refs.refElem as HTMLDivElement
      const resizeObserver = globalResize.create(() => $xeList.recalculate())
      resizeObserver.observe(el)
      if (el) {
        resizeObserver.observe(el.parentElement as HTMLDivElement)
      }
      internalData.resizeObserver = resizeObserver
    }
    $xeList.recalculate()
    globalEvents.on($xeList, 'resize', $xeList.recalculate)
  },
  activated () {
    const $xeList = this

    $xeList.recalculate().then(() => $xeList.refreshScroll())
  },
  beforeDestroy () {
    const $xeList = this
    const reactData = $xeList.reactData
    const internalData = $xeList.internalData

    const { resizeObserver } = internalData
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    globalEvents.off($xeList, 'resize')
    XEUtils.assign(reactData, createReactData())
    XEUtils.assign(internalData, createInternalData())
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
