import XEUtils from 'xe-utils'
import { VxeFormDesignDefines } from '../../../types'

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  let max = 10000
  XEUtils.eachTree(widgetObjList, item => {
    max = Math.max(max, item.id)
  }, { children: 'children' })
  return max + 1
}
