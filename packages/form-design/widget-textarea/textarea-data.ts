import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetTextareaFormObjVO {
  placeholder: string
}

export const getWidgetTextareaConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetTextareaFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-textarea',
    options: {
      placeholder: ''
    }
  }
}
