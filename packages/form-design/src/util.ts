import XEUtils from 'xe-utils'
import { renderer } from '@vxe-ui/core'

import { VxeFormDesignDefines } from '../../../types'

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  let max = 10000
  XEUtils.eachTree(widgetObjList, item => {
    if (item) {
      max = Math.max(max, item.id)
    }
  }, { children: 'children' })
  return max + 1
}

/**
 * 判断是否布局控件
 */
export const hasFormDesignLayoutType = (name: string) => {
  const compConf = renderer.get(name) || {}
  return compConf && compConf.formDesignWidgetGroup === 'layout'
}
