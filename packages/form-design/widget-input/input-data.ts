import { VxeFormProps } from '../../../types'

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
