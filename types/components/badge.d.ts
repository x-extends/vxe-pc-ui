import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBadge: DefineVxeComponentApp<VxeBadgeProps, VxeBadgeEventProps, VxeBadgeSlots>
export type VxeBadgeComponent = DefineVxeComponentOptions<VxeBadgeProps>

export type VxeBadgeInstance = DefineVxeComponentInstance<{
  reactData: BadgeReactData
}, VxeBadgeProps, VxeBadgePrivateComputed, VxeBadgeMethods>

export type VxeBadgeConstructor = VxeBadgeInstance

export interface BadgePrivateRef {
}
export interface VxeBadgePrivateRef extends BadgePrivateRef { }

export namespace VxeBadgePropTypes {
}

export interface VxeBadgeProps {
}

export interface BadgePrivateComputed {
}
export interface VxeBadgePrivateComputed extends BadgePrivateComputed { }

export interface BadgeReactData {
}

export interface BadgeMethods {
}
export interface VxeBadgeMethods extends BadgeMethods { }

export interface BadgePrivateMethods { }
export interface VxeBadgePrivateMethods extends BadgePrivateMethods { }

export type VxeBadgeEmits = []

export namespace VxeBadgeDefines {
  export interface BadgeEventParams extends VxeComponentEventParams {
    $badge: VxeBadgeConstructor
  }
}

export type VxeBadgeEventProps = {}

export interface VxeBadgeListeners { }

export namespace VxeBadgeEvents { }

export namespace VxeBadgeSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeBadgeSlots {
  default?: (params: VxeBadgeSlotTypes.DefaultSlotParams) => any
}

export const Badge: typeof VxeBadge
export default VxeBadge
