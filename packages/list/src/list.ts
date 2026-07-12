import { h, PropType, ref, Ref, computed, onBeforeUnmount, watch, reactive, nextTick, onActivated, onMounted, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { VxeUI, getConfig, getIcon, getI18n, menus, globalEvents, globalResize, createEvent, useSize, renderEmptyElement } from '../../ui'
import { getCrossListDragRowInfo } from './store'
import { isScale, removeClass, addClass, getTpImg, toCssUnit } from '../../ui/src/dom'
import { isEnableConf, getText, enModelValue, deModelValue } from '../../ui/src/utils'
import { createComponentLog } from '../../ui/src/log'
import { moveRowAnimateToTb, clearRowAnimate } from '../../ui/src/anime'
import { getItemCacheObj } from './util'
import VxeLoadingComponent from '../../loading/src/loading'

import type { VxeListConstructor, VxeListPropTypes, VxeListEmits, ListReactData, VxeListPrivateMethods, ListInternalData, VxeListDefines, ValueOf, ListMethods, ListPrivateMethods, ListPrivateRef, VxeComponentStyleType } from '../../../types'

const { warnLog, errLog } = createComponentLog('tree')

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

let crossListDragRowObj: {
  $oldList: VxeListConstructor & VxeListPrivateMethods
  $newList: (VxeListConstructor & VxeListPrivateMethods) | null
} | null = null

export default defineVxeComponent({
  name: 'VxeList',
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
  emits: [
    'update:checkRowKey',
    'update:checkRowKeys',
    'row-click',
    'row-dblclick',
    'current-change',
    'radio-change',
    'checkbox-change',
    'checkbox-all',
    'scroll',
    'row-dragstart',
    'row-dragover',
    'row-dragend',
    'row-remove-dragend',
    'row-insert-dragend',
    'row-menu',
    'menu-click'
  ] as VxeListEmits,
  setup (props, context) {
    const { slots, emit } = context

    const xID = XEUtils.uniqueId()

    const browseObj = XEUtils.browse()

    const { computeSize } = useSize(props)

    const reactData = reactive(createReactData())

    const internalData = createInternalData()

    const crossListDragRowInfo = getCrossListDragRowInfo()

    const refElem = ref() as Ref<HTMLDivElement>
    const refHeaderElem = ref() as Ref<HTMLDivElement>
    const refFooterElem = ref() as Ref<HTMLDivElement>
    const refVirtualWrapper = ref() as Ref<HTMLDivElement>
    const refVirtualBody = ref() as Ref<HTMLDivElement>

    const refDragRowLineElem = ref<HTMLDivElement>()
    const refDragTipElem = ref<HTMLDivElement>()

    const refMaps: ListPrivateRef = {
      refElem
    }

    const $xeList = {
      xID,
      props,
      context,
      reactData,
      internalData,
      getRefMaps: () => refMaps
    } as unknown as VxeListConstructor & VxeListPrivateMethods

    const computeRowOpts = computed(() => {
      return Object.assign({}, getConfig().list.rowConfig, props.rowConfig)
    })

    const computeDragOpts = computed(() => {
      return Object.assign({}, getConfig().list.dragConfig, props.dragConfig)
    })

    const computeSYOpts = computed(() => {
      return Object.assign({} as { gt: number }, getConfig().list.virtualYConfig || getConfig().list.scrollY, props.virtualYConfig || props.scrollY)
    })

    const computeKeyField = computed(() => {
      const rowOpts = computeRowOpts.value
      const { keyField } = rowOpts
      return keyField || ''
    })

    const computeIsDrag = computed(() => {
      const { dragConfig } = props
      const dragOpts = computeDragOpts.value
      return dragConfig && isEnableConf(dragOpts)
    })

    const computeRowHeight = computed(() => {
      const rowOpts = computeRowOpts.value
      const { height } = rowOpts
      return height
    })

    const computeRadioOpts = computed(() => {
      return Object.assign({ showIcon: true }, getConfig().list.radioConfig, props.radioConfig)
    })

    const computeCheckboxOpts = computed(() => {
      return Object.assign({ showIcon: true }, getConfig().list.checkboxConfig, props.checkboxConfig)
    })

    const computeMenuOpts = computed(() => {
      return Object.assign({}, getConfig().list.menuConfig, props.menuConfig)
    })

    const computeWrapperStyles = computed(() => {
      const rowHeight = computeRowHeight.value
      const style: VxeComponentStyleType = {}
      if (rowHeight) {
        style['--vxe-ui-list-row-height'] = toCssUnit(rowHeight)
      }
      return style
    })

    const computeVirtualStyles = computed(() => {
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
    })

    const dispatchEvent = (type: ValueOf<VxeListEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $list: $xeList }, params))
    }

    const emitCheckboxMode = (value: VxeListPropTypes.CheckRowKeys) => {
      emit('update:checkRowKeys', value)
    }

    const emitRadioMode = (value: VxeListPropTypes.CheckRowKey) => {
      emit('update:checkRowKey', value)
    }

    const getRowId = (row: any) => {
      const keyField = computeKeyField.value
      return getRowIdByField(row, keyField)
    }

    const calcTableHeight = (key: 'height' | 'maxHeight') => {
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
    }

    const updateHeight = () => {
      const headEl = refHeaderElem.value
      const footEl = refFooterElem.value
      reactData.headHeight = headEl ? Math.floor(headEl.offsetHeight) : 0
      reactData.footHeight = footEl ? Math.floor(footEl.offsetHeight) : 0
      reactData.customHeight = calcTableHeight('height')
      reactData.customMaxHeight = calcTableHeight('maxHeight')
    }

    const updateYSpace = () => {
      const { scrollYLoad } = reactData
      const { scrollYStore, fullData } = internalData
      reactData.bodyHeight = scrollYLoad ? fullData.length * scrollYStore.rowHeight : 0
      reactData.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0
    }

    const updateAfterFullData = () => {
      const { fullData } = internalData
      internalData.afterList = fullData.slice(0)
      updateAfterDataIndex()
    }

    const handleData = (force?: boolean) => {
      const { scrollYLoad } = reactData
      const { fullData, scrollYStore, rowMaps } = internalData
      const keyField = computeKeyField.value
      if (force) {
        // 更新数据，处理筛选和排序
        updateAfterFullData()
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
      return nextTick()
    }

    const updateYData = () => {
      handleData()
      updateYSpace()
    }

    const computeScrollLoad = () => {
      return nextTick().then(() => {
        const { scrollYLoad } = reactData
        const { scrollYStore } = internalData
        const virtualBodyElem = refVirtualBody.value
        const sYOpts = computeSYOpts.value
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
          const scrollBodyElem = refVirtualWrapper.value
          const visibleYSize = Math.max(8, Math.ceil(scrollBodyElem.clientHeight / rowHeight))
          const offsetYSize = sYOpts.oSize ? XEUtils.toNumber(sYOpts.oSize) : (browseObj.edge ? 10 : 0)
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(scrollYStore.startIndex + visibleYSize + offsetYSize, scrollYStore.endIndex)
          updateYData()
        } else {
          updateYSpace()
        }
      })
    }

    /**
     * 清除滚动条
     */
    const clearScroll = () => {
      const scrollBodyElem = refVirtualWrapper.value
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
      }
      return nextTick()
    }

    /**
     * 如果有滚动条，则滚动到对应的位置
     */
    const scrollTo = (scrollLeft: { top?: number | null; left?: number | null; } | number | null | undefined, scrollTop?: number | null) => {
      const scrollBodyElem = refVirtualWrapper.value
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
            nextTick(() => {
              resolve()
            })
          }, 50)
        })
      }
      return nextTick()
    }

    /**
     * 刷新滚动条
     */
    const refreshScroll = () => {
      const { lastScrollLeft, lastScrollTop } = internalData
      return clearScroll().then(() => {
        if (lastScrollLeft || lastScrollTop) {
          internalData.lastScrollLeft = 0
          internalData.lastScrollTop = 0
          return scrollTo(lastScrollLeft, lastScrollTop)
        }
      })
    }

    /**
     * 重新计算列表
     */
    const recalculate = () => {
      const el = refElem.value
      if (el) {
        const parentEl = el.parentElement
        let parentHeight = 0
        if (parentEl) {
          const parentStyle = getComputedStyle(parentEl)
          parentHeight = parentEl.clientHeight - Math.ceil(XEUtils.toNumber(parentStyle.paddingLeft) + XEUtils.toNumber(parentStyle.paddingRight))
        }
        reactData.parentHeight = parentHeight
        updateHeight()
        if (el.clientWidth && el.clientHeight) {
          return computeScrollLoad()
        }
      }
      return nextTick()
    }

    const loadYData = (evnt: Event) => {
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
          updateYData()
        }
      }
    }

    const scrollEvent = (evnt: Event) => {
      const scrollBodyElem = evnt.target as HTMLDivElement
      const scrollTop = scrollBodyElem.scrollTop
      const scrollLeft = scrollBodyElem.scrollLeft
      const isX = scrollLeft !== internalData.lastScrollLeft
      const isY = scrollTop !== internalData.lastScrollTop
      internalData.lastScrollTop = scrollTop
      internalData.lastScrollLeft = scrollLeft
      if (reactData.scrollYLoad) {
        loadYData(evnt)
      }
      dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    }

    const updateRadioModeValue = () => {
      const { checkRowKey } = props
      const { fullKeyMaps } = internalData
      if (checkRowKey) {
        const row = fullKeyMaps[checkRowKey]
        reactData.selectRadioRow = row || null
      } else {
        reactData.selectRadioRow = null
      }
    }

    const updateCheckboxModeValue = () => {
      const { checkRowKeys } = props
      const { fullKeyMaps } = internalData
      const keyField = computeKeyField.value
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
      updateCheckboxStatus()
    }

    const updateAfterDataIndex = () => {
      const { afterList, rowMaps } = internalData
      const keyField = computeKeyField.value
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
    }

    const cacheRowMap = () => {
      const { fullData } = internalData
      const keyField = computeKeyField.value
      const keyMaps: Record<string, any> = {}
      const rowMaps: Record<string, VxeListDefines.RowCacheItem> = {}
      if (keyField) {
        fullData.forEach((row, rowIndex) => {
          const rowid = getRowIdByField(row, keyField)
          const rowKey = getRowKeyByField(row, keyField)
          keyMaps[rowKey] = row
          rowMaps[rowid] = {
            item: row,
            index: rowIndex,
            $index: -1,
            _index: -1
          }
        })
      }
      internalData.fullKeyMaps = keyMaps
      internalData.rowMaps = rowMaps
    }

    /**
     * 加载数据
     * @param {Array} datas 数据
     */
    const loadData = (datas: any[]) => {
      const { scrollYStore } = internalData
      const sYOpts = computeSYOpts.value
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
      cacheRowMap()
      handleData(true)
      updateRadioModeValue()
      updateCheckboxModeValue()
      return computeScrollLoad().then(() => {
        refreshScroll()
      })
    }

    const handleRowDragEndClearStatus = () => {
      clearRowDragData()
      clearCrossListDragStatus()
      recalculate()
    }

    const clearRowDropOrigin = () => {
      const el = refElem.value
      if (el) {
        const clss = 'row--drag-origin'
        XEUtils.arrayEach(el.querySelectorAll(`.${clss}`), (elem) => {
          (elem as HTMLTableCellElement).draggable = false
          removeClass(elem, clss)
        })
      }
    }

    const updateRowDropOrigin = (row: any) => {
      const sYOpts = computeSYOpts.value
      const { sItem } = sYOpts
      const el = refElem.value
      if (el) {
        const clss = 'row--drag-origin'
        const rowid = getRowId(row)
        XEUtils.arrayEach(el.querySelectorAll<HTMLDivElement>(`.vxe-list--row[rowid="${rowid}"]` + (sItem ? `${sItem}[rowid="${rowid}"]` : '')), (elem) => {
          addClass(elem, clss)
        })
      }
    }

    const updateRowDropTipContent = (rowEl: HTMLElement) => {
      const { dragRow } = reactData
      const dragOpts = computeDragOpts.value
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
    }

    const hideDropTip = () => {
      const rdTipEl = refDragTipElem.value
      const rdLineEl = refDragRowLineElem.value
      if (rdTipEl) {
        rdTipEl.style.display = ''
      }
      if (rdLineEl) {
        rdLineEl.style.display = ''
      }
    }

    const clearCrossListDragStatus = () => {
      crossListDragRowObj = null
      crossListDragRowInfo.row = null
    }

    const clearDragStatus = () => {
      const { dragRow } = reactData
      if (dragRow) {
        hideDropTip()
        clearRowDropOrigin()
        clearCrossListDragStatus()
        reactData.dragRow = null
      }
    }

    const handleRowDragMousedownEvent = (evnt: MouseEvent, params: { row: any }) => {
      evnt.stopPropagation()
      const { row } = params
      const dragConfig = computeDragOpts.value
      const { isCrossListDrag, trigger, dragStartMethod } = dragConfig
      const dragEl = evnt.currentTarget as HTMLElement
      const rowEl = trigger === 'row' ? dragEl : (dragEl.parentElement as HTMLElement).parentElement as HTMLElement
      clearRowDropOrigin()
      if (dragStartMethod && !dragStartMethod(params)) {
        rowEl.draggable = false
        reactData.dragRow = null
        hideDropTip()
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
      reactData.isCrossDragRow = false
      rowEl.draggable = true
      updateRowDropOrigin(row)
      updateRowDropTipContent(rowEl)
      dispatchEvent('row-dragstart', dragstartEventParams, evnt)
    }

    const handleRowDragMouseupEvent = () => {
      clearDragStatus()
    }

    const showDropTip = (evnt: DragEvent | MouseEvent, rowEl: HTMLElement | null, showLine: boolean, dragPos: string) => {
      const wrapperEl = refElem.value
      if (!wrapperEl) {
        return
      }
      const wrapperRect = wrapperEl.getBoundingClientRect()
      const wrapperHeight = wrapperEl.clientHeight
      if (rowEl) {
        const rdLineEl = refDragRowLineElem.value
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
      const rdTipEl = refDragTipElem.value
      if (rdTipEl) {
        rdTipEl.style.display = 'block'
        rdTipEl.style.top = `${Math.min(wrapperEl.clientHeight - wrapperEl.scrollTop - rdTipEl.clientHeight, evnt.clientY - wrapperRect.y)}px`
        rdTipEl.style.left = `${Math.min(wrapperEl.clientWidth - wrapperEl.scrollLeft - rdTipEl.clientWidth - 1, evnt.clientX - wrapperRect.x)}px`
        rdTipEl.setAttribute('drag-status', showLine ? 'normal' : 'disabled')
      }
    }

    const clearRowDragData = () => {
      const wrapperEl = refElem.value
      const dtClss = ['.vxe-list--row']
      hideDropTip()
      clearRowDropOrigin()
      clearRowAnimate(wrapperEl, dtClss)
      reactData.dragRow = null
    }

    const handleRowDragSwapEvent = (evnt: DragEvent | null, dragRow: any, prevDragRow: any, prevDragPos: '' | 'top' | 'bottom' | undefined) => {
      const { fullData } = internalData
      const dragConfig = computeDragOpts.value
      const { animation, dragEndMethod } = dragConfig
      const dEndMethod = dragEndMethod || (dragConfig ? dragConfig.dragEndMethod : null)
      const dragOffsetIndex: 0 | 1 = prevDragPos === 'bottom' ? 1 : 0
      const el = refElem.value
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

        const dragRowid = getRowId(dragRow)
        const _dragRowIndex = findRowIndexOfByKey(fullData, dragRowid)
        const newRowid = getRowKey(prevDragRow)
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
          oafIndex = findRowIndexOf(fullData, dragRow)
          fullData.splice(oafIndex, 1)
          // 插入
          const pafIndex = findRowIndexOf(fullData, prevDragRow)
          nafIndex = pafIndex + dragOffsetIndex
          fullData.splice(nafIndex, 0, dragRow)

          handleData()
          if (reactData.scrollYLoad) {
            updateYSpace()
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
            dispatchEvent('row-dragend', dragendEventParams, evnt)
          }

          return nextTick().then(() => {
            if (animation) {
              const { rowList } = reactData
              const { fullData } = internalData
              const _newRowIndex = findRowIndexOfByKey(fullData, dragRowid)
              const firstRow = fullData[0]
              const _firstRowIndex = findRowIndexOf(fullData, firstRow)
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
                  const $newRowIndex = findRowIndexOfByKey(rowList, dragRowid)
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
                    const rowid = getRowId(obj)
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

            recalculate()
          }).then(() => {
            return {
              status: true
            }
          })
        }).catch(() => {
          return errRest
        }).then((rest) => {
          clearRowDragData()
          clearCrossListDragStatus()
          return rest
        })
      }
      clearRowDragData()
      clearCrossListDragStatus()
      return Promise.resolve(errRest)
    }

    const handleRowDragDragstartEvent = (evnt: DragEvent) => {
      if (evnt.dataTransfer) {
        evnt.dataTransfer.setDragImage(getTpImg(), 0, 0)
      }
    }

    const handleRowDragDragendEvent = (evnt: DragEvent) => {
      const { dragRow } = reactData
      const { prevDragRow, prevDragPos } = internalData
      const dragConfig = computeDragOpts.value
      const { isCrossListDrag } = dragConfig
      // 跨列表拖拽
      if (isCrossListDrag && crossListDragRowObj) {
        const { $newList } = crossListDragRowObj
        if ($newList && $newList.xID !== $xeList.xID) {
          $newList.handleCrossListRowDragInsertEvent(evnt)
          return
        }
      }
      handleRowDragSwapEvent(evnt, dragRow, prevDragRow, prevDragPos)
    }

    const handleRowDragDragoverEvent = (evnt: DragEvent) => {
      const { dragRow } = reactData
      const { fullData } = internalData
      const dragConfig = computeDragOpts.value
      const { isCrossListDrag } = dragConfig
      if (!dragRow) {
        evnt.preventDefault()
      }
      const rowEl = evnt.currentTarget as HTMLElement
      const rowid = rowEl.getAttribute('rowid') || ''
      const row = findRowByKey(fullData, rowid)
      if (row) {
        evnt.preventDefault()
        const offsetY = evnt.clientY - rowEl.getBoundingClientRect().y
        const dragPos = offsetY < rowEl.clientHeight / 2 ? 'top' : 'bottom'
        internalData.prevDragRow = row
        internalData.prevDragPos = dragPos
        // 跨列表拖拽
        if (isCrossListDrag && crossListDragRowObj) {
          const { $oldList, $newList } = crossListDragRowObj
          if ($oldList) {
            const oldListReactData = $oldList.reactData
            if ($oldList.xID === $xeList.xID) {
              if ($newList) {
                $newList.hideCrossListRowDropClearStatus()
              }
              reactData.isCrossDragRow = false
              oldListReactData.isCrossDragRow = false
              crossListDragRowObj.$newList = null
            } else {
              if ($newList && $newList.xID !== $xeList.xID) {
                $newList.hideCrossListRowDropClearStatus()
              }
              $oldList.hideCrossListRowDropClearStatus()
              oldListReactData.isCrossDragRow = true
              reactData.dragTipText = oldListReactData.dragTipText
              crossListDragRowObj.$newList = $xeList
              showDropTip(evnt, rowEl, true, dragPos)
              return
            }
          }
        }
        if ((dragRow && getRowId(dragRow) === rowid)) {
          showDropTip(evnt, rowEl, false, dragPos)
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
        showDropTip(evnt, rowEl, true, dragPos)
        dispatchEvent('row-dragover', dragoverEventParams, evnt)
      }
    }

    const handleRowMousedownEvent = (evnt: MouseEvent, row: any) => {
      const dragConfig = computeDragOpts.value
      const isDrag = computeIsDrag.value
      const { trigger, disabledMethod } = dragConfig
      let isRowDrag = false
      if (isDrag) {
        isRowDrag = trigger === 'row'
      }
      const params = { row, $list: $xeList }
      if (isRowDrag && !(disabledMethod && disabledMethod(params))) {
        handleRowDragMousedownEvent(evnt, params)
      }
    }

    const handleRowClickEvent = (evnt: MouseEvent, row: any) => {
      const { showRadio, showCheckbox } = props
      const { currentRow } = internalData
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const rowOpts = computeRowOpts.value
      const { isCurrent } = rowOpts
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      if (isCurrent) {
        triggerCurrent = true
        changeCurrentEvent(evnt, row)
      } else if (currentRow) {
        internalData.currentRow = null
        reactData.currRowFlag++
      }
      if (showRadio && radioOpts.trigger === 'row') {
        triggerRadio = true
        changeRadioEvent(evnt, row)
      }
      if (showCheckbox && checkboxOpts.trigger === 'row') {
        triggerCheckbox = true
        changeCheckboxEvent(evnt, row)
      }
      dispatchEvent('row-click', { row, triggerCurrent, triggerRadio, triggerCheckbox }, evnt)
    }

    const handleRowDblclickEvent = (evnt: MouseEvent, row: any) => {
      dispatchEvent('row-dblclick', { row }, evnt)
    }

    const getRowKey = (row: any) => {
      const keyField = computeKeyField.value
      return getRowKeyByField(row, keyField)
    }

    const eqRowKey = (rowKey1: any, rowKey2: string | number | null | undefined) => {
      return ('' + rowKey1) === ('' + rowKey2)
    }

    const eqRow = (row1: any, row2: any) => {
      if (row1 && row2) {
        if (row1 === row2) {
          return true
        }
        return eqRowKey(getRowId(row1), getRowId(row2))
      }
      return false
    }

    const eqRowByKey = (row: any, rowKey: any) => {
      return row && eqRowKey(getRowKey(row), rowKey)
    }

    const findRow = (list: any, row: any) => {
      return row ? XEUtils.find(list, obj => eqRow(obj, row)) : null
    }

    const findRowByKey = (list: any, rowKey: string | number | null | undefined) => {
      const keyField = computeKeyField.value
      return XEUtils.find(list, obj => eqRowKey(getRowIdByField(obj, keyField), rowKey))
    }

    const findRowIndexOf = (list: any, row: any) => {
      return row ? XEUtils.findIndexOf(list, obj => eqRow(obj, row)) : -1
    }

    const findRowIndexOfByKey = (list: any, rowKey: string | number | null | undefined) => {
      const keyField = computeKeyField.value
      return XEUtils.findIndexOf(list, obj => eqRowKey(getRowIdByField(obj, keyField), rowKey))
    }

    const isCheckedByRadioRowKey = (rowKey: string | number | null | undefined) => {
      const { selectRadioRow } = reactData
      return getRowKey(selectRadioRow) === rowKey
    }

    const isCheckedByRadioRow = (row: any) => {
      return isCheckedByRadioRowKey(getRowKey(row))
    }

    const isCheckedByCheckboxRowKey = (rowid: any) => {
      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[rowid])
    }

    const isCheckedByCheckboxRow = (row: any) => {
      return isCheckedByCheckboxRowKey(getRowKey(row))
    }

    const setCurrentRow = (row: any) => {
      internalData.currentRow = row
      reactData.currRowFlag++
      return nextTick()
    }

    const setCurrentRowByKey = (rowKey: string | number | null | undefined) => {
      const { fullData } = internalData
      internalData.currentRow = findRowByKey(fullData, rowKey)
      reactData.currRowFlag++
      return nextTick()
    }

    const getCurrentRow = () => {
      const { currentRow } = internalData
      return currentRow
    }

    const getCurrentRowKey = () => {
      const { currentRow } = internalData
      return currentRow ? getRowKey(currentRow) : null
    }

    const clearCurrentRow = () => {
      internalData.currentRow = null
      reactData.currRowFlag++
      return nextTick()
    }

    const setRadioRow = (row: any) => {
      reactData.selectRadioRow = row
      const value = getRowKey(row)
      emitRadioMode(value)
      return nextTick()
    }

    const setRadioRowByKey = (rowKey: string | number | null | undefined) => {
      const { fullData } = internalData
      reactData.selectRadioRow = findRowByKey(fullData, rowKey)
      const value = rowKey as string
      emitRadioMode(value)
      return nextTick()
    }

    const getRadioRow = () => {
      const { selectRadioRow } = reactData
      return selectRadioRow
    }

    const getRadioRowKey = () => {
      const { selectRadioRow } = reactData
      return selectRadioRow ? getRowKey(selectRadioRow) : null
    }

    const clearRadioRow = () => {
      const value = null
      reactData.selectRadioRow = value
      emitRadioMode(value)
      return nextTick()
    }

    const setCheckboxRow = (row: any | any[], checked: boolean) => {
      const { selectCheckboxMaps } = internalData
      const keyField = computeKeyField.value
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
      const value = getCheckboxRowKeys()
      emitCheckboxMode(value)
      return updateCheckboxStatus()
    }

    const setCheckboxRowByKey = (rowKey: string | number | null | undefined | (string | number | null | undefined)[], checked: boolean) => {
      const { selectCheckboxMaps, fullKeyMaps } = internalData
      const keyField = computeKeyField.value
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
      const value = getCheckboxRowKeys()
      emitCheckboxMode(value)
      return updateCheckboxStatus()
    }

    const getCheckboxRecords = () => {
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
    }

    const getCheckboxRowKeys = () => {
      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      const keyField = computeKeyField.value
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
    }

    const clearCheckboxRow = () => {
      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      reactData.isAllChecked = false
      reactData.isAllIndeterminate = false
      const value: string[] = []
      emitCheckboxMode(value)
      return nextTick()
    }

    const setAllCheckboxRow = (checked: boolean) => {
      const { fullData, selectCheckboxMaps } = internalData
      const keyField = computeKeyField.value
      if (checked) {
        const value: string[] = []
        for (const row of fullData) {
          const rowKey = getRowKeyByField(row, keyField)
          const rowid = getRowIdByField(row, keyField)
          selectCheckboxMaps[rowid] = row
          value.push(rowKey)
        }
        emitCheckboxMode(value)
        return updateCheckboxStatus()
      }
      return clearCheckboxRow()
    }

    const updateCheckboxStatus = () => {
      const { selectCheckboxMaps, fullData } = internalData
      const keyField = computeKeyField.value
      const checkboxOpts = computeCheckboxOpts.value
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
      return nextTick()
    }

    const changeCheckboxAllEvent = (evnt: MouseEvent) => {
      const { isAllChecked } = reactData
      const isChecked = !isAllChecked
      if (isChecked) {
        setAllCheckboxRow(true)
      } else {
        clearCheckboxRow()
      }
      dispatchEvent('checkbox-all', { checked: isChecked }, evnt)
    }

    const changeCheckboxEvent = (evnt: MouseEvent, row: any) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      const { selectCheckboxMaps } = internalData
      const checkboxOpts = computeCheckboxOpts.value
      const { checkMethod } = checkboxOpts
      const rowid = getRowId(row)
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
      updateCheckboxStatus()
      const rowids = XEUtils.keys(selectCheckboxMaps)
      const value = rowids.map(deModelValue)
      emitCheckboxMode(value)
      dispatchEvent('checkbox-change', { row, value, checked: isChecked }, evnt)
    }

    const changeCurrentEvent = (evnt: MouseEvent, row: any) => {
      evnt.preventDefault()
      const rowOpts = computeRowOpts.value
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
      dispatchEvent('current-change', { row, checked: isChecked }, evnt)
    }

    const changeRadioEvent = (evnt: MouseEvent, row: any) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      const { selectRadioRow } = reactData
      const radioOpts = computeRadioOpts.value
      const { strict, checkMethod } = radioOpts
      const rowKey = getRowKey(row)
      const isDisabled = checkMethod ? !checkMethod({ $list: $xeList, row }) : false
      if (isDisabled) {
        return
      }
      const value = rowKey
      let isChecked = true
      if (strict) {
        if (selectRadioRow && rowKey === getRowKey(selectRadioRow)) {
          isChecked = false
          reactData.selectRadioRow = null
        } else {
          reactData.selectRadioRow = row
        }
      } else {
        reactData.selectRadioRow = row
      }
      emitRadioMode(value)
      dispatchEvent('radio-change', { row, value, checked: isChecked }, evnt)
    }

    const insertListRow = (newRecords: any[], isAppend: boolean) => {
      const { fullData, rowMaps } = internalData
      const keyField = computeKeyField.value
      const funcName = isAppend ? 'push' : 'unshift'
      newRecords.forEach((item) => {
        const rowid = getRowIdByField(item, keyField)
        const rowRest = getItemCacheObj(item)
        fullData[funcName](item)
        rowMaps[rowid] = rowRest
      })
    }

    const handleInsertRowAt = (records: any[], targetRowOrRowKey: any, isInsertNextRow?: any) => {
      const { fullData, rowMaps, removeRowMaps, insertRowMaps } = internalData
      const keyField = computeKeyField.value
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
        insertListRow(newRecords, false)
      } else {
        if (targetRow === -1) {
          insertListRow(newRecords, true)
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
            insertListRow(newRecords, true)
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
      cacheRowMap()
      handleData(true)
      updateAfterDataIndex()
      updateCheckboxStatus()
      if (reactData.scrollYLoad) {
        updateYSpace()
      }
      return nextTick().then(() => {
        return {
          row: newRecords.length ? newRecords[newRecords.length - 1] : null,
          rows: newRecords
        }
      })
    }

    const handleContextmenuEvent = (evnt: MouseEvent, row: any) => {
      const { menuConfig } = props
      const menuOpts = computeMenuOpts.value
      const rowOpts = computeRowOpts.value
      const { isCurrent } = rowOpts
      if (menuConfig ? isEnableConf(menuOpts) : menuOpts.enabled) {
        const { options, visibleMethod } = menuOpts
        if (!visibleMethod || visibleMethod({ $list: $xeList, options, row })) {
          if (isCurrent) {
            changeCurrentEvent(evnt, row)
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
                  dispatchEvent('menu-click', params, eventParams.$event)
                }
              }
            })
          }
        }
      }
      dispatchEvent('row-menu', { row }, evnt)
    }

    const listMethods: ListMethods = {
      dispatchEvent,
      loadData,
      /**
       * 重新加载数据
       * @param {Array} datas 数据
       */
      reloadData (datas) {
        clearScroll()
        return loadData(datas)
      },
      getFullData () {
        const { fullData } = internalData
        return fullData
      },
      recalculate,
      scrollTo,
      refreshScroll,
      clearScroll,
      getRowKey,
      eqRowKey,
      eqRow,
      eqRowByKey,
      findRow,
      findRowByKey,
      findRowIndexOf,
      findRowIndexOfByKey,
      isCheckedByRadioRowKey,
      isCheckedByRadioRow,
      isCheckedByCheckboxRowKey,
      isCheckedByCheckboxRow,
      setCurrentRow,
      setCurrentRowByKey,
      getCurrentRow,
      getCurrentRowKey,
      clearCurrentRow,
      setRadioRow,
      setRadioRowByKey,
      getRadioRow,
      getRadioRowKey,
      clearRadioRow,
      setCheckboxRow,
      setCheckboxRowByKey,
      getCheckboxRecords,
      getCheckboxRows: getCheckboxRecords,
      getCheckboxRowKeys,
      clearCheckboxRow,
      setAllCheckboxRow,
      insert (records) {
        return handleInsertRowAt(records, null)
      },
      insertAt (records, targetRowOrRowKey) {
        return handleInsertRowAt(records, targetRowOrRowKey)
      },
      insertNextAt (records, targetRowOrRowKey) {
        return handleInsertRowAt(records, targetRowOrRowKey, true)
      },
      getInsertRecords () {
        const { insertRowMaps } = internalData
        const insertRecords: any[] = []
        XEUtils.each(insertRowMaps, (item) => {
          insertRecords.push(item)
        })
        return insertRecords
      },
      isInsertByRow (row) {
        const rowid = getRowId(row)
        return !!reactData.insertRowFlag && !!internalData.insertRowMaps[rowid]
      },
      remove (rows) {
        const { fullData, insertRowMaps, removeRowMaps } = internalData
        const keyField = computeKeyField.value
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
            const rowid = getRowId(item)
            removeRowMaps[rowid] = item
          }
        })

        // 从数据源中移除
        if (fullData === rows) {
          rows = delList = fullData.slice(0)
          internalData.fullData = []
        } else {
          rows.forEach((item: any) => {
            const rowid = getRowId(item)
            const rowIndex = XEUtils.findIndexOf(fullData, item => rowid === getRowId(item))
            if (rowIndex > -1) {
              const rItems = fullData.splice(rowIndex, 1)
              delList.push(rItems[0])
            }
          })
        }

        // 从新增中移除已删除的数据
        rows.forEach((item: any) => {
          const rowid = getRowId(item)
          if (insertRowMaps[rowid]) {
            delete insertRowMaps[rowid]
          }
        })

        reactData.removeRowFlag++
        reactData.insertRowFlag++
        cacheRowMap()
        handleData(true)
        updateAfterDataIndex()
        updateCheckboxStatus()
        if (reactData.scrollYLoad) {
          updateYSpace()
        }
        return nextTick().then(() => {
          return recalculate()
        }).then(() => {
          return { row: delList.length ? delList[delList.length - 1] : null, rows: delList }
        })
      },
      getRemoveRecords () {
        const { removeRowMaps } = internalData
        const removeRecords: any[] = []
        XEUtils.each(removeRowMaps, (item) => {
          removeRecords.push(item)
        })
        return removeRecords
      },
      isRemoveByRow (row) {
        const rowid = getRowId(row)
        return !!reactData.removeRowFlag && !!internalData.removeRowMaps[rowid]
      },
      getRecordset () {
        return {
          insertRecords: $xeList.getInsertRecords(),
          removeRecords: $xeList.getRemoveRecords()
        }
      }
    }

    const listPrivateMethods: ListPrivateMethods = {
      handleCrossListRowDragCancelEvent () {
        clearRowDragData()
        clearCrossListDragStatus()
      },
      /**
       * 处理跨树拖拽完成
       */
      handleCrossListRowDragFinishEvent (evnt: DragEvent) {
        const { rowList } = reactData
        const { rowMaps } = internalData
        const dragOpts = computeDragOpts.value
        const { animation, isCrossListDrag } = dragOpts
        const el = refElem.value
        if (!el) {
          return
        }
        if (isCrossListDrag && crossListDragRowObj && crossListDragRowInfo) {
          const { row: dragRow } = crossListDragRowInfo
          if (dragRow) {
            const dragRowid = getRowId(dragRow)
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
                  const rowid = getRowId(item)
                  dtClss.push(`.vxe-list--row[rowid="${rowid}"]`)
                })
                const dtTrList = wrapperEl.querySelectorAll<HTMLElement>(dtClss.join(','))
                moveRowAnimateToTb(dtTrList, dragRowHeight)
              }
            })
            dispatchEvent('row-remove-dragend', {
              row: dragRow
            }, evnt)
            handleRowDragEndClearStatus()
          }
        }
      },
      /**
       * 处理跨树拖至新的空树
       */
      handleCrossListRowDragoverEmptyEvent (evnt: DragEvent) {
        const { rowList } = reactData
        const dragOpts = computeDragOpts.value
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
              showDropTip(evnt, evnt.currentTarget as HTMLDivElement, true, '')
            }
          }
        }
      },
      /**
       * 处理跨树拖插入
       */
      handleCrossListRowDragInsertEvent (evnt: DragEvent) {
        const { prevDragRow, prevDragPos } = internalData
        const dragOpts = computeDragOpts.value
        const { animation, isCrossListDrag, dragEndMethod } = dragOpts
        // 跨表拖拽
        if (isCrossListDrag && crossListDragRowObj && crossListDragRowInfo) {
          const { row: oldRow } = crossListDragRowInfo
          const { $oldList } = crossListDragRowObj
          const el = refElem.value
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
                handleRowDragEndClearStatus()
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
              clearRowDragData()

              insertRest.then(() => {
                const { rowList } = reactData
                const { rowMaps } = internalData
                const oldRowid = getRowId(dragRow)
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
                    const rowid = getRowId(item)
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
        hideDropTip()
      }
    }

    Object.assign($xeList, listMethods, listPrivateMethods)

    const renderDragTip = () => {
      const { dragRow, dragTipText } = reactData
      const dragOpts = computeDragOpts.value
      const isDrag = computeIsDrag.value
      const dRow = dragRow
      if (isDrag) {
        return h('div', {
          class: 'vxe-list--drag-wrapper'
        }, [
          h('div', {
            ref: refDragRowLineElem,
            class: ['vxe-list--drag-row-line', {
              'is--guides': dragOpts.showGuidesStatus
            }]
          }),
          dRow && dragOpts.showDragTip
            ? h('div', {
              ref: refDragTipElem,
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
    }

    const renderRadio = (row: any, rowid: string, isChecked: boolean) => {
      const { showRadio } = props
      const radioOpts = computeRadioOpts.value
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
          onClick (evnt) {
            if (!isDisabled) {
              changeRadioEvent(evnt, row)
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeList)
    }

    const renderCheckbox = (row: any, rowid: string, isChecked: boolean) => {
      const { showCheckbox } = props
      const checkboxOpts = computeCheckboxOpts.value
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
          onClick (evnt) {
            if (!isDisabled) {
              changeCheckboxEvent(evnt, row)
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeList)
    }

    const renderRow = (row: any, rowIndex: any) => {
      const { showRadio, showCheckbox } = props
      const { selectRadioRow, currRowFlag, updateCheckboxFlag } = reactData
      const { selectCheckboxMaps, currentRow } = internalData
      const contentSlot = slots.content
      const extraSlot = slots.extra
      const dragOpts = computeDragOpts.value
      const { trigger, icon, disabledMethod, visibleMethod } = dragOpts
      const rowOpts = computeRowOpts.value
      const { useKey, contentField, className: rowClassName, isCurrent } = rowOpts
      const isDrag = computeIsDrag.value
      const keyField = computeKeyField.value
      const isRowFnCls = rowClassName && XEUtils.isFunction(rowClassName)

      const hasKey = keyField || useKey || isDrag || isCurrent || showRadio || showCheckbox

      const rowKey = hasKey && keyField ? getRowIdByField(row, keyField) : ''
      const rowid = enModelValue(rowKey)
      const rowParams = { row, $list: $xeList }

      let isRadioChecked = false
      if (showRadio) {
        isRadioChecked = selectRadioRow && (row === selectRadioRow || eqRowByKey(selectRadioRow, rowKey))
      }

      let isCheckboxChecked = false
      if (showCheckbox) {
        isCheckboxChecked = !!(updateCheckboxFlag && selectCheckboxMaps[rowid])
      }

      const ctVNs: VNode[] = []
      if (showRadio) {
        ctVNs.push(
          renderRadio(row, rowid, isRadioChecked)
        )
      }
      if (showCheckbox) {
        ctVNs.push(
          renderCheckbox(row, rowid, isCheckboxChecked)
        )
      }
      let isDragDisabled = false
      if (isDrag && keyField && (!visibleMethod || visibleMethod(rowParams))) {
        const handleOns: {
          onMousedown?: (evnt: MouseEvent) => void
          onMouseup?: (evnt: MouseEvent) => void
        } = {}
        if (trigger !== 'row') {
          isDragDisabled = !!(disabledMethod && disabledMethod(rowParams))
          handleOns.onMousedown = (evnt) => {
            if (!isDragDisabled) {
              handleRowDragMousedownEvent(evnt, rowParams)
            }
          }
          handleOns.onMouseup = handleRowDragMouseupEvent
        }
        ctVNs.push(
          h('div', {
            key: 'ct1',
            class: 'vxe-list--row-drag'
          }, [
            h('span', {
              class: 'vxe-list--drag-handle',
              ...handleOns
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
        onMousedown: (evnt: MouseEvent) => void
        onMouseup: (evnt: MouseEvent) => void
        onClick: (evnt: MouseEvent) => void
        onDblclick: (evnt: MouseEvent) => void
        onContextmenu?: (evnt: MouseEvent) => void
        onDragstart?: (evnt: DragEvent) => void
        onDragend?: (evnt: DragEvent) => void
        onDragover?: (evnt: DragEvent) => void
      } = {
        onMousedown (evnt: MouseEvent) {
          handleRowMousedownEvent(evnt, row)
        },
        onMouseup: handleRowDragMouseupEvent,
        onClick (evnt: MouseEvent) {
          handleRowClickEvent(evnt, row)
        },
        onDblclick (evnt: MouseEvent) {
          handleRowDblclickEvent(evnt, row)
        },
        onContextmenu (evnt) {
          handleContextmenuEvent(evnt, row)
        }
      }
      // 拖拽行事件
      if (isDrag) {
        rowOns.onDragstart = handleRowDragDragstartEvent
        rowOns.onDragend = handleRowDragDragendEvent
        rowOns.onDragover = handleRowDragDragoverEvent
      }

      return h('div', {
        key: hasKey && keyField ? rowid : rowIndex,
        class: ['vxe-list--row', isRowFnCls ? rowClassName(rowParams) : (rowClassName || ''), {
          'is--drag-disabled': isDragDisabled,
          'is--current': currRowFlag && currentRow && eqRowByKey(currentRow, rowKey),
          'is-radio--checked': isRadioChecked,
          'is-checkbox--checked': isCheckboxChecked
        }],
        rowid: hasKey && keyField ? rowid : undefined,
        ...rowOns
      }, ctVNs)
    }

    const renderVN = () => {
      const { showCheckbox, className, loading } = props
      const { bodyHeight, topSpaceHeight, rowList, isAllChecked, isAllIndeterminate } = reactData
      const defaultSlot = slots.default
      const headerSlot = slots.header
      const footerSlot = slots.footer
      const vSize = computeSize.value
      const wrapperStyles = computeWrapperStyles.value
      const virtualStyles = computeVirtualStyles.value
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const { showHeader, headerTitle } = checkboxOpts
      const dragOpts = computeDragOpts.value
      const { trigger, isCrossListDrag } = dragOpts
      const rowOpts = computeRowOpts.value
      const { isHover, padding } = rowOpts
      const isDrag = computeIsDrag.value
      const showDefChekboxHead = showCheckbox && showHeader !== false

      const leOns: {
        onDragover?: (...args: any[]) => void
      } = { }
      if (isCrossListDrag && !rowList.length) {
        leOns.onDragover = $xeList.handleCrossListRowDragoverEmptyEvent
      }
      return h('div', {
        ref: refElem,
        class: ['vxe-list', className ? (XEUtils.isFunction(className) ? className({ $list: $xeList }) : className) : '', {
          [`size--${vSize}`]: vSize,
          'is--drag': isDrag,
          'is--loading': loading
        }],
        style: wrapperStyles,
        ...leOns
      }, [
        headerSlot || showDefChekboxHead
          ? h('div', {
            ref: refHeaderElem,
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
                  onClick: changeCheckboxAllEvent
                }, [
                  h('span', {
                    class: ['vxe-checkbox--icon', isAllChecked ? getIcon().CHECKBOX_CHECKED : (isAllIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : getIcon().CHECKBOX_UNCHECKED)]
                  }),
                  h('span', {
                    class: 'vxe-checkbox--label'
                  }, XEUtils.eqNull(headerTitle) ? getI18n('vxe.list.allChecked') : getText(headerTitle))
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
          ref: refVirtualWrapper,
          class: 'vxe-list--virtual-wrapper',
          style: virtualStyles,
          onScroll: scrollEvent
        }, [
          h('div', {
            class: 'vxe-list--y-space',
            style: {
              height: bodyHeight ? `${bodyHeight}px` : ''
            }
          }),
          h('div', {
            ref: refVirtualBody,
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
          }, defaultSlot ? defaultSlot({ items: rowList, $list: $xeList }) : rowList.map((row, i) => renderRow(row, i)))
        ]),
        footerSlot
          ? h('div', {
            ref: refFooterElem,
            class: 'vxe-list--footer-wrapper'
          }, footerSlot({ items: rowList, $list: $xeList }))
          : renderEmptyElement($xeList),
        /**
         * 拖拽提示
         */
        renderDragTip(),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-list--loading',
          modelValue: loading
        })
      ])
    }

    const dataFlag = ref(0)
    watch(() => props.data ? props.data.length : -1, () => {
      dataFlag.value++
    })
    watch(() => props.data, () => {
      dataFlag.value++
    })
    watch(dataFlag, () => {
      loadData(props.data || [])
    })

    const reFlag = ref(0)
    watch(() => props.height, () => {
      reFlag.value++
    })
    watch(() => props.maxHeight, () => {
      reFlag.value++
    })
    watch(() => props.syncResize, () => {
      reFlag.value++
    })
    watch(computeRowHeight, () => {
      reFlag.value++
    })
    watch(reFlag, () => {
      nextTick(() => {
        recalculate()
      })
    })

    watch(() => props.checkRowKey, () => {
      updateRadioModeValue()
    })

    const checkKeyFlag = ref(0)
    watch(() => props.checkRowKeys ? props.checkRowKeys.length : -1, () => {
      checkKeyFlag.value++
    })
    watch(() => props.checkRowKeys, () => {
      checkKeyFlag.value++
    })
    watch(checkKeyFlag, () => {
      updateCheckboxModeValue()
    })

    onActivated(() => {
      recalculate().then(() => refreshScroll())
    })

    nextTick(() => {
      loadData(props.data || [])
    })

    onMounted(() => {
      const { showSeq, showRadio, showCheckbox } = props
      const rowOpts = computeRowOpts.value
      const { useKey } = rowOpts

      const isDrag = computeIsDrag.value
      const keyField = computeKeyField.value
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
        const el = refElem.value
        const resizeObserver = globalResize.create(() => recalculate())
        resizeObserver.observe(el)
        if (el) {
          resizeObserver.observe(el.parentElement as HTMLDivElement)
        }
        internalData.resizeObserver = resizeObserver
      }
      recalculate()
      globalEvents.on($xeList, 'resize', recalculate)
    })

    onBeforeUnmount(() => {
      const { resizeObserver } = internalData
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      globalEvents.off($xeList, 'resize')
      XEUtils.assign(reactData, createReactData())
      XEUtils.assign(internalData, createInternalData())
    })

    $xeList.renderVN = renderVN

    return $xeList
  },
  render () {
    return this.renderVN()
  }
})
