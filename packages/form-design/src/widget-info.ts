import { renderer } from '@vxe-ui/core'
import { getNewWidgetId } from './util'
import XEUtils from 'xe-utils'

import type { VxeFormPropTypes, VxeFormDesignDefines, VxeFormProps } from '../../../types'

export class FormDesignWidgetInfo {
  id = 0
  field = ''
  title = ''
  name = ''
  required = false
  options: VxeFormPropTypes.Data = {}
  children: (FormDesignWidgetInfo | null)[] = []
  model = {
    update: false,
    value: ''
  }

  constructor (name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) {
    const compConf = renderer.get(name) || {}
    let widgetFormConfig: VxeFormProps = {}
    let widgetFormData: VxeFormPropTypes.Data = {}
    const widgetId = getNewWidgetId(widgetObjList)
    let title = ''
    if (compConf) {
      const widgetName = compConf.formDesignWidgetName
      if (widgetName) {
        title = XEUtils.isFunction(widgetName) ? widgetName({ name }) : `${widgetName}`
      }
      const createWidgetFormConfig = compConf.createFormDesignWidgetFormConfig
      if (createWidgetFormConfig) {
        widgetFormConfig = createWidgetFormConfig({ name }) || {}
        widgetFormData = widgetFormConfig.data || {}
        delete widgetFormConfig.data
        delete widgetFormConfig.items
      }
    }
    this.id = widgetId
    this.field = `${name}${widgetId}`
    this.title = title
    this.name = name
    this.options = widgetFormData
  }
}
