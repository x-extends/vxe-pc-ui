import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeNumberInput: defineVxeComponent<VxeNumberInputProps, VxeNumberInputEventProps>
export type VxeNumberInputComponent = DefineComponent<VxeNumberInputProps, VxeNumberInputEmits>

export type VxeNumberInputInstance = ComponentPublicInstance<VxeNumberInputProps, VxeNumberInputConstructor>

export interface VxeNumberInputConstructor extends VxeComponentBaseOptions, VxeNumberInputMethods {
  props: VxeNumberInputProps
  context: SetupContext<VxeNumberInputEmits>
  reactData: NumberInputReactData
  getRefMaps(): NumberInputPrivateRef
  getComputeMaps(): NumberInputPrivateComputed
  renderVN: RenderFunction
}

export interface NumberInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeNumberInputPrivateRef extends NumberInputPrivateRef { }

export namespace VxeNumberInputPropTypes {
}

export type VxeNumberInputProps = {
}

export interface NumberInputPrivateComputed {
}
export interface VxeNumberInputPrivateComputed extends NumberInputPrivateComputed { }

export interface NumberInputReactData {
}

export interface NumberInputMethods {
  dispatchEvent(type: ValueOf<VxeNumberInputEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeNumberInputMethods extends NumberInputMethods { }

export interface NumberInputPrivateMethods { }
export interface VxeNumberInputPrivateMethods extends NumberInputPrivateMethods { }

export type VxeNumberInputEmits = []

export namespace VxeNumberInputDefines {
  export interface NumberInputEventParams extends VxeComponentEventParams {
    $numberInput: VxeNumberInputConstructor
  }
}

export type VxeNumberInputEventProps = {}

export interface VxeNumberInputListeners { }

export namespace VxeNumberInputEvents { }

export namespace VxeNumberInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeNumberInputSlots {
  default: (params: VxeNumberInputSlotTypes.DefaultSlotParams) => any
}

export const NumberInput: typeof VxeNumberInput
export default VxeNumberInput
