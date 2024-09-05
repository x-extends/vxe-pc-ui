import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCollapsePane: DefineVxeComponentApp<VxeCollapsePaneProps, VxeCollapsePaneEventProps, VxeCollapsePaneSlots>
export type VxeCollapsePaneComponent = DefineVxeComponentOptions<VxeCollapsePaneProps, VxeCollapsePaneEventProps>

export type VxeCollapsePaneInstance = DefineVxeComponentInstance<VxeCollapsePaneProps, VxeCollapsePaneConstructor>

export interface VxeCollapsePaneConstructor extends VxeComponentBaseOptions, VxeCollapsePaneMethods {
  reactData: CollapsePaneReactData
}

export interface CollapsePanePrivateRef {
}
export interface VxeCollapsePanePrivateRef extends CollapsePanePrivateRef { }

export namespace VxeCollapsePanePropTypes {
}

export type VxeCollapsePaneProps = {
}

export interface CollapsePanePrivateComputed {
}
export interface VxeCollapsePanePrivateComputed extends CollapsePanePrivateComputed { }

export interface CollapsePaneReactData {
}

export interface CollapsePaneMethods {
}
export interface VxeCollapsePaneMethods extends CollapsePaneMethods { }

export interface CollapsePanePrivateMethods { }
export interface VxeCollapsePanePrivateMethods extends CollapsePanePrivateMethods { }

export type VxeCollapsePaneEmits = []

export namespace VxeCollapsePaneDefines {
  export interface CollapsePaneEventParams extends VxeComponentEventParams {
    $collapsePane: VxeCollapsePaneConstructor
  }
}

export type VxeCollapsePaneEventProps = {}

export interface VxeCollapsePaneListeners { }

export namespace VxeCollapsePaneEvents { }

export namespace VxeCollapsePaneSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCollapsePaneSlots {
  default?: (params: VxeCollapsePaneSlotTypes.DefaultSlotParams) => any
}

export const CollapsePane: typeof VxeCollapsePane
export default VxeCollapsePane
