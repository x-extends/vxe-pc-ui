import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeFormDesignDefines, VxeFormDesignPropTypes } from './form-design'
import { VxeFormProps, VxeFormPropTypes } from './form'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormView: defineVxeComponent<VxeFormViewProps, VxeFormViewEventProps>
export type VxeFormViewComponent = DefineComponent<VxeFormViewProps, VxeFormViewEmits>

export type VxeFormViewInstance = ComponentPublicInstance<VxeFormViewProps, VxeFormViewConstructor>

export interface VxeFormViewConstructor extends VxeComponentBaseOptions, VxeFormViewMethods {
  props: VxeFormViewProps
  context: SetupContext<VxeFormViewEmits>
  reactData: FormViewReactData
  getRefMaps(): FormViewPrivateRef
  getComputeMaps(): FormViewPrivateComputed
  renderVN: RenderFunction
}

export interface FormViewPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeFormViewPrivateRef extends FormViewPrivateRef { }

export namespace VxeFormViewPropTypes {
  export type ModelValue = VxeFormPropTypes.Data
  export type Config = null | VxeFormDesignDefines.FormDesignConfig
  export type ViewRender = {
    name?: string
  }
  export type CreateFormConfig = (params: VxeFormViewDefines.CreateFormConfigParams) => VxeFormProps
}

export type VxeFormViewProps = {
  modelValue?: VxeFormViewPropTypes.ModelValue
  config?: VxeFormViewPropTypes.Config
  viewRender?: VxeFormViewPropTypes.ViewRender
  createFormConfig?: VxeFormViewPropTypes.CreateFormConfig
}

export interface FormViewPrivateComputed {
}
export interface VxeFormViewPrivateComputed extends FormViewPrivateComputed { }

export interface FormViewReactData {
  formConfig: VxeFormProps<VxeFormDesignPropTypes.FormData>,
  formRules: VxeFormPropTypes.Rules
  widgetObjList: VxeFormDesignDefines.WidgetObjItem[]
}

export interface FormViewMethods {
  dispatchEvent(type: ValueOf<VxeFormViewEmits>, params: any, evnt: Event): void
  loadConfig (config: VxeFormDesignDefines.FormDesignConfig): Promise<any>
  loadFormConfig (formData: VxeFormProps): Promise<any>
  loadWidgetData (widgetData: VxeFormDesignDefines.WidgetObjItem[]): Promise<any>
  updateItemStatus(widget: VxeFormDesignDefines.WidgetObjItem, value: any): Promise<any>
  setItemValue(widget: VxeFormDesignDefines.WidgetObjItem, value: any): Promise<any>
  getItemValue(widget: VxeFormDesignDefines.WidgetObjItem): any
}
export interface VxeFormViewMethods extends FormViewMethods { }

export interface FormViewPrivateMethods { }
export interface VxeFormViewPrivateMethods extends FormViewPrivateMethods { }

export type VxeFormViewEmits = [
  'update:modelValue'
]

export namespace VxeFormViewDefines {
  export interface FormViewEventParams extends VxeComponentEventParams {
    $formView: VxeFormViewConstructor
  }

  export interface CreateFormConfigParams<D = any> {
    viewRender: undefined | VxeFormViewPropTypes.ViewRender
    formConfig: D
  }
}

export type VxeFormViewEventProps = {}

export interface VxeFormViewListeners { }

export namespace VxeFormViewEvents { }

export namespace VxeFormViewSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeFormViewSlots {
  default: (params: VxeFormViewSlotTypes.DefaultSlotParams) => any
}

export const FormView: typeof VxeFormView
export default VxeFormView
