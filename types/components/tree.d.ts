import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTree: defineVxeComponent<VxeTreeProps, VxeTreeEventProps>
export type VxeTreeComponent = DefineComponent<VxeTreeProps, VxeTreeEmits>

export type VxeTreeInstance = ComponentPublicInstance<VxeTreeProps, VxeTreeConstructor>

export interface VxeTreeConstructor extends VxeComponentBaseOptions, VxeTreeMethods {
  props: VxeTreeProps
  context: SetupContext<VxeTreeEmits>
  reactData: TreeReactData
  getRefMaps(): TreePrivateRef
  getComputeMaps(): TreePrivateComputed
  renderVN: RenderFunction
}

export interface TreePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTreePrivateRef extends TreePrivateRef { }

export namespace VxeTreePropTypes {
}

export type VxeTreeProps = {
}

export interface TreePrivateComputed {
}
export interface VxeTreePrivateComputed extends TreePrivateComputed { }

export interface TreeReactData {
}

export interface TreeMethods {
  dispatchEvent(type: ValueOf<VxeTreeEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTreeMethods extends TreeMethods { }

export interface TreePrivateMethods { }
export interface VxeTreePrivateMethods extends TreePrivateMethods { }

export type VxeTreeEmits = []

export namespace VxeTreeDefines {
  export interface TreeEventParams extends VxeComponentEventParams {
    $tree: VxeTreeConstructor
  }
}

export type VxeTreeEventProps = {}

export interface VxeTreeListeners { }

export namespace VxeTreeEvents { }

export namespace VxeTreeSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSlots {
  default: (params: VxeTreeSlotTypes.DefaultSlotParams) => any
}

export const Tree: typeof VxeTree
export default VxeTree
