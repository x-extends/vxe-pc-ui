import { ref, h, reactive, PropType, computed, VNode, watch, onUnmounted, nextTick, onMounted } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { getI18n, createEvent, getIcon, getConfig, useSize, globalEvents, globalResize, renderEmptyElement } from '../../ui'
import { calcTreeLine, enNodeValue, deNodeValue } from './util'
import { errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit, isScale, getPaddingTopBottomSize } from '../../ui/src/dom'
import VxeLoadingComponent from '../../loading/src/loading'

import type { TreeReactData, VxeTreeEmits, VxeTreePropTypes, TreeInternalData, TreePrivateRef, VxeTreeDefines, VxeTreePrivateComputed, TreePrivateMethods, TreeMethods, ValueOf, VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

function createInternalData (): TreeInternalData {
  return {
    // initialized: false,
    // lastFilterValue: '',
    treeFullData: [],
    afterTreeList: [],
    afterVisibleList: [],
    nodeMaps: {},
    selectCheckboxMaps: {},
    indeterminateRowMaps: {},
    treeExpandedMaps: {},
    treeExpandLazyLoadedMaps: {},

    lastScrollLeft: 0,
    lastScrollTop: 0,
    scrollYStore: {
      startIndex: 0,
      endIndex: 0,
      visibleSize: 0,
      offsetSize: 0,
      rowHeight: 0
    },

    lastScrollTime: 0
    // hpTimeout: undefined
  }
}

export default defineVxeComponent({
  name: 'VxeTree',
  props: {
    data: Array as PropType<VxeTreePropTypes.Data>,
    autoResize: {
      type: Boolean as PropType<VxeTreePropTypes.AutoResize>,
      default: () => getConfig().tree.autoResize
    },
    height: [String, Number] as PropType<VxeTreePropTypes.Height>,
    maxHeight: {
      type: [String, Number] as PropType<VxeTreePropTypes.MaxHeight>,
      default: () => getConfig().tree.maxHeight
    },
    minHeight: {
      type: [String, Number] as PropType<VxeTreePropTypes.MinHeight>,
      default: () => getConfig().tree.minHeight
    },
    loading: Boolean as PropType<VxeTreePropTypes.Loading>,
    loadingConfig: Object as PropType<VxeTreePropTypes.LoadingConfig>,
    accordion: {
      type: Boolean as PropType<VxeTreePropTypes.Accordion>,
      default: () => getConfig().tree.accordion
    },
    childrenField: {
      type: String as PropType<VxeTreePropTypes.ChildrenField>,
      default: () => getConfig().tree.childrenField
    },
    valueField: {
      type: String as PropType<VxeTreePropTypes.ValueField>,
      default: () => getConfig().tree.valueField
    },
    keyField: {
      type: String as PropType<VxeTreePropTypes.KeyField>,
      default: () => getConfig().tree.keyField
    },
    parentField: {
      type: String as PropType<VxeTreePropTypes.ParentField>,
      default: () => getConfig().tree.parentField
    },
    titleField: {
      type: String as PropType<VxeTreePropTypes.TitleField>,
      default: () => getConfig().tree.titleField
    },
    hasChildField: {
      type: String as PropType<VxeTreePropTypes.HasChildField>,
      default: () => getConfig().tree.hasChildField
    },
    mapChildrenField: {
      type: String as PropType<VxeTreePropTypes.MapChildrenField>,
      default: () => getConfig().tree.mapChildrenField
    },
    transform: Boolean as PropType<VxeTreePropTypes.Transform>,
    // 已废弃
    isCurrent: Boolean as PropType<VxeTreePropTypes.IsCurrent>,
    // 已废弃
    isHover: Boolean as PropType<VxeTreePropTypes.IsHover>,
    expandAll: Boolean as PropType<VxeTreePropTypes.ExpandAll>,
    expandNodeKeys: Array as PropType<VxeTreePropTypes.ExpandNodeKeys>,
    showLine: {
      type: Boolean as PropType<VxeTreePropTypes.ShowLine>,
      default: () => getConfig().tree.showLine
    },
    trigger: String as PropType<VxeTreePropTypes.Trigger>,
    indent: {
      type: Number as PropType<VxeTreePropTypes.Indent>,
      default: () => getConfig().tree.indent
    },
    showRadio: {
      type: Boolean as PropType<VxeTreePropTypes.ShowRadio>,
      default: () => getConfig().tree.showRadio
    },
    checkNodeKey: {
      type: [String, Number] as PropType<VxeTreePropTypes.CheckNodeKey>,
      default: () => getConfig().tree.checkNodeKey
    },
    radioConfig: Object as PropType<VxeTreePropTypes.RadioConfig>,
    showCheckbox: {
      type: Boolean as PropType<VxeTreePropTypes.ShowCheckbox>,
      default: () => getConfig().tree.showCheckbox
    },
    checkNodeKeys: {
      type: Array as PropType<VxeTreePropTypes.CheckNodeKeys>,
      default: () => getConfig().tree.checkNodeKeys
    },
    checkboxConfig: Object as PropType<VxeTreePropTypes.CheckboxConfig>,
    nodeConfig: Object as PropType<VxeTreePropTypes.NodeConfig>,
    lazy: Boolean as PropType<VxeTreePropTypes.Lazy>,
    toggleMethod: Function as PropType<VxeTreePropTypes.ToggleMethod>,
    loadMethod: Function as PropType<VxeTreePropTypes.LoadMethod>,
    showIcon: {
      type: Boolean as PropType<VxeTreePropTypes.ShowIcon>,
      default: true
    },
    iconOpen: {
      type: String as PropType<VxeTreePropTypes.IconOpen>,
      default: () => getConfig().tree.iconOpen
    },
    iconClose: {
      type: String as PropType<VxeTreePropTypes.IconClose>,
      default: () => getConfig().tree.iconClose
    },
    iconLoaded: {
      type: String as PropType<VxeTreePropTypes.IconLoaded>,
      default: () => getConfig().tree.iconLoaded
    },
    filterValue: [String, Number] as PropType<VxeTreePropTypes.FilterValue>,
    filterConfig: Object as PropType<VxeTreePropTypes.FilterConfig>,
    size: {
      type: String as PropType<VxeTreePropTypes.Size>,
      default: () => getConfig().tree.size || getConfig().size
    },
    virtualYConfig: Object as PropType<VxeTreePropTypes.VirtualYConfig>
  },
  emits: [
    'update:modelValue',
    'update:checkNodeKey',
    'update:checkNodeKeys',
    'node-click',
    'node-dblclick',
    'current-change',
    'radio-change',
    'checkbox-change',
    'load-success',
    'load-error',
    'scroll'
  ] as VxeTreeEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()
    const refHeaderWrapperElem = ref<HTMLDivElement>()
    const refFooterWrapperElem = ref<HTMLDivElement>()
    const refVirtualWrapper = ref<HTMLDivElement>()
    const refVirtualBody = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
      parentHeight: 0,
      customHeight: 0,
      customMinHeight: 0,
      customMaxHeight: 0,
      currentNode: null,
      scrollYLoad: false,
      bodyHeight: 0,
      topSpaceHeight: 0,
      selectRadioKey: enNodeValue(props.checkNodeKey),
      treeList: [],
      updateExpandedFlag: 1,
      updateCheckboxFlag: 1
    })

    const internalData = createInternalData()

    const refMaps: TreePrivateRef = {
      refElem
    }

    const computeTitleField = computed(() => {
      return props.titleField || 'title'
    })

    const computeKeyField = computed(() => {
      return props.keyField || 'id'
    })

    const computeValueField = computed(() => {
      const keyField = computeKeyField.value
      return props.valueField || keyField
    })

    const computeParentField = computed(() => {
      return props.parentField || 'parentId'
    })

    const computeChildrenField = computed(() => {
      return props.childrenField || 'children'
    })

    const computeMapChildrenField = computed(() => {
      return props.mapChildrenField || 'mapChildren'
    })

    const computeHasChildField = computed(() => {
      return props.hasChildField || 'hasChild'
    })

    const computeVirtualYOpts = computed(() => {
      return Object.assign({} as { gt: number }, getConfig().tree.virtualYConfig, props.virtualYConfig)
    })

    const computeIsRowCurrent = computed(() => {
      const nodeOpts = computeNodeOpts.value
      const { isCurrent } = nodeOpts
      if (XEUtils.isBoolean(isCurrent)) {
        return isCurrent
      }
      return props.isCurrent
    })

    const computeIsRowHover = computed(() => {
      const nodeOpts = computeNodeOpts.value
      const { isHover } = nodeOpts
      if (XEUtils.isBoolean(isHover)) {
        return isHover
      }
      return props.isHover
    })

    const computeRadioOpts = computed(() => {
      return Object.assign({ showIcon: true }, getConfig().tree.radioConfig, props.radioConfig)
    })

    const computeCheckboxOpts = computed(() => {
      return Object.assign({ showIcon: true }, getConfig().tree.checkboxConfig, props.checkboxConfig)
    })

    const computeNodeOpts = computed(() => {
      return Object.assign({}, getConfig().tree.nodeConfig, props.nodeConfig)
    })

    const computeLoadingOpts = computed(() => {
      return Object.assign({}, getConfig().tree.loadingConfig, props.loadingConfig)
    })

    const computeTreeStyle = computed(() => {
      const { customHeight, customMinHeight, customMaxHeight } = reactData
      const stys: Record<string, string> = {}
      if (customHeight) {
        stys.height = toCssUnit(customHeight)
      }
      if (customMinHeight) {
        stys.minHeight = toCssUnit(customMinHeight)
      }
      if (customMaxHeight) {
        stys.maxHeight = toCssUnit(customMaxHeight)
      }
      return stys
    })

    const computeFilterOpts = computed(() => {
      return Object.assign({}, getConfig().tree.filterConfig, props.filterConfig)
    })

    const computeMaps: VxeTreePrivateComputed = {
      computeChildrenField,
      computeMapChildrenField,
      computeRadioOpts,
      computeCheckboxOpts,
      computeNodeOpts
    }

    const $xeTree = {
      xID,
      props,
      context,
      internalData,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeTreeConstructor & VxeTreePrivateMethods

    const getNodeId = (node: any) => {
      const valueField = computeValueField.value
      const nodeKey = XEUtils.get(node, valueField)
      return enNodeValue(nodeKey)
    }

    const isExpandByNode = (node: any) => {
      const { updateExpandedFlag } = reactData
      const { treeExpandedMaps } = internalData
      const nodeid = getNodeId(node)
      return !!(updateExpandedFlag && treeExpandedMaps[nodeid])
    }

    const isCheckedByRadioNodeId = (nodeid: any) => {
      const { selectRadioKey } = reactData
      return selectRadioKey === nodeid
    }

    const isCheckedByRadioNode = (node: any) => {
      return isCheckedByRadioNodeId(getNodeId(node))
    }

    const isCheckedByCheckboxNodeId = (nodeid: any) => {
      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
    }

    const isCheckedByCheckboxNode = (node: any) => {
      return isCheckedByCheckboxNodeId(getNodeId(node))
    }

    const isIndeterminateByCheckboxNodeid = (nodeid: any) => {
      const { updateCheckboxFlag } = reactData
      const { indeterminateRowMaps } = internalData
      return !!(updateCheckboxFlag && indeterminateRowMaps[nodeid])
    }

    const isIndeterminateByCheckboxNode = (node: any) => {
      return isIndeterminateByCheckboxNodeid(getNodeId(node))
    }

    const emitCheckboxMode = (value: VxeTreePropTypes.CheckNodeKeys) => {
      emit('update:checkNodeKeys', value)
    }

    const emitRadioMode = (value: VxeTreePropTypes.CheckNodeKey) => {
      emit('update:checkNodeKey', value)
    }

    const handleSetCheckboxByNodeId = (nodeKeys: any | any[], checked: boolean) => {
      const { nodeMaps } = internalData
      if (nodeKeys) {
        if (!XEUtils.isArray(nodeKeys)) {
          nodeKeys = [nodeKeys]
        }
        const nodeList: any[] = []
        nodeKeys.forEach((nodeKey: string) => {
          const nodeid = enNodeValue(nodeKey)
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            nodeList.push(nodeItem.item)
          }
        })
        handleCheckedCheckboxNode(nodeList, checked)
      }
      return nextTick()
    }

    const handleCheckedCheckboxNode = (nodeList: any[], checked: boolean) => {
      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const mapChildrenField = computeMapChildrenField.value
      const childrenField = computeChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly } = checkboxOpts
      const handleSelect = (node: any) => {
        const nodeid = getNodeId(node)
        if (checked) {
          if (!selectCheckboxMaps[nodeid]) {
            selectCheckboxMaps[nodeid] = node
          }
        } else {
          if (selectCheckboxMaps[nodeid]) {
            delete selectCheckboxMaps[nodeid]
          }
        }
      }
      if (checkStrictly) {
        nodeList.forEach(handleSelect)
      } else {
        XEUtils.eachTree(nodeList, handleSelect, { children: transform ? mapChildrenField : childrenField })
      }
      reactData.updateCheckboxFlag++
      updateCheckboxStatus()
    }

    const updateCheckboxChecked = (nodeKeys: VxeTreePropTypes.CheckNodeKeys) => {
      internalData.selectCheckboxMaps = {}
      handleSetCheckboxByNodeId(nodeKeys, true)
    }

    const handleSetExpand = (nodeid: string | number, expanded: boolean, expandedMaps: Record<string, boolean>) => {
      if (expanded) {
        if (!expandedMaps[nodeid]) {
          expandedMaps[nodeid] = true
        }
      } else {
        if (expandedMaps[nodeid]) {
          delete expandedMaps[nodeid]
        }
      }
    }

    const dispatchEvent = (type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null) => {
      emit(type, createEvent(evnt, { $tree: $xeTree }, params))
    }

    const getParentElem = () => {
      const el = refElem.value
      return el ? el.parentElement : null
    }

    const calcTableHeight = (key: 'height' | 'minHeight' | 'maxHeight') => {
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
      reactData.customHeight = calcTableHeight('height')
      reactData.customMinHeight = calcTableHeight('minHeight')
      reactData.customMaxHeight = calcTableHeight('maxHeight')

      // 如果启用虚拟滚动，默认高度
      if (reactData.scrollYLoad && !(reactData.customHeight || reactData.customMinHeight)) {
        reactData.customHeight = 300
      }
    }

    const createNode = (records: any[]) => {
      const valueField = computeValueField.value
      return Promise.resolve(
        records.map(obj => {
          const item = { ...obj }
          let nodeid = getNodeId(item)
          if (!nodeid) {
            nodeid = getNodeUniqueId()
            XEUtils.set(item, valueField, nodeid)
          }
          return item
        })
      )
    }

    const cacheNodeMap = () => {
      const { treeFullData } = internalData
      const valueField = computeValueField.value
      const childrenField = computeChildrenField.value
      const keyMaps: Record<string, VxeTreeDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeFullData, (item, index, items, path, parent, nodes) => {
        let nodeid = getNodeId(item)
        if (!nodeid) {
          nodeid = getNodeUniqueId()
          XEUtils.set(item, valueField, nodeid)
        }
        keyMaps[nodeid] = {
          item,
          index,
          items,
          parent,
          nodes,
          level: nodes.length,
          treeIndex: index,
          lineCount: 0,
          treeLoaded: false
        }
      }, { children: childrenField })
      internalData.nodeMaps = keyMaps
    }

    const updateAfterDataIndex = () => {
      const { transform } = props
      const { afterTreeList, nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      XEUtils.eachTree(afterTreeList, (item, index, items) => {
        const nodeid = getNodeId(item)
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          nodeItem.items = items
          nodeItem.treeIndex = index
        } else {
          const rest = {
            item,
            index,
            items,
            parent,
            nodes: [],
            level: 0,
            treeIndex: index,
            lineCount: 0,
            treeLoaded: false
          }
          nodeMaps[nodeid] = rest
        }
      }, { children: transform ? mapChildrenField : childrenField })
    }

    const updateAfterFullData = () => {
      const { transform, filterValue } = props
      const { treeFullData, lastFilterValue } = internalData
      const titleField = computeTitleField.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const filterOpts = computeFilterOpts.value
      const { autoExpandAll, beforeFilterMethod, filterMethod, afterFilterMethod } = filterOpts
      let fullList = treeFullData
      let treeList = fullList
      let filterStr = ''
      if (filterValue || filterValue === 0) {
        filterStr = `${filterValue}`
        const handleSearch = filterMethod
          ? (item: any) => {
              return filterMethod({
                $tree: $xeTree,
                node: item,
                filterValue: filterStr
              })
            }
          : (item: any) => {
              return String(item[titleField]).toLowerCase().indexOf(filterStr) > -1
            }
        const bafParams = { $tree: $xeTree, filterValue: filterStr }
        if (beforeFilterMethod) {
          beforeFilterMethod(bafParams)
        }
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, handleSearch, {
            original: true,
            isEvery: true,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
        } else {
          fullList = treeFullData.filter(handleSearch)
        }
        internalData.lastFilterValue = filterStr
        nextTick(() => {
          // 筛选时自动展开
          if (autoExpandAll) {
            $xeTree.setAllExpandNode(true).then(() => {
              if (afterFilterMethod) {
                afterFilterMethod(bafParams)
              }
            })
          } else {
            if (afterFilterMethod) {
              afterFilterMethod(bafParams)
            }
          }
        })
      } else {
        if (transform) {
          treeList = XEUtils.searchTree(treeFullData, () => true, {
            original: true,
            isEvery: true,
            children: childrenField,
            mapChildren: mapChildrenField
          })
          fullList = treeList
          if (lastFilterValue) {
            const bafParams = { $tree: $xeTree, filterValue: filterStr }
            if (beforeFilterMethod) {
              beforeFilterMethod(bafParams)
            }
            // 取消筛选时自动收起
            nextTick(() => {
              if (autoExpandAll) {
                $xeTree.clearAllExpandNode().then(() => {
                  if (afterFilterMethod) {
                    afterFilterMethod(bafParams)
                  }
                })
              } else {
                if (afterFilterMethod) {
                  afterFilterMethod(bafParams)
                }
              }
            })
          }
        }
        internalData.lastFilterValue = ''
      }
      internalData.afterVisibleList = fullList
      internalData.afterTreeList = treeList
      updateAfterDataIndex()
    }

    /**
     * 如果为虚拟树、则将树结构拍平
     */
    const handleTreeToList = () => {
      const { transform } = props
      const { afterTreeList, treeExpandedMaps } = internalData
      const mapChildrenField = computeMapChildrenField.value
      const expandMaps: {
        [key: string]: number
      } = {}
      if (transform) {
        const fullData: any[] = []
        XEUtils.eachTree(afterTreeList, (item, index, items, path, parentRow) => {
          const nodeid = getNodeId(item)
          const parentNodeid = getNodeId(parentRow)
          if (!parentRow || (expandMaps[parentNodeid] && treeExpandedMaps[parentNodeid])) {
            expandMaps[nodeid] = 1
            fullData.push(item)
          }
        }, { children: mapChildrenField })
        updateScrollYStatus(fullData)
        internalData.afterVisibleList = fullData
        return fullData
      }
      return internalData.afterVisibleList
    }

    const handleData = (force?: boolean) => {
      const { scrollYLoad } = reactData
      const { scrollYStore } = internalData
      let fullList: any[] = internalData.afterVisibleList
      if (force) {
        // 更新数据，处理筛选和排序
        updateAfterFullData()
        // 如果为虚拟树，将树结构拍平
        fullList = handleTreeToList()
      }
      const treeList = scrollYLoad ? fullList.slice(scrollYStore.startIndex, scrollYStore.endIndex) : fullList.slice(0)
      reactData.treeList = treeList
    }

    const triggerSearchEvent = XEUtils.debounce(() => handleData(true), 350, { trailing: true })

    const loadData = (list: any[]) => {
      const { expandAll, expandNodeKeys, transform } = props
      const { initialized, scrollYStore } = internalData
      const keyField = computeKeyField.value
      const parentField = computeParentField.value
      const childrenField = computeChildrenField.value
      const fullData = transform ? XEUtils.toArrayTree(list, { key: keyField, parentKey: parentField, mapChildren: childrenField }) : list ? list.slice(0) : []
      internalData.treeFullData = fullData
      Object.assign(scrollYStore, {
        startIndex: 0,
        endIndex: 1,
        visibleSize: 0
      })
      const sYLoad = updateScrollYStatus(fullData)
      cacheNodeMap()
      handleData(true)
      if (sYLoad) {
        if (!(props.height || props.maxHeight)) {
          errLog('vxe.error.reqProp', ['[tree] height | max-height | virtual-y-config.enabled=false'])
        }
      }
      return computeScrollLoad().then(() => {
        if (!initialized) {
          if (list && list.length) {
            internalData.initialized = true
            if (expandAll) {
              $xeTree.setAllExpandNode(true)
            } else if (expandNodeKeys && expandNodeKeys.length) {
              $xeTree.setExpandByNodeId(expandNodeKeys, true)
            }
            handleSetCheckboxByNodeId(props.checkNodeKeys || [], true)
          }
        }
        updateHeight()
        refreshScroll()
      })
    }

    const updateScrollYStatus = (fullData?: any[]) => {
      const { transform } = props
      const virtualYOpts = computeVirtualYOpts.value
      const allList = fullData || internalData.treeFullData
      // 如果gt为0，则总是启用
      const scrollYLoad = !!transform && !!virtualYOpts.enabled && virtualYOpts.gt > -1 && (virtualYOpts.gt === 0 || virtualYOpts.gt < allList.length)
      reactData.scrollYLoad = scrollYLoad
      return scrollYLoad
    }

    const updateYSpace = () => {
      const { scrollYLoad } = reactData
      const { scrollYStore, afterVisibleList } = internalData
      reactData.bodyHeight = scrollYLoad ? afterVisibleList.length * scrollYStore.rowHeight : 0
      reactData.topSpaceHeight = scrollYLoad ? Math.max(scrollYStore.startIndex * scrollYStore.rowHeight, 0) : 0
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
        const virtualYOpts = computeVirtualYOpts.value
        let rowHeight = 0
        let firstItemElem: HTMLElement | undefined
        if (virtualBodyElem) {
          if (!firstItemElem) {
            firstItemElem = virtualBodyElem.children[0] as HTMLElement
          }
        }
        if (firstItemElem) {
          rowHeight = firstItemElem.offsetHeight
        }
        rowHeight = Math.max(20, rowHeight)
        scrollYStore.rowHeight = rowHeight
        // 计算 Y 逻辑
        if (scrollYLoad) {
          const scrollBodyElem = refVirtualWrapper.value
          const visibleYSize = Math.max(8, scrollBodyElem ? Math.ceil(scrollBodyElem.clientHeight / rowHeight) : 0)
          const offsetYSize = Math.max(0, Math.min(2, XEUtils.toNumber(virtualYOpts.oSize)))
          scrollYStore.offsetSize = offsetYSize
          scrollYStore.visibleSize = visibleYSize
          scrollYStore.endIndex = Math.max(scrollYStore.startIndex, visibleYSize + offsetYSize, scrollYStore.endIndex)
          updateYData()
        } else {
          updateYSpace()
        }
      })
    }

    /**
     * 如果有滚动条，则滚动到对应的位置
     */
    const handleScrollTo = (scrollLeft: { top?: number | null; left?: number | null; } | number | null | undefined, scrollTop?: number | null) => {
      const scrollBodyElem = refVirtualWrapper.value
      if (scrollLeft) {
        if (!XEUtils.isNumber(scrollLeft)) {
          scrollTop = scrollLeft.top
          scrollLeft = scrollLeft.left
        }
      }
      if (scrollBodyElem) {
        if (XEUtils.isNumber(scrollLeft)) {
          scrollBodyElem.scrollLeft = scrollLeft
        }
        if (XEUtils.isNumber(scrollTop)) {
          scrollBodyElem.scrollTop = scrollTop
        }
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
      const { scrollYStore } = internalData
      const { rowHeight } = scrollYStore
      const el = refElem.value
      if (el && el.clientWidth && el.clientHeight) {
        const parentEl = getParentElem()
        const headerWrapperEl = refHeaderWrapperElem.value
        const footerWrapperEl = refFooterWrapperElem.value
        const headHeight = headerWrapperEl ? headerWrapperEl.clientHeight : 0
        const footHeight = footerWrapperEl ? footerWrapperEl.clientHeight : 0
        if (parentEl) {
          const parentPaddingSize = getPaddingTopBottomSize(parentEl)
          reactData.parentHeight = Math.max(headHeight + footHeight + rowHeight, parentEl.clientHeight - parentPaddingSize - headHeight - footHeight)
        }
        updateHeight()
        return computeScrollLoad().then(() => {
          updateHeight()
          updateYSpace()
        })
      }
      return nextTick()
    }

    const loadYData = () => {
      const { scrollYStore } = internalData
      const { startIndex, endIndex, visibleSize, offsetSize, rowHeight } = scrollYStore
      const scrollBodyElem = refVirtualWrapper.value
      if (!scrollBodyElem) {
        return
      }
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
        loadYData()
      }
      internalData.lastScrollTime = Date.now()
      dispatchEvent('scroll', { scrollLeft, scrollTop, isX, isY }, evnt)
    }

    const clearScroll = () => {
      const scrollBodyElem = refVirtualWrapper.value
      if (scrollBodyElem) {
        scrollBodyElem.scrollTop = 0
        scrollBodyElem.scrollLeft = 0
      }
      internalData.lastScrollTop = 0
      internalData.lastScrollLeft = 0
      return nextTick()
    }

    const handleNodeClickEvent = (evnt: MouseEvent, node: any) => {
      const { showRadio, showCheckbox, trigger } = props
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const isRowCurrent = computeIsRowCurrent.value
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      if (isRowCurrent) {
        triggerCurrent = true
        changeCurrentEvent(evnt, node)
      } else if (reactData.currentNode) {
        reactData.currentNode = null
      }
      if (trigger === 'node') {
        triggerExpand = true
        toggleExpandEvent(evnt, node)
      }
      if (showRadio && radioOpts.trigger === 'node') {
        triggerRadio = true
        changeRadioEvent(evnt, node)
      }
      if (showCheckbox && checkboxOpts.trigger === 'node') {
        triggerCheckbox = true
        changeCheckboxEvent(evnt, node)
      }
      dispatchEvent('node-click', { node, triggerCurrent, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    }

    const handleNodeDblclickEvent = (evnt: MouseEvent, node: any) => {
      dispatchEvent('node-dblclick', { node }, evnt)
    }

    const handleAsyncTreeExpandChilds = (node: any) => {
      const checkboxOpts = computeCheckboxOpts.value
      const { loadMethod } = props
      const { checkStrictly } = checkboxOpts
      return new Promise<void>(resolve => {
        if (loadMethod) {
          const { nodeMaps } = internalData
          const nodeid = getNodeId(node)
          const nodeItem = nodeMaps[nodeid]
          internalData.treeExpandLazyLoadedMaps[nodeid] = true
          Promise.resolve(
            loadMethod({ $tree: $xeTree, node })
          ).then((childRecords: any) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = true
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            if (!XEUtils.isArray(childRecords)) {
              childRecords = []
            }
            if (childRecords) {
              return $xeTree.loadChildrenNode(node, childRecords).then(childRows => {
                const { treeExpandedMaps } = internalData
                if (childRows.length && !treeExpandedMaps[nodeid]) {
                  treeExpandedMaps[nodeid] = true
                }
                reactData.updateExpandedFlag++
                // 如果当前节点已选中，则展开后子节点也被选中
                if (!checkStrictly && $xeTree.isCheckedByCheckboxNodeId(nodeid)) {
                  handleCheckedCheckboxNode(childRows, true)
                }
                dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return nextTick()
              })
            } else {
              dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            handleTreeToList()
            handleData()
            return recalculate()
          })
        } else {
          resolve()
        }
      })
    }

    /**
     * 展开与收起树节点
     * @param nodeList
     * @param expanded
     * @returns
     */
    const handleBaseTreeExpand = (nodeList: any[], expanded: boolean) => {
      const { lazy, accordion, toggleMethod } = props
      const { treeExpandLazyLoadedMaps, treeExpandedMaps } = internalData
      const { nodeMaps } = internalData
      const childrenField = computeChildrenField.value
      const hasChildField = computeHasChildField.value
      const result: any[] = []
      let validNodes = toggleMethod ? nodeList.filter((node: any) => toggleMethod({ $tree: $xeTree, expanded, node })) : nodeList
      if (accordion) {
        validNodes = validNodes.length ? [validNodes[validNodes.length - 1]] : []
        // 同一级只能展开一个
        const nodeid = getNodeId(validNodes[0])
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          nodeItem.items.forEach(item => {
            const itemNodeId = getNodeId(item)
            if (treeExpandedMaps[itemNodeId]) {
              delete treeExpandedMaps[itemNodeId]
            }
          })
        }
      }
      const expandNodes: any[] = []
      if (expanded) {
        validNodes.forEach((item) => {
          const itemNodeId = getNodeId(item)
          if (!treeExpandedMaps[itemNodeId]) {
            const nodeItem = nodeMaps[itemNodeId]
            const isLoad = lazy && item[hasChildField] && !nodeItem.treeLoaded && !treeExpandLazyLoadedMaps[itemNodeId]
            // 是否使用懒加载
            if (isLoad) {
              result.push(handleAsyncTreeExpandChilds(item))
            } else {
              if (item[childrenField] && item[childrenField].length) {
                treeExpandedMaps[itemNodeId] = true
                expandNodes.push(item)
              }
            }
          }
        })
      } else {
        validNodes.forEach(item => {
          const itemNodeId = getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
            expandNodes.push(item)
          }
        })
      }
      reactData.updateExpandedFlag++
      handleTreeToList()
      handleData()
      return Promise.all(result).then(() => recalculate())
    }

    const toggleExpandEvent = (evnt: MouseEvent, node: any) => {
      const { lazy } = props
      const { treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const nodeid = getNodeId(node)
      const expanded = !treeExpandedMaps[nodeid]
      evnt.stopPropagation()
      if (!lazy || !treeExpandLazyLoadedMaps[nodeid]) {
        handleBaseTreeExpand([node], expanded)
      }
    }

    const updateCheckboxStatus = () => {
      const { transform } = props
      const { selectCheckboxMaps, indeterminateRowMaps, afterTreeList } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly, checkMethod } = checkboxOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(afterTreeList, (node) => {
          const nodeid = getNodeId(node)
          const childList = node[childrenField]
          if (childList && childList.length && !childRowMaps[nodeid]) {
            childRowMaps[nodeid] = 1
            childRowList.unshift([node, nodeid, childList])
          }
        }, { children: transform ? mapChildrenField : childrenField })

        childRowList.forEach(vals => {
          const node: string = vals[0]
          const nodeid: string = vals[1]
          const childList: any[] = vals[2]
          let sLen = 0 // 已选
          let hLen = 0 // 半选
          let vLen = 0 // 有效子行
          const cLen = childList.length // 子行
          childList.forEach(
            checkMethod
              ? (item) => {
                  const childNodeid = getNodeId(item)
                  const isSelect = selectCheckboxMaps[childNodeid]
                  if (checkMethod({ $tree: $xeTree, node: item })) {
                    if (isSelect) {
                      sLen++
                    } else if (indeterminateRowMaps[childNodeid]) {
                      hLen++
                    }
                    vLen++
                  } else {
                    if (isSelect) {
                      sLen++
                    } else if (indeterminateRowMaps[childNodeid]) {
                      hLen++
                    }
                  }
                }
              : item => {
                const childNodeid = getNodeId(item)
                const isSelect = selectCheckboxMaps[childNodeid]
                if (isSelect) {
                  sLen++
                } else if (indeterminateRowMaps[childNodeid]) {
                  hLen++
                }
                vLen++
              }
          )

          let isSelected = false
          if (cLen > 0) {
            if (vLen > 0) {
              isSelected = (sLen > 0 || hLen > 0) && sLen >= vLen
            } else {
            // 如果存在子项禁用
              if ((sLen > 0 && sLen >= vLen)) {
                isSelected = true
              } else if (selectCheckboxMaps[nodeid]) {
                isSelected = true
              } else {
                isSelected = false
              }
            }
          } else {
          // 如果无子项
            isSelected = selectCheckboxMaps[nodeid]
          }
          const halfSelect = !isSelected && (sLen > 0 || hLen > 0)

          if (isSelected) {
            selectCheckboxMaps[nodeid] = node
            if (indeterminateRowMaps[nodeid]) {
              delete indeterminateRowMaps[nodeid]
            }
          } else {
            if (selectCheckboxMaps[nodeid]) {
              delete selectCheckboxMaps[nodeid]
            }
            if (halfSelect) {
              indeterminateRowMaps[nodeid] = node
            } else {
              if (indeterminateRowMaps[nodeid]) {
                delete indeterminateRowMaps[nodeid]
              }
            }
          }
        })
        reactData.updateCheckboxFlag++
      }
    }

    const changeCheckboxEvent = (evnt: MouseEvent, node: any) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly, checkMethod } = checkboxOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ $tree: $xeTree, node })
      }
      if (isDisabled) {
        return
      }
      const nodeid = getNodeId(node)
      let isChecked = false
      if (selectCheckboxMaps[nodeid]) {
        delete selectCheckboxMaps[nodeid]
      } else {
        isChecked = true
        selectCheckboxMaps[nodeid] = node
      }
      if (!checkStrictly) {
        XEUtils.eachTree(XEUtils.get(node, transform ? mapChildrenField : childrenField), (childNode) => {
          const childNodeid = getNodeId(childNode)
          if (isChecked) {
            if (!selectCheckboxMaps[childNodeid]) {
              selectCheckboxMaps[childNodeid] = true
            }
          } else {
            if (selectCheckboxMaps[childNodeid]) {
              delete selectCheckboxMaps[childNodeid]
            }
          }
        }, { children: transform ? mapChildrenField : childrenField })
      }
      reactData.updateCheckboxFlag++
      updateCheckboxStatus()
      const nodeids = XEUtils.keys(selectCheckboxMaps)
      const value = nodeids.map(deNodeValue)
      emitCheckboxMode(value)
      dispatchEvent('checkbox-change', { node, value, checked: isChecked }, evnt)
    }

    const changeCurrentEvent = (evnt: MouseEvent, node: any) => {
      evnt.preventDefault()
      const nodeOpts = computeNodeOpts.value
      const { currentMethod, trigger } = nodeOpts
      const childrenField = computeChildrenField.value
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      let isDisabled = !!currentMethod
      if (trigger === 'child') {
        if (hasChild) {
          return
        }
      } else if (trigger === 'parent') {
        if (!hasChild) {
          return
        }
      }
      if (currentMethod) {
        isDisabled = !currentMethod({ node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      reactData.currentNode = node
      dispatchEvent('current-change', { node, checked: isChecked }, evnt)
    }

    const changeRadioEvent = (evnt: MouseEvent, node: any) => {
      evnt.preventDefault()
      evnt.stopPropagation()
      const radioOpts = computeRadioOpts.value
      const { checkMethod } = radioOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ $tree: $xeTree, node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      const nodeid = getNodeId(node)
      const value = deNodeValue(nodeid)
      reactData.selectRadioKey = nodeid
      emitRadioMode(value)
      dispatchEvent('radio-change', { node, value, checked: isChecked }, evnt)
    }

    const handleGlobalResizeEvent = () => {
      const el = refElem.value
      if (!el || !el.clientWidth) {
        return
      }
      recalculate()
    }

    const treeMethods: TreeMethods = {
      dispatchEvent,
      getNodeId,
      getNodeById (nodeid) {
        const { nodeMaps } = internalData
        if (nodeid) {
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            return nodeItem.item
          }
        }
        return null
      },
      loadData (data) {
        return loadData(data || [])
      },
      reloadData (data) {
        return loadData(data || [])
      },
      clearCurrentNode () {
        reactData.currentNode = null
        return nextTick()
      },
      getCurrentNodeId () {
        const { currentNode } = reactData
        if (currentNode) {
          return deNodeValue(getNodeId(currentNode))
        }
        return null
      },
      getCurrentNode () {
        const { currentNode } = reactData
        const { nodeMaps } = internalData
        if (currentNode) {
          const nodeItem = nodeMaps[getNodeId(currentNode)]
          if (nodeItem) {
            return nodeItem.item
          }
        }
        return null
      },
      setCurrentNodeId (nodeKey) {
        const { nodeMaps } = internalData
        const nodeItem = nodeMaps[enNodeValue(nodeKey)]
        reactData.currentNode = nodeItem ? nodeItem.item : null
        return nextTick()
      },
      setCurrentNode (node) {
        reactData.currentNode = node
        return nextTick()
      },
      clearRadioNode () {
        reactData.selectRadioKey = null
        emitRadioMode(null)
        return nextTick()
      },
      getRadioNodeId () {
        return reactData.selectRadioKey || null
      },
      getRadioNode () {
        const { selectRadioKey } = reactData
        const { nodeMaps } = internalData
        if (selectRadioKey) {
          const nodeItem = nodeMaps[selectRadioKey]
          if (nodeItem) {
            return nodeItem.item
          }
        }
        return null
      },
      setRadioNodeId (nodeKey) {
        reactData.selectRadioKey = enNodeValue(nodeKey)
        emitRadioMode(nodeKey)
        return nextTick()
      },
      setRadioNode (node) {
        if (node) {
          const nodeid = getNodeId(node)
          reactData.selectRadioKey = nodeid
          emitRadioMode(deNodeValue(nodeid))
        } else {
          emitRadioMode(null)
        }
        return nextTick()
      },
      setCheckboxNode (nodeList, checked) {
        if (nodeList) {
          if (!XEUtils.isArray(nodeList)) {
            nodeList = [nodeList]
          }
          handleCheckedCheckboxNode(nodeList, checked)
        }
        emitCheckboxMode($xeTree.getCheckboxNodeIds())
        return nextTick()
      },
      setCheckboxByNodeId (nodeKeys, selected) {
        handleSetCheckboxByNodeId(nodeKeys, selected)
        emitCheckboxMode($xeTree.getCheckboxNodeIds())
        return nextTick()
      },
      getCheckboxNodeIds () {
        const { selectCheckboxMaps } = internalData
        const nodeKeys: any[] = []
        XEUtils.each(selectCheckboxMaps, (item, nodeId) => {
          nodeKeys.push(deNodeValue(nodeId))
        })
        return nodeKeys
      },
      getCheckboxNodes () {
        const { nodeMaps, selectCheckboxMaps } = internalData
        const list: any[] = []
        XEUtils.each(selectCheckboxMaps, (item, nodeid) => {
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            list.push(nodeItem.item)
          }
        })
        return list
      },
      clearCheckboxNode () {
        internalData.indeterminateRowMaps = {}
        internalData.selectCheckboxMaps = {}
        reactData.updateCheckboxFlag++
        emitCheckboxMode([])
        updateCheckboxStatus()
        return nextTick().then(() => {
          return { checkNodeKeys: [], checkNodes: [] }
        })
      },
      setAllCheckboxNode (checked) {
        const { transform } = props
        const selectMaps: Record<string, boolean> = {}
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        const checkKeys: string[] = []
        const checkNodes: any[] = []
        if (checked) {
          XEUtils.eachTree(internalData.afterTreeList, (node) => {
            const nodeid = getNodeId(node)
            checkKeys.push(nodeid)
            checkNodes.push(node)
            selectMaps[nodeid] = true
          }, { children: transform ? mapChildrenField : childrenField })
        }
        internalData.indeterminateRowMaps = {}
        internalData.selectCheckboxMaps = selectMaps
        reactData.updateCheckboxFlag++
        updateCheckboxStatus()
        return nextTick().then(() => {
          return { checkNodeKeys: checkKeys, checkNodes }
        })
      },
      clearExpandNode () {
        return treeMethods.clearAllExpandNode()
      },
      clearAllExpandNode () {
        const { nodeMaps, scrollYStore } = internalData
        XEUtils.each(nodeMaps, (nodeItem: VxeTreeDefines.NodeCacheItem) => {
          nodeItem.treeLoaded = false
        })
        internalData.treeExpandedMaps = {}
        reactData.updateExpandedFlag++
        reactData.topSpaceHeight = 0
        scrollYStore.startIndex = 0
        scrollYStore.endIndex = 1
        handleTreeToList()
        handleData()
        return recalculate()
      },
      setExpandByNodeId (nodeKeys, expanded) {
        const { treeExpandedMaps } = internalData
        if (nodeKeys) {
          if (!XEUtils.isArray(nodeKeys)) {
            nodeKeys = [nodeKeys]
          }
          nodeKeys.forEach((nodeKey) => {
            const nodeid = enNodeValue(nodeKey)
            handleSetExpand(nodeid, expanded, treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        handleTreeToList()
        handleData()
        return recalculate()
      },
      getExpandNodeIds () {
        const { treeExpandedMaps } = internalData
        const nodeKeys: any[] = []
        XEUtils.each(treeExpandedMaps, (item, nodeId) => {
          nodeKeys.push(deNodeValue(nodeId))
        })
        return nodeKeys
      },
      getExpandNodes () {
        const { nodeMaps, treeExpandedMaps } = internalData
        const list: any[] = []
        XEUtils.each(treeExpandedMaps, (item, nodeid) => {
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            list.push(nodeItem.item)
          }
        })
        return list
      },
      setExpandNode (nodes, expanded) {
        const { treeExpandedMaps } = internalData
        if (nodes) {
          if (!XEUtils.isArray(nodes)) {
            nodes = [nodes]
          }
          nodes.forEach((node: any) => {
            const nodeid = getNodeId(node)
            handleSetExpand(nodeid, expanded, treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        handleTreeToList()
        handleData()
        return recalculate()
      },
      toggleExpandByNodeId (nodeKeys) {
        const { treeExpandedMaps } = internalData
        if (nodeKeys) {
          if (!XEUtils.isArray(nodeKeys)) {
            nodeKeys = [nodeKeys]
          }
          nodeKeys.forEach((nodeKey) => {
            const nodeid = enNodeValue(nodeKey)
            handleSetExpand(nodeid, !treeExpandedMaps[`${nodeid}`], treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        handleTreeToList()
        handleData()
        return recalculate()
      },
      toggleExpandNode (nodes) {
        const { treeExpandedMaps } = internalData
        if (nodes) {
          if (!XEUtils.isArray(nodes)) {
            nodes = [nodes]
          }
          nodes.forEach((node: any) => {
            const nodeid = getNodeId(node)
            handleSetExpand(nodeid, !treeExpandedMaps[nodeid], treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        handleTreeToList()
        handleData()
        return recalculate()
      },
      setAllExpandNode (expanded) {
        const { transform } = props
        const { scrollYLoad } = reactData
        const { scrollYStore, treeExpandedMaps } = internalData
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        if (expanded) {
          XEUtils.eachTree(internalData.afterTreeList, (node) => {
            const childList: any[] = XEUtils.get(node, childrenField)
            const hasChild = childList && childList.length
            if (hasChild) {
              const nodeid = getNodeId(node)
              treeExpandedMaps[nodeid] = true
            }
          }, { children: transform ? mapChildrenField : childrenField })
        } else {
          internalData.treeExpandedMaps = {}
        }
        reactData.updateExpandedFlag++
        reactData.topSpaceHeight = 0
        scrollYStore.startIndex = 0
        scrollYStore.endIndex = 1
        handleTreeToList()
        handleData()
        return recalculate().then(() => {
          if (scrollYLoad) {
            loadYData()
          }
          return recalculate()
        })
      },
      reloadExpandNode (node) {
        const { lazy } = props
        if (lazy) {
          treeMethods.clearExpandLoaded(node)
          return handleAsyncTreeExpandChilds(node)
        }
        return recalculate()
      },
      clearExpandLoaded (node) {
        const { lazy } = props
        const { nodeMaps } = internalData
        if (lazy) {
          const nodeItem = nodeMaps[getNodeId(node)]
          if (nodeItem) {
            nodeItem.treeLoaded = false
          }
        }
        return recalculate()
      },
      /**
       * 用于树结构，给行数据加载子节点
       */
      loadChildrenNode (node, childRecords) {
        const { lazy, transform } = props
        const { nodeMaps } = internalData
        if (!lazy) {
          return Promise.resolve([])
        }
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        const parentNodeItem = nodeMaps[getNodeId(node)]
        const parentLevel = parentNodeItem ? parentNodeItem.level : 0
        const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
        return createNode(childRecords).then((nodeList) => {
          XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
            const itemNodeId = getNodeId(childRow)
            nodeMaps[itemNodeId] = {
              item: childRow,
              index: -1,
              items,
              parent: parent || parentNodeItem.item,
              nodes: parentNodes.concat(nodes),
              level: parentLevel + nodes.length,
              treeIndex: -1,
              lineCount: 0,
              treeLoaded: false
            }
          }, { children: childrenField })
          node[childrenField] = nodeList
          if (transform) {
            node[mapChildrenField] = nodeList
          }
          updateAfterDataIndex()
          return nodeList
        })
      },
      isExpandByNode,
      isCheckedByRadioNodeId,
      isCheckedByRadioNode,
      isCheckedByCheckboxNodeId,
      isIndeterminateByCheckboxNode,
      isCheckedByCheckboxNode,
      getCheckboxIndeterminateNodes () {
        const { nodeMaps, indeterminateRowMaps } = internalData
        const list: any[] = []
        XEUtils.each(indeterminateRowMaps, (item, nodeid) => {
          const nodeItem = nodeMaps[nodeid]
          if (nodeItem) {
            list.push(nodeItem.item)
          }
        })
        return list
      },
      recalculate,
      scrollTo: handleScrollTo,
      scrollToNode (node) {
        return $xeTree.scrollToNodeId(getNodeId(node))
      },
      scrollToNodeId (nodeid) {
        const { transform } = props
        const { scrollYStore, afterTreeList } = internalData
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        const scrollBodyElem = refVirtualWrapper.value
        if (nodeid && scrollBodyElem) {
          if (transform) {
            const matchObj = XEUtils.findTree(afterTreeList, item => getNodeId(item) === nodeid, { children: transform ? mapChildrenField : childrenField })
            if (matchObj) {
              return $xeTree.setExpandNode(matchObj.nodes, true).then(() => {
                const itemIndex = XEUtils.findIndexOf(internalData.afterVisibleList, item => getNodeId(item) === nodeid)
                if (itemIndex > -1) {
                  const targetTop = Math.max(0, (itemIndex - 1) * scrollYStore.rowHeight)
                  return handleScrollTo(scrollBodyElem.scrollLeft, targetTop)
                }
              })
            }
          } else {
            const itemEl = scrollBodyElem.querySelector<HTMLDivElement>(`.vxe-tree--node-wrapper[nodeid="${nodeid}"]`)
            if (itemEl) {
              return handleScrollTo(scrollBodyElem.scrollLeft, itemEl.offsetTop)
            }
          }
        }
        return recalculate()
      },
      clearScroll
    }

    const treePrivateMethods: TreePrivateMethods = {
    }

    Object.assign($xeTree, treeMethods, treePrivateMethods)

    const renderRadio = (node: any, nodeid: string, isChecked: boolean) => {
      const { showRadio } = props
      const radioOpts = computeRadioOpts.value
      const { showIcon, checkMethod, visibleMethod } = radioOpts
      const isVisible = !visibleMethod || visibleMethod({ $tree: $xeTree, node })
      let isDisabled = !!checkMethod
      if (showRadio && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ $tree: $xeTree, node })
        }
        return h('div', {
          class: ['vxe-tree--radio-option', {
            'is--checked': isChecked,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeRadioEvent(evnt, node)
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    }

    const renderCheckbox = (node: any, nodeid: string, isChecked: boolean) => {
      const { showCheckbox } = props
      const checkboxOpts = computeCheckboxOpts.value
      const { showIcon, checkMethod, visibleMethod } = checkboxOpts
      const isIndeterminate = isIndeterminateByCheckboxNodeid(nodeid)
      const isVisible = !visibleMethod || visibleMethod({ $tree: $xeTree, node })
      let isDisabled = !!checkMethod
      if (showCheckbox && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ $tree: $xeTree, node })
        }
        return h('div', {
          class: ['vxe-tree--checkbox-option', {
            'is--checked': isChecked,
            'is--indeterminate': isIndeterminate,
            'is--disabled': isDisabled
          }],
          onClick: (evnt) => {
            if (!isDisabled) {
              changeCheckboxEvent(evnt, node)
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    }

    const renderNode = (node: any, nodeid: string) => {
      const { lazy, showRadio, showCheckbox, showLine, indent, iconOpen, iconClose, iconLoaded, showIcon } = props
      const { currentNode, selectRadioKey, updateExpandedFlag } = reactData
      const { afterTreeList, nodeMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const childrenField = computeChildrenField.value
      const titleField = computeTitleField.value
      const hasChildField = computeHasChildField.value
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      const iconSlot = slots.icon
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const isExpand = updateExpandedFlag && treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid]
      const nodeValue = XEUtils.get(node, titleField)
      const nLevel = nodeItem.level

      let isRadioChecked = false
      if (showRadio) {
        isRadioChecked = nodeid === String(selectRadioKey)
      }

      let isCheckboxChecked = false
      if (showCheckbox) {
        isCheckboxChecked = isCheckedByCheckboxNodeId(nodeid)
      }

      let hasLazyChilds = false
      let isLazyLoading = false
      let isLazyLoaded = false
      if (lazy) {
        isLazyLoading = !!treeExpandLazyLoadedMaps[nodeid]
        hasLazyChilds = node[hasChildField]
        isLazyLoaded = !!nodeItem.treeLoaded
      }
      const prevNode = nodeItem.items[nodeItem.treeIndex - 1]
      const nParams = { node, isExpand }

      return h('div', {
        key: nodeid,
        class: ['vxe-tree--node-wrapper', `node--level-${nLevel}`],
        nodeid
      }, [
        h('div', {
          class: ['vxe-tree--node-item', {
            'is--current': currentNode && nodeid === getNodeId(currentNode),
            'is-radio--checked': isRadioChecked,
            'is-checkbox--checked': isCheckboxChecked
          }],
          style: {
            paddingLeft: `${(nLevel - 1) * (indent || 1)}px`
          },
          onClick (evnt) {
            handleNodeClickEvent(evnt, node)
          },
          onDblclick (evnt) {
            handleNodeDblclickEvent(evnt, node)
          }
        }, [
          showLine
            ? h('div', {
              class: 'vxe-tree--node-line-wrapper'
            }, [
              h('div', {
                class: 'vxe-tree--node-line',
                style: {
                  height: `${getNodeId(afterTreeList[0]) === nodeid ? 1 : calcTreeLine($xeTree, node, prevNode)}px`
                }
              })
            ])
            : renderEmptyElement($xeTree),
          h('div', {
            class: 'vxe-tree--node-item-switcher'
          }, showIcon && (lazy ? (isLazyLoaded ? hasChild : hasLazyChilds) : hasChild)
            ? [
                h('div', {
                  class: 'vxe-tree--node-item-icon',
                  onClick (evnt) {
                    toggleExpandEvent(evnt, node)
                  }
                }, iconSlot
                  ? getSlotVNs(iconSlot(nParams))
                  : [
                      h('i', {
                        class: isLazyLoading ? (iconLoaded || getIcon().TREE_NODE_LOADED) : (isExpand ? (iconOpen || getIcon().TREE_NODE_OPEN) : (iconClose || getIcon().TREE_NODE_CLOSE))
                      })
                    ])
              ]
            : []),
          renderRadio(node, nodeid, isRadioChecked),
          renderCheckbox(node, nodeid, isCheckboxChecked),
          h('div', {
            class: 'vxe-tree--node-item-inner'
          }, [
            h('div', {
              class: 'vxe-tree--node-item-title'
            }, titleSlot ? getSlotVNs(titleSlot(nParams)) : `${nodeValue}`),
            extraSlot
              ? h('div', {
                class: 'vxe-tree--node-item-extra'
              }, getSlotVNs(extraSlot(nParams)))
              : renderEmptyElement($xeTree)
          ])
        ])
      ])
    }

    const renderList = (treeList: any[]) => {
      const { transform } = props
      const { treeExpandedMaps } = internalData
      const childrenField = computeChildrenField.value
      if (!treeList.length) {
        return [
          h('div', {
            class: 'vxe-tree--empty-placeholder'
          }, getI18n('vxe.tree.searchEmpty'))
        ]
      }
      const nodeVNs: VNode[] = []
      treeList.forEach(transform
        ? (node) => {
            const nodeid = getNodeId(node)
            nodeVNs.push(renderNode(node, nodeid))
          }
        : (node) => {
            const nodeid = getNodeId(node)
            nodeVNs.push(renderNode(node, nodeid))
            const childList: any[] = XEUtils.get(node, childrenField)
            const hasChild = childList && childList.length
            if (hasChild && treeExpandedMaps[nodeid]) {
              nodeVNs.push(...renderList(childList))
            }
          })
      return nodeVNs
    }

    const renderVN = () => {
      const { loading, trigger, showLine } = props
      const { bodyHeight, topSpaceHeight, treeList } = reactData
      const vSize = computeSize.value
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const loadingOpts = computeLoadingOpts.value
      const isRowHover = computeIsRowHover.value
      const treeStyle = computeTreeStyle.value
      const loadingSlot = slots.loading
      const headerSlot = slots.header
      const footerSlot = slots.footer

      return h('div', {
        ref: refElem,
        class: ['vxe-tree', {
          [`size--${vSize}`]: vSize,
          'show--line': showLine,
          'checkbox--highlight': checkboxOpts.highlight,
          'radio--highlight': radioOpts.highlight,
          'node--hover': isRowHover,
          'node--trigger': trigger === 'node',
          'is--loading': loading
        }]
      }, [
        headerSlot
          ? h('div', {
            ref: refHeaderWrapperElem,
            class: 'vxe-tree--header-wrapper'
          }, headerSlot({ $tree: $xeTree }))
          : renderEmptyElement($xeTree),
        h('div', {
          ref: refVirtualWrapper,
          class: 'vxe-tree--node-list-wrapper',
          style: treeStyle,
          onScroll: scrollEvent
        }, [
          h('div', {
            class: 'vxe-tree--y-space',
            style: {
              height: bodyHeight ? `${bodyHeight}px` : ''
            }
          }),
          h('div', {
            ref: refVirtualBody,
            class: 'vxe-tree--node-list-body',
            style: {
              transform: `translateY(${topSpaceHeight}px)`
            }
          }, renderList(treeList))
        ]),
        footerSlot
          ? h('div', {
            ref: refFooterWrapperElem,
            class: 'vxe-tree--footer-wrapper'
          }, footerSlot({ $tree: $xeTree }))
          : renderEmptyElement($xeTree),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-tree--loading',
          modelValue: loading,
          icon: loadingOpts.icon,
          text: loadingOpts.text
        }, loadingSlot
          ? {
              default: () => loadingSlot({ $tree: $xeTree })
            }
          : {})
      ])
    }

    const dataFlag = ref(0)
    watch(() => props.data ? props.data.length : 0, () => {
      dataFlag.value++
    })
    watch(() => props.data, () => {
      dataFlag.value++
    })
    watch(dataFlag, () => {
      loadData(props.data || [])
    })

    watch(() => props.checkNodeKey, (nodeKey) => {
      reactData.selectRadioKey = enNodeValue(nodeKey)
    })

    const checkboxFlag = ref(0)
    watch(() => props.checkNodeKeys ? props.checkNodeKeys.length : 0, () => {
      checkboxFlag.value++
    })
    watch(() => props.checkNodeKeys, () => {
      checkboxFlag.value++
    })
    watch(checkboxFlag, () => {
      updateCheckboxChecked(props.checkNodeKeys || [])
    })

    watch(() => props.filterValue, () => {
      triggerSearchEvent(new Event('filter'))
    })

    const hFlag = ref(0)
    watch(() => props.height, () => {
      hFlag.value++
    })
    watch(() => props.minHeight, () => {
      hFlag.value++
    })
    watch(() => props.maxHeight, () => {
      hFlag.value++
    })
    watch(hFlag, () => {
      recalculate()
    })

    onMounted(() => {
      if (props.autoResize) {
        const el = refElem.value
        const parentEl = getParentElem()
        const resizeObserver = globalResize.create(() => {
          if (props.autoResize) {
            recalculate()
          }
        })
        if (el) {
          resizeObserver.observe(el)
        }
        if (parentEl) {
          resizeObserver.observe(parentEl)
        }
        internalData.resizeObserver = resizeObserver
      }

      globalEvents.on($xeTree, 'resize', handleGlobalResizeEvent)
    })

    onUnmounted(() => {
      const { resizeObserver } = internalData
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      globalEvents.off($xeTree, 'resize')
      XEUtils.assign(internalData, createInternalData())
    })

    loadData(props.data || [])

    $xeTree.renderVN = renderVN

    return $xeTree
  },
  render () {
    return this.renderVN()
  }
})
