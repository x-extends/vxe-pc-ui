import type { VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

// 跨表拖拽
export const crossTreeDragNodeGlobal = {
  node: null as any
}

export function getCrossTreeDragNodeInfo($xeTree: VxeTreeConstructor & VxeTreePrivateMethods) {
  const crossTreeDragNodeInfo = ($xeTree as any).crossTreeDragNodeInfo as typeof crossTreeDragNodeGlobal
  return crossTreeDragNodeInfo
}
