import { h } from 'vue'
import { getFormDesignWidgetName } from './util'
import { renderer } from '@vxe-ui/core'

import { getWidgetRowFormData, WidgetRowEditComponent, WidgetRowViewComponent, WidgetRowFormComponent } from '../widget-row'
import { getWidgetInputFormData, createWidgetInputViewRules, WidgetInputViewComponent, WidgetInputFormComponent } from '../widget-input'
import { getWidgetTextareaFormData, WidgetTextareaViewComponent, WidgetTextareaFormComponent } from '../widget-textarea'
import { getWidgetSelectFormData, WidgetSelectViewComponent, WidgetSelectFormComponent } from '../widget-select'

import type { VxeGlobalRendererHandles } from '../../../types'

const defaultFormDesignWidgetName = (params: VxeGlobalRendererHandles.FormDesignWidgetNameParams) => {
  return getFormDesignWidgetName(params.name)
}

/**
 * 表单设计器 - 渲染器
 */
renderer.mixin({
  row: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-row-col',
    formDesignWidgetGroup: 'layout',
    renderFormDesignWidgetEdit (renderOpts, renderParams) {
      return h(WidgetRowEditComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetRowViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetFormConfig: getWidgetRowFormData,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetRowFormComponent, { renderOpts, renderParams })
    }
  },
  input: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-input',
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetInputViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetFormConfig: getWidgetInputFormData,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetInputFormComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetViewRules: createWidgetInputViewRules
  },
  textarea: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-textarea',
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetTextareaViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetFormConfig: getWidgetTextareaFormData,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetTextareaFormComponent, { renderOpts, renderParams })
    }
  },
  select: {
    formDesignWidgetName: defaultFormDesignWidgetName,
    formDesignWidgetIcon: 'vxe-icon-select',
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetSelectViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetFormConfig: getWidgetSelectFormData,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetSelectFormComponent, { renderOpts, renderParams })
    }
  }
})
