import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeDateInput: defineVxeComponent<VxeDateInputProps, VxeDateInputEventProps>
export type VxeDateInputComponent = DefineComponent<VxeDateInputProps, VxeDateInputEmits>

export type VxeDateInputInstance = ComponentPublicInstance<VxeDateInputProps, VxeDateInputConstructor>

export interface VxeDateInputConstructor extends VxeComponentBaseOptions, VxeDateInputMethods {
  props: VxeDateInputProps
  context: SetupContext<VxeDateInputEmits>
  reactData: DateInputReactData
  getRefMaps(): DateInputPrivateRef
  getComputeMaps(): DateInputPrivateComputed
  renderVN: RenderFunction
}

export interface DateInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeDateInputPrivateRef extends DateInputPrivateRef { }

export namespace VxeDateInputPropTypes {
}

export type VxeDateInputProps = {
}

export interface DateInputPrivateComputed {
}
export interface VxeDateInputPrivateComputed extends DateInputPrivateComputed { }

export interface DateInputReactData {
}

export interface DateInputMethods {
  dispatchEvent(type: ValueOf<VxeDateInputEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeDateInputMethods extends DateInputMethods { }

export interface DateInputPrivateMethods { }
export interface VxeDateInputPrivateMethods extends DateInputPrivateMethods { }

export type VxeDateInputEmits = []

export namespace VxeDateInputDefines {
  export interface DateInputEventParams extends VxeComponentEventParams {
    $dateInput: VxeDateInputConstructor
  }
}

export type VxeDateInputEventProps = {}

export interface VxeDateInputListeners { }

export namespace VxeDateInputEvents { }

export namespace VxeDateInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeDateInputSlots {
  default: (params: VxeDateInputSlotTypes.DefaultSlotParams) => any
}

export const DateInput: typeof VxeDateInput
export default VxeDateInput
