import { reactive } from 'vue'

// 跨列表拖拽
export const crossListDragRowInfo = reactive({
  row: null as any
})

export function getCrossListDragRowInfo () {
  return crossListDragRowInfo
}
