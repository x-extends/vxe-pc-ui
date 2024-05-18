import XEUtils from 'xe-utils'
import { renderer } from '../../ui/src/renderer'
import { getNewWidgetId } from './util'

import { VxeFormPropTypes, VxeFormDesignDefines, VxeFormProps } from '../../../types'

const getWidgetFormData = (formItems: any) => {
  const data: any = {}
  XEUtils.eachTree(formItems, item => {
    const { field } = item
    if (field) {
      data[field] = null
    }
  }, { children: 'children' })
  return data
}

export class FormDesignWidgetInfo {
  id = 0
  name = ''
  widgetFormConfig: VxeFormProps = {}
  widgetFormItems: VxeFormPropTypes.Items[] = []
  widgetFormData: VxeFormPropTypes.Data = {}
  children: (FormDesignWidgetInfo | null)[] = []
  model = {
    update: false,
    value: ''
  }

  constructor (name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) {
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
    this.id = widgetId
    this.name = name
    this.widgetFormConfig = widgetFormConfig
    this.widgetFormItems = widgetFormItems
    this.widgetFormData = widgetFormData
    this.children = []
  }
}
