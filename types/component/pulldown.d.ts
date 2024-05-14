import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePulldown: defineVxeComponent<VxePulldownProps, VxePulldownEventProps>

export type VxePulldownInstance = ComponentPublicInstance<VxePulldownProps, VxePulldownConstructor>

export interface VxePulldownConstructor extends VxeComponentBase, VxePulldownMethods {
  props: VxePulldownProps
  context: SetupContext<VxePulldownEmits>
  reactData: PulldownReactData
  getRefMaps(): PulldownPrivateRef
  getComputeMaps(): PulldownPrivateComputed
  renderVN: RenderFunction
}

export interface PulldownPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePulldownPrivateRef extends PulldownPrivateRef { }

export namespace VxePulldownPropTypes {
}

export type VxePulldownProps = {}

export interface PulldownPrivateComputed {
}
export interface VxePulldownPrivateComputed extends PulldownPrivateComputed { }

export interface PulldownReactData {
}

export interface PulldownMethods {
}
export interface VxePulldownMethods extends PulldownMethods { }

export interface PulldownPrivateMethods { }
export interface VxePulldownPrivateMethods extends PulldownPrivateMethods { }

export type VxePulldownEmits = []

export namespace VxePulldownDefines {
  export interface PulldownEventParams extends VxeComponentEvent {
    $pulldown: VxePulldownConstructor
  }
}

export type VxePulldownEventProps = {}

export interface VxePulldownListeners { }

export namespace VxePulldownEvents { }

export namespace VxePulldownSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxePulldownSlots {
  default: (params: VxePulldownSlotTypes.DefaultSlotParams) => any
}

export const Pulldown: typeof VxePulldown
export default VxePulldown
