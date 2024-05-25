import { renderer } from '@vxe-ui/core'
import { getNewWidgetId } from './util'
import XEUtils from 'xe-utils'

import type { VxeFormPropTypes, VxeFormDesignConstructor, VxeFormDesignDefines } from '../../../types'

// 控件缓存信息，不需要响应
export const widgetConfigMaps: Record<string, {
  icon: string | null | undefined
  group: string | null | undefined
  customGroup: string | null | undefined
}> = {}

export function getWidgetIcon (name: string) {
  const widgetConfig = widgetConfigMaps[name]
  return widgetConfig ? widgetConfig.icon : ''
}

export function getWidgetGroup (name: string) {
  const widgetConfig = widgetConfigMaps[name]
  return widgetConfig ? widgetConfig.group : ''
}

export function getWidgetCustomGroup (name: string) {
  const widgetConfig = widgetConfigMaps[name]
  return widgetConfig ? widgetConfig.customGroup : ''
}

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

  constructor ($xeFormDesign: VxeFormDesignConstructor | null, name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) {
    const compConf = renderer.get(name) || {}
    const widgetId = getNewWidgetId(widgetObjList)
    if (compConf) {
      const createWidgetFormConfig = compConf.createFormDesignWidgetConfig
      if (createWidgetFormConfig) {
        const widgetConfig = createWidgetFormConfig({ name, $formDesign: $xeFormDesign }) || {}
        this.title = XEUtils.toValueString(widgetConfig.title)
        this.options = widgetConfig.options || {}
        this.children = widgetConfig.children || []
        if (!widgetConfigMaps[name]) {
          widgetConfigMaps[name] = {
            icon: widgetConfig.icon,
            group: widgetConfig.group,
            customGroup: widgetConfig.customGroup
          }
        }
      }
    }
    this.id = widgetId
    this.field = `${name}${widgetId}`
    this.name = name
  }
}
