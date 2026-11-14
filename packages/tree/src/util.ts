import type { VxeTreeConstructor, VxeTreeDefines } from '../../../types'

function countTreeExpand($xeTree: VxeTreeConstructor, prevNode: any) {
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

export function calcTreeLine($xeTree: VxeTreeConstructor, node: any, prevNode: any) {
  const internalData = $xeTree.internalData
  const { scrollYStore } = internalData
  const { rowHeight } = scrollYStore
  let expandSize = 1
  if (prevNode) {
    expandSize = countTreeExpand($xeTree, prevNode)
  }
  return (rowHeight || 28) * expandSize - (prevNode ? 1 : 12)
}

export function getItemCacheObj(item: any): VxeTreeDefines.NodeCacheItem {
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
    treeLoaded: false,
    linesMask: 0
  }
}

/**
 * 分配树节点的连接线
 * 类名（cut-full / cut-top / cut-bottom）
 */
export function getTreeNodeLines(isExpandable: boolean, depth: number, linesMask: number, isFirstRow: boolean, isLastRow: boolean, showRootLine: boolean | undefined) {
  const lines: VxeTreeDefines.NodeCacheTreeLineData[] = []

  for (let col = 1; col <= depth; col++) {
    const leftVal = `var(--vxe-ui-tree-node-padding) + var(--vxe-ui-tree-node-btn-width) / 2 + var(--vxe-ui-tree-node-indent) * ${(col - 1)}`
    const through = (linesMask & (1 << (col - 1))) !== 0

    if (col === 1 && !showRootLine) {
      continue
    }

    if (col < depth) {
      // 普通列（贯穿线）
      if (through) {
        let top = '0'
        let height = '100%'
        if (isFirstRow) {
          top = '50%'
          height = '50%'
        } else if (isLastRow) {
          top = '0'
          height = '50%'
        }

        lines.push({
          type: 'v',
          style: {
            left: `calc(${leftVal})`,
            top,
            height
          }
        })
      }
    } else {
      // 肘部列
      let vTop = '0'
      let vHeight = through ? '100%' : '50%'

      if (isFirstRow && isLastRow) {
        vTop = '50%'
        vHeight = '0px'
      } else if (isFirstRow) {
        vTop = '50%'
        vHeight = '50%'
      } else if (isLastRow) {
        vTop = '0'
        vHeight = '50%'
      }

      if (isExpandable && vHeight !== '0px') {
        // 元素切割：根据头和尾的情况分配不同的类名
        let cutType = 'v cut'
        if (vTop === '0' && vHeight === '50%') {
          cutType = 'v cut-top'
        } else if (vTop === '50%' && vHeight === '50%') {
          cutType = 'v cut-bottom'
        } else if (vHeight === '100%') {
          cutType = 'v cut-full'
        }

        lines.push({
          type: cutType,
          style: {
            left: `calc(${leftVal})`,
            top: vTop,
            height: vHeight
          }
        })
      } else {
        // 正常竖线
        if (vHeight !== '0px') {
          lines.push({
            type: 'v',
            style: {
              left: `calc(${leftVal})`,
              top: vTop,
              height: vHeight
            }
          })
        }
      }

      // 横线处理：如果可展开，横线从图标右侧开始画；否则正常画
      if (isExpandable) {
        lines.push({
          type: 'h',
          style: {
            left: `calc(${leftVal} + var(--vxe-ui-tree-node-btn-width) / 2)`,
            top: '50%',
            width: 'calc(var(--vxe-ui-tree-node-indent) - var(--vxe-ui-tree-node-btn-width) - 0.2em)'
          }
        })
      } else {
        lines.push({
          type: 'h',
          style: {
            left: `calc(${leftVal})`,
            top: '50%',
            width: 'calc(var(--vxe-ui-tree-node-indent) - var(--vxe-ui-tree-node-btn-width) / 2 - 0.1em)'
          }
        })
      }
    }
  }
  return lines
}
