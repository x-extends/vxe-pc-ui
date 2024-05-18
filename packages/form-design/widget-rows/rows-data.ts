import { getFormDesignWidgetName } from '../render/util'

import { VxeGlobalRendererHandles, VxeFormProps } from '../../../types'

export interface WidgetRowsFormObjVO {
  itemTitle: string
  colSize: number
  colSpan: string
}

export const getWidgetRowsFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetRowsFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name),
      colSize: 2,
      colSpan: '12,12'
    }
  }
}
