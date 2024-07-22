import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePrintPageBreak: defineVxeComponent<VxePrintPageBreakProps, VxePrintPageBreakEventProps, VxePrintPageBreakSlots>
export type VxePrintPageBreakComponent = DefineComponent<VxePrintPageBreakProps, VxePrintPageBreakEmits>

export type VxePrintPageBreakInstance = ComponentPublicInstance<VxePrintPageBreakProps, VxePrintPageBreakConstructor>

export interface VxePrintPageBreakConstructor extends VxeComponentBaseOptions, VxePrintPageBreakMethods {
  props: VxePrintPageBreakProps
  context: SetupContext<VxePrintPageBreakEmits>
  reactData: PrintPageBreakReactData
  getRefMaps(): PrintPageBreakPrivateRef
  getComputeMaps(): PrintPageBreakPrivateComputed
  renderVN: RenderFunction
}

export interface PrintPageBreakPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePrintPageBreakPrivateRef extends PrintPageBreakPrivateRef { }

export namespace VxePrintPageBreakPropTypes {
}

export type VxePrintPageBreakProps = {
}

export interface PrintPageBreakPrivateComputed {
}
export interface VxePrintPageBreakPrivateComputed extends PrintPageBreakPrivateComputed { }

export interface PrintPageBreakReactData {
}

export interface PrintPageBreakMethods {
  dispatchEvent(type: ValueOf<VxePrintPageBreakEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxePrintPageBreakMethods extends PrintPageBreakMethods { }

export interface PrintPageBreakPrivateMethods { }
export interface VxePrintPageBreakPrivateMethods extends PrintPageBreakPrivateMethods { }

export type VxePrintPageBreakEmits = []

export namespace VxePrintPageBreakDefines {
  export interface PrintPageBreakEventParams extends VxeComponentEventParams {
    $printPageBreak: VxePrintPageBreakConstructor
  }
}

export type VxePrintPageBreakEventProps = {}

export interface VxePrintPageBreakListeners { }

export namespace VxePrintPageBreakEvents { }

export namespace VxePrintPageBreakSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxePrintPageBreakSlots {
  default: (params: VxePrintPageBreakSlotTypes.DefaultSlotParams) => any
}

export const PrintPageBreak: typeof VxePrintPageBreak
export default VxePrintPageBreak
