import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTextarea: defineVxeComponent<VxeTextareaProps, VxeTextareaEventProps>

export type VxeTextareaInstance = ComponentPublicInstance<VxeTextareaProps, VxeTextareaConstructor>

export interface VxeTextareaConstructor extends VxeComponentBase, VxeTextareaMethods {
  props: VxeTextareaProps
  context: SetupContext<VxeTextareaEmits>
  reactData: TextareaReactData
  getRefMaps(): TextareaPrivateRef
  getComputeMaps(): TextareaPrivateComputed
  renderVN: RenderFunction
}

export interface TextareaPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTextareaPrivateRef extends TextareaPrivateRef { }

export namespace VxeTextareaPropTypes {
}

export type VxeTextareaProps = {}

export interface TextareaPrivateComputed {
}
export interface VxeTextareaPrivateComputed extends TextareaPrivateComputed { }

export interface TextareaReactData {
}

export interface TextareaMethods {
}
export interface VxeTextareaMethods extends TextareaMethods { }

export interface TextareaPrivateMethods { }
export interface VxeTextareaPrivateMethods extends TextareaPrivateMethods { }

export type VxeTextareaEmits = []

export namespace VxeTextareaDefines {
  export interface TextareaEventParams extends VxeComponentEvent {
    $textarea: VxeTextareaConstructor
  }
}

export type VxeTextareaEventProps = {}

export interface VxeTextareaListeners { }

export namespace VxeTextareaEvents { }

export namespace VxeTextareaSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTextareaSlots {
  default: (params: VxeTextareaSlotTypes.DefaultSlotParams) => any
}

export const Textarea: typeof VxeTextarea
export default VxeTextarea
