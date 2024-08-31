import XEUtils from 'xe-utils'
import { getWidgetConfig } from './widget-info'

import type { VxeFormDesignDefines } from '../../../types'

let maxWidgetId = 100000

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  XEUtils.eachTree(widgetObjList, item => {
    if (item) {
      maxWidgetId = Math.max(maxWidgetId, item.id)
    }
  }, { children: 'children' })
  return ++maxWidgetId
}

/**
 * 判断是否布局控件
 */
export const hasFormDesignLayoutType = (widget: VxeFormDesignDefines.WidgetObjItem) => {
  if (widget) {
    const widgetConf = getWidgetConfig(widget.name)
    return widgetConf.group === 'layout'
  }
  return false
}
