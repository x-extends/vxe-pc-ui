import { computed, inject, provide, ComputedRef } from 'vue'

import { VxeComponentSize } from '../../types'

export function useSize (props: { size?: VxeComponentSize }) {
  // 组件尺寸上下文
  const xesize = inject('xesize', null as ComputedRef<VxeComponentSize> | null)
  const computeSize = computed(() => {
    return props.size || (xesize ? xesize.value : null)
  })
  provide('xesize', computeSize)

  return computeSize
}
