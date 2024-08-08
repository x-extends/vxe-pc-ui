import { handleGetFormDesignWidgetName } from '../render/util'
import { WidgetDefaultValueObjVO } from '../../form-design/src/use'

import type { VxeGlobalRendererHandles } from '../../../types'
export interface WidgetVxeDatePickerFormObjVO {
  placeholder: string
  defaultValue: WidgetDefaultValueObjVO
}

export const getWidgetVxeDatePickerConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeDatePickerFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-calendar',
    options: {
      placeholder: '',
      defaultValue: {
        type: '',
        value: ''
      }
    }
  }
}
