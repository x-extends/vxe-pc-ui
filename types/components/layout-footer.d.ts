import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentAlignType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutFooter: DefineVxeComponentApp<VxeLayoutFooterProps, VxeLayoutFooterEventProps, VxeLayoutFooterSlots>
export type VxeLayoutFooterComponent = DefineVxeComponentOptions<VxeLayoutFooterProps, VxeLayoutFooterEventProps>

export type VxeLayoutFooterInstance = DefineVxeComponentInstance<VxeLayoutFooterProps, VxeLayoutFooterConstructor>

export interface VxeLayoutFooterConstructor extends VxeComponentBaseOptions, VxeLayoutFooterProps, VxeLayoutFooterMethods {
  reactData: LayoutFooterReactData
}

export interface LayoutFooterPrivateRef {
}
export interface VxeLayoutFooterPrivateRef extends LayoutFooterPrivateRef { }

export namespace VxeLayoutFooterPropTypes {
  export type Fixed = boolean
  export type Align = VxeComponentAlignType
}

export interface VxeLayoutFooterProps {
  fixed?: VxeLayoutFooterPropTypes.Fixed
  align?: VxeLayoutFooterPropTypes.Align
}

export interface LayoutFooterPrivateComputed {
}
export interface VxeLayoutFooterPrivateComputed extends LayoutFooterPrivateComputed { }

export interface LayoutFooterReactData {
}

export interface LayoutFooterMethods {
  dispatchEvent(type: ValueOf<VxeLayoutFooterEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutFooterMethods extends LayoutFooterMethods { }

export interface LayoutFooterPrivateMethods { }
export interface VxeLayoutFooterPrivateMethods extends LayoutFooterPrivateMethods { }

export type VxeLayoutFooterEmits = []

export namespace VxeLayoutFooterDefines {
  export interface LayoutFooterEventParams extends VxeComponentEventParams {
    $layoutFooter: VxeLayoutFooterConstructor
  }
}

export type VxeLayoutFooterEventProps = {}

export interface VxeLayoutFooterListeners { }

export namespace VxeLayoutFooterEvents { }

export namespace VxeLayoutFooterSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutFooterSlots {
  default: (params: VxeLayoutFooterSlotTypes.DefaultSlotParams) => any
}

export const LayoutFooter: typeof VxeLayoutFooter
export default VxeLayoutFooter
