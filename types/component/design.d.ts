import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeDesign: defineVxeComponent<VxeDesignProps, VxeDesignEventProps>

export interface VxeDesignConstructor extends VxeComponentBase, VxeDesignMethods {
  props: VxeDesignProps
  context: SetupContext<VxeDesignEmits>
  reactData: DesignReactData
  getRefMaps(): DesignPrivateRef
  getComputeMaps(): DesignPrivateComputed
  renderVN: RenderFunction
}

export interface DesignPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeDesignPrivateRef extends DesignPrivateRef { }

export namespace VxeDesignPropTypes {
  export type Size = VxeComponentSize
}

export type VxeDesignProps = {
  size?: VxeDesignPropTypes.Size
}

export interface DesignPrivateComputed {
}
export interface VxeDesignPrivateComputed extends DesignPrivateComputed { }

export interface DesignReactData {
}

export interface DesignMethods {
  dispatchEvent(type: ValueOf<VxeDesignEmits>, params: any, evnt: Event): void
}
export interface VxeDesignMethods extends DesignMethods { }

export interface DesignPrivateMethods { }
export interface VxeDesignPrivateMethods extends DesignPrivateMethods { }

export type VxeDesignEmits = [
]

export namespace VxeDesignDefines {
  export interface DesignEventParams extends VxeComponentEvent {
    $design: VxeDesignConstructor
  }
}

export type VxeDesignEventProps = {}

export interface VxeDesignListeners { }

export namespace VxeDesignEvents { }

export interface VxeDesignSlots {
}

export default VxeDesign
