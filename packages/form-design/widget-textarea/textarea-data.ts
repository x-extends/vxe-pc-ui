import { VxeFormProps } from '../../../types'

export interface WidgetTextareaFormObjVO {
  required: false
  placeholder: string
}

export const getWidgetTextareaFormData = (): VxeFormProps<WidgetTextareaFormObjVO> => {
  return {
    data: {
      required: false,
      placeholder: '请输入'
    }
  }
}
