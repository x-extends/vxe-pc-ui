import { RenderFunction, SetupContext, Ref, VNode, ComputedRef, WritableComputedRef, ComponentPublicInstance, DefineComponent, UnwrapNestedRefs } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'
import { VxeFormPropTypes } from '../components/form'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormDesign: defineVxeComponent<VxeFormDesignProps, VxeFormDesignEventProps, VxeFormDesignSlots>
export type VxeFormDesignComponent = DefineComponent<VxeFormDesignProps, VxeFormDesignEmits>

export type VxeFormDesignInstance = ComponentPublicInstance<VxeFormDesignProps, VxeFormDesignConstructor>

export interface VxeFormDesignConstructor extends VxeComponentBaseOptions, VxeFormDesignMethods {
  props: VxeFormDesignProps
  context: SetupContext<VxeFormDesignEmits>
  reactData: FormDesignReactData
  internalData: FormDesignInternalData
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

  export type Config = null | VxeFormDesignDefines.FormDesignConfig
  export type Height = string | number
  export interface WidgetItem {
    customGroup?: string
    group?: VxeFormDesignDefines.WidgetGroup
    children: string[]
  }
  export type Widgets = WidgetItem[]

  export type FormData = Record<string, any>

  export type ShowPc = boolean
  export type ShowMobile = boolean
  export interface FormRender {
    name?: string
  }
}

export type VxeFormDesignProps = {
  size?: VxeFormDesignPropTypes.Size
  config?: VxeFormDesignPropTypes.Config
  height?: VxeFormDesignPropTypes.Height
  widgets?: VxeFormDesignPropTypes.Widgets
  showPc?: VxeFormDesignPropTypes.ShowPc
  showMobile?: VxeFormDesignPropTypes.ShowMobile
  formData?: VxeFormDesignPropTypes.FormData
  formRender?: VxeFormDesignPropTypes.FormRender
}

export interface FormDesignPrivateComputed {
}
export interface VxeFormDesignPrivateComputed extends FormDesignPrivateComputed { }

export interface FormDesignReactData<D = VxeFormDesignDefines.DefaultSettingFormDataObjVO> {
  formData: D,
  widgetConfigs: VxeFormDesignDefines.WidgetConfigGroup[]
  widgetObjList: VxeFormDesignDefines.WidgetObjItem[]
  dragWidget: VxeFormDesignDefines.WidgetObjItem | null
  sortWidget: VxeFormDesignDefines.WidgetObjItem | null
  activeWidget: VxeFormDesignDefines.WidgetObjItem | null
  sortSubWidget: VxeFormDesignDefines.WidgetObjItem | null
}

export interface FormDesignInternalData {
}

export interface FormDesignMethods {
  dispatchEvent(type: ValueOf<VxeFormDesignEmits>, params: any, evnt: Event): void
  createWidget (name: string): VxeFormDesignDefines.WidgetObjItem
  createEmptyWidget (): VxeFormDesignDefines.WidgetObjItem
  getConfig (): VxeFormDesignDefines.FormDesignConfig
  clearConfig (): Promise<any>
  loadConfig (config: Partial<VxeFormDesignDefines.FormDesignConfig>): Promise<any>
  getFormConfig(): VxeFormDesignPropTypes.FormData
  loadFormConfig (formData: VxeFormDesignPropTypes.FormData): Promise<any>
  getFormData(): Record<string, any>
  getWidgetData (): VxeFormDesignDefines.WidgetObjItem[]
  loadWidgetData (widgetData: VxeFormDesignDefines.WidgetObjItem[]): Promise<any>
  refreshPreviewView(): Promise<any>
  openStyleSetting(): Promise<any>
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

export interface VxeFormDesignLayoutStyle {
  reactData: UnwrapNestedRefs<{
    activeTab: number
  }>
  renderVN: RenderFunction
}

export namespace VxeFormDesignDefines {

  export interface FormDesignDefaultParams {
    $formDesign: VxeFormDesignConstructor
  }

  export type WidgetGroup = null | '' | 'base' | 'layout' | 'advanced'

  export interface FormDesignEventParams extends FormDesignDefaultParams, VxeComponentEventParams {
  }

  export interface FormDesignConfig {
    formConfig: VxeFormDesignPropTypes.FormData
    widgetData: WidgetObjItem[]
  }

  export interface WidgetConfigGroup {
    title?: string
    group?: VxeFormDesignDefines.WidgetGroup
    children: VxeFormDesignDefines.WidgetObjItem[]
  }

  export interface WidgetObjItem<D = any> {
    id: number
    field: string
    title: string
    name: string
    required: boolean
    options: D
    model: {
      update: boolean
      value: any
    }
    children: WidgetObjItem[]
  }

  export interface DefaultSettingFormDataObjVO {
    title: string
    pcVisible: boolean
    pcVertical: VxeFormPropTypes.Vertical
    pcTitleBold: VxeFormPropTypes.TitleBold
    pcTitleColon: boolean
    pcTitleAlign: VxeFormPropTypes.TitleAlign
    pcTitleWidth: VxeFormPropTypes.TitleWidth
    pcTitleWidthUnit: null | '' | 'px' | '%'
    mobileVisible: boolean
    mobileVertical: VxeFormPropTypes.Vertical
    mobileTitleBold: VxeFormPropTypes.TitleBold
    mobileTitleColon: boolean
    mobileTitleAlign: VxeFormPropTypes.TitleAlign
    mobileTitleWidth: VxeFormPropTypes.TitleWidth
    mobileTitleWidthUnit: null | '' | 'px' | '%'
  }

  export interface ClickWidgetParams<D = any> {
    widget: VxeFormDesignDefines.WidgetObjItem<D>
  }
  export interface ClickWidgetEventParams<D = any> extends FormDesignEventParams, ClickWidgetParams<D> { }

  export interface AddWidgetEventParams<D = any> extends FormDesignEventParams {
    newWidget: VxeFormDesignDefines.WidgetObjItem<D>
  }
  export interface CopyWidgetEventParams<D = any> extends FormDesignEventParams {
    widget: VxeFormDesignDefines.WidgetObjItem<D>
    newWidget: VxeFormDesignDefines.WidgetObjItem<D>
  }
  export interface RemoveWidgetEventParams<D = any> extends FormDesignEventParams {
    widget: VxeFormDesignDefines.WidgetObjItem<D>
  }
}

export type VxeFormDesignEventProps = {
  onClickWidget?: VxeFormDesignEvents.ClickWidget
  onAddWidget?: VxeFormDesignEvents.AddWidget
  onCopyWidget?: VxeFormDesignEvents.CopyWidget
  onRemoveWidget?: VxeFormDesignEvents.RemoveWidget
}

export interface VxeFormDesignListeners {
  clickWidget?: VxeFormDesignEvents.ClickWidget
  addWidget?: VxeFormDesignEvents.AddWidget
  copyWidget?: VxeFormDesignEvents.CopyWidget
  removeWidget?: VxeFormDesignEvents.RemoveWidget
}

export namespace VxeFormDesignEvents {
  export type ClickWidget<D = any> = (params: VxeFormDesignDefines.ClickWidgetEventParams<D>) => void
  export type AddWidget<D = any> = (params: VxeFormDesignDefines.AddWidgetEventParams<D>) => void
  export type CopyWidget<D = any> = (params: VxeFormDesignDefines.CopyWidgetEventParams<D>) => void
  export type RemoveWidget<D = any> = (params: VxeFormDesignDefines.RemoveWidgetEventParams<D>) => void
 }

export namespace VxeFormDesignSlotTypes {}
export interface VxeFormDesignSlots {
  default: (params: VxeFlowViewSlotTypes.DefaultSlotParams) => any
  header: (params: VxeFlowViewSlotTypes.DefaultSlotParams) => any
}

export interface FormDesignExport {
  useWidgetView<T = any>(props: {
    renderOpts: any
    renderParams: any
  }): {
    currWidget: ComputedRef<VxeFormDesignDefines.WidgetObjItem<T>>,
    widgetModel: WritableComputedRef<any>
  }
  useWidgetName(props: {
    renderOpts: any
    renderParams: any
  }): {
    computeKebabCaseName: ComputedRef<string>
  }
  useWidgetPropDataSource(props: {
    renderOpts: any
    renderParams: any
  }, isSubOption?: boolean): {
    renderDataSourceFormItem(): VNode
  }
}

export const FormDesign: typeof VxeFormDesign
export default VxeFormDesign
