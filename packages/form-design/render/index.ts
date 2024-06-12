import { h } from 'vue'
import { renderer } from '@vxe-ui/core'

import { getWidgetTextConfig, WidgetTextViewComponent, WidgetTextFormComponent } from '../widget-text'
import { getWidgetRowConfig, WidgetRowEditComponent, WidgetRowViewComponent, WidgetRowFormComponent } from '../widget-row'
import { getWidgetSubtableConfig, WidgetSubtableEditComponent, WidgetSubtableViewComponent, WidgetSubtableFormComponent } from '../widget-subtable'

import { getWidgetInputConfig, WidgetInputViewComponent, WidgetInputFormComponent } from '../widget-input'
import { getWidgetTextareaConfig, WidgetTextareaViewComponent, WidgetTextareaFormComponent } from '../widget-textarea'
import { getWidgetSelectConfig, WidgetSelectViewComponent, WidgetSelectFormComponent } from '../widget-select'

import { getWidgetVxeInputConfig, WidgetVxeInputViewComponent, WidgetVxeInputFormComponent } from '../widget-vxe-input'
import { getWidgetVxeNumberInputConfig, WidgetVxeNumberInputViewComponent, WidgetVxeNumberInputFormComponent } from '../widget-vxe-number-input'
import { getWidgetVxeDateInputConfig, WidgetVxeDateInputViewComponent, WidgetVxeDateInputFormComponent } from '../widget-vxe-date-input'
import { getWidgetVxeTextareaConfig, WidgetVxeTextareaViewComponent, WidgetVxeTextareaFormComponent } from '../widget-vxe-textarea'
import { getWidgetVxeSwitchConfig, WidgetVxeSwitchViewComponent, WidgetVxeSwitchFormComponent } from '../widget-vxe-switch'
import { getWidgetVxeSelectConfig, WidgetVxeSelectViewComponent, WidgetVxeSelectFormComponent } from '../widget-vxe-select'
import { getWidgetVxeRadioGroupConfig, WidgetVxeRadioGroupViewComponent, WidgetVxeRadioGroupFormComponent } from '../widget-vxe-radio-group'
import { getWidgetVxeCheckboxGroupConfig, WidgetVxeCheckboxGroupViewComponent, WidgetVxeCheckboxGroupFormComponent } from '../widget-vxe-checkbox-group'
import { getWidgetVxeUploadFileConfig, WidgetVxeUploadFileViewComponent, WidgetVxeUploadFileFormComponent } from '../widget-vxe-upload-file'
import { getWidgetVxeUploadImageConfig, WidgetVxeUploadImageViewComponent, WidgetVxeUploadImageFormComponent } from '../widget-vxe-upload-image'

/**
 * 表单设计器 - 渲染器
 */
renderer.mixin({
  title: {
    createFormDesignWidgetConfig: getWidgetTextConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetTextViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetTextFormComponent, { renderOpts, renderParams })
    }
  },
  row: {
    createFormDesignWidgetConfig: getWidgetRowConfig,
    renderFormDesignWidgetEdit (renderOpts, renderParams) {
      return h(WidgetRowEditComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetRowViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetRowFormComponent, { renderOpts, renderParams })
    }
  },
  subtable: {
    createFormDesignWidgetConfig: getWidgetSubtableConfig,
    renderFormDesignWidgetEdit (renderOpts, renderParams) {
      return h(WidgetSubtableEditComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetSubtableViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetSubtableFormComponent, { renderOpts, renderParams })
    }
  },
  input: {
    createFormDesignWidgetConfig: getWidgetInputConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetInputViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetInputFormComponent, { renderOpts, renderParams })
    }
  },
  textarea: {
    createFormDesignWidgetConfig: getWidgetTextareaConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetTextareaViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetTextareaFormComponent, { renderOpts, renderParams })
    }
  },
  select: {
    createFormDesignWidgetConfig: getWidgetSelectConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetSelectViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetSelectFormComponent, { renderOpts, renderParams })
    }
  },
  VxeInput: {
    createFormDesignWidgetConfig: getWidgetVxeInputConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeInputViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeInputFormComponent, { renderOpts, renderParams })
    }
  },
  VxeNumberInput: {
    createFormDesignWidgetConfig: getWidgetVxeNumberInputConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeNumberInputViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeNumberInputFormComponent, { renderOpts, renderParams })
    }
  },
  VxeDateInput: {
    createFormDesignWidgetConfig: getWidgetVxeDateInputConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeDateInputViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeDateInputFormComponent, { renderOpts, renderParams })
    }
  },
  VxeTextarea: {
    createFormDesignWidgetConfig: getWidgetVxeTextareaConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeTextareaViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeTextareaFormComponent, { renderOpts, renderParams })
    }
  },
  VxeSwitch: {
    createFormDesignWidgetConfig: getWidgetVxeSwitchConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeSwitchViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeSwitchFormComponent, { renderOpts, renderParams })
    }
  },
  VxeSelect: {
    createFormDesignWidgetConfig: getWidgetVxeSelectConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeSelectViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeSelectFormComponent, { renderOpts, renderParams })
    }
  },
  VxeRadioGroup: {
    createFormDesignWidgetConfig: getWidgetVxeRadioGroupConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeRadioGroupViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeRadioGroupFormComponent, { renderOpts, renderParams })
    }
  },
  VxeCheckboxGroup: {
    createFormDesignWidgetConfig: getWidgetVxeCheckboxGroupConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeCheckboxGroupViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeCheckboxGroupFormComponent, { renderOpts, renderParams })
    }
  },
  VxeUploadFile: {
    createFormDesignWidgetConfig: getWidgetVxeUploadFileConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeUploadFileViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeUploadFileFormComponent, { renderOpts, renderParams })
    }
  },
  VxeUploadImage: {
    createFormDesignWidgetConfig: getWidgetVxeUploadImageConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeUploadImageViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeUploadImageFormComponent, { renderOpts, renderParams })
    }
  }
})
