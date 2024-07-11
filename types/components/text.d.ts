import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentSizeType, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeText: defineVxeComponent<VxeTextProps, VxeTextEventProps>
export type VxeTextComponent = DefineComponent<VxeTextProps, VxeTextEmits>

export type VxeTextInstance = ComponentPublicInstance<VxeTextProps, VxeTextConstructor>

export interface VxeTextConstructor extends VxeComponentBaseOptions, VxeTextMethods {
  props: VxeTextProps
  context: SetupContext<VxeTextEmits>
  reactData: TextReactData
  getRefMaps(): TextPrivateRef
  getComputeMaps(): TextPrivateComputed
  renderVN: RenderFunction
}

export interface TextPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTextPrivateRef extends TextPrivateRef { }

export namespace VxeTextPropTypes {
  export type Status = VxeComponentStatusType
  export type Title = string | number
  export type Icon = string
  export type Content = string | number
  export type Size = VxeComponentSizeType
}

export type VxeTextProps = {
  status?: VxeTextPropTypes.Status
  title?: VxeTextPropTypes.Title
  icon?: VxeTextPropTypes.Icon
  content?: VxeTextPropTypes.Content
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
  default: (params: VxeTextSlotTypes.DefaultSlotParams) => any
  icon: (params: VxeTextSlotTypes.DefaultSlotParams) => any
}

export const Text: typeof VxeText
export default VxeText
