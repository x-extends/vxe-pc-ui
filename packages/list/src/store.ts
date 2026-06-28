import type { VxeListConstructor, VxeListPrivateMethods } from '../../../types'

interface CrossListDragRowObj {
  row: any
}

// 跨表拖拽
export const crossListDragRowGlobal: CrossListDragRowObj = {
  row: null
}

export function getCrossListDragRowInfo ($xeList: VxeListConstructor & VxeListPrivateMethods) {
  const crossListDragRowInfo = ($xeList as any).crossListDragRowInfo as CrossListDragRowObj
  return crossListDragRowInfo
}
