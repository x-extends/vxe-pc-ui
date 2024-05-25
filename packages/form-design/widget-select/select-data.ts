import { getFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetSelectFormOptionSubObjVO {
  value: string,
}

export interface WidgetSelectFormOptionObjVO {
  value: string,
  options?: WidgetSelectFormOptionSubObjVO[]
}

export interface WidgetSelectFormObjVO {
  options?: WidgetSelectFormOptionObjVO[]
}

export const getWidgetSelectConfig = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetConfigParams): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetSelectFormObjVO> => {
  return {
    title: getFormDesignWidgetName(params.name),
    icon: 'vxe-icon-select',
    options: {
      options: [
        { value: '选项1' },
        { value: '选项2' },
        { value: '选项3' }
      ]
    }
  }
}
