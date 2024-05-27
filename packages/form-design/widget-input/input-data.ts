import { handleGetFormDesignWidgetName } from '../render/util'

export interface WidgetInputFormObjVO {
  placeholder: string
}

export const getWidgetInputConfig = () => {
  return {
    title: handleGetFormDesignWidgetName,
    icon: 'vxe-icon-input',
    options: {
      placeholder: ''
    }
  }
}
