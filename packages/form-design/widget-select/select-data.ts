import { getFormDesignWidgetName } from '../render/util'

import { VxeGlobalRendererHandles, VxeFormProps } from '../../../types'

export interface WidgetSelectFormOptionSubObjVO {
  value: string,
}

export interface WidgetSelectFormOptionObjVO {
  value: string,
  options?: WidgetSelectFormOptionSubObjVO[]
}

export interface WidgetSelectFormObjVO {
  itemTitle: string
  options?: WidgetSelectFormOptionObjVO[]
}

export const getWidgetSelectFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetSelectFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name),
      options: [
        { value: '选项1' },
        { value: '选项2' },
        { value: '选项3' }
      ]
    }
  }
}
