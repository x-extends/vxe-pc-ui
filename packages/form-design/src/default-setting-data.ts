import { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormProps } from '../../../types'

export const getDefaultSettingFormData = (defOpts?: Partial<VxeFormDesignDefines.DefaultSettingFormDataObjVO>): VxeFormDesignDefines.DefaultSettingFormDataObjVO => {
  return {
    pcVisible: defOpts ? !!defOpts.pcVisible : true,
    pcVertical: true,
    pcTitleBold: false,
    mobileVisible: defOpts ? !!defOpts.mobileVisible : true,
    mobileVertical: true,
    mobileTitleBold: false
  }
}

export const createDefaultFormViewPCFormConfig = (params: VxeGlobalRendererHandles.CreateFormViewFormConfigParams<VxeFormDesignDefines.DefaultSettingFormDataObjVO>): VxeFormProps => {
  const { formConfig } = params
  return {
    vertical: formConfig.pcVertical,
    titleBold: formConfig.pcTitleBold
  }
}

export const createDefaultFormViewMobileFormConfig = (params: VxeGlobalRendererHandles.CreateFormViewFormConfigParams<VxeFormDesignDefines.DefaultSettingFormDataObjVO>): VxeFormProps => {
  const { formConfig } = params
  return {
    vertical: formConfig.mobileVertical,
    titleBold: formConfig.mobileTitleBold
  }
}
