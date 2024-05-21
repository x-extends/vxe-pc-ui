import type { VxeFormProps } from '../../../types'

export interface WidgetRowFormObjVO {
  colSize: number
  colSpan: string
}

export const getWidgetRowFormData = (): VxeFormProps<WidgetRowFormObjVO> => {
  return {
    data: {
      colSize: 2,
      colSpan: '12,12'
    }
  }
}
