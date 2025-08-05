import XEUtils from 'xe-utils'

import type { VxeTreeConstructor } from '../../../types'

export function enNodeValue (nodeid: string | number | null) {
  return XEUtils.eqNull(nodeid) ? '' : encodeURIComponent(`${nodeid}`)
}

export function deNodeValue (nodeid: string | number | null) {
  return nodeid ? decodeURIComponent(`${nodeid}`) : nodeid
}

function countTreeExpand ($xeTree: VxeTreeConstructor, prevNode: any) {
  let count = 1
  if (!prevNode) {
    return count
  }
  const props = $xeTree
  const { transform } = props
  const reactData = $xeTree.reactData
  const { updateExpandedFlag } = reactData
  const internalData = $xeTree.internalData
  const { treeExpandedMaps } = internalData
  const childrenField = $xeTree.computeChildrenField
  const mapChildrenField = $xeTree.computeMapChildrenField
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
