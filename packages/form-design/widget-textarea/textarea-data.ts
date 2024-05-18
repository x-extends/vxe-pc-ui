import { getFormDesignWidgetName } from '../render/util'

import { VxeGlobalRendererHandles, VxeFormProps } from '../../../types'

export interface WidgetTextareaFormObjVO {
  itemTitle: string
  placeholder: string
}

export const getWidgetTextareaFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetTextareaFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name),
      placeholder: '请输入'
    }
  }
}
