import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckbox: defineVxeComponent<VxeCheckboxProps, VxeCheckboxEventProps>

export type VxeCheckboxInstance = ComponentPublicInstance<VxeCheckboxProps, VxeCheckboxConstructor>

export interface VxeCheckboxConstructor extends VxeComponentBase, VxeCheckboxMethods {
  props: VxeCheckboxProps
  context: SetupContext<VxeCheckboxEmits>
  reactData: CheckboxReactData
  getRefMaps(): CheckboxPrivateRef
  getComputeMaps(): CheckboxPrivateComputed
  renderVN: RenderFunction
}

export interface CheckboxPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCheckboxPrivateRef extends CheckboxPrivateRef { }

export namespace VxeCheckboxPropTypes {
}

export type VxeCheckboxProps = {}

export interface CheckboxPrivateComputed {
}
export interface VxeCheckboxPrivateComputed extends CheckboxPrivateComputed { }

export interface CheckboxReactData {
}

export interface CheckboxMethods {
}
export interface VxeCheckboxMethods extends CheckboxMethods { }

export interface CheckboxPrivateMethods { }
export interface VxeCheckboxPrivateMethods extends CheckboxPrivateMethods { }

export type VxeCheckboxEmits = []

export namespace VxeCheckboxDefines {
  export interface CheckboxEventParams extends VxeComponentEvent {
    $checkbox: VxeCheckboxConstructor
  }
}

export type VxeCheckboxEventProps = {}

export interface VxeCheckboxListeners { }

export namespace VxeCheckboxEvents { }

export namespace VxeCheckboxSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCheckboxSlots {
  default: (params: VxeCheckboxSlotTypes.DefaultSlotParams) => any
}

export const Checkbox: typeof VxeCheckbox
export default VxeCheckbox
