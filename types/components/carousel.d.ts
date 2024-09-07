import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeCarouselItemPropTypes, VxeCarouselItemProps, VxeCarouselItemSlots } from './carousel-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCarousel: DefineVxeComponentApp<VxeCarouselProps, VxeCarouselEventProps, VxeCarouselSlots>
export type VxeCarouselComponent = DefineVxeComponentOptions<VxeCarouselProps>

export type VxeCarouselInstance = DefineVxeComponentInstance<{
  reactData: CarouselReactData
}, VxeCarouselProps, CarouselPrivateComputed, CarouselMethods>

export type VxeCarouselConstructor = VxeCarouselInstance

export interface CarouselPrivateRef {
}
export interface VxeCarouselPrivateRef extends CarouselPrivateRef { }

export namespace VxeCarouselPropTypes {
  export type ModelValue = VxeCarouselItemPropTypes.Name
  export interface Option extends VxeCarouselItemProps {
    slots?: VxeCarouselItemSlots
  }
  export type Options = Option[]
  export type Loading = boolean
  export type Height = number | string
  export type Width = number | string
  export type AutoPlay = boolean
  export type Interval = number | string
  export type Loop = boolean
  export type Vertical = boolean
  export type ShowIndicators = boolean
}

export interface VxeCarouselProps {
  value?: VxeCarouselPropTypes.ModelValue
  options?: VxeCarouselPropTypes.Options
  loading?: VxeCarouselPropTypes.Loading
  height?: VxeCarouselPropTypes.Height
  width?: VxeCarouselPropTypes.Width
  autoPlay?: VxeCarouselPropTypes.AutoPlay
  loop?: VxeCarouselPropTypes.Loop
  interval?: VxeCarouselPropTypes.Interval
  vertical?: VxeCarouselPropTypes.Vertical
  showIndicators?: VxeCarouselPropTypes.ShowIndicators
}

export interface CarouselPrivateComputed {
}
export interface VxeCarouselPrivateComputed extends CarouselPrivateComputed { }

export interface CarouselReactData {
  activeName: VxeCarouselPropTypes.ModelValue | undefined
  staticItems: VxeCarouselDefines.ItemConfig[]
  itemWidth: number
  itemHeight: number
}

export interface CarouselInternalData {
  apTimeout: undefined | number
  stopFlag: boolean
}

export interface CarouselMethods {
  dispatchEvent(type: ValueOf<VxeCarouselEmits>, params: Record<string, any>, evnt: Event | null): void
  /**
   * 切换到上一个
   */
  prev(): Promise<any>
  /**
   * 切换到下一个
   */
  next(): Promise<any>
}
export interface VxeCarouselMethods extends CarouselMethods { }

export interface CarouselPrivateMethods { }
export interface VxeCarouselPrivateMethods extends CarouselPrivateMethods { }

export type VxeCarouselEmits = [
  'input',
  'change'
]

export namespace VxeCarouselDefines {
  export interface CarouselEventParams extends VxeComponentEventParams {
    $carousel: VxeCarouselConstructor
  }

  export interface ItemConfig {
    id: string
    name: VxeCarouselItemPropTypes.Name | undefined
    url: VxeCarouselItemPropTypes.Url | undefined
    className: VxeCarouselItemPropTypes.ClassName | undefined
    slots: VxeCarouselItemSlots
  }
}

export type VxeCarouselEventProps = {}

export interface VxeCarouselListeners { }

export namespace VxeCarouselEvents { }

export namespace VxeCarouselSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCarouselSlots {
  default?: (params: VxeCarouselSlotTypes.DefaultSlotParams) => any
}

export const Carousel: typeof VxeCarousel
export default VxeCarousel
