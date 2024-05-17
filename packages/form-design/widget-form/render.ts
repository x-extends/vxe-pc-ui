import { h } from 'vue'
import XEUtils from 'xe-utils'
import { getFormDesignWidgetName } from './util'
import WidgetLayoutRowsComponent from '../src/widget-layout-rows'
import VxeFormItemComponent from '../../form/src/form-item'
import { getOnName, getModelEvent, getChangeEvent } from '../../ui/src/vn'

// form-design widget form
import { getWidgetRowsFormData, WidgetRowsFormComponent } from './rows-form'
import { getWidgetInputFormData, WidgetInputFormComponent } from './input-form'
import { getWidgetTextareaFormData, WidgetTextareaFormComponent } from './textarea-form'
import { getWidgetSelectFormData, WidgetSelectFormComponent } from './select-form'

import { RendererOptions, VxeGlobalRendererHandles } from '../../../types'

const defaultFormDesignWidgetName = (params: VxeGlobalRendererHandles.FormDesignWidgetNameParams) => {
  return getFormDesignWidgetName(params.name)
}

/**
 * 原生事件处理
 * @param renderOpts
 * @param params
 * @param modelFunc
 * @param changeFunc
 */
function getElementOns (renderOpts: any, params: any, modelFunc?: any, changeFunc?: any) {
  const { events } = renderOpts
  const modelEvent = getModelEvent(renderOpts)
  const changeEvent = getChangeEvent(renderOpts)
  const isSameEvent = changeEvent === modelEvent
  const ons: any = {}
  if (events) {
    XEUtils.objectEach(events, (func, key: any) => {
      ons[getOnName(key)] = function (...args: any[]) {
        func(params, ...args)
      }
    })
  }
  if (modelFunc) {
    ons[getOnName(modelEvent)] = function (targetEvnt: any) {
      modelFunc(targetEvnt)
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt)
      }
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt)
      }
    }
  }
  if (!isSameEvent && changeFunc) {
    ons[getOnName(changeEvent)] = function (...args: any[]) {
      changeFunc(...args)
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args)
      }
    }
  }
  return ons
}

function getNativeAttrs (renderOpts: any) {
  let { name, attrs } = renderOpts
  if (name === 'input') {
    attrs = Object.assign({ type: 'text' }, attrs)
  }
  return attrs
}

function getNativeFormDesignOns (renderOpts: any, params: any) {
  const { item } = params
  const { model } = item
  return getElementOns(renderOpts, params, (evnt: any) => {
    const itemValue = evnt.target.value
    model.update = true
    model.value = itemValue
  })
}

/**
 * 设计器预览表单渲染-原生的标签
 * input、textarea、select
 */
function nativeFormDesignRender (renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions, params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams) {
  const { name } = renderOpts
  const { item } = params
  return h(VxeFormItemComponent, {
    title: item.widgetFormData.itemTitle,
    span: 24
  }, {
    default () {
      return h('input', {
        class: `vxe-default-${name}`,
        ...getNativeAttrs({ name, attrs: item.widgetFormData }),
        value: item.model.value,
        ...getNativeFormDesignOns(renderOpts, params)
      })
    }
  })
}

const renderMap: { [name: string]: RendererOptions } = {
  rows: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-feedback',
    formDesignWidgetGroup: 'layout',
    renderFormDesignWidgetView (renderOpts, params) {
      const { item } = params
      return h(WidgetLayoutRowsComponent, {
        colSize: item.widgetFormData.colSize,
        colSpan: item.widgetFormData.colSpan,
        widgets: item.widgetFormData.widgets
      })
    },
    createFormDesignWidgetFormConfig: getWidgetRowsFormData,
    renderFormDesignWidgetFormView (renderOpts, params) {
      const { widget } = params
      return h(WidgetRowsFormComponent, {
        widget
      })
    }
  },
  input: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-feedback',
    renderFormDesignWidgetView: nativeFormDesignRender,
    createFormDesignWidgetFormConfig: getWidgetInputFormData,
    renderFormDesignWidgetFormView (renderOpts, params) {
      const { widget } = params
      return h(WidgetInputFormComponent, {
        widget
      })
    }
  },
  textarea: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-feedback',
    renderFormDesignWidgetView: nativeFormDesignRender,
    createFormDesignWidgetFormConfig: getWidgetTextareaFormData,
    renderFormDesignWidgetFormView (renderOpts, params) {
      const { widget } = params
      return h(WidgetTextareaFormComponent, {
        widget
      })
    }
  },
  select: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-feedback',
    renderFormDesignWidgetView: nativeFormDesignRender,
    createFormDesignWidgetFormConfig: getWidgetSelectFormData,
    renderFormDesignWidgetFormView (renderOpts, params) {
      const { widget } = params
      return h(WidgetSelectFormComponent, {
        widget
      })
    }
  }
}

export default renderMap
