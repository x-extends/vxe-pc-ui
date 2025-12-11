import type { VxeTreeConstructor, VxeTreePrivateMethods } from '../../../types'

interface CrossTreeDragNodeObj {
  node: any
}

// 跨表拖拽
export const crossTreeDragNodeGlobal: CrossTreeDragNodeObj = {
  node: null
}

export function getCrossTreeDragNodeInfo ($xeTree: VxeTreeConstructor & VxeTreePrivateMethods) {
  const crossTreeDragNodeInfo = ($xeTree as any).crossTreeDragNodeInfo as CrossTreeDragNodeObj
  return crossTreeDragNodeInfo
}
