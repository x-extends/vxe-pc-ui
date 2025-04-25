import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeText: DefineVxeComponentApp<VxeTextProps, VxeTextEventProps, VxeTextSlots, VxeTextMethods>
export type VxeTextComponent = DefineVxeComponentOptions<VxeTextProps>

export type VxeTextInstance = DefineVxeComponentInstance<{
  reactData: TextReactData
}, VxeTextProps, VxeTextPrivateComputed, VxeTextMethods>

export type VxeTextConstructor = VxeTextInstance

export interface TextPrivateRef {
}
export interface VxeTextPrivateRef extends TextPrivateRef { }

export namespace VxeTextPropTypes {
  export type Status = VxeComponentStatusType
  export type Title = string | number
  export type Icon = string
  export type Loading = boolean
  export type Content = string | number
  export type ClickToCopy = boolean
  export type Size = VxeComponentSizeType
}

export interface VxeTextProps {
  status?: VxeTextPropTypes.Status
  title?: VxeTextPropTypes.Title
  icon?: VxeTextPropTypes.Icon
  loading?: VxeTextPropTypes.Loading
  content?: VxeTextPropTypes.Content
  clickToCopy?: VxeTextPropTypes.ClickToCopy
  size?: VxeTextPropTypes.Size
}

export interface TextPrivateComputed {
}
export interface VxeTextPrivateComputed extends TextPrivateComputed { }

export interface TextReactData {
}

export interface TextMethods {
  dispatchEvent(type: ValueOf<VxeTextEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeTextMethods extends TextMethods { }

export interface TextPrivateMethods { }
export interface VxeTextPrivateMethods extends TextPrivateMethods { }

export type VxeTextEmits = [
  'click'
]

export namespace VxeTextDefines {
  export interface TextEventParams extends VxeComponentEventParams {
    $text: VxeTextConstructor
  }

  export interface ClickParams {
  }
  export interface ClickEventParams extends TextEventParams, ClickParams { }
}

export type VxeTextEventProps = {
  onClick?: VxeTextEvents.Click
}

export interface VxeTextListeners {
  click?: VxeTextEvents.Click
}

export namespace VxeTextEvents {
  export type Click = (params: VxeTextDefines.ClickEventParams) => void
}

export namespace VxeTextSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTextSlots {
  default?: (params: VxeTextSlotTypes.DefaultSlotParams) => any
  icon?: (params: VxeTextSlotTypes.DefaultSlotParams) => any
}

export const Text: typeof VxeText
export default VxeText
