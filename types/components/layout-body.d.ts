import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutBody: defineVxeComponent<VxeLayoutBodyProps, VxeLayoutBodyEventProps, VxeLayoutBodySlots>
export type VxeLayoutBodyComponent = DefineComponent<VxeLayoutBodyProps, VxeLayoutBodyEmits>

export type VxeLayoutBodyInstance = ComponentPublicInstance<VxeLayoutBodyProps, VxeLayoutBodyConstructor>

export interface VxeLayoutBodyConstructor extends VxeComponentBaseOptions, VxeLayoutBodyMethods {
  props: VxeLayoutBodyProps
  context: SetupContext<VxeLayoutBodyEmits>
  reactData: LayoutBodyReactData
  getRefMaps(): LayoutBodyPrivateRef
  getComputeMaps(): LayoutBodyPrivateComputed
  renderVN: RenderFunction
}

export interface LayoutBodyPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutBodyPrivateRef extends LayoutBodyPrivateRef { }

export namespace VxeLayoutBodyPropTypes {
  export type Padding = boolean
}

export type VxeLayoutBodyProps = {
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
