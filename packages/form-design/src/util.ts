import XEUtils from 'xe-utils'
import { PropType } from 'vue'
import { getWidgetConfigGroup } from './widget-info'

import type { VxeFormDesignDefines, VxeGlobalRendererHandles } from '../../../types'

let maxWidgetId = 100000

export function getNewWidgetId (widgetObjList: VxeFormDesignDefines.WidgetObjItem[]) {
  XEUtils.eachTree(widgetObjList, item => {
    if (item) {
      maxWidgetId = Math.max(maxWidgetId, item.id)
    }
  }, { children: 'children' })
  return ++maxWidgetId
}

/**
 * 判断是否布局控件
 */
export const hasFormDesignLayoutType = (widget: VxeFormDesignDefines.WidgetObjItem) => {
  return widget && getWidgetConfigGroup(widget.name) === 'layout'
}

export function createWidgetConfigProps <D = any> () {
  return {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<D>>,
      default: () => ({})
    }
  }
}

export function createWidgetViewProps <D = any> () {
  return {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<D>>,
      default: () => ({})
    }
  }
}
