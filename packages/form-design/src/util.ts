import XEUtils from 'xe-utils'
import { renderer } from '../../ui/src/renderer'

import { VxeFormDesignDefines, VxeFormProps } from '../../../types'

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  let max = 10000
  XEUtils.eachTree(widgetObjList, item => {
    max = Math.max(max, item.id)
  }, { children: 'children' })
  return max + 1
}

export const createWidgetFormData = (formItems: any) => {
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
  let formConfig: VxeFormProps = {}
  const widgetId = getNewWidgetId(widgetObjList)
  if (compConf) {
    const createPropFormConfig = compConf.createFormDesignWidgetSettingPropFormConfig
    if (createPropFormConfig) {
      formConfig = createPropFormConfig({ name }) || {}
      formConfig.data = formConfig.data || createWidgetFormData(formConfig.items)
    }
  }
  const widgetItem: VxeFormDesignDefines.WidgetObjItem = {
    id: widgetId,
    name: name,
    formConfig,
    model: {
      update: false,
      value: ''
    }
  }
  return widgetItem
}
