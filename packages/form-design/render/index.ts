import { h } from 'vue'
import { getFormDesignWidgetName } from './util'

import { getWidgetRowsFormData, WidgetRowsViewComponent, WidgetRowsFormComponent } from '../widget-rows'
import { getWidgetInputFormData, WidgetInputViewComponent, WidgetInputFormComponent } from '../widget-input'
import { getWidgetTextareaFormData, WidgetTextareaViewComponent, WidgetTextareaFormComponent } from '../widget-textarea'
import { getWidgetSelectFormData, WidgetSelectViewComponent, WidgetSelectFormComponent } from '../widget-select'

import { RendererOptions, VxeGlobalRendererHandles } from '../../../types'

const defaultFormDesignWidgetName = (params: VxeGlobalRendererHandles.FormDesignWidgetNameParams) => {
  return getFormDesignWidgetName(params.name)
}

/**
 * 表单设计器 - 渲染器
 */
const renderMap: Record<string, RendererOptions> = {
  rows: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-feedback',
    formDesignWidgetGroup: 'layout',
    renderFormDesignWidgetView (renderOpts, params) {
      const { widget } = params
      return h(WidgetRowsViewComponent, { widget })
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
    renderFormDesignWidgetView (renderOpts, params) {
      const { widget } = params
      return h(WidgetInputViewComponent, { widget })
    },
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
    renderFormDesignWidgetView (renderOpts, params) {
      const { widget } = params
      return h(WidgetTextareaViewComponent, { widget })
    },
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
    renderFormDesignWidgetView (renderOpts, params) {
      const { widget } = params
      return h(WidgetSelectViewComponent, { widget })
    },
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
