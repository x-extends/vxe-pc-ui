import type { VxeFormProps, VxeFormDefines, VxeGlobalRendererHandles } from '../../../types'

export interface WidgetInputFormObjVO {
  placeholder: string
}

export const getWidgetInputFormData = (): VxeFormProps<WidgetInputFormObjVO> => {
  return {
    data: {
      placeholder: '请输入'
    }
  }
}

export const createWidgetInputViewRules = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetViewRulesParams<WidgetInputFormObjVO>) => {
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
