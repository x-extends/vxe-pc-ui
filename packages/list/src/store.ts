import { reactive } from 'vue'

interface CrossListDragRowObj {
  row: any
}

// 跨列表拖拽
export const crossListDragRowInfo: CrossListDragRowObj = reactive({
  row: null
})

export function getCrossListDragRowInfo () {
  return crossListDragRowInfo
}
