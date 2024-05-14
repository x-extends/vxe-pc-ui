import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeRadioGroup: defineVxeComponent<VxeRadioGroupProps, VxeRadioGroupEventProps>

export type VxeRadioGroupInstance = ComponentPublicInstance<VxeRadioGroupProps, VxeRadioGroupConstructor>

export interface VxeRadioGroupConstructor extends VxeComponentBase, VxeRadioGroupMethods {
  props: VxeRadioGroupProps
  context: SetupContext<VxeRadioGroupEmits>
  reactData: RadioGroupReactData
  getRefMaps(): RadioGroupPrivateRef
  getComputeMaps(): RadioGroupPrivateComputed
  renderVN: RenderFunction
}

export interface RadioGroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeRadioGroupPrivateRef extends RadioGroupPrivateRef { }

export namespace VxeRadioGroupPropTypes {
}

export type VxeRadioGroupProps = {}

export interface RadioGroupPrivateComputed {
}
export interface VxeRadioGroupPrivateComputed extends RadioGroupPrivateComputed { }

export interface RadioGroupReactData {
}

export interface RadioGroupMethods {
}
export interface VxeRadioGroupMethods extends RadioGroupMethods { }

export interface RadioGroupPrivateMethods { }
export interface VxeRadioGroupPrivateMethods extends RadioGroupPrivateMethods { }

export type VxeRadioGroupEmits = []

export namespace VxeRadioGroupDefines {
  export interface RadioGroupEventParams extends VxeComponentEvent {
    $radioGroup: VxeRadioGroupConstructor
  }
}

export type VxeRadioGroupEventProps = {}

export interface VxeRadioGroupListeners { }

export namespace VxeRadioGroupEvents { }

export namespace VxeRadioGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeRadioGroupSlots {
  default: (params: VxeRadioGroupSlotTypes.DefaultSlotParams) => any
}

export const RadioGroup: typeof VxeRadioGroup
export default VxeRadioGroup
