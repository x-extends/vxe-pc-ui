import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCollapse: defineVxeComponent<VxeCollapseProps, VxeCollapseEventProps, VxeCollapseSlots>
export type VxeCollapseComponent = DefineComponent<VxeCollapseProps, VxeCollapseEmits>

export type VxeCollapseInstance = ComponentPublicInstance<VxeCollapseProps, VxeCollapseConstructor>

export interface VxeCollapseConstructor extends VxeComponentBaseOptions, VxeCollapseMethods {
  props: VxeCollapseProps
  context: SetupContext<VxeCollapseEmits>
  reactData: CollapseReactData
  getRefMaps(): CollapsePrivateRef
  getComputeMaps(): CollapsePrivateComputed
  renderVN: RenderFunction
}

export interface CollapsePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCollapsePrivateRef extends CollapsePrivateRef { }

export namespace VxeCollapsePropTypes {
}

export type VxeCollapseProps = {
}

export interface CollapsePrivateComputed {
}
export interface VxeCollapsePrivateComputed extends CollapsePrivateComputed { }

export interface CollapseReactData {
}

export interface CollapseMethods {
}
export interface VxeCollapseMethods extends CollapseMethods { }

export interface CollapsePrivateMethods { }
export interface VxeCollapsePrivateMethods extends CollapsePrivateMethods { }

export type VxeCollapseEmits = []

export namespace VxeCollapseDefines {
  export interface CollapseEventParams extends VxeComponentEventParams {
    $collapse: VxeCollapseConstructor
  }
}

export type VxeCollapseEventProps = {}

export interface VxeCollapseListeners { }

export namespace VxeCollapseEvents { }

export namespace VxeCollapseSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCollapseSlots {
  default: (params: VxeCollapseSlotTypes.DefaultSlotParams) => any
}

export const Collapse: typeof VxeCollapse
export default VxeCollapse
