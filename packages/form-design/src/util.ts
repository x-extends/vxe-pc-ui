import XEUtils from 'xe-utils'
import { getWidgetGroup } from './widget-info'

import type { VxeFormDesignDefines } from '../../../types'

let maxWidgetId = 100000

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  let max = ++maxWidgetId
  XEUtils.eachTree(widgetObjList, item => {
    if (item) {
      max = Math.max(max, item.id)
    }
  }, { children: 'children' })
  return maxWidgetId
}

/**
 * 判断是否布局控件
 */
export const hasFormDesignLayoutType = (widget: VxeFormDesignDefines.WidgetObjItem) => {
  return widget && getWidgetGroup(widget.name) === 'layout'
}
