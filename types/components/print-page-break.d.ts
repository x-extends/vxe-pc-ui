import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePrintPageBreak: DefineVxeComponentApp<VxePrintPageBreakProps, VxePrintPageBreakEventProps, VxePrintPageBreakSlots>
export type VxePrintPageBreakComponent = DefineVxeComponentOptions<VxePrintPageBreakProps, VxePrintPageBreakEventProps>

export type VxePrintPageBreakInstance = DefineVxeComponentInstance<VxePrintPageBreakProps, VxePrintPageBreakConstructor>

export interface VxePrintPageBreakConstructor extends VxeComponentBaseOptions, VxePrintPageBreakMethods {
  reactData: PrintPageBreakReactData
}

export interface PrintPageBreakPrivateRef {
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
  default?: (params: VxePrintPageBreakSlotTypes.DefaultSlotParams) => any
}

export const PrintPageBreak: typeof VxePrintPageBreak
export default VxePrintPageBreak
