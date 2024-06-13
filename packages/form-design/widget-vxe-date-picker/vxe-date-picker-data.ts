import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetVxeDatePickerFormObjVO {
  placeholder: string
}

export const getWidgetVxeDatePickerConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeDatePickerFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-calendar',
    options: {
      placeholder: ''
    }
  }
}
