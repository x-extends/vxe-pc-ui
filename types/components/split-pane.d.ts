import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSlotType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplitPane: DefineVxeComponentApp<VxeSplitPaneProps, VxeSplitPaneEventProps, VxeSplitPaneSlots>
export type VxeSplitPaneComponent = DefineVxeComponentOptions<VxeSplitPaneProps>

export type VxeSplitPaneInstance = DefineVxeComponentInstance<{
  reactData: SplitItemReactData
}, VxeSplitPaneProps, VxeSplitPanePrivateComputed, VxeSplitPaneMethods>

export type VxeSplitPaneConstructor = VxeSplitPaneInstance

export interface SplitItemPrivateRef {
}
export interface VxeSplitPanePrivateRef extends SplitItemPrivateRef { }

export namespace VxeSplitPanePropTypes {
  export type Name = string | number
  export type Width = string | number
  export type Height = string | number
  export type MinWidth = string | number
  export type MinHeight = string | number
  export type ShowAction = boolean
}

export interface VxeSplitPaneProps {
  name?: VxeSplitPanePropTypes.Name
  width?: VxeSplitPanePropTypes.Width
  height?: VxeSplitPanePropTypes.Height
  minWidth?: VxeSplitPanePropTypes.MinWidth
  minHeight?: VxeSplitPanePropTypes.MinHeight
  showAction?: VxeSplitPanePropTypes.ShowAction

  slots?: {
    default?: string | ((params: VxeSplitPaneSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
  }
}

export interface SplitItemPrivateComputed {
}
export interface VxeSplitPanePrivateComputed extends SplitItemPrivateComputed { }

export interface SplitItemReactData {
}

export interface SplitItemInternalData {
}

export interface SplitItemMethods {
  dispatchEvent(type: ValueOf<VxeSplitPaneEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeSplitPaneMethods extends SplitItemMethods { }

export interface SplitItemPrivateMethods { }
export interface VxeSplitPanePrivateMethods extends SplitItemPrivateMethods { }

export type VxeSplitPaneEmits = [
]

export namespace VxeSplitPaneDefines {
  export interface SplitItemEventParams extends VxeComponentEventParams {
    $splitPane: VxeSplitPaneConstructor
  }
}

export type VxeSplitPaneEventProps = {
}

export interface VxeSplitPaneListeners {
}

export namespace VxeSplitPaneEvents {
}

export namespace VxeSplitPaneSlotTypes {
  export interface DefaultSlotParams {
    name: VxeSplitPanePropTypes.Name
    isVisible: boolean
    isExpand: boolean
  }
}

export interface VxeSplitPaneSlots {
  default?: (params: VxeSplitPaneSlotTypes.DefaultSlotParams) => any
}

export const SplitItem: typeof VxeSplitPane
export default VxeSplitPane
