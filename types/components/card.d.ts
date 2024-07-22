import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCard: defineVxeComponent<VxeCardProps, VxeCardEventProps, VxeCardSlots>
export type VxeCardComponent = DefineComponent<VxeCardProps, VxeCardEmits>

export type VxeCardInstance = ComponentPublicInstance<VxeCardProps, VxeCardConstructor>

export interface VxeCardConstructor extends VxeComponentBaseOptions, VxeCardMethods {
  props: VxeCardProps
  context: SetupContext<VxeCardEmits>
  reactData: CardReactData
  getRefMaps(): CardPrivateRef
  getComputeMaps(): CardPrivateComputed
  renderVN: RenderFunction
}

export interface CardPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCardPrivateRef extends CardPrivateRef { }

export namespace VxeCardPropTypes {
  export type Title = string | number
  export type ShowTitleOverflow = boolean
  export type Height = string | number
  export type Width = string | number
  export type Border = boolean
  export type Shadow = boolean
  export type Padding = boolean
}

export type VxeCardProps = {
  title?: VxeCardPropTypes.Title
  showTitleOverflow?: VxeCardPropTypes.ShowTitleOverflow
  height?: VxeCardPropTypes.Height
  width?: VxeCardPropTypes.Width
  border?: VxeCardPropTypes.Border
  shadow?: VxeCardPropTypes.Shadow
  padding?: VxeCardPropTypes.Padding
}

export interface CardPrivateComputed {
}
export interface VxeCardPrivateComputed extends CardPrivateComputed { }

export interface CardReactData {
}

export interface CardMethods {
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
  default: (params: VxeCardSlotTypes.DefaultSlotParams) => any
}

export const Card: typeof VxeCard
export default VxeCard
