import { getFormDesignWidgetName } from '../render/util'

import { VxeGlobalRendererHandles, VxeFormProps } from '../../../types'

export interface WidgetInputFormObjVO {
  itemTitle: string
  placeholder: string
}

export const getWidgetInputFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetInputFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name),
      placeholder: '请输入'
    }
  }
}
