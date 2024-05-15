import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutBody: defineVxeComponent<VxeLayoutBodyProps, VxeLayoutBodyEventProps>

export type VxeLayoutBodyInstance = ComponentPublicInstance<VxeLayoutBodyProps, VxeLayoutBodyConstructor>

export interface VxeLayoutBodyConstructor extends VxeComponentBase, VxeLayoutBodyMethods {
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
}
export interface VxeLayoutBodyMethods extends LayoutBodyMethods { }

export interface LayoutBodyPrivateMethods { }
export interface VxeLayoutBodyPrivateMethods extends LayoutBodyPrivateMethods { }

export type VxeLayoutBodyEmits = []

export namespace VxeLayoutBodyDefines {
  export interface LayoutBodyEventParams extends VxeComponentEvent {
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
