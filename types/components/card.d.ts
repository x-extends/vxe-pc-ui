import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf, VxeComponentSizeType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCard: DefineVxeComponentApp<VxeCardProps, VxeCardEventProps, VxeCardSlots, VxeCardMethods>
export type VxeCardComponent = DefineVxeComponentOptions<VxeCardProps>

export type VxeCardInstance = DefineVxeComponentInstance<{
  reactData: CardReactData
}, VxeCardProps, VxeCardPrivateComputed, VxeCardMethods>

export type VxeCardConstructor = VxeCardInstance

export interface CardPrivateRef {
}
export interface VxeCardPrivateRef extends CardPrivateRef { }

export namespace VxeCardPropTypes {
  export type Title = string | number
  export type ShowTitleOverflow = boolean
  export type Height = string | number
  export type Width = string | number
  export type Border = boolean
  export type Loading = boolean
  export type Shadow = boolean
  export type Padding = boolean
  export type Size = VxeComponentSizeType
}

export type VxeCardProps = {
  title?: VxeCardPropTypes.Title
  showTitleOverflow?: VxeCardPropTypes.ShowTitleOverflow
  height?: VxeCardPropTypes.Height
  width?: VxeCardPropTypes.Width
  border?: VxeCardPropTypes.Border
  loading?: VxeCardPropTypes.Loading
  shadow?: VxeCardPropTypes.Shadow
  padding?: VxeCardPropTypes.Padding
  size?: VxeCardPropTypes.Size
}

export interface CardPrivateComputed {
}
export interface VxeCardPrivateComputed extends CardPrivateComputed { }

export interface CardReactData {
}

export interface CardMethods {
  dispatchEvent(type: ValueOf<VxeCardEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCardMethods extends CardMethods { }

export interface CardPrivateMethods { }
export interface VxeCardPrivateMethods extends CardPrivateMethods { }

export type VxeCardEmits = []

export namespace VxeCardDefines {
  export interface CardEventParams extends VxeComponentEventParams {
    $card: VxeCardConstructor
  }
}

export type VxeCardEventProps = {}

export interface VxeCardListeners { }

export namespace VxeCardEvents { }

export namespace VxeCardSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCardSlots {
  default?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  header?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  title?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  extra?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  footer?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  left?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
  right?: (params: VxeCardSlotTypes.DefaultSlotParams) => any
}

export const Card: typeof VxeCard
export default VxeCard
