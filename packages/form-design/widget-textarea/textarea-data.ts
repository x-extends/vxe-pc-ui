import { handleGetFormDesignWidgetName } from '../render/util'

export interface WidgetTextareaFormObjVO {
  placeholder: string
}

export const getWidgetTextareaConfig = () => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-textarea',
    options: {
      placeholder: ''
    }
  }
}
