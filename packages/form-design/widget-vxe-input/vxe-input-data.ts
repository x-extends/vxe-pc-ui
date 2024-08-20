import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetVxeInputFormObjVO {
  placeholder: string
}

export const getWidgetVxeInputConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeInputFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-input',
    query: true,
    options: {
      placeholder: ''
    }
  }
}
