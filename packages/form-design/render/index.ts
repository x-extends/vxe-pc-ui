import { h } from 'vue'
import { renderer } from '@vxe-ui/core'

import { getWidgetRowConfig, WidgetRowEditComponent, WidgetRowViewComponent, WidgetRowFormComponent } from '../widget-row'
import { getWidgetInputConfig, WidgetInputViewComponent, WidgetInputFormComponent } from '../widget-input'
import { getWidgetTextareaConfig, WidgetTextareaViewComponent, WidgetTextareaFormComponent } from '../widget-textarea'
import { getWidgetSelectConfig, WidgetSelectViewComponent, WidgetSelectFormComponent } from '../widget-select'

/**
 * 表单设计器 - 渲染器
 */
renderer.mixin({
  row: {
    renderFormDesignWidgetEdit (renderOpts, renderParams) {
      return h(WidgetRowEditComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetRowViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetConfig: getWidgetRowConfig,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetRowFormComponent, { renderOpts, renderParams })
    }
  },
  input: {
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetInputViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetConfig: getWidgetInputConfig,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetInputFormComponent, { renderOpts, renderParams })
    }
  },
  textarea: {
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetTextareaViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetConfig: getWidgetTextareaConfig,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetTextareaFormComponent, { renderOpts, renderParams })
    }
  },
  select: {
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetSelectViewComponent, { renderOpts, renderParams })
    },
    createFormDesignWidgetConfig: getWidgetSelectConfig,
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetSelectFormComponent, { renderOpts, renderParams })
    }
  }
})
