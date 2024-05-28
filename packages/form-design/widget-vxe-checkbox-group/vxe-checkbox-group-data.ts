import { handleGetFormDesignWidgetName } from '../render/util'
import { getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { WidgetDataSourceOptionObjVO } from '../render/use-widget-form'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetVxeCheckboxGroupFormObjVO {
  options: WidgetDataSourceOptionObjVO[]
}

export const getWidgetVxeCheckboxGroupConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeCheckboxGroupFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-checkbox-checked',
    options: {
      options: XEUtils.range(0, 3).map((v, i) => {
        return {
          value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [i + 1])
        }
      })
    }
  }
}
