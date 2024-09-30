import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeEmpty: DefineVxeComponentApp<VxeEmptyProps, VxeEmptyEventProps, VxeEmptySlots>
export type VxeEmptyComponent = DefineVxeComponentOptions<VxeEmptyProps>

export type VxeEmptyInstance = DefineVxeComponentInstance<{
  reactData: EmptyReactData
}, VxeEmptyProps, VxeEmptyPrivateComputed, VxeEmptyMethods>

export type VxeEmptyConstructor = VxeEmptyInstance

export interface EmptyPrivateRef {
}
export interface VxeEmptyPrivateRef extends EmptyPrivateRef { }

export namespace VxeEmptyPropTypes {
  export type ImageUrl = string
  export type ImageStyle = VxeComponentStyleType
  export type Icon = string
  export type Content = number | string
}

export interface VxeEmptyProps {
  imageUrl?: VxeEmptyPropTypes.ImageUrl
  imageStyle?: VxeEmptyPropTypes.ImageStyle
  icon?: VxeEmptyPropTypes.Icon
  content?: VxeEmptyPropTypes.Content
}

export interface EmptyPrivateComputed {
}
export interface VxeEmptyPrivateComputed extends EmptyPrivateComputed { }

export interface EmptyReactData {
}

export interface EmptyMethods {
}
export interface VxeEmptyMethods extends EmptyMethods { }

export interface EmptyPrivateMethods { }
export interface VxeEmptyPrivateMethods extends EmptyPrivateMethods { }

export type VxeEmptyEmits = []

export namespace VxeEmptyDefines {
  export interface EmptyEventParams extends VxeComponentEventParams {
    $empty: VxeEmptyConstructor
  }
}

export type VxeEmptyEventProps = {}

export interface VxeEmptyListeners { }

export namespace VxeEmptyEvents { }

export namespace VxeEmptySlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeEmptySlots {
  default?: (params: VxeEmptySlotTypes.DefaultSlotParams) => any
}

export const Empty: typeof VxeEmpty
export default VxeEmpty
