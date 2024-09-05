import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutBody: DefineVxeComponentApp<VxeLayoutBodyProps, VxeLayoutBodyEventProps, VxeLayoutBodySlots>
export type VxeLayoutBodyComponent = DefineVxeComponentOptions<VxeLayoutBodyProps, VxeLayoutBodyEventProps>

export type VxeLayoutBodyInstance = DefineVxeComponentInstance<VxeLayoutBodyProps, VxeLayoutBodyConstructor>

export interface VxeLayoutBodyConstructor extends VxeComponentBaseOptions, VxeLayoutBodyProps, VxeLayoutBodyMethods {
  reactData: LayoutBodyReactData
}

export interface LayoutBodyPrivateRef {
}
export interface VxeLayoutBodyPrivateRef extends LayoutBodyPrivateRef { }

export namespace VxeLayoutBodyPropTypes {
  export type Size = VxeComponentSizeType
  export type Loading = boolean
  export type Padding = boolean
}

export interface VxeLayoutBodyProps {
  size?: VxeLayoutBodyPropTypes.Size
  loading?: VxeLayoutBodyPropTypes.Loading
  padding?: VxeLayoutBodyPropTypes.Padding
}

export interface LayoutBodyPrivateComputed {
}
export interface VxeLayoutBodyPrivateComputed extends LayoutBodyPrivateComputed { }

export interface LayoutBodyReactData {
}

export interface LayoutBodyMethods {
  dispatchEvent(type: ValueOf<VxeLayoutBodyEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutBodyMethods extends LayoutBodyMethods { }

export interface LayoutBodyPrivateMethods { }
export interface VxeLayoutBodyPrivateMethods extends LayoutBodyPrivateMethods { }

export type VxeLayoutBodyEmits = []

export namespace VxeLayoutBodyDefines {
  export interface LayoutBodyEventParams extends VxeComponentEventParams {
    $layoutBody: VxeLayoutBodyConstructor
  }
}

export type VxeLayoutBodyEventProps = {}

export interface VxeLayoutBodyListeners { }

export namespace VxeLayoutBodyEvents { }

export namespace VxeLayoutBodySlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutBodySlots {
  default: (params: VxeLayoutBodySlotTypes.DefaultSlotParams) => any
}

export const LayoutBody: typeof VxeLayoutBody
export default VxeLayoutBody
