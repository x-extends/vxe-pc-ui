import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetVxeDateInputFormObjVO {
  placeholder: string
}

export const getWidgetVxeDateInputConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeDateInputFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-calendar',
    options: {
      placeholder: ''
    }
  }
}
