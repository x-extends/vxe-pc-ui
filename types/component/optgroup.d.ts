import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeOptgroup: defineVxeComponent<VxeOptgroupProps, VxeOptgroupEventProps>

export type VxeOptgroupInstance = ComponentPublicInstance<VxeOptgroupProps, VxeOptgroupConstructor>

export interface VxeOptgroupConstructor extends VxeComponentBase, VxeOptgroupMethods {
  props: VxeOptgroupProps
  context: SetupContext<VxeOptgroupEmits>
  reactData: OptgroupReactData
  getRefMaps(): OptgroupPrivateRef
  getComputeMaps(): OptgroupPrivateComputed
  renderVN: RenderFunction
}

export interface OptgroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeOptgroupPrivateRef extends OptgroupPrivateRef { }

export namespace VxeOptgroupPropTypes {
}

export type VxeOptgroupProps = {}

export interface OptgroupPrivateComputed {
}
export interface VxeOptgroupPrivateComputed extends OptgroupPrivateComputed { }

export interface OptgroupReactData {
}

export interface OptgroupMethods {
}
export interface VxeOptgroupMethods extends OptgroupMethods { }

export interface OptgroupPrivateMethods { }
export interface VxeOptgroupPrivateMethods extends OptgroupPrivateMethods { }

export type VxeOptgroupEmits = []

export namespace VxeOptgroupDefines {
  export interface OptgroupEventParams extends VxeComponentEvent {
    $optgroup: VxeOptgroupConstructor
  }
}

export type VxeOptgroupEventProps = {}

export interface VxeOptgroupListeners { }

export namespace VxeOptgroupEvents { }

export namespace VxeOptgroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeOptgroupSlots {
  default: (params: VxeOptgroupSlotTypes.DefaultSlotParams) => any
}

export const Optgroup: typeof VxeOptgroup
export default VxeOptgroup
