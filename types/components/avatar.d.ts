import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAvatar: DefineVxeComponentApp<VxeAvatarProps, VxeAvatarEventProps, VxeAvatarSlots>
export type VxeAvatarComponent = DefineVxeComponentOptions<VxeAvatarProps, VxeAvatarEventProps>

export type VxeAvatarInstance = DefineVxeComponentInstance<VxeAvatarProps, VxeAvatarConstructor>

export interface VxeAvatarConstructor extends VxeComponentBaseOptions, VxeAvatarMethods {
  props: VxeAvatarProps
  context: SetupContext<VxeAvatarEmits>
  reactData: AvatarReactData
  getRefMaps(): AvatarPrivateRef
  getComputeMaps(): AvatarPrivateComputed
  renderVN: RenderFunction
}

export interface AvatarPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
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
