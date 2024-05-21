import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeListDesign: defineVxeComponent<VxeListDesignProps, VxeListDesignEventProps>
export type VxeListDesignComponent = DefineComponent<VxeListDesignProps, VxeListDesignEmits>

export type VxeListDesignInstance = ComponentPublicInstance<VxeListDesignProps, VxeListDesignConstructor>

export interface VxeListDesignConstructor extends VxeComponentBaseOptions, VxeListDesignMethods {
  props: VxeListDesignProps
  context: SetupContext<VxeListDesignEmits>
  reactData: ListDesignReactData
  getRefMaps(): ListDesignPrivateRef
  getComputeMaps(): ListDesignPrivateComputed
  renderVN: RenderFunction
}

export interface ListDesignPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeListDesignPrivateRef extends ListDesignPrivateRef { }

export namespace VxeListDesignPropTypes {
  export type Size = VxeComponentSizeType
}

export type VxeListDesignProps = {
  size?: VxeListDesignPropTypes.Size
}

export interface ListDesignPrivateComputed {
}
export interface VxeListDesignPrivateComputed extends ListDesignPrivateComputed { }

export interface ListDesignReactData {
}

export interface ListDesignMethods {
  dispatchEvent(type: ValueOf<VxeListDesignEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeListDesignMethods extends ListDesignMethods { }

export interface ListDesignPrivateMethods { }
export interface VxeListDesignPrivateMethods extends ListDesignPrivateMethods { }

export type VxeListDesignEmits = [
]

export namespace VxeListDesignDefines {
  export interface ListDesignEventParams extends VxeComponentEventParams {
    $listDesign: VxeListDesignConstructor
  }
}

export type VxeListDesignEventProps = {}

export interface VxeListDesignListeners { }

export namespace VxeListDesignEvents { }

export namespace VxeListDesignSlotTypes {}
export interface VxeListDesignSlots {
}

export const ListDesign: typeof VxeListDesign
export default VxeListDesign
