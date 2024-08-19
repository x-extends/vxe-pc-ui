import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCarousel: defineVxeComponent<VxeCarouselProps, VxeCarouselEventProps, VxeCarouselSlots>
export type VxeCarouselComponent = DefineComponent<VxeCarouselProps & VxeCarouselEventProps>

export type VxeCarouselInstance = ComponentPublicInstance<VxeCarouselProps, VxeCarouselConstructor>

export interface VxeCarouselConstructor extends VxeComponentBaseOptions, VxeCarouselMethods {
  props: VxeCarouselProps
  context: SetupContext<VxeCarouselEmits>
  reactData: CarouselReactData
  getRefMaps(): CarouselPrivateRef
  getComputeMaps(): CarouselPrivateComputed
  renderVN: RenderFunction
}

export interface CarouselPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCarouselPrivateRef extends CarouselPrivateRef { }

export namespace VxeCarouselPropTypes {
}

export type VxeCarouselProps = {
}

export interface CarouselPrivateComputed {
}
export interface VxeCarouselPrivateComputed extends CarouselPrivateComputed { }

export interface CarouselReactData {
}

export interface CarouselMethods {
  dispatchEvent(type: ValueOf<VxeCarouselEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeCarouselMethods extends CarouselMethods { }

export interface CarouselPrivateMethods { }
export interface VxeCarouselPrivateMethods extends CarouselPrivateMethods { }

export type VxeCarouselEmits = []

export namespace VxeCarouselDefines {
  export interface CarouselEventParams extends VxeComponentEventParams {
    $carousel: VxeCarouselConstructor
  }
}

export type VxeCarouselEventProps = {}

export interface VxeCarouselListeners { }

export namespace VxeCarouselEvents { }

export namespace VxeCarouselSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCarouselSlots {
  default: (params: VxeCarouselSlotTypes.DefaultSlotParams) => any
}

export const Carousel: typeof VxeCarousel
export default VxeCarousel
