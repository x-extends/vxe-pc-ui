import { handleGetFormDesignWidgetName } from '../render/util'
import { getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { WidgetDataSourceOptionObjVO } from '../src/use'

import type { VxeGlobalRendererHandles, VxeTreeSelectPropTypes } from '../../../types'

export interface WidgetVxeTreeSelectFormObjVO {
  placeholder: string
  options: WidgetDataSourceOptionObjVO[],
  multiple: VxeTreeSelectPropTypes.Multiple
}

export const getWidgetVxeTreeSelectConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeTreeSelectFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-tree-select',
    options: {
      placeholder: '',
      options: XEUtils.range(0, 3).map((v, i) => {
        return {
          value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [i + 1])
        }
      }),
      multiple: false
    }
  }
}
