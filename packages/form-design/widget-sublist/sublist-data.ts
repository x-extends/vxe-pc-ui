import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetSublistFormObjVO {
  showSeq: boolean
}

export const getWidgetSublistConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetSublistFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    group: 'layout',
    icon: 'vxe-icon-subtable',
    options: {
      showSeq: true
    }
  }
}
