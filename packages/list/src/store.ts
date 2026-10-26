import type { VxeListConstructor, VxeListPrivateMethods } from '../../../types'

// 跨表拖拽
export const crossListDragRowGlobal = {
  row: null as any
}

export function getCrossListDragRowInfo($xeList: VxeListConstructor & VxeListPrivateMethods) {
  const crossListDragRowInfo = ($xeList as any).crossListDragRowInfo as typeof crossListDragRowGlobal
  return crossListDragRowInfo
}
