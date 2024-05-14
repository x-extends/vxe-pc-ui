import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeOption: defineVxeComponent<VxeOptionProps, VxeOptionEventProps>

export type VxeOptionInstance = ComponentPublicInstance<VxeOptionProps, VxeOptionConstructor>

export interface VxeOptionConstructor extends VxeComponentBase, VxeOptionMethods {
  props: VxeOptionProps
  context: SetupContext<VxeOptionEmits>
  reactData: OptionReactData
  getRefMaps(): OptionPrivateRef
  getComputeMaps(): OptionPrivateComputed
  renderVN: RenderFunction
}

export interface OptionPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeOptionPrivateRef extends OptionPrivateRef { }

export namespace VxeOptionPropTypes {
}

export type VxeOptionProps = {}

export interface OptionPrivateComputed {
}
export interface VxeOptionPrivateComputed extends OptionPrivateComputed { }

export interface OptionReactData {
}

export interface OptionMethods {
}
export interface VxeOptionMethods extends OptionMethods { }

export interface OptionPrivateMethods { }
export interface VxeOptionPrivateMethods extends OptionPrivateMethods { }

export type VxeOptionEmits = []

export namespace VxeOptionDefines {
  export interface OptionEventParams extends VxeComponentEvent {
    $option: VxeOptionConstructor
  }
}

export type VxeOptionEventProps = {}

export interface VxeOptionListeners { }

export namespace VxeOptionEvents { }

export namespace VxeOptionSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeOptionSlots {
  default: (params: VxeOptionSlotTypes.DefaultSlotParams) => any
}

export const Option: typeof VxeOption
export default VxeOption
