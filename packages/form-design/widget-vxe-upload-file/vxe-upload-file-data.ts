import { handleGetFormDesignWidgetName } from '../render/util'

import type { VxeGlobalRendererHandles, VxeUploadPropTypes } from '../../../types'

export function getLimitSizeOptions () {
  const sizeOpts: { label: string, value: VxeUploadPropTypes.LimitSize }[] = [
    { label: '无限制', value: '' }
  ]
  const sizeList = [1, 2, 5, 10, 20, 50, 100, 200, 500]
  sizeList.forEach(num => {
    sizeOpts.push(
      { label: `${num}M`, value: num }
    )
  })
  return sizeOpts
}

export interface WidgetVxeUploadFileFormObjVO {
  limitCount: VxeUploadPropTypes.LimitCount
  limitSize: VxeUploadPropTypes.LimitSize
  multiple: VxeUploadPropTypes.Multiple
}

export const getWidgetVxeUploadFileConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeUploadFileFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-file',
    options: {
      limitCount: '',
      limitSize: 100,
      multiple: false
    }
  }
}
