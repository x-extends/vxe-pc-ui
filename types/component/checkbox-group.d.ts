import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeCheckboxGroup: defineVxeComponent<VxeCheckboxGroupProps, VxeCheckboxGroupEventProps>

export type VxeCheckboxGroupInstance = ComponentPublicInstance<VxeCheckboxGroupProps, VxeCheckboxGroupConstructor>

export interface VxeCheckboxGroupConstructor extends VxeComponentBase, VxeCheckboxGroupMethods {
  props: VxeCheckboxGroupProps
  context: SetupContext<VxeCheckboxGroupEmits>
  reactData: CheckboxGroupReactData
  getRefMaps(): CheckboxGroupPrivateRef
  getComputeMaps(): CheckboxGroupPrivateComputed
  renderVN: RenderFunction
}

export interface CheckboxGroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeCheckboxGroupPrivateRef extends CheckboxGroupPrivateRef { }

export namespace VxeCheckboxGroupPropTypes {
}

export type VxeCheckboxGroupProps = {}

export interface CheckboxGroupPrivateComputed {
}
export interface VxeCheckboxGroupPrivateComputed extends CheckboxGroupPrivateComputed { }

export interface CheckboxGroupReactData {
}

export interface CheckboxGroupMethods {
}
export interface VxeCheckboxGroupMethods extends CheckboxGroupMethods { }

export interface CheckboxGroupPrivateMethods { }
export interface VxeCheckboxGroupPrivateMethods extends CheckboxGroupPrivateMethods { }

export type VxeCheckboxGroupEmits = []

export namespace VxeCheckboxGroupDefines {
  export interface CheckboxGroupEventParams extends VxeComponentEvent {
    $checkboxGroup: VxeCheckboxGroupConstructor
  }
}

export type VxeCheckboxGroupEventProps = {}

export interface VxeCheckboxGroupListeners { }

export namespace VxeCheckboxGroupEvents { }

export namespace VxeCheckboxGroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeCheckboxGroupSlots {
  default: (params: VxeCheckboxGroupSlotTypes.DefaultSlotParams) => any
}

export const CheckboxGroup: typeof VxeCheckboxGroup
export default VxeCheckboxGroup
