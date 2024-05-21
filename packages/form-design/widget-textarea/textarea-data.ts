import type { VxeFormProps } from '../../../types'

export interface WidgetTextareaFormObjVO {
  placeholder: string
}

export const getWidgetTextareaFormData = (): VxeFormProps<WidgetTextareaFormObjVO> => {
  return {
    data: {
      placeholder: '请输入'
    }
  }
}
