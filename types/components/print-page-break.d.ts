import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePrintPageBreak: DefineVxeComponentApp<VxePrintPageBreakProps, VxePrintPageBreakEventProps, VxePrintPageBreakSlots, VxePrintPageBreakMethods>
export type VxePrintPageBreakComponent = DefineVxeComponentOptions<VxePrintPageBreakProps>

export type VxePrintPageBreakInstance = DefineVxeComponentInstance<{
  reactData: PrintPageBreakReactData
}, VxePrintPageBreakProps, VxePrintPageBreakPrivateComputed, VxePrintPageBreakMethods>

export type VxePrintPageBreakConstructor = VxePrintPageBreakInstance

export interface PrintPageBreakPrivateRef {
}
export interface VxePrintPageBreakPrivateRef extends PrintPageBreakPrivateRef { }

export namespace VxePrintPageBreakPropTypes {
}

export interface VxePrintPageBreakProps {
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
