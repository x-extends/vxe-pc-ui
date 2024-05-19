import { computed } from 'vue'
import XEUtils from 'xe-utils'

import { VxeGlobalRendererHandles } from '../../../types'

export function useKebabCaseName (props: { renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions }) {
  const computeKebabCaseName = computed(() => {
    const { renderOpts } = props
    return renderOpts ? XEUtils.kebabCase(renderOpts.name) : ''
  })
  return computeKebabCaseName
}
