import { handleGetFormDesignWidgetName } from '../render/util'
import { getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { WidgetDataSourceOptionObjVO } from '../render/use-widget-form'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetVxeRadioGroupFormObjVO {
  options: WidgetDataSourceOptionObjVO[]
}

export const getWidgetVxeRadioGroupConfig = (): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetVxeRadioGroupFormObjVO> => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-radio-checked',
    options: {
      options: XEUtils.range(0, 3).map((v, i) => {
        return {
          value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [i + 1])
        }
      })
    }
  }
}
