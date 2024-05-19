import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxePasswordInput: defineVxeComponent<VxePasswordInputProps, VxePasswordInputEventProps>
export type VxePasswordInputComponent = DefineComponent<VxePasswordInputProps, VxePasswordInputEmits>

export type VxePasswordInputInstance = ComponentPublicInstance<VxePasswordInputProps, VxePasswordInputConstructor>

export interface VxePasswordInputConstructor extends VxeComponentBase, VxePasswordInputMethods {
  props: VxePasswordInputProps
  context: SetupContext<VxePasswordInputEmits>
  reactData: PasswordInputReactData
  getRefMaps(): PasswordInputPrivateRef
  getComputeMaps(): PasswordInputPrivateComputed
  renderVN: RenderFunction
}

export interface PasswordInputPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxePasswordInputPrivateRef extends PasswordInputPrivateRef { }

export namespace VxePasswordInputPropTypes {
}

export type VxePasswordInputProps = {
}

export interface PasswordInputPrivateComputed {
}
export interface VxePasswordInputPrivateComputed extends PasswordInputPrivateComputed { }

export interface PasswordInputReactData {
}

export interface PasswordInputMethods {
}
export interface VxePasswordInputMethods extends PasswordInputMethods { }

export interface PasswordInputPrivateMethods { }
export interface VxePasswordInputPrivateMethods extends PasswordInputPrivateMethods { }

export type VxePasswordInputEmits = []

export namespace VxePasswordInputDefines {
  export interface PasswordInputEventParams extends VxeComponentEvent {
    $passwordInput: VxePasswordInputConstructor
  }
}

export type VxePasswordInputEventProps = {}

export interface VxePasswordInputListeners { }

export namespace VxePasswordInputEvents { }

export namespace VxePasswordInputSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxePasswordInputSlots {
  default: (params: VxePasswordInputSlotTypes.DefaultSlotParams) => any
}

export const PasswordInput: typeof VxePasswordInput
export default VxePasswordInput
