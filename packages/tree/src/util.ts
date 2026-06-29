import type { VxeTreeConstructor, VxeTreeDefines } from '../../../types'

function countTreeExpand ($xeTree: VxeTreeConstructor, prevNode: any) {
  let count = 1
  if (!prevNode) {
    return count
  }
  const props = $xeTree.props
  const { transform } = props
  const reactData = $xeTree.reactData
  const { updateExpandedFlag } = reactData
  const internalData = $xeTree.internalData
  const { treeExpandedMaps } = internalData
  const { computeChildrenField, computeMapChildrenField } = $xeTree.getComputeMaps()
  const childrenField = computeChildrenField.value
  const mapChildrenField = computeMapChildrenField.value
  const nodeChildren = prevNode[transform ? mapChildrenField : childrenField]
  if (nodeChildren && updateExpandedFlag && treeExpandedMaps[$xeTree.getNodeId(prevNode)]) {
    for (let index = 0; index < nodeChildren.length; index++) {
      count += countTreeExpand($xeTree, nodeChildren[index])
    }
  }
  return count
}

export function calcTreeLine ($xeTree: VxeTreeConstructor, node: any, prevNode: any) {
  const internalData = $xeTree.internalData
  const { scrollYStore } = internalData
  const { rowHeight } = scrollYStore
  let expandSize = 1
  if (prevNode) {
    expandSize = countTreeExpand($xeTree, prevNode)
  }
  return (rowHeight || 28) * expandSize - (prevNode ? 1 : 12)
}

export function getItemCacheObj (item: any): VxeTreeDefines.NodeCacheItem {
  return {
    item,
    index: -1,
    $index: -1,
    _index: -1,
    items: [],
    parent: null,
    nodes: [],
    level: 0,
    treeIndex: -1,
    lineCount: 0,
    treeLoaded: false
  }
}
