import XEUtils from 'xe-utils'
import { renderer } from '../../ui/src/renderer'

import { VxeFormPropTypes, VxeFormDesignDefines, VxeFormProps } from '../../../types'

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  let max = 10000
  XEUtils.eachTree(widgetObjList, item => {
    max = Math.max(max, item.id)
  }, { children: 'children' })
  return max + 1
}

export const getWidgetFormData = (formItems: any) => {
  const data: any = {}
  XEUtils.eachTree(formItems, item => {
    const { field } = item
    if (field) {
      data[field] = null
    }
  }, { children: 'children' })
  return data
}

export const createWidgetItem = (name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) => {
  const compConf = renderer.get(name) || {}
  let widgetFormConfig: VxeFormProps = {}
  let widgetFormItems: VxeFormPropTypes.Items[] = []
  let widgetFormData: VxeFormPropTypes.Data = {}
  const widgetId = getNewWidgetId(widgetObjList)
  if (compConf) {
    const createWidgetFormConfig = compConf.createFormDesignWidgetFormConfig
    if (createWidgetFormConfig) {
      widgetFormConfig = createWidgetFormConfig({ name }) || {}
      widgetFormItems = widgetFormConfig.items || []
      widgetFormData = widgetFormConfig.data || getWidgetFormData(widgetFormItems)
      delete widgetFormConfig.data
      delete widgetFormConfig.items
    }
  }
  const widgetItem: VxeFormDesignDefines.WidgetObjItem = {
    id: widgetId,
    name: name,
    widgetFormConfig,
    widgetFormData,
    widgetFormItems,
    model: {
      update: false,
      value: ''
    }
  }
  return widgetItem
}

/**
 * 判断是否布局控件
 */
export const hasLayoutGroup = (name: string) => {
  const compConf = renderer.get(name) || {}
  return compConf && compConf.formDesignWidgetGroup === 'layout'
}
