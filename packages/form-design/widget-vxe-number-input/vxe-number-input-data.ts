import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetVxeNumberInputFormObjVO {
  placeholder: string
}

export const getWidgetVxeNumberInputConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeNumberInputFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-number',
    options: {
      placeholder: ''
    }
  }
}
