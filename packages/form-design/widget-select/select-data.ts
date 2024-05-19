import { VxeFormProps } from '../../../types'

export interface WidgetSelectFormOptionSubObjVO {
  value: string,
}

export interface WidgetSelectFormOptionObjVO {
  value: string,
  options?: WidgetSelectFormOptionSubObjVO[]
}

export interface WidgetSelectFormObjVO {
  options?: WidgetSelectFormOptionObjVO[]
}

export const getWidgetSelectFormData = (): VxeFormProps<WidgetSelectFormObjVO> => {
  return {
    data: {
      options: [
        { value: '选项1' },
        { value: '选项2' },
        { value: '选项3' }
      ]
    }
  }
}
