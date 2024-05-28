import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetVxeTextareaFormObjVO {
  placeholder: string
}

export const getWidgetVxeTextareaConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeTextareaFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-textarea',
    options: {
      placeholder: ''
    }
  }
}
