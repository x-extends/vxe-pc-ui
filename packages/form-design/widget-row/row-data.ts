import XEUtils from 'xe-utils'
import { getFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetRowFormObjVO {
  colSize: number
  colSpan: string
}

export const getWidgetRowConfig = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetConfigParams): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetRowFormObjVO> => {
  const { $formDesign } = params
  const defaultColSize = 2
  return {
    title: getFormDesignWidgetName(params.name),
    group: 'layout',
    icon: 'vxe-icon-row-col',
    options: {
      colSize: defaultColSize,
      colSpan: '12,12'
    },
    children: $formDesign
      ? XEUtils.range(0, defaultColSize).map(() => {
        return $formDesign.createEmptyWidget()
      })
      : []
  }
}
