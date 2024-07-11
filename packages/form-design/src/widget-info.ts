import { ref } from 'vue'
import { renderer } from '@vxe-ui/core'
import { getNewWidgetId } from './util'
import XEUtils from 'xe-utils'

import type { VxeFormPropTypes, VxeFormDesignConstructor, VxeFormDesignDefines } from '../../../types'

// 控件原始配置信息，带响应
interface WidgetReactConfigItem {
  title: undefined | string | number |((params: {
    name: string
    $formDesign: VxeFormDesignConstructor | null
  }) => string)
  icon: string | null | undefined
  group: string | null | undefined
  customGroup: undefined | string | number |((params: {
    name: string
    $formDesign: VxeFormDesignConstructor | null
  }) => string)
}

// 控件原始配置信息，带响应
export const refWidgetReactConfigMaps = ref<Record<string, WidgetReactConfigItem>>({})

export function getWidgetConfigTitle (name: string, $xeFormDesign: VxeFormDesignConstructor | null) {
  const widgetReactConfigMaps = refWidgetReactConfigMaps.value
  const configMaps = widgetReactConfigMaps[name]
  if (configMaps) {
    const configTitle = configMaps.title
    const params = { name, $formDesign: $xeFormDesign }
    return XEUtils.toValueString(XEUtils.isFunction(configTitle) ? configTitle(params) : configTitle)
  }
  return name
}

export function getWidgetConfigIcon (name: string) {
  const widgetReactConfigMaps = refWidgetReactConfigMaps.value
  const configMaps = widgetReactConfigMaps[name]
  return configMaps ? configMaps.icon : ''
}

export function getWidgetConfigGroup (name: string) {
  const widgetReactConfigMaps = refWidgetReactConfigMaps.value
  const configMaps = widgetReactConfigMaps[name]
  return configMaps ? configMaps.group : ''
}

export function getWidgetConfigCustomGroup (name: string, $xeFormDesign: VxeFormDesignConstructor | null) {
  const widgetReactConfigMaps = refWidgetReactConfigMaps.value
  const configMaps = widgetReactConfigMaps[name]
  if (configMaps) {
    const configCustomGroup = configMaps.customGroup
    const params = { name, $formDesign: $xeFormDesign }
    return XEUtils.toValueString(XEUtils.isFunction(configCustomGroup) ? configCustomGroup(params) : configCustomGroup)
  }
  return name
}

export class FormDesignWidgetInfo {
  id = 0
  field = ''
  title = ''
  name = ''
  required = false
  options: VxeFormPropTypes.Data = {}
  // eslint-disable-next-line no-use-before-define
  children: FormDesignWidgetInfo[] = []
  model = {
    update: false,
    value: ''
  }

  constructor ($xeFormDesign: VxeFormDesignConstructor | null, name: string, widgetObjList: VxeFormDesignDefines.WidgetObjItem<any>[]) {
    if (name) {
      const compConf = renderer.get(name) || {}
      if (compConf) {
        const widgetReactConfigMaps = refWidgetReactConfigMaps.value
        const createWidgetFormConfig = compConf.createFormDesignWidgetConfig
        if (createWidgetFormConfig) {
          const params = { name, $formDesign: $xeFormDesign }
          const widgetConfig = createWidgetFormConfig(params) || {}
          const titleConf = widgetConfig.title
          this.title = XEUtils.toValueString(XEUtils.isFunction(titleConf) ? titleConf(params) : titleConf)
          this.options = widgetConfig.options || {}
          this.children = widgetConfig.children || []
          if (!widgetReactConfigMaps[name]) {
            widgetReactConfigMaps[name] = {
              title: titleConf,
              icon: widgetConfig.icon,
              group: widgetConfig.group,
              customGroup: widgetConfig.customGroup
            }
            refWidgetReactConfigMaps.value = Object.assign({}, widgetReactConfigMaps)
          }
        }
      }
    }
    const widgetId = getNewWidgetId(widgetObjList)
    this.id = widgetId
    this.field = `${name}${widgetId}`
    this.name = name
  }
}

export function configToWidget (conf: {
  name: string
  id: number
  field: string
  title: string
  required: boolean
  options?: any
  children?: VxeFormDesignDefines.WidgetObjItem[]
}) {
  const widget = new FormDesignWidgetInfo(null, conf.name, [])
  widget.id = conf.id
  widget.title = conf.title
  widget.field = conf.field
  widget.required = conf.required
  widget.options = Object.assign({}, widget.options, conf.options)
  widget.children = conf.children ? conf.children.map(item => configToWidget(item)) : []
  return widget
}
