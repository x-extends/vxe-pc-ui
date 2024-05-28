import { handleGetFormDesignWidgetName } from '../render/util'
import { getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { WidgetDataSourceOptionObjVO } from '../render/use-widget-form'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetVxeSelectFormObjVO {
  placeholder: string
  options: WidgetDataSourceOptionObjVO[]
}

export const getWidgetVxeSelectConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeSelectFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-select',
    options: {
      placeholder: '',
      options: XEUtils.range(0, 3).map((v, i) => {
        return {
          value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [i + 1])
        }
      })
    }
  }
}
