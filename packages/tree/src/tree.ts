import { ref, h, reactive, PropType, computed, VNode, watch, onUnmounted, nextTick } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { createEvent, getIcon, getConfig, useSize, renderEmptyElement } from '../../ui'
import XEUtils from 'xe-utils'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../../ui/src/dom'
import VxeLoadingComponent from '../../loading/src/loading'

import type { TreeReactData, VxeTreeEmits, VxeTreePropTypes, TreeInternalData, TreePrivateRef, VxeTreeDefines, VxeTreePrivateComputed, TreePrivateMethods, TreeMethods, ValueOf, VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

export default defineVxeComponent({
  name: 'VxeTree',
  props: {
    data: Array as PropType<VxeTreePropTypes.Data>,
    height: [String, Number] as PropType<VxeTreePropTypes.Height>,
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
    size: {
      type: String as PropType<VxeTreePropTypes.Size>,
      default: () => getConfig().tree.size || getConfig().size
    }
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
    'load-error'
  ] as VxeTreeEmits,
  setup (props, context) {
    const { emit, slots } = context

    const xID = XEUtils.uniqueId()

    const { computeSize } = useSize(props)

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<TreeReactData>({
      currentNode: null,
      selectRadioKey: props.checkNodeKey,
      treeList: [],
      updateExpandedFlag: 1,
      updateCheckboxFlag: 1
    })

    const internalData: TreeInternalData = {
      // initialized: false,
      nodeMaps: {},
      selectCheckboxMaps: {},
      indeterminateRowMaps: {},
      treeExpandedMaps: {},
      treeExpandLazyLoadedMaps: {}
    }

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
      const { height, minHeight } = props
      const stys: Record<string, string> = {}
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (minHeight) {
        stys.minHeight = toCssUnit(minHeight)
      }
      return stys
    })

    const computeMaps: VxeTreePrivateComputed = {
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
      const nodeid = XEUtils.get(node, valueField)
      return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(nodeid)
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

    const setRadioNode = (node: any) => {
      if (node) {
        reactData.selectRadioKey = getNodeId(node)
      }
      return nextTick()
    }

    const setCheckboxNode = (nodeList: any | any[], checked: boolean) => {
      if (nodeList) {
        if (!XEUtils.isArray(nodeList)) {
          nodeList = [nodeList]
        }
        handleCheckedCheckboxNode(nodeList, checked)
      }
      return nextTick()
    }

    const setCheckboxByNodeId = (nodeIds: any | any[], checked: boolean) => {
      const { nodeMaps } = internalData
      if (nodeIds) {
        if (!XEUtils.isArray(nodeIds)) {
          nodeIds = [nodeIds]
        }
        const nodeList: any[] = []
        nodeIds.forEach((nodeid: string) => {
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

    const updateCheckboxChecked = (nodeIds: VxeTreePropTypes.CheckNodeKeys) => {
      setCheckboxByNodeId(nodeIds, true)
    }

    const handleSetExpand = (nodeid: string, expanded: boolean, expandedMaps: Record<string, boolean>) => {
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

    const treeMethods: TreeMethods = {
      dispatchEvent,
      clearCurrentNode () {
        reactData.currentNode = null
        return nextTick()
      },
      getCurrentNodeId () {
        const { currentNode } = reactData
        if (currentNode) {
          return getNodeId(currentNode)
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
        const nodeItem = nodeMaps[nodeKey]
        reactData.currentNode = nodeItem ? nodeItem.item : null
        return nextTick()
      },
      setCurrentNode (node) {
        reactData.currentNode = node
        return nextTick()
      },
      clearRadioNode () {
        reactData.selectRadioKey = null
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
        reactData.selectRadioKey = nodeKey
        return nextTick()
      },
      setRadioNode,
      setCheckboxNode,
      setCheckboxByNodeId,
      getCheckboxNodeIds () {
        const { selectCheckboxMaps } = internalData
        return Object.keys(selectCheckboxMaps)
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
        internalData.selectCheckboxMaps = {}
        reactData.updateCheckboxFlag++
        return nextTick()
      },
      setAllCheckboxNode (checked) {
        const { transform } = props
        const selectMaps: Record<string, boolean> = {}
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        if (checked) {
          XEUtils.eachTree(reactData.treeList, (node) => {
            const nodeid = getNodeId(node)
            selectMaps[nodeid] = true
          }, { children: transform ? mapChildrenField : childrenField })
        }
        internalData.selectCheckboxMaps = selectMaps
        reactData.updateCheckboxFlag++
        return nextTick()
      },
      clearExpandNode () {
        return treeMethods.clearAllExpandNode()
      },
      clearAllExpandNode () {
        const { nodeMaps } = internalData
        XEUtils.each(nodeMaps, (nodeItem: VxeTreeDefines.NodeCacheItem) => {
          nodeItem.treeLoaded = false
        })
        internalData.treeExpandedMaps = {}
        reactData.updateExpandedFlag++
        return nextTick()
      },
      setExpandByNodeId (nodeids, expanded) {
        const { treeExpandedMaps } = internalData
        if (nodeids) {
          if (!XEUtils.isArray(nodeids)) {
            nodeids = [nodeids]
          }
          nodeids.forEach((nodeid: string) => {
            handleSetExpand(nodeid, expanded, treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        return nextTick()
      },
      getExpandNodeIds () {
        const { treeExpandedMaps } = internalData
        return XEUtils.keys(treeExpandedMaps)
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
        return nextTick()
      },
      toggleExpandByNodeId (nodeids) {
        const { treeExpandedMaps } = internalData
        if (nodeids) {
          if (!XEUtils.isArray(nodeids)) {
            nodeids = [nodeids]
          }
          nodeids.forEach((nodeid: string) => {
            handleSetExpand(nodeid, !treeExpandedMaps[nodeid], treeExpandedMaps)
          })
          reactData.updateExpandedFlag++
        }
        return nextTick()
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
        return nextTick()
      },
      setAllExpandNode (expanded) {
        const { transform } = props
        const { treeExpandedMaps } = internalData
        const childrenField = computeChildrenField.value
        const mapChildrenField = computeMapChildrenField.value
        if (expanded) {
          XEUtils.eachTree(reactData.treeList, (node) => {
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
        return nextTick()
      },
      reloadExpandNode (node) {
        const { lazy } = props
        if (lazy) {
          treeMethods.clearExpandLoaded(node)
          return handleAsyncTreeExpandChilds(node)
        }
        return nextTick()
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
        return nextTick()
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
        const parentNodeItem = nodeMaps[getNodeId(node)]
        const parentLevel = parentNodeItem ? parentNodeItem.level : 0
        const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
        return createNode(childRecords).then((nodeList) => {
          XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
            const itemNodeId = getNodeId(childRow)
            nodeMaps[itemNodeId] = {
              item: node,
              itemIndex: -1,
              items,
              parent: parent || parentNodeItem.item,
              nodes: parentNodes.concat(nodes),
              level: parentLevel + nodes.length,
              lineCount: 0,
              treeLoaded: false
            }
          }, { children: childrenField })
          node[childrenField] = nodeList
          if (transform) {
            node[childrenField] = nodeList
          }
          updateNodeLine(node)
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
      }
    }

    const cacheNodeMap = () => {
      const { transform } = props
      const { treeList } = reactData
      const valueField = computeValueField.value
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const keyMaps: Record<string, VxeTreeDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeList, (item, itemIndex, items, path, parent, nodes) => {
        let nodeid = getNodeId(item)
        if (!nodeid) {
          nodeid = getNodeUniqueId()
          XEUtils.set(item, valueField, nodeid)
        }
        keyMaps[nodeid] = {
          item,
          itemIndex,
          items,
          parent,
          nodes,
          level: nodes.length,
          lineCount: 0,
          treeLoaded: false
        }
      }, { children: transform ? mapChildrenField : childrenField })
      internalData.nodeMaps = keyMaps
    }

    const loadTreeData = (list: any[]) => {
      const { expandAll, transform } = props
      const { initialized } = internalData
      const keyField = computeKeyField.value
      const parentField = computeParentField.value
      const mapChildrenField = computeMapChildrenField.value
      if (transform) {
        reactData.treeList = XEUtils.toArrayTree(list, { key: keyField, parentKey: parentField, mapChildren: mapChildrenField })
      } else {
        reactData.treeList = list ? list.slice(0) : []
      }
      cacheNodeMap()
      if (!initialized) {
        if (list && list.length) {
          internalData.initialized = true
          if (expandAll) {
            $xeTree.setAllExpandNode(true)
          }
          $xeTree.setCheckboxByNodeId(props.checkNodeKeys || [], true)
        }
      }
    }

    const handleCountLine = (item: any, isRoot: boolean, nodeItem: VxeTreeDefines.NodeCacheItem) => {
      const { treeExpandedMaps } = internalData
      const childrenField = computeChildrenField.value
      const nodeid = getNodeId(item)
      nodeItem.lineCount++
      if (treeExpandedMaps[nodeid]) {
        XEUtils.arrayEach(item[childrenField], (childItem, childIndex, childList) => {
          if (!isRoot || childIndex < childList.length - 1) {
            handleCountLine(childItem, false, nodeItem)
          }
        })
      }
    }

    const updateNodeLine = (node: any) => {
      const { nodeMaps } = internalData
      if (node) {
        const nodeid = getNodeId(node)
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          XEUtils.lastArrayEach(nodeItem.nodes, childItem => {
            const nodeid = getNodeId(childItem)
            const nodeItem = nodeMaps[nodeid]
            if (nodeItem) {
              nodeItem.lineCount = 0
              handleCountLine(childItem, true, nodeItem)
            }
          })
        }
      }
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

    const handleAsyncTreeExpandChilds = (node: any): Promise<void> => {
      const checkboxOpts = computeCheckboxOpts.value
      const { loadMethod } = props
      const { checkStrictly } = checkboxOpts
      return new Promise(resolve => {
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
                updateNodeLine(node)
                dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return nextTick()
              })
            } else {
              updateNodeLine(node)
              dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            updateNodeLine(node)
            dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            return nextTick()
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
      expandNodes.forEach(updateNodeLine)
      return Promise.all(result)
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
      const { treeList } = reactData
      const { selectCheckboxMaps, indeterminateRowMaps } = internalData
      const childrenField = computeChildrenField.value
      const mapChildrenField = computeMapChildrenField.value
      const checkboxOpts = computeCheckboxOpts.value
      const { checkStrictly, checkMethod } = checkboxOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(treeList, (node) => {
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
          let vLen = 0 // 有效行
          childList.forEach(
            checkMethod
              ? (item) => {
                  const childNodeid = getNodeId(item)
                  const isSelect = selectCheckboxMaps[childNodeid]
                  if (checkMethod({ node: item })) {
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
          const isSelected = sLen >= vLen
          const halfSelect = !isSelected && (sLen >= 1 || hLen >= 1)
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
        isDisabled = !checkMethod({ node })
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
        XEUtils.eachTree(XEUtils.get(node, childrenField), (childNode) => {
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
      const value = XEUtils.keys(selectCheckboxMaps)
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
        isDisabled = !checkMethod({ node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      const value = getNodeId(node)
      reactData.selectRadioKey = value
      emitRadioMode(value)
      dispatchEvent('radio-change', { node, value, checked: isChecked }, evnt)
    }

    const treePrivateMethods: TreePrivateMethods = {
    }

    Object.assign($xeTree, treeMethods, treePrivateMethods)

    const renderRadio = (node: any, nodeid: string, isChecked: boolean) => {
      const { showRadio } = props
      const radioOpts = computeRadioOpts.value
      const { showIcon, checkMethod, visibleMethod } = radioOpts
      const isVisible = !visibleMethod || visibleMethod({ node })
      let isDisabled = !!checkMethod
      if (showRadio && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ node })
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
      const isVisible = !visibleMethod || visibleMethod({ node })
      let isDisabled = !!checkMethod
      if (showCheckbox && showIcon && isVisible) {
        if (checkMethod) {
          isDisabled = !checkMethod({ node })
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

    const renderNode = (node: any): VNode => {
      const { lazy, showRadio, showCheckbox, showLine, indent, iconOpen, iconClose, iconLoaded, showIcon } = props
      const { currentNode, selectRadioKey, updateExpandedFlag } = reactData
      const { nodeMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const childrenField = computeChildrenField.value
      const titleField = computeTitleField.value
      const hasChildField = computeHasChildField.value
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      const iconSlot = slots.icon
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const nodeid = getNodeId(node)
      const isExpand = updateExpandedFlag && treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid]
      const nodeValue = XEUtils.get(node, titleField)
      const childVns: VNode[] = []
      if (hasChild && treeExpandedMaps[nodeid]) {
        if (showLine) {
          childVns.push(
            h('div', {
              key: 'line',
              class: 'vxe-tree--node-child-line',
              style: {
                height: `calc(${nodeItem.lineCount} * var(--vxe-ui-tree-node-height) - var(--vxe-ui-tree-node-height) / 2)`,
                left: `${(nodeItem.level + 1) * (indent || 1)}px`
              }
            })
          )
        }
        childList.forEach(childItem => {
          childVns.push(renderNode(childItem))
        })
      }

      let isRadioChecked = false
      if (showRadio) {
        // eslint-disable-next-line eqeqeq
        isRadioChecked = nodeid == selectRadioKey
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

      return h('div', {
        class: ['vxe-tree--node-wrapper', `node--level-${nodeItem.level}`],
        nodeid
      }, [
        h('div', {
          class: ['vxe-tree--node-item', {
            'is--current': currentNode && nodeid === getNodeId(currentNode),
            'is-radio--checked': isRadioChecked,
            'is-checkbox--checked': isCheckboxChecked
          }],
          style: {
            paddingLeft: `${(nodeItem.level - 1) * (indent || 1)}px`
          },
          onClick (evnt) {
            handleNodeClickEvent(evnt, node)
          },
          onDblclick (evnt) {
            handleNodeDblclickEvent(evnt, node)
          }
        }, [
          showIcon || showLine
            ? h('div', {
              class: 'vxe-tree--node-item-switcher'
            }, showIcon && (lazy ? (isLazyLoaded ? hasChild : hasLazyChilds) : hasChild)
              ? [
                  h('div', {
                    class: 'vxe-tree--node-item-icon',
                    onClick (evnt) {
                      toggleExpandEvent(evnt, node)
                    }
                  }, iconSlot
                    ? iconSlot({ node, isExpand })
                    : [
                        h('i', {
                          class: isLazyLoading ? (iconLoaded || getIcon().TREE_NODE_LOADED) : (isExpand ? (iconOpen || getIcon().TREE_NODE_OPEN) : (iconClose || getIcon().TREE_NODE_CLOSE))
                        })
                      ])
                ]
              : [])
            : renderEmptyElement($xeTree),
          renderRadio(node, nodeid, isRadioChecked),
          renderCheckbox(node, nodeid, isCheckboxChecked),
          h('div', {
            class: 'vxe-tree--node-item-inner'
          }, [
            h('div', {
              class: 'vxe-tree--node-item-title'
            }, titleSlot ? getSlotVNs(titleSlot({ node, isExpand })) : `${nodeValue}`),
            extraSlot
              ? h('div', {
                class: 'vxe-tree--node-item-extra'
              }, getSlotVNs(extraSlot({ node, isExpand })))
              : renderEmptyElement($xeTree)
          ])
        ]),
        hasChild && treeExpandedMaps[nodeid]
          ? h('div', {
            class: 'vxe-tree--node-child-wrapper'
          }, childVns)
          : renderEmptyElement($xeTree)
      ])
    }

    const renderNodeList = () => {
      const { treeList } = reactData
      return h('div', {
        class: 'vxe-tree--node-list-wrapper'
      }, treeList.map(node => renderNode(node)))
    }

    const renderVN = () => {
      const { loading, trigger, showLine } = props
      const vSize = computeSize.value
      const radioOpts = computeRadioOpts.value
      const checkboxOpts = computeCheckboxOpts.value
      const treeStyle = computeTreeStyle.value
      const loadingOpts = computeLoadingOpts.value
      const isRowHover = computeIsRowHover.value
      const loadingSlot = slots.loading
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
        }],
        style: treeStyle
      }, [
        renderNodeList(),
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
      loadTreeData(props.data || [])
    })

    watch(() => props.checkNodeKey, (val) => {
      reactData.selectRadioKey = val
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

    onUnmounted(() => {
      reactData.treeList = []
      internalData.treeExpandedMaps = {}
      internalData.indeterminateRowMaps = {}
      internalData.nodeMaps = {}
    })

    loadTreeData(props.data || [])

    $xeTree.renderVN = renderVN

    return $xeTree
  },
  render () {
    return this.renderVN()
  }
})
