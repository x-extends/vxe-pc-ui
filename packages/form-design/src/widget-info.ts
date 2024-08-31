import { ref } from 'vue'
import { renderer } from '@vxe-ui/core'
import { getNewWidgetId } from './util'
import { errLog } from '../../ui/src/log'
import XEUtils from 'xe-utils'

import type { VxeFormPropTypes, VxeFormDesignConstructor, VxeFormDesignDefines, VxeGlobalRendererHandles } from '../../../types'

// 控件原始配置信息，带响应
const refWidgetReactConfigMaps = ref<Record<string, VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj>>({})

export const getWidgetConfig = (name: string) => {
  const widgetReactConfigMaps = refWidgetReactConfigMaps.value
  return widgetReactConfigMaps[name] || {}
}

export function getWidgetConfigTitle (name: string, $xeFormDesign: VxeFormDesignConstructor | null) {
  const widgetConf = getWidgetConfig(name)
  if (widgetConf) {
    const configTitle = widgetConf.title
    const params = { name, $formDesign: $xeFormDesign }
    return XEUtils.toValueString(XEUtils.isFunction(configTitle) ? configTitle(params) : configTitle)
  }
  return name
}

export function getWidgetConfigCustomGroup (name: string, $xeFormDesign: VxeFormDesignConstructor | null) {
  const widgetConf = getWidgetConfig(name)
  if (widgetConf) {
    const configCustomGroup = widgetConf.customGroup
    const params = { name, $formDesign: $xeFormDesign }
    return XEUtils.toValueString(XEUtils.isFunction(configCustomGroup) ? configCustomGroup(params) : configCustomGroup)
  }
  return name
}

const validWidgetUniqueField = (field: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) => {
  return !XEUtils.findTree(widgetObjList, item => item.field === field, { children: 'children' })
}

export class FormDesignWidgetInfo {
  id = 0
  field = ''
  title = ''
  name = ''
  required = false
  hidden = false
  options: VxeFormPropTypes.Data = {}
  children: FormDesignWidgetInfo[] = []
  model = {
    update: false,
    value: ''
  }

  constructor ($xeFormDesign: VxeFormDesignConstructor | null, name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) {
    let customField = ''
    if (name) {
      const compConf = renderer.get(name) || {}
      if (compConf) {
        const widgetReactConfigMaps = refWidgetReactConfigMaps.value
        const createWidgetFormConfig = compConf.createFormDesignWidgetConfig
        if (createWidgetFormConfig) {
          const params = { name, $formDesign: $xeFormDesign }
          const widgetConfig = createWidgetFormConfig(params) || {}
          const titleConf = widgetConfig.title
          const fieldConf = widgetConfig.field
          this.title = XEUtils.toValueString(XEUtils.isFunction(titleConf) ? titleConf(params) : titleConf)
          this.options = widgetConfig.options || {}
          this.children = widgetConfig.children || []
          if (fieldConf) {
            if (XEUtils.isFunction(fieldConf)) {
              customField = fieldConf({ name, $formDesign: $xeFormDesign })
            } else {
              customField = fieldConf
            }
          }
          if (!widgetReactConfigMaps[name]) {
            widgetReactConfigMaps[name] = { ...widgetConfig }
            refWidgetReactConfigMaps.value = Object.assign({}, widgetReactConfigMaps)
          }
        }
      }
    }
    const widgetId = getNewWidgetId(widgetObjList)
    if (customField) {
      // 如果使用了自定义字段，验证字段名是否唯一
      if (!validWidgetUniqueField(customField, widgetObjList)) {
        errLog('vxe.error.uniField', [customField])
      }
    }
    this.id = widgetId
    this.field = customField || `${name}${widgetId}`
    this.name = name
  }
}

export function configToWidget (conf: {
  name: string
  id: number
  field: string
  title: string
  required: boolean
  hidden: boolean
  options?: any
  children?: VxeFormDesignDefines.WidgetObjItem[]
}) {
  const widget = new FormDesignWidgetInfo(null, conf.name, [])
  widget.id = conf.id
  widget.title = conf.title || ''
  widget.field = conf.field || ''
  widget.required = conf.required || false
  widget.hidden = conf.hidden || false
  widget.options = Object.assign({}, widget.options, conf.options)
  widget.children = conf.children ? conf.children.map(item => configToWidget(item)) : []
  return widget
}
