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
import { getWidgetVxeDatePickerConfig, WidgetVxeDatePickerViewComponent, WidgetVxeDatePickerFormComponent } from '../widget-vxe-date-picker'
import { getWidgetVxeTextareaConfig, WidgetVxeTextareaViewComponent, WidgetVxeTextareaFormComponent } from '../widget-vxe-textarea'
import { getWidgetVxeSwitchConfig, WidgetVxeSwitchViewComponent, WidgetVxeSwitchFormComponent } from '../widget-vxe-switch'
import { getWidgetVxeSelectConfig, WidgetVxeSelectViewComponent, WidgetVxeSelectFormComponent } from '../widget-vxe-select'
import { getWidgetVxeTreeSelectConfig, WidgetVxeTreeSelectViewComponent, WidgetVxeTreeSelectFormComponent } from '../widget-vxe-tree-select'
import { getWidgetVxeRadioGroupConfig, WidgetVxeRadioGroupViewComponent, WidgetVxeRadioGroupFormComponent } from '../widget-vxe-radio-group'
import { getWidgetVxeCheckboxGroupConfig, WidgetVxeCheckboxGroupViewComponent, WidgetVxeCheckboxGroupFormComponent } from '../widget-vxe-checkbox-group'
import { getWidgetVxeUploadFileConfig, WidgetVxeUploadFileViewComponent, WidgetVxeUploadFileFormComponent } from '../widget-vxe-upload-file'
import { getWidgetVxeUploadImageConfig, WidgetVxeUploadImageViewComponent, WidgetVxeUploadImageFormComponent } from '../widget-vxe-upload-image'
import { getWidgetVxeRateConfig, WidgetVxeRateViewComponent, WidgetVxeRateFormComponent } from '../widget-vxe-rate'
import { getWidgetVxeSliderConfig, WidgetVxeSliderViewComponent, WidgetVxeSliderFormComponent } from '../widget-vxe-slider'

/**
 * 表单设计器 - 渲染器
 */
renderer.mixin({
  text: {
    createFormDesignWidgetConfig: getWidgetTextConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetTextViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetTextFormComponent, { renderOpts, renderParams })
    }
  },
  /**
   * 已废弃
   */
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
  VxeDatePicker: {
    createFormDesignWidgetConfig: getWidgetVxeDatePickerConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeDatePickerViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeDatePickerFormComponent, { renderOpts, renderParams })
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
  VxeTreeSelect: {
    createFormDesignWidgetConfig: getWidgetVxeTreeSelectConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeTreeSelectViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeTreeSelectFormComponent, { renderOpts, renderParams })
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
  },
  VxeRate: {
    createFormDesignWidgetConfig: getWidgetVxeRateConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeRateViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeRateFormComponent, { renderOpts, renderParams })
    }
  },
  VxeSlider: {
    createFormDesignWidgetConfig: getWidgetVxeSliderConfig,
    renderFormDesignWidgetView (renderOpts, renderParams) {
      return h(WidgetVxeSliderViewComponent, { renderOpts, renderParams })
    },
    renderFormDesignWidgetFormView (renderOpts, renderParams) {
      return h(WidgetVxeSliderFormComponent, { renderOpts, renderParams })
    }
  }
})
