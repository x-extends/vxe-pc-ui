import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetInputFormObjVO {
  placeholder: string
}

export const getWidgetInputConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetInputFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-input',
    query: true,
    options: {
      placeholder: ''
    }
  }
}
