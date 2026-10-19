import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf, VxeComponentSizeType, VxeComponentIsVScrollbar } from '@vxe-ui/core'
import { VxeScrollbarProps } from './scrollbar'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCard: DefineVxeComponentApp<VxeCardProps, VxeCardEventProps, VxeCardSlots, VxeCardMethods>
export type VxeCardComponent = DefineVxeComponentOptions<VxeCardProps, VxeCardEventProps>

export type VxeCardInstance = DefineVxeComponentInstance<VxeCardProps, VxeCardConstructor>

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
  export type Loading = boolean
  export type Shadow = boolean
  export type Padding = boolean
  export type Size = VxeComponentSizeType
  export type UseScrollbar = VxeComponentIsVScrollbar
  export interface ScrollbarConfig extends Pick<VxeScrollbarProps, 'xConfig' | 'yConfig' | 'padding' | 'autoHide' | 'fluentOverlay' | 'visible' | 'className' | 'viewAttrs' | 'viewClassName' | 'viewInnerClassName'> {
    /**
     * 滚动条宽度
     */
    width?: number | string
    /**
     * 滚动条高度
     */
    height?: number | string
  }
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
  /**
   * 使用虚拟滚动条
   */
  useScrollbar?: VxeCardPropTypes.UseScrollbar
  /**
   * 滚动条配置项
   */
  scrollbarConfig?: VxeCardPropTypes.ScrollbarConfig
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
