import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'
import { VxeFormProps } from '../components/form'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormDesign: defineVxeComponent<VxeFormDesignProps, VxeFormDesignEventProps>

export type VxeFormDesignInstance = ComponentPublicInstance<VxeFormDesignProps, VxeFormDesignConstructor>

export interface VxeFormDesignConstructor extends VxeComponentBase, VxeFormDesignMethods {
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
  export type Size = VxeComponentSize

  export type Height = string | number
  export interface WidgetItem {
    title: string | ((params: any) => string)
    children: string[]
  }
  export type Widgets = WidgetItem[]
  export interface FormRender {
    name: string
  }
}

export type VxeFormDesignProps = {
  size?: VxeFormDesignPropTypes.Size
  height?: VxeFormDesignPropTypes.Height
  widgets?: VxeFormDesignPropTypes.Widgets
  formRender?: VxeFormDesignPropTypes.FormRender
}

export interface FormDesignPrivateComputed {
}
export interface VxeFormDesignPrivateComputed extends FormDesignPrivateComputed { }

export interface FormDesignReactData {
  formConfig: VxeFormProps,
  widgetConfigs: VxeFormDesignDefines.WidgetConfigItem[]
  widgetObjList: VxeFormDesignDefines.WidgetObjItem[]
  dragWidget: VxeFormDesignDefines.WidgetObjItem | null
  sortWidget: VxeFormDesignDefines.WidgetObjItem | null
  activeWidget: VxeFormDesignDefines.WidgetObjItem | null
}

export interface FormDesignMethods {
  dispatchEvent(type: ValueOf<VxeFormDesignEmits>, params: any, evnt: Event): void
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
  export interface FormDesignEventParams extends VxeComponentEvent {
    $formDesign: VxeFormDesignConstructor
  }

  export interface WidgetConfigItem extends VxeFormDesignPropTypes.WidgetItem {
  }

  export interface WidgetObjItem {
    id: number
    name: string
    formConfig: VxeFormProps,
    model: {
      update: boolean
      value: any
    }
    children?: WidgetObjItem[]
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
