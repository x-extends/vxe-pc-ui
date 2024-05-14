import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadioButton: defineVxeComponent<VxeRadioButtonProps, VxeRadioButtonEventProps>

export type VxeRadioButtonInstance = ComponentPublicInstance<VxeRadioButtonProps, VxeRadioButtonConstructor>

export interface VxeRadioButtonConstructor extends VxeComponentBase, VxeRadioButtonMethods {
  props: VxeRadioButtonProps
  context: SetupContext<VxeRadioButtonEmits>
  reactData: RadioButtonReactData
  getRefMaps(): RadioButtonPrivateRef
  getComputeMaps(): RadioButtonPrivateComputed
  renderVN: RenderFunction
}

export interface RadioButtonPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeRadioButtonPrivateRef extends RadioButtonPrivateRef { }

export namespace VxeRadioButtonPropTypes {
}

export type VxeRadioButtonProps = {}

export interface RadioButtonPrivateComputed {
}
export interface VxeRadioButtonPrivateComputed extends RadioButtonPrivateComputed { }

export interface RadioButtonReactData {
}

export interface RadioButtonMethods {
}
export interface VxeRadioButtonMethods extends RadioButtonMethods { }

export interface RadioButtonPrivateMethods { }
export interface VxeRadioButtonPrivateMethods extends RadioButtonPrivateMethods { }

export type VxeRadioButtonEmits = []

export namespace VxeRadioButtonDefines {
  export interface RadioButtonEventParams extends VxeComponentEvent {
    $radioButton: VxeRadioButtonConstructor
  }
}

export type VxeRadioButtonEventProps = {}

export interface VxeRadioButtonListeners { }

export namespace VxeRadioButtonEvents { }

export namespace VxeRadioButtonSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioButtonSlots {
  default: (params: VxeRadioButtonSlotTypes.DefaultSlotParams) => any
}

export const RadioButton: typeof VxeRadioButton
export default VxeRadioButton
