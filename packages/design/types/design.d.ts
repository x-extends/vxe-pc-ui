import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, VxeComponentSize, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define */

declare const VxeDesign: defineVxeComponent<VxeDesignProps, VxeDesignEventProps>

export interface VxeDesignConstructor extends VxeComponentBase, VxeDesignMethods {
  props: VxeDesignProps
  context: SetupContext<VxeDesignEmits>
  reactData: DesignReactData
  getRefMaps(): DesignPrivateRef
  renderVN: RenderFunction
}

export interface DesignPrivateRef {
  refElem: Ref<HTMLDivElement>
}
export interface VxeDesignPrivateRef extends DesignPrivateRef { }

export namespace VxeDesignPropTypes {
  export type Size = VxeComponentSize
}

export type VxeDesignProps = {
  size?: VxeDesignPropTypes.Size
}

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
    $Design: VxeDesignConstructor
  }
}

export type VxeDesignEventProps = {
  // [key: string]: any
}

export interface VxeDesignListeners { }

export namespace VxeDesignEvents { }

export interface VxeDesignSlots {
}

export default VxeDesign
