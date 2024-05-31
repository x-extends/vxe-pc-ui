import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles, VxeUploadPropTypes } from '../../../types'

export interface WidgetVxeUploadImageFormObjVO {
  limitCount: VxeUploadPropTypes.LimitCount
  limitSize: VxeUploadPropTypes.LimitSize
  multiple: VxeUploadPropTypes.Multiple
}

export const getWidgetVxeUploadImageConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeUploadImageFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-file-image',
    options: {
      limitCount: 9,
      limitSize: 10,
      multiple: false
    }
  }
}
