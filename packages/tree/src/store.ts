import { reactive } from 'vue'

// 跨树拖拽
export const crossTreeDragNodeInfo = reactive({
  node: null as any
})

export function getCrossTreeDragNodeInfo() {
  return crossTreeDragNodeInfo
}
