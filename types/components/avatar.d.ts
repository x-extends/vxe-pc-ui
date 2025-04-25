import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentStatusType, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAvatar: DefineVxeComponentApp<VxeAvatarProps, VxeAvatarEventProps, VxeAvatarSlots, VxeAvatarMethods>
export type VxeAvatarComponent = DefineVxeComponentOptions<VxeAvatarProps>

export type VxeAvatarInstance = DefineVxeComponentInstance<{
  reactData: AvatarReactData
}, VxeAvatarProps, VxeAvatarPrivateComputed, VxeAvatarMethods>

export type VxeAvatarConstructor = VxeAvatarInstance

export interface AvatarPrivateRef {
}
export interface VxeAvatarPrivateRef extends AvatarPrivateRef { }

export namespace VxeAvatarPropTypes {
  export type Count = string | number
  export type Dot = boolean
  export type Content = string | number
  export type Icon = string
  export type Src = string
  export type Width = string | number
  export type Height = string | number
  export type Circle = boolean
  export type Status = VxeComponentStatusType
  export type Size = VxeComponentSizeType
}

export interface VxeAvatarProps {
  count?: VxeAvatarPropTypes.Count
  dot?: VxeAvatarPropTypes.Dot
  content?: VxeAvatarPropTypes.Content
  icon?: VxeAvatarPropTypes.Icon
  src?: VxeAvatarPropTypes.Src
  width?: VxeAvatarPropTypes.Width
  height?: VxeAvatarPropTypes.Height
  circle?: VxeAvatarPropTypes.Circle
  status?: VxeAvatarPropTypes.Status
  size?: VxeAvatarPropTypes.Size
}

export interface AvatarPrivateComputed {
}
export interface VxeAvatarPrivateComputed extends AvatarPrivateComputed { }

export interface AvatarReactData {
}

export interface AvatarMethods {
}
export interface VxeAvatarMethods extends AvatarMethods { }

export interface AvatarPrivateMethods { }
export interface VxeAvatarPrivateMethods extends AvatarPrivateMethods { }

export type VxeAvatarEmits = []

export namespace VxeAvatarDefines {
  export interface AvatarEventParams extends VxeComponentEventParams {
    $avatar: VxeAvatarConstructor
  }
}

export type VxeAvatarEventProps = {}

export interface VxeAvatarListeners { }

export namespace VxeAvatarEvents { }

export namespace VxeAvatarSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeAvatarSlots {
  default?: (params: VxeAvatarSlotTypes.DefaultSlotParams) => any
}

export const Avatar: typeof VxeAvatar
export default VxeAvatar
