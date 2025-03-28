import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSlotType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSplitItem: DefineVxeComponentApp<VxeSplitItemProps, VxeSplitItemEventProps, VxeSplitItemSlots>
export type VxeSplitItemComponent = DefineVxeComponentOptions<VxeSplitItemProps, VxeSplitItemEventProps>

export type VxeSplitItemInstance = DefineVxeComponentInstance<VxeSplitItemProps, VxeSplitItemConstructor>

export interface VxeSplitItemConstructor extends VxeComponentBaseOptions, VxeSplitItemMethods {
  props: VxeSplitItemProps
  context: SetupContext<VxeSplitItemEmits>
  reactData: SplitItemReactData
  getRefMaps(): SplitItemPrivateRef
  getComputeMaps(): SplitItemPrivateComputed
  renderVN: RenderFunction
}

export interface SplitItemPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSplitItemPrivateRef extends SplitItemPrivateRef { }

export namespace VxeSplitItemPropTypes {
  export type Name = string | number
  export type Width = string | number
  export type Height = string | number
  export type MinWidth = string | number
  export type MinHeight = string | number
  export type ShowAction = boolean
}

export interface VxeSplitItemProps {
  name?: VxeSplitItemPropTypes.Name
  width?: VxeSplitItemPropTypes.Width
  height?: VxeSplitItemPropTypes.Height
  minWidth?: VxeSplitItemPropTypes.MinWidth
  minHeight?: VxeSplitItemPropTypes.MinHeight
  showAction?: VxeSplitItemPropTypes.ShowAction

  slots?: {
    default?: string | ((params: VxeSplitItemSlotTypes.DefaultSlotParams) => VxeComponentSlotType | VxeComponentSlotType[])
  }
}

export interface SplitItemPrivateComputed {
}
export interface VxeSplitItemPrivateComputed extends SplitItemPrivateComputed { }

export interface SplitItemReactData {
}

export interface SplitItemInternalData {
}

export interface SplitItemMethods {
  dispatchEvent(type: ValueOf<VxeSplitItemEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeSplitItemMethods extends SplitItemMethods { }

export interface SplitItemPrivateMethods { }
export interface VxeSplitItemPrivateMethods extends SplitItemPrivateMethods { }

export type VxeSplitItemEmits = [
]

export namespace VxeSplitItemDefines {
  export interface SplitItemEventParams extends VxeComponentEventParams {
    $splitItem: VxeSplitItemConstructor
  }
}

export type VxeSplitItemEventProps = {
}

export interface VxeSplitItemListeners {
}

export namespace VxeSplitItemEvents {
}

export namespace VxeSplitItemSlotTypes {
  export interface DefaultSlotParams {
    name: VxeSplitItemPropTypes.Name
    isVisible: boolean
    isExpand: boolean
  }
}

export interface VxeSplitItemSlots {
  default?: (params: VxeSplitItemSlotTypes.DefaultSlotParams) => any
}

export const SplitItem: typeof VxeSplitItem
export default VxeSplitItem
