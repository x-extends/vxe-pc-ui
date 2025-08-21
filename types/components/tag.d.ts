import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTag: DefineVxeComponentApp<VxeTagProps, VxeTagEventProps, VxeTagSlots, VxeTagMethods>
export type VxeTagComponent = DefineVxeComponentOptions<VxeTagProps>

export type VxeTagInstance = DefineVxeComponentInstance<{
  reactData: TagReactData
}, VxeTagProps, VxeTagPrivateComputed, VxeTagMethods>

export type VxeTagConstructor = VxeTagInstance

export interface TagPrivateRef {
}
export interface VxeTagPrivateRef extends TagPrivateRef { }

export namespace VxeTagPropTypes {
  export type Status = VxeComponentStatusType
  export type Title = string | number
  export type Icon = string
  export type Content = string | number
  export type Round = boolean
  export type Size = VxeComponentSizeType
}

export interface VxeTagProps {
  status?: VxeTagPropTypes.Status
  title?: VxeTagPropTypes.Title
  icon?: VxeTagPropTypes.Icon
  content?: VxeTagPropTypes.Content
  round?: VxeTagPropTypes.Round
  size?: VxeTagPropTypes.Size
}

export interface TagPrivateComputed {
}
export interface VxeTagPrivateComputed extends TagPrivateComputed { }

export interface TagReactData {
}

export interface TagMethods {
  dispatchEvent(type: ValueOf<VxeTagEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTagMethods extends TagMethods { }

export interface TagPrivateMethods { }
export interface VxeTagPrivateMethods extends TagPrivateMethods { }

export type VxeTagEmits = [
  'click'
]

export namespace VxeTagDefines {
  export interface TagEventParams extends VxeComponentEventParams {
    $tag: VxeTagConstructor
  }

  export interface ClickParams {
  }
  export interface ClickEventParams extends TagEventParams, ClickParams { }
}

export type VxeTagEventProps = {
  onClick?: VxeTagEvents.Click
}

export interface VxeTagListeners {
  click?: VxeTagEvents.Click
}

export namespace VxeTagEvents {
  export type Click = (params: VxeTagDefines.ClickEventParams) => void
}

export namespace VxeTagSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTagSlots {
  default?: (params: VxeTagSlotTypes.DefaultSlotParams) => any
  icon?: (params: VxeTagSlotTypes.DefaultSlotParams) => any
}

export const Tag: typeof VxeTag
export default VxeTag
