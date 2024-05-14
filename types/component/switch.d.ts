import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeSwitch: defineVxeComponent<VxeSwitchProps, VxeSwitchEventProps>

export type VxeSwitchInstance = ComponentPublicInstance<VxeSwitchProps, VxeSwitchConstructor>

export interface VxeSwitchConstructor extends VxeComponentBase, VxeSwitchMethods {
  props: VxeSwitchProps
  context: SetupContext<VxeSwitchEmits>
  reactData: SwitchReactData
  getRefMaps(): SwitchPrivateRef
  getComputeMaps(): SwitchPrivateComputed
  renderVN: RenderFunction
}

export interface SwitchPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeSwitchPrivateRef extends SwitchPrivateRef { }

export namespace VxeSwitchPropTypes {
}

export type VxeSwitchProps = {}

export interface SwitchPrivateComputed {
}
export interface VxeSwitchPrivateComputed extends SwitchPrivateComputed { }

export interface SwitchReactData {
}

export interface SwitchMethods {
}
export interface VxeSwitchMethods extends SwitchMethods { }

export interface SwitchPrivateMethods { }
export interface VxeSwitchPrivateMethods extends SwitchPrivateMethods { }

export type VxeSwitchEmits = []

export namespace VxeSwitchDefines {
  export interface SwitchEventParams extends VxeComponentEvent {
    $switch: VxeSwitchConstructor
  }
}

export type VxeSwitchEventProps = {}

export interface VxeSwitchListeners { }

export namespace VxeSwitchEvents { }

export namespace VxeSwitchSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeSwitchSlots {
  default: (params: VxeSwitchSlotTypes.DefaultSlotParams) => any
}

export const Switch: typeof VxeSwitch
export default VxeSwitch
