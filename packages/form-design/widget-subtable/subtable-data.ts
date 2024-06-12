import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetSubtableFormObjVO {
  showSeq: boolean
}

export const getWidgetSubtableConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetSubtableFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    group: 'layout',
    icon: 'vxe-icon-subtable',
    options: {
      showSeq: true
    }
  }
}
