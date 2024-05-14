import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeInput: defineVxeComponent<VxeInputProps, VxeInputEventProps>

export type VxeInputInstance = ComponentPublicInstance<VxeInputProps, VxeInputConstructor>

export interface VxeInputConstructor extends VxeComponentBase, VxeInputMethods {
  props: VxeInputProps
  context: SetupContext<VxeInputEmits>
  reactData: InputReactData
  getRefMaps(): InputPrivateRef
  getComputeMaps(): InputPrivateComputed
  renderVN: RenderFunction
}

export interface InputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeInputPrivateRef extends InputPrivateRef { }

export namespace VxeInputPropTypes {
}

export type VxeInputProps = {}

export interface InputPrivateComputed {
}
export interface VxeInputPrivateComputed extends InputPrivateComputed { }

export interface InputReactData {
}

export interface InputMethods {
}
export interface VxeInputMethods extends InputMethods { }

export interface InputPrivateMethods { }
export interface VxeInputPrivateMethods extends InputPrivateMethods { }

export type VxeInputEmits = []

export namespace VxeInputDefines {
  export interface InputEventParams extends VxeComponentEvent {
    $input: VxeInputConstructor
  }
}

export type VxeInputEventProps = {}

export interface VxeInputListeners { }

export namespace VxeInputEvents { }

export namespace VxeInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeInputSlots {
  default: (params: VxeInputSlotTypes.DefaultSlotParams) => any
}

export const Input: typeof VxeInput
export default VxeInput
