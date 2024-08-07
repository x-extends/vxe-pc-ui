import { RenderFunction, SetupContext, Ref, DefineComponent, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCol: defineVxeComponent<VxeColProps, VxeColEventProps, VxeColSlots>
export type VxeColComponent = DefineComponent<VxeColProps, VxeColEmits>

export type VxeColInstance = ComponentPublicInstance<VxeColProps, VxeColConstructor>

export interface VxeColConstructor extends VxeComponentBaseOptions, VxeColMethods {
  props: VxeColProps
  context: SetupContext<VxeColEmits>
  reactData: ColReactData
  getRefMaps(): ColPrivateRef
  getComputeMaps(): ColPrivateComputed
  renderVN: RenderFunction
}

export interface ColPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeColPrivateRef extends ColPrivateRef { }

export namespace VxeColPropTypes {
}

export type VxeColProps = {}

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
  default: (params: VxeColSlotTypes.DefaultSlotParams) => any
}

export const Col: typeof VxeCol
export default VxeCol
