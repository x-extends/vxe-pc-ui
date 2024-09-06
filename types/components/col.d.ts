import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCol: DefineVxeComponentApp<VxeColProps, VxeColEventProps, VxeColSlots>
export type VxeColComponent = DefineVxeComponentOptions<VxeColProps>

export type VxeColInstance = DefineVxeComponentInstance<{
  reactData: ColReactData
}, VxeColProps, ColPrivateComputed, ColMethods>

export type VxeColConstructor = VxeColInstance

export interface ColPrivateRef {
}
export interface VxeColPrivateRef extends ColPrivateRef { }

export namespace VxeColPropTypes {
  export type Size = VxeComponentSizeType
}

export interface VxeColProps {
  size?: VxeColPropTypes.Size
}

export interface ColPrivateComputed {
}
export interface VxeColPrivateComputed extends ColPrivateComputed { }

export interface ColReactData {
}

export interface ColMethods {
}
export interface VxeColMethods extends ColMethods { }

export interface ColPrivateMethods { }
export interface VxeColPrivateMethods extends ColPrivateMethods { }

export type VxeColEmits = []

export namespace VxeColDefines {
  export interface ColEventParams extends VxeComponentEventParams {
    $col: VxeColConstructor
  }
}

export type VxeColEventProps = {}

export interface VxeColListeners { }

export namespace VxeColEvents { }

export namespace VxeColSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeColSlots {
  default?: (params: VxeColSlotTypes.DefaultSlotParams) => any
}

export const Col: typeof VxeCol
export default VxeCol
