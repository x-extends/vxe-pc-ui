import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentPermissionCodeType, VxeComponentSizeType, VxeComponentStatusType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTip: DefineVxeComponentApp<VxeTipProps, VxeTipEventProps, VxeTipSlots>
export type VxeTipComponent = DefineVxeComponentOptions<VxeTipProps>

export type VxeTipInstance = DefineVxeComponentInstance<{
  reactData: TipReactData
}, VxeTipProps, VxeTipPrivateComputed, VxeTipMethods>

export type VxeTipConstructor = VxeTipInstance

export interface TipPrivateRef {
}
export interface VxeTipPrivateRef extends TipPrivateRef { }

export namespace VxeTipPropTypes {
  export type Title = string | number
  export type Content = string | number
  export type Status = VxeComponentStatusType
  export type Icon = string
  export type Size = VxeComponentSizeType
  export type PermissionCode = VxeComponentPermissionCodeType
}

export interface VxeTipProps {
  title?: VxeTipPropTypes.Title
  content?: VxeTipPropTypes.Content
  status?: VxeTipPropTypes.Status
  icon?: VxeTipPropTypes.Icon
  size?: VxeTipPropTypes.Size
  permissionCode?: VxeTipPropTypes.PermissionCode
}

export interface TipPrivateComputed {
}
export interface VxeTipPrivateComputed extends TipPrivateComputed { }

export interface TipReactData {
}

export interface TipMethods {
  dispatchEvent(type: ValueOf<VxeTipEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTipMethods extends TipMethods { }

export interface TipPrivateMethods { }
export interface VxeTipPrivateMethods extends TipPrivateMethods { }

export type VxeTipEmits = []

export namespace VxeTipDefines {
  export interface TipEventParams extends VxeComponentEventParams {
    $tip: VxeTipConstructor
  }
}

export type VxeTipEventProps = {}

export interface VxeTipListeners { }

export namespace VxeTipEvents { }

export namespace VxeTipSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTipSlots {
  default?: (params: VxeTipSlotTypes.DefaultSlotParams) => any
  title?: (params: VxeTipSlotTypes.DefaultSlotParams) => any
  icon?: (params: VxeTipSlotTypes.DefaultSlotParams) => any
}

export const Tip: typeof VxeTip
export default VxeTip
