import { computed } from 'vue'
import XEUtils from 'xe-utils'

import { VxeFormDesignDefines } from '../../../types'

export function useKebabCaseName (props: { widget: VxeFormDesignDefines.WidgetObjItem }) {
  const computeKebabCaseName = computed(() => {
    const { widget } = props
    return widget ? XEUtils.kebabCase(widget.name) : ''
  })
  return computeKebabCaseName
}
