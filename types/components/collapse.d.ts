import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCollapse: DefineVxeComponentApp<VxeCollapseProps, VxeCollapseEventProps, VxeCollapseSlots>
export type VxeCollapseComponent = DefineVxeComponentOptions<VxeCollapseProps>

export type VxeCollapseInstance = DefineVxeComponentInstance<{
  reactData: CollapseReactData
}, VxeCollapseProps, VxeCollapsePrivateComputed, VxeCollapseMethods>

export type VxeCollapseConstructor = VxeCollapseInstance

export interface CollapsePrivateRef {
}
export interface VxeCollapsePrivateRef extends CollapsePrivateRef { }

export namespace VxeCollapsePropTypes {
}

export interface VxeCollapseProps {
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
  default?: (params: VxeCollapseSlotTypes.DefaultSlotParams) => any
}

export const Collapse: typeof VxeCollapse
export default VxeCollapse
