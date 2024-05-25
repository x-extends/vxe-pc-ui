import { getFormDesignWidgetName } from '../render/util'

import type { VxeFormDefines, VxeGlobalRendererHandles } from '../../../types'

export interface WidgetInputFormObjVO {
  placeholder: string
}

export const getWidgetInputConfig = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetConfigParams): VxeGlobalRendererHandles.CreateFormDesignWidgetConfigObj<WidgetInputFormObjVO> => {
  return {
    title: getFormDesignWidgetName(params.name),
    icon: 'vxe-icon-input',
    options: {
      placeholder: '请输入'
    }
  }
}

export const createWidgetInputViewRules = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetRulesParams<WidgetInputFormObjVO>) => {
  const { widget } = params
  const rules: VxeFormDefines.FormRule[] = []
  if (widget.required) {
    rules.push({
      required: true,
      content: '必填 ！'
    })
  }
  return rules
}
