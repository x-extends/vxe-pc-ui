import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeFormProps, VxeFormPropTypes } from '../components/form'
import { VxeFormItemPropTypes } from '../components/form-item'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormDesign: defineVxeComponent<VxeFormDesignProps, VxeFormDesignEventProps>
export type VxeFormDesignComponent = DefineComponent<VxeFormDesignProps, VxeFormDesignEmits>

export type VxeFormDesignInstance = ComponentPublicInstance<VxeFormDesignProps, VxeFormDesignConstructor>

export interface VxeFormDesignConstructor extends VxeComponentBaseOptions, VxeFormDesignMethods {
  props: VxeFormDesignProps
  context: SetupContext<VxeFormDesignEmits>
  reactData: FormDesignReactData
  getRefMaps(): FormDesignPrivateRef
  getComputeMaps(): FormDesignPrivateComputed
  renderVN: RenderFunction
}

export interface FormDesignPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeFormDesignPrivateRef extends FormDesignPrivateRef { }

export namespace VxeFormDesignPropTypes {
  export type Size = VxeComponentSizeType

  export type Height = string | number
  export interface WidgetItem {
    title: string | ((params: any) => string)
    children: string[]
  }
  export type Widgets = WidgetItem[]

  export interface FormConfig {
    vertical?: VxeFormItemPropTypes.Vertical
    titleWidth?: VxeFormItemPropTypes.TitleWidth
  }
  export type FormData = Record<string, any>
  export interface FormRender {
    name: string
  }
}

export type VxeFormDesignProps = {
  size?: VxeFormDesignPropTypes.Size
  height?: VxeFormDesignPropTypes.Height
  widgets?: VxeFormDesignPropTypes.Widgets
  formConfig?: VxeFormDesignPropTypes.FormConfig
  formData?: VxeFormDesignPropTypes.FormData
  formRender?: VxeFormDesignPropTypes.FormRender
}

export interface FormDesignPrivateComputed {
}
export interface VxeFormDesignPrivateComputed extends FormDesignPrivateComputed { }

export interface FormDesignReactData<D = any> {
  formConfig: VxeFormDesignPropTypes.FormConfig,
  formData: D,
  widgetConfigs: VxeFormDesignDefines.WidgetConfigItem[]
  widgetObjList: VxeFormDesignDefines.WidgetObjItem[]
  dragWidget: VxeFormDesignDefines.WidgetObjItem | null
  sortWidget: VxeFormDesignDefines.WidgetObjItem | null
  activeWidget: VxeFormDesignDefines.WidgetObjItem | null
}

export interface FormDesignMethods {
  dispatchEvent(type: ValueOf<VxeFormDesignEmits>, params: any, evnt: Event): void
  createWidget (name: string): VxeFormDesignDefines.WidgetObjItem
  createEmptyWidget (): VxeFormDesignDefines.WidgetObjItem
  getConfig (): VxeFormDesignDefines.FormDesignConfig
  loadConfig (config: VxeFormDesignDefines.FormDesignConfig): Promise<any>
  getFormConfig(): VxeFormProps
  loadFormConfig (formData: VxeFormProps): Promise<any>
  getWidgetData (): VxeFormDesignDefines.WidgetObjItem[]
  loadWidgetData (widgetData: VxeFormDesignDefines.WidgetObjItem[]): Promise<any>
}
export interface VxeFormDesignMethods extends FormDesignMethods { }

export interface FormDesignPrivateMethods {
  handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem): void
  handleCopyWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem): void
  handleRemoveWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem): void
}
export interface VxeFormDesignPrivateMethods extends FormDesignPrivateMethods { }

export type VxeFormDesignEmits = [
  'click-widget',
  'add-widget',
  'copy-widget',
  'remove-widget'
]

export namespace VxeFormDesignDefines {
  export interface FormDesignEventParams extends VxeComponentEventParams {
    $formDesign: VxeFormDesignConstructor
  }

  export interface FormDesignConfig {
    formConfig: VxeFormProps
    formData: VxeFormDesignPropTypes.FormData
    widgetData: WidgetObjItem[]
  }

  export interface WidgetConfigItem extends VxeFormDesignPropTypes.WidgetItem {
  }

  export interface WidgetObjItem<D = any> {
    id: number
    field: string
    title: string
    name: string
    required: false
    options: D
    model: {
      update: boolean
      value: any
    }
    children: WidgetObjItem[]
  }

  export interface DefaultSettingFormDataObjVO {
    showPC: boolean
    showMobile: boolean
  }
}

export type VxeFormDesignEventProps = {}

export interface VxeFormDesignListeners { }

export namespace VxeFormDesignEvents { }

export namespace VxeFormDesignSlotTypes {}
export interface VxeFormDesignSlots {
}

export const FormDesign: typeof VxeFormDesign
export default VxeFormDesign
