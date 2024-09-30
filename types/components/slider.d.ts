import { RenderFunction, SetupContext, Ref } from 'vue'
import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSlider: DefineVxeComponentApp<VxeSliderProps, VxeSliderEventProps, VxeSliderSlots>
export type VxeSliderComponent = DefineVxeComponentOptions<VxeSliderProps, VxeSliderEventProps>

export type VxeSliderInstance = DefineVxeComponentInstance<VxeSliderProps, VxeSliderConstructor>

export interface VxeSliderConstructor extends VxeComponentBaseOptions, VxeSliderMethods {
  props: VxeSliderProps
  context: SetupContext<VxeSliderEmits>
  reactData: SliderReactData
  getRefMaps(): SliderPrivateRef
  getComputeMaps(): SliderPrivateComputed
  renderVN: RenderFunction
}

export interface SliderPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSliderPrivateRef extends SliderPrivateRef { }

export namespace VxeSliderPropTypes {
}

export interface VxeSliderProps {
}

export interface SliderPrivateComputed {
}
export interface VxeSliderPrivateComputed extends SliderPrivateComputed { }

export interface SliderReactData {
}

export interface SliderMethods {
}
export interface VxeSliderMethods extends SliderMethods { }

export interface SliderPrivateMethods { }
export interface VxeSliderPrivateMethods extends SliderPrivateMethods { }

export type VxeSliderEmits = []

export namespace VxeSliderDefines {
  export interface SliderEventParams extends VxeComponentEventParams {
    $slider: VxeSliderConstructor
  }
}

export type VxeSliderEventProps = {}

export interface VxeSliderListeners { }

export namespace VxeSliderEvents { }

export namespace VxeSliderSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeSliderSlots {
  default?: (params: VxeSliderSlotTypes.DefaultSlotParams) => any
}

export const Slider: typeof VxeSlider
export default VxeSlider
