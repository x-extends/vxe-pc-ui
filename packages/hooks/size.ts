import { computed, inject, provide, ComputedRef } from 'vue'

import type { VxeComponentSizeType } from '../../types'

export function useSize (props: { size?: VxeComponentSizeType }) {
  // 组件尺寸上下文
  const xesize = inject('xesize', null as ComputedRef<VxeComponentSizeType> | null)
  const computeSize = computed(() => {
    return props.size || (xesize ? xesize.value : null)
  })
  provide('xesize', computeSize)

  return computeSize
}
