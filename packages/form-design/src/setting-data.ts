import { VxeFormDesignDefines, VxeFormProps } from '../../../types'

export const getDefaultSettingFormData = (): VxeFormProps<VxeFormDesignDefines.DefaultSettingFormObjVO> => {
  return {
    vertical: true,
    data: {
      showPC: true,
      showMobile: true
    }
  }
}
