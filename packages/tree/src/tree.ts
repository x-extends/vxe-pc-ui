import { PropType, CreateElement, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent, getIcon, getConfig, renderEmptyElement, globalMixins } from '../../ui'
import { getSlotVNs } from '../../ui/src/vn'
import { toCssUnit } from '../../ui/src/dom'
import VxeLoadingComponent from '../../loading/src/loading'

import type { TreeReactData, VxeTreeEmits, VxeTreePropTypes, TreeInternalData, VxeTreeDefines, VxeComponentSizeType, ValueOf } from '../../../types'

/**
 * 生成节点的唯一主键
 */
function getNodeUniqueId () {
  return XEUtils.uniqueId('node_')
}

function handleSetExpand (nodeid: string, expanded: boolean, expandedMaps: Record<string, boolean>) {
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

export default /* define-vxe-component start */ defineVxeComponent({
  name: 'VxeTree',
  mixins: [
    globalMixins.sizeMixin
  ],
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
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: TreeReactData = {
      currentNode: null,
      selectRadioKey: null,
      treeList: [],
      updateExpandedFlag: 1,
      updateCheckboxFlag: 1
    }
    const internalData: TreeInternalData = {
      // initialized: false,
      nodeMaps: {},
      selectCheckboxMaps: {},
      indeterminateRowMaps: {},
      treeExpandedMaps: {},
      treeExpandLazyLoadedMaps: {}
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
    computeTitleField () {
      const $xeTree = this
      const props = $xeTree

      return props.titleField || 'title'
    },
    computeKeyField () {
      const $xeTree = this
      const props = $xeTree

      return props.keyField || 'id'
    },
    computeValueField () {
      const $xeTree = this
      const props = $xeTree

      const keyField = $xeTree.computeKeyField as string
      return props.valueField || keyField
    },
    computeParentField () {
      const $xeTree = this
      const props = $xeTree

      return props.parentField || 'parentId'
    },
    computeChildrenField () {
      const $xeTree = this
      const props = $xeTree

      return props.childrenField || 'children'
    },
    computeMapChildrenField () {
      const $xeTree = this
      const props = $xeTree

      return props.mapChildrenField || 'mapChildren'
    },
    computeHasChildField () {
      const $xeTree = this
      const props = $xeTree

      return props.hasChildField || 'hasChild'
    },
    computeIsRowCurrent () {
      const $xeTree = this
      const props = $xeTree

      const nodeOpts = $xeTree.computeNodeOpts as VxeTreePropTypes.NodeConfig
      const { isCurrent } = nodeOpts
      if (XEUtils.isBoolean(isCurrent)) {
        return isCurrent
      }
      return props.isCurrent
    },
    computeIsRowHover () {
      const $xeTree = this
      const props = $xeTree

      const nodeOpts = $xeTree.computeNodeOpts as VxeTreePropTypes.NodeConfig
      const { isHover } = nodeOpts
      if (XEUtils.isBoolean(isHover)) {
        return isHover
      }
      return props.isHover
    },
    computeRadioOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({ showIcon: true }, getConfig().tree.radioConfig, props.radioConfig)
    },
    computeCheckboxOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({ showIcon: true }, getConfig().tree.checkboxConfig, props.checkboxConfig)
    },
    computeNodeOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.nodeConfig, props.nodeConfig)
    },
    computeLoadingOpts () {
      const $xeTree = this
      const props = $xeTree

      return Object.assign({}, getConfig().tree.loadingConfig, props.loadingConfig)
    },
    computeTreeStyle () {
      const $xeTree = this
      const props = $xeTree

      const { height, minHeight } = props
      const stys: Record<string, string> = {}
      if (height) {
        stys.height = toCssUnit(height)
      }
      if (minHeight) {
        stys.minHeight = toCssUnit(minHeight)
      }
      return stys
    }
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeTree = this
      $xeTree.$emit(type, createEvent(evnt, { $tree: $xeTree }, params))
    },
    clearCurrentNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.currentNode = null
      return $xeTree.$nextTick()
    },
    getCurrentNodeId () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { currentNode } = reactData
      if (currentNode) {
        return $xeTree.getNodeId(currentNode)
      }
      return null
    },
    getCurrentNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { currentNode } = reactData
      const { nodeMaps } = internalData
      if (currentNode) {
        const nodeItem = nodeMaps[$xeTree.getNodeId(currentNode)]
        if (nodeItem) {
          return nodeItem.item
        }
      }
      return null
    },
    setCurrentNodeId (nodeKey: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { nodeMaps } = internalData
      const nodeItem = nodeMaps[nodeKey]
      reactData.currentNode = nodeItem ? nodeItem.item : null
      return $xeTree.$nextTick()
    },
    setCurrentNode (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.currentNode = node
      return $xeTree.$nextTick()
    },
    clearRadioNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = null
      return $xeTree.$nextTick()
    },
    getCheckboxNodeIds () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { selectCheckboxMaps } = internalData
      return Object.keys(selectCheckboxMaps)
    },
    getCheckboxNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

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
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      internalData.selectCheckboxMaps = {}
      reactData.updateCheckboxFlag++
      return $xeTree.$nextTick()
    },
    setAllCheckboxNode (checked: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const selectMaps: Record<string, boolean> = {}
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      if (checked) {
        XEUtils.eachTree(reactData.treeList, (node) => {
          const nodeid = $xeTree.getNodeId(node)
          selectMaps[nodeid] = true
        }, { children: transform ? mapChildrenField : childrenField })
      }
      internalData.selectCheckboxMaps = selectMaps
      reactData.updateCheckboxFlag++
      return $xeTree.$nextTick()
    },
    clearExpandNode () {
      const $xeTree = this

      return $xeTree.clearAllExpandNode()
    },
    clearAllExpandNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { nodeMaps } = internalData
      XEUtils.each(nodeMaps, (nodeItem: VxeTreeDefines.NodeCacheItem) => {
        nodeItem.treeLoaded = false
      })
      internalData.treeExpandedMaps = {}
      reactData.updateExpandedFlag++
      return $xeTree.$nextTick()
    },
    setExpandByNodeId (nodeids: any, expanded: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

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
      return $xeTree.$nextTick()
    },
    getExpandNodeIds () {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      return XEUtils.keys(treeExpandedMaps)
    },
    getExpandNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

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
    setExpandNode (nodes: any, expanded: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodes) {
        if (!XEUtils.isArray(nodes)) {
          nodes = [nodes]
        }
        nodes.forEach((node: any) => {
          const nodeid = $xeTree.getNodeId(node)
          handleSetExpand(nodeid, expanded, treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      return $xeTree.$nextTick()
    },
    toggleExpandByNodeId (nodeids: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

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
      return $xeTree.$nextTick()
    },
    toggleExpandNode (nodes: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      if (nodes) {
        if (!XEUtils.isArray(nodes)) {
          nodes = [nodes]
        }
        nodes.forEach((node: any) => {
          const nodeid = $xeTree.getNodeId(node)
          handleSetExpand(nodeid, !treeExpandedMaps[nodeid], treeExpandedMaps)
        })
        reactData.updateExpandedFlag++
      }
      return $xeTree.$nextTick()
    },
    setAllExpandNode (expanded: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { treeExpandedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      if (expanded) {
        XEUtils.eachTree(reactData.treeList, (node) => {
          const childList: any[] = XEUtils.get(node, childrenField)
          const hasChild = childList && childList.length
          if (hasChild) {
            const nodeid = $xeTree.getNodeId(node)
            treeExpandedMaps[nodeid] = true
          }
        }, { children: transform ? mapChildrenField : childrenField })
      } else {
        internalData.treeExpandedMaps = {}
      }
      reactData.updateExpandedFlag++
      return $xeTree.$nextTick()
    },
    reloadExpandNode (node: any) {
      const $xeTree = this
      const props = $xeTree

      const { lazy } = props
      if (lazy) {
        $xeTree.clearExpandLoaded(node)
        return $xeTree.handleAsyncTreeExpandChilds(node)
      }
      return $xeTree.$nextTick()
    },
    clearExpandLoaded (node: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy } = props
      const { nodeMaps } = internalData
      if (lazy) {
        const nodeItem = nodeMaps[$xeTree.getNodeId(node)]
        if (nodeItem) {
          nodeItem.treeLoaded = false
        }
      }
      return $xeTree.$nextTick()
    },
    /**
     * 用于树结构，给行数据加载子节点
     */
    loadChildrenNode (node: any, childRecords: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy, transform } = props
      const { nodeMaps } = internalData
      if (!lazy) {
        return Promise.resolve([])
      }
      const childrenField = $xeTree.computeChildrenField
      const parentNodeItem = nodeMaps[$xeTree.getNodeId(node)]
      const parentLevel = parentNodeItem ? parentNodeItem.level : 0
      const parentNodes = parentNodeItem ? parentNodeItem.nodes : []
      return $xeTree.createNode(childRecords).then((nodeList) => {
        XEUtils.eachTree(nodeList, (childRow, index, items, path, parent, nodes) => {
          const itemNodeId = $xeTree.getNodeId(childRow)
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
        $xeTree.updateNodeLine(node)
        return nodeList
      })
    },
    getNodeId (node: any) {
      const $xeTree = this

      const valueField = $xeTree.computeValueField
      const nodeid = XEUtils.get(node, valueField)
      return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(nodeid)
    },
    isExpandByNode (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateExpandedFlag } = reactData
      const { treeExpandedMaps } = internalData
      const nodeid = $xeTree.getNodeId(node)
      return !!(updateExpandedFlag && treeExpandedMaps[nodeid])
    },
    isCheckedByRadioNodeId (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { selectRadioKey } = reactData
      return selectRadioKey === nodeid
    },
    isCheckedByRadioNode  (node: any) {
      const $xeTree = this

      return $xeTree.isCheckedByRadioNodeId($xeTree.getNodeId(node))
    },
    isCheckedByCheckboxNodeId  (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateCheckboxFlag } = reactData
      const { selectCheckboxMaps } = internalData
      return !!(updateCheckboxFlag && selectCheckboxMaps[nodeid])
    },
    isCheckedByCheckboxNode  (node: any) {
      const $xeTree = this

      return $xeTree.isCheckedByCheckboxNodeId($xeTree.getNodeId(node))
    },
    isIndeterminateByCheckboxNodeid (nodeid: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { updateCheckboxFlag } = reactData
      const { indeterminateRowMaps } = internalData
      return !!(updateCheckboxFlag && indeterminateRowMaps[nodeid])
    },
    isIndeterminateByCheckboxNode  (node: any) {
      const $xeTree = this

      return $xeTree.isIndeterminateByCheckboxNodeid($xeTree.getNodeId(node))
    },
    getCheckboxIndeterminateNodes () {
      const $xeTree = this
      const internalData = $xeTree.internalData

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
    emitCheckboxMode  (value: VxeTreePropTypes.CheckNodeKeys) {
      const $xeTree = this

      $xeTree.$emit('update:checkNodeKeys', value)
    },
    emitRadioMode  (value: VxeTreePropTypes.CheckNodeKey) {
      const $xeTree = this

      $xeTree.$emit('update:checkNodeKey', value)
    },
    getRadioNodeId () {
      const $xeTree = this
      const reactData = $xeTree.reactData

      return reactData.selectRadioKey || null
    },
    setRadioNodeId (nodeKey: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = nodeKey
      return $xeTree.$nextTick()
    },
    getRadioNode () {
      const $xeTree = this
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

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
    setRadioNode  (node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      if (node) {
        reactData.selectRadioKey = $xeTree.getNodeId(node)
      }
      return $xeTree.$nextTick()
    },
    setCheckboxNode  (nodeList: any | any[], checked: boolean) {
      const $xeTree = this

      if (nodeList) {
        if (!XEUtils.isArray(nodeList)) {
          nodeList = [nodeList]
        }
        $xeTree.handleCheckedCheckboxNode(nodeList, checked)
      }
      return $xeTree.$nextTick()
    },
    setCheckboxByNodeId  (nodeIds: any | any[], checked: boolean) {
      const $xeTree = this
      const internalData = $xeTree.internalData

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
        $xeTree.handleCheckedCheckboxNode(nodeList, checked)
      }
      return $xeTree.$nextTick()
    },
    handleCheckedCheckboxNode  (nodeList: any[], checked: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const mapChildrenField = $xeTree.computeMapChildrenField
      const childrenField = $xeTree.computeChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly } = checkboxOpts
      const handleSelect = (node: any) => {
        const nodeid = $xeTree.getNodeId(node)
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
      $xeTree.updateCheckboxStatus()
    },
    updateCheckboxChecked  (nodeIds: VxeTreePropTypes.CheckNodeKeys) {
      const $xeTree = this

      $xeTree.setCheckboxByNodeId(nodeIds, true)
    },
    createNode (records: any[]) {
      const $xeTree = this

      const valueField = $xeTree.computeValueField
      return Promise.resolve(
        records.map(obj => {
          const item = { ...obj }
          let nodeid = $xeTree.getNodeId(item)
          if (!nodeid) {
            nodeid = getNodeUniqueId()
            XEUtils.set(item, valueField, nodeid)
          }
          return item
        })
      )
    },
    cacheNodeMap  () {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { treeList } = reactData
      const valueField = $xeTree.computeValueField
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const keyMaps: Record<string, VxeTreeDefines.NodeCacheItem> = {}
      XEUtils.eachTree(treeList, (item, itemIndex, items, path, parent, nodes) => {
        let nodeid = $xeTree.getNodeId(item)
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
    },
    loadTreeData (list: any[]) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { expandAll, transform } = props
      const { initialized } = internalData
      const keyField = $xeTree.computeKeyField
      const parentField = $xeTree.computeParentField
      const mapChildrenField = $xeTree.computeMapChildrenField
      if (transform) {
        reactData.treeList = XEUtils.toArrayTree(list, { key: keyField, parentKey: parentField, mapChildren: mapChildrenField })
      } else {
        reactData.treeList = list ? list.slice(0) : []
      }
      $xeTree.cacheNodeMap()
      if (!initialized) {
        if (list && list.length) {
          internalData.initialized = true
          if (expandAll) {
            $xeTree.setAllExpandNode(true)
          }
          $xeTree.setCheckboxByNodeId(props.checkNodeKeys || [], true)
        }
      }
    },
    handleCountLine  (item: any, isRoot: boolean, nodeItem: VxeTreeDefines.NodeCacheItem) {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { treeExpandedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const nodeid = $xeTree.getNodeId(item)
      nodeItem.lineCount++
      if (treeExpandedMaps[nodeid]) {
        XEUtils.arrayEach(item[childrenField], (childItem, childIndex, childList) => {
          if (!isRoot || childIndex < childList.length - 1) {
            $xeTree.handleCountLine(childItem, false, nodeItem)
          }
        })
      }
    },
    updateNodeLine  (node: any) {
      const $xeTree = this
      const internalData = $xeTree.internalData

      const { nodeMaps } = internalData
      if (node) {
        const nodeid = $xeTree.getNodeId(node)
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          XEUtils.lastArrayEach(nodeItem.nodes, childItem => {
            const nodeid = $xeTree.getNodeId(childItem)
            const nodeItem = nodeMaps[nodeid]
            if (nodeItem) {
              nodeItem.lineCount = 0
              $xeTree.handleCountLine(childItem, true, nodeItem)
            }
          })
        }
      }
    },
    handleNodeClickEvent  (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData

      const { showRadio, showCheckbox, trigger } = props
      const radioOpts = $xeTree.computeRadioOpts
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const isRowCurrent = $xeTree.computeIsRowCurrent
      let triggerCurrent = false
      let triggerRadio = false
      let triggerCheckbox = false
      let triggerExpand = false
      if (isRowCurrent) {
        triggerCurrent = true
        $xeTree.changeCurrentEvent(evnt, node)
      } else if (reactData.currentNode) {
        reactData.currentNode = null
      }
      if (trigger === 'node') {
        triggerExpand = true
        $xeTree.toggleExpandEvent(evnt, node)
      }
      if (showRadio && radioOpts.trigger === 'node') {
        triggerRadio = true
        $xeTree.changeRadioEvent(evnt, node)
      }
      if (showCheckbox && checkboxOpts.trigger === 'node') {
        triggerCheckbox = true
        $xeTree.changeCheckboxEvent(evnt, node)
      }
      $xeTree.dispatchEvent('node-click', { node, triggerCurrent, triggerRadio, triggerCheckbox, triggerExpand }, evnt)
    },
    handleNodeDblclickEvent  (evnt: MouseEvent, node: any) {
      const $xeTree = this

      $xeTree.dispatchEvent('node-dblclick', { node }, evnt)
    },
    handleAsyncTreeExpandChilds  (node: any): Promise<void> {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { loadMethod } = props
      const { checkStrictly } = checkboxOpts
      return new Promise(resolve => {
        if (loadMethod) {
          const { nodeMaps } = internalData
          const nodeid = $xeTree.getNodeId(node)
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
                  $xeTree.handleCheckedCheckboxNode(childRows, true)
                }
                $xeTree.updateNodeLine(node)
                $xeTree.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
                return $xeTree.$nextTick()
              })
            } else {
              $xeTree.updateNodeLine(node)
              $xeTree.dispatchEvent('load-success', { node, data: childRecords }, new Event('load-success'))
            }
          }).catch((e) => {
            const { treeExpandLazyLoadedMaps } = internalData
            nodeItem.treeLoaded = false
            if (treeExpandLazyLoadedMaps[nodeid]) {
              treeExpandLazyLoadedMaps[nodeid] = false
            }
            $xeTree.updateNodeLine(node)
            $xeTree.dispatchEvent('load-error', { node, data: e }, new Event('load-error'))
          }).finally(() => {
            return $xeTree.$nextTick()
          })
        } else {
          resolve()
        }
      })
    },
    /**
     * 展开与收起树节点
     * @param nodeList
     * @param expanded
     * @returns
     */
    handleBaseTreeExpand (nodeList: any[], expanded: boolean) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy, accordion, toggleMethod } = props
      const { treeExpandLazyLoadedMaps, treeExpandedMaps } = internalData
      const { nodeMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const hasChildField = $xeTree.computeHasChildField
      const result: any[] = []
      let validNodes = toggleMethod ? nodeList.filter((node: any) => toggleMethod({ $tree: $xeTree, expanded, node })) : nodeList
      if (accordion) {
        validNodes = validNodes.length ? [validNodes[validNodes.length - 1]] : []
        // 同一级只能展开一个
        const nodeid = $xeTree.getNodeId(validNodes[0])
        const nodeItem = nodeMaps[nodeid]
        if (nodeItem) {
          nodeItem.items.forEach(item => {
            const itemNodeId = $xeTree.getNodeId(item)
            if (treeExpandedMaps[itemNodeId]) {
              delete treeExpandedMaps[itemNodeId]
            }
          })
        }
      }
      const expandNodes: any[] = []
      if (expanded) {
        validNodes.forEach((item) => {
          const itemNodeId = $xeTree.getNodeId(item)
          if (!treeExpandedMaps[itemNodeId]) {
            const nodeItem = nodeMaps[itemNodeId]
            const isLoad = lazy && item[hasChildField] && !nodeItem.treeLoaded && !treeExpandLazyLoadedMaps[itemNodeId]
            // 是否使用懒加载
            if (isLoad) {
              result.push($xeTree.handleAsyncTreeExpandChilds(item))
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
          const itemNodeId = $xeTree.getNodeId(item)
          if (treeExpandedMaps[itemNodeId]) {
            delete treeExpandedMaps[itemNodeId]
            expandNodes.push(item)
          }
        })
      }
      reactData.updateExpandedFlag++
      expandNodes.forEach($xeTree.updateNodeLine)
      return Promise.all(result)
    },
    toggleExpandEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const internalData = $xeTree.internalData

      const { lazy } = props
      const { treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const nodeid = $xeTree.getNodeId(node)
      const expanded = !treeExpandedMaps[nodeid]
      evnt.stopPropagation()
      if (!lazy || !treeExpandLazyLoadedMaps[nodeid]) {
        $xeTree.handleBaseTreeExpand([node], expanded)
      }
    },
    updateCheckboxStatus  () {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { transform } = props
      const { treeList } = reactData
      const { selectCheckboxMaps, indeterminateRowMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly, checkMethod } = checkboxOpts
      if (!checkStrictly) {
        const childRowMaps: Record<string, number> = {}
        const childRowList: any[][] = []
        XEUtils.eachTree(treeList, (node) => {
          const nodeid = $xeTree.getNodeId(node)
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
                  const childNodeid = $xeTree.getNodeId(item)
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
                const childNodeid = $xeTree.getNodeId(item)
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
    },
    changeCheckboxEvent  (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const props = $xeTree
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      evnt.preventDefault()
      evnt.stopPropagation()
      const { transform } = props
      const { selectCheckboxMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const mapChildrenField = $xeTree.computeMapChildrenField
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { checkStrictly, checkMethod } = checkboxOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ node })
      }
      if (isDisabled) {
        return
      }
      const nodeid = $xeTree.getNodeId(node)
      let isChecked = false
      if (selectCheckboxMaps[nodeid]) {
        delete selectCheckboxMaps[nodeid]
      } else {
        isChecked = true
        selectCheckboxMaps[nodeid] = node
      }
      if (!checkStrictly) {
        XEUtils.eachTree(XEUtils.get(node, childrenField), (childNode) => {
          const childNodeid = $xeTree.getNodeId(childNode)
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
      $xeTree.updateCheckboxStatus()
      const value = XEUtils.keys(selectCheckboxMaps)
      $xeTree.emitCheckboxMode(value)
      $xeTree.dispatchEvent('checkbox-change', { node, value, checked: isChecked }, evnt)
    },
    changeCurrentEvent (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      evnt.preventDefault()
      const nodeOpts = $xeTree.computeNodeOpts
      const { currentMethod, trigger } = nodeOpts
      const childrenField = $xeTree.computeChildrenField
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
      $xeTree.dispatchEvent('current-change', { node, checked: isChecked }, evnt)
    },
    changeRadioEvent  (evnt: MouseEvent, node: any) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      evnt.preventDefault()
      evnt.stopPropagation()
      const radioOpts = $xeTree.computeRadioOpts
      const { checkMethod } = radioOpts
      let isDisabled = !!checkMethod
      if (checkMethod) {
        isDisabled = !checkMethod({ node })
      }
      if (isDisabled) {
        return
      }
      const isChecked = true
      const value = $xeTree.getNodeId(node)
      reactData.selectRadioKey = value
      $xeTree.emitRadioMode(value)
      $xeTree.dispatchEvent('radio-change', { node, value, checked: isChecked }, evnt)
    },

    //
    // Render
    //
    renderRadio (h: CreateElement, node: any, nodeid: string, isChecked: boolean) {
      const $xeTree = this
      const props = $xeTree

      const { showRadio } = props
      const radioOpts = $xeTree.computeRadioOpts
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
          on: {
            click: (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeTree.changeRadioEvent(evnt, node)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-radio--icon', isChecked ? getIcon().RADIO_CHECKED : getIcon().RADIO_UNCHECKED]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    },
    renderCheckbox  (h: CreateElement, node: any, nodeid: string, isChecked: boolean) {
      const $xeTree = this
      const props = $xeTree

      const { showCheckbox } = props
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const { showIcon, checkMethod, visibleMethod } = checkboxOpts
      const isIndeterminate = $xeTree.isIndeterminateByCheckboxNodeid(nodeid)
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
          on: {
            click: (evnt: MouseEvent) => {
              if (!isDisabled) {
                $xeTree.changeCheckboxEvent(evnt, node)
              }
            }
          }
        }, [
          h('span', {
            class: ['vxe-checkbox--icon', isIndeterminate ? getIcon().CHECKBOX_INDETERMINATE : (isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED)]
          })
        ])
      }
      return renderEmptyElement($xeTree)
    },
    renderNode (h: CreateElement, node: any): VNode {
      const $xeTree = this
      const props = $xeTree
      const slots = $xeTree.$scopedSlots
      const reactData = $xeTree.reactData
      const internalData = $xeTree.internalData

      const { lazy, showRadio, showCheckbox, showLine, indent, iconOpen, iconClose, iconLoaded, showIcon } = props
      const { currentNode, selectRadioKey, updateExpandedFlag } = reactData
      const { nodeMaps, treeExpandedMaps, treeExpandLazyLoadedMaps } = internalData
      const childrenField = $xeTree.computeChildrenField
      const titleField = $xeTree.computeTitleField
      const hasChildField = $xeTree.computeHasChildField
      const childList: any[] = XEUtils.get(node, childrenField)
      const hasChild = childList && childList.length
      const iconSlot = slots.icon
      const titleSlot = slots.title
      const extraSlot = slots.extra
      const nodeid = $xeTree.getNodeId(node)
      const isExpand = updateExpandedFlag && treeExpandedMaps[nodeid]
      const nodeItem = nodeMaps[nodeid]
      const nodeValue = XEUtils.get(node, titleField)

      let isRadioChecked = false
      if (showRadio) {
        // eslint-disable-next-line eqeqeq
        isRadioChecked = nodeid == selectRadioKey
      }

      let isCheckboxChecked = false
      if (showCheckbox) {
        isCheckboxChecked = $xeTree.isCheckedByCheckboxNodeId(nodeid)
      }

      let hasLazyChilds = false
      let isLazyLoading = false
      let isLazyLoaded = false
      if (lazy) {
        isLazyLoading = !!treeExpandLazyLoadedMaps[nodeid]
        hasLazyChilds = node[hasChildField]
        isLazyLoaded = !!nodeItem.treeLoaded
      }

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
          childVns.push($xeTree.renderNode(h, childItem))
        })
      }

      return h('div', {
        class: ['vxe-tree--node-wrapper', `node--level-${nodeItem.level}`],
        attrs: {
          nodeid
        }
      }, [
        h('div', {
          class: ['vxe-tree--node-item', {
            'is--current': currentNode && nodeid === $xeTree.getNodeId(currentNode),
            'is-radio--checked': isRadioChecked,
            'is-checkbox--checked': isCheckboxChecked
          }],
          style: {
            paddingLeft: `${(nodeItem.level - 1) * (indent || 1)}px`
          },
          on: {
            click (evnt: MouseEvent) {
              $xeTree.handleNodeClickEvent(evnt, node)
            },
            dblclick (evnt: MouseEvent) {
              $xeTree.handleNodeDblclickEvent(evnt, node)
            }
          }
        }, [
          showIcon || showLine
            ? h('div', {
              class: 'vxe-tree--node-item-switcher'
            }, showIcon && (lazy ? (isLazyLoaded ? hasChild : hasLazyChilds) : hasChild)
              ? [
                  h('div', {
                    class: 'vxe-tree--node-item-icon',
                    on: {
                      click (evnt: MouseEvent) {
                        $xeTree.toggleExpandEvent(evnt, node)
                      }
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
          $xeTree.renderRadio(h, node, nodeid, isRadioChecked),
          $xeTree.renderCheckbox(h, node, nodeid, isCheckboxChecked),
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
    },
    renderNodeList (h: CreateElement) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      const { treeList } = reactData
      return h('div', {
        class: 'vxe-tree--node-list-wrapper'
      }, treeList.map(node => $xeTree.renderNode(h, node)))
    },
    renderVN (h: CreateElement): VNode {
      const $xeTree = this
      const props = $xeTree
      const slots = $xeTree.$scopedSlots

      const { loading, trigger, showLine } = props
      const vSize = $xeTree.computeSize
      const radioOpts = $xeTree.computeRadioOpts
      const checkboxOpts = $xeTree.computeCheckboxOpts
      const treeStyle = $xeTree.computeTreeStyle
      const loadingOpts = $xeTree.computeLoadingOpts
      const isRowHover = $xeTree.computeIsRowHover
      const loadingSlot = slots.loading
      return h('div', {
        ref: 'refElem',
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
        $xeTree.renderNodeList(h),
        /**
         * 加载中
         */
        h(VxeLoadingComponent, {
          class: 'vxe-tree--loading',
          props: {
            value: loading,
            icon: loadingOpts.icon,
            text: loadingOpts.text
          },
          scopedSlots: loadingSlot
            ? {
                default: () => loadingSlot({ $tree: $xeTree })
              }
            : {}
        })
      ])
    }
  },
  watch: {
    data (val) {
      const $xeTree = this

      $xeTree.loadTreeData(val || [])
    },
    checkNodeKey (val) {
      const $xeTree = this
      const reactData = $xeTree.reactData

      reactData.selectRadioKey = val
    },
    checkNodeKeys () {
      const $xeTree = this
      const props = $xeTree

      $xeTree.updateCheckboxChecked(props.checkNodeKeys || [])
    }
  },
  created () {
    const $xeTree = this
    const props = $xeTree
    const reactData = $xeTree.reactData

    reactData.selectRadioKey = props.checkNodeKey || null

    $xeTree.loadTreeData(props.data || [])
  },
  beforeDestroy () {
    const $xeTree = this
    const reactData = $xeTree.reactData
    const internalData = $xeTree.internalData

    reactData.treeList = []
    internalData.treeExpandedMaps = {}
    internalData.indeterminateRowMaps = {}
    internalData.nodeMaps = {}
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
}) /* define-vxe-component end */
