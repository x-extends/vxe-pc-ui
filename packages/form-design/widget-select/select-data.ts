import { handleGetFormDesignWidgetName } from '../render/util'
import { getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'

export interface WidgetSelectFormOptionSubObjVO {
  value: string,
}

export interface WidgetSelectFormOptionObjVO {
  value: string,
  options?: WidgetSelectFormOptionSubObjVO[]
}

export interface WidgetSelectFormObjVO {
  options?: WidgetSelectFormOptionObjVO[]
}

export const getWidgetSelectConfig = () => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-select',
    options: {
      options: XEUtils.range(0, 3).map((v, i) => {
        return {
          value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [i + 1])
        }
      })
    }
  }
}
