import { getFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetTextareaFormObjVO {
  placeholder: string
}

export const getWidgetTextareaConfig = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetConfigParams): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetTextareaFormObjVO> => {
  return {
    title: getFormDesignWidgetName(params.name),
    icon: 'vxe-icon-textarea',
    options: {
      placeholder: '请输入'
    }
  }
}
