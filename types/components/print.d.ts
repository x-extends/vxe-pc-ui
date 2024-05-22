import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePrint: defineVxeComponent<VxePrintProps, VxePrintEventProps>
export type VxePrintComponent = DefineComponent<VxePrintProps, VxePrintEmits>

export type VxePrintInstance = ComponentPublicInstance<VxePrintProps, VxePrintConstructor>

export interface VxePrintConstructor extends VxeComponentBaseOptions, VxePrintMethods {
  props: VxePrintProps
  context: SetupContext<VxePrintEmits>
  reactData: PrintReactData
  getRefMaps(): PrintPrivateRef
  getComputeMaps(): PrintPrivateComputed
  renderVN: RenderFunction
}

export interface PrintPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePrintPrivateRef extends PrintPrivateRef { }

export namespace VxePrintPropTypes {
  export type Title = string
  export type Content = string
  export type CustomStyle = string
  export type beforeMethod = (params: {
    content: string
    options: VxePrintProps
  }) => string
}

export type VxePrintProps = {
  title?: VxePrintPropTypes.Title
  content?: VxePrintPropTypes.Content
  customStyle?: VxePrintPropTypes.CustomStyle
  beforeMethod?: VxePrintPropTypes.beforeMethod
}

export interface PrintPrivateComputed {
}
export interface VxePrintPrivateComputed extends PrintPrivateComputed { }

export interface PrintReactData {
}

export interface PrintMethods {
  dispatchEvent(type: ValueOf<VxePrintEmits>, params: Record<string, any>, evnt: Event | null): void
  print(): Promise<any>
}
export interface VxePrintMethods extends PrintMethods { }

export interface PrintPrivateMethods { }
export interface VxePrintPrivateMethods extends PrintPrivateMethods { }

export type VxePrintEmits = []

export namespace VxePrintDefines {
  export interface PrintEventParams extends VxeComponentEventParams {
    $print: VxePrintConstructor
  }

  export type PrintFunction = (options?: VxePrintProps) => Promise<any>
}

export type VxePrintEventProps = {}

export interface VxePrintListeners { }

export namespace VxePrintEvents { }

export namespace VxePrintSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxePrintSlots {
  default: (params: VxePrintSlotTypes.DefaultSlotParams) => any
}

export const Print: typeof VxePrint
export default VxePrint
