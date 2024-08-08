import { computed } from 'vue'
import XEUtils from 'xe-utils'

import type { VxeGlobalRendererHandles } from '../../../../types'

export function useWidgetName (props: { renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions }) {
  const computeKebabCaseName = computed(() => {
    const { renderOpts } = props
    return renderOpts ? XEUtils.kebabCase(renderOpts.name) : ''
  })
  return {
    computeKebabCaseName
  }
}
