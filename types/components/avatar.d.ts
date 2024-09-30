import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAvatar: DefineVxeComponentApp<VxeAvatarProps, VxeAvatarEventProps, VxeAvatarSlots>
export type VxeAvatarComponent = DefineVxeComponentOptions<VxeAvatarProps>

export type VxeAvatarInstance = DefineVxeComponentInstance<{
  reactData: AvatarReactData
}, VxeAvatarProps, VxeAvatarPrivateComputed, VxeAvatarMethods>

export type VxeAvatarConstructor = VxeAvatarInstance

export interface AvatarPrivateRef {
}
export interface VxeAvatarPrivateRef extends AvatarPrivateRef { }

export namespace VxeAvatarPropTypes {
}

export interface VxeAvatarProps {
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
