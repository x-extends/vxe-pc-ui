import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutContainer: defineVxeComponent<VxeLayoutContainerProps, VxeLayoutContainerEventProps>

export type VxeLayoutContainerInstance = ComponentPublicInstance<VxeLayoutContainerProps, VxeLayoutContainerConstructor>

export interface VxeLayoutContainerConstructor extends VxeComponentBase, VxeLayoutContainerMethods {
  props: VxeLayoutContainerProps
  context: SetupContext<VxeLayoutContainerEmits>
  reactData: LayoutContainerReactData
  getRefMaps(): LayoutContainerPrivateRef
  getComputeMaps(): LayoutContainerPrivateComputed
  renderVN: RenderFunction
}

export interface LayoutContainerPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutContainerPrivateRef extends LayoutContainerPrivateRef { }

export namespace VxeLayoutContainerPropTypes {
}

export type VxeLayoutContainerProps = {}

export interface LayoutContainerPrivateComputed {
}
export interface VxeLayoutContainerPrivateComputed extends LayoutContainerPrivateComputed { }

export interface LayoutContainerReactData {
}

export interface LayoutContainerMethods {
}
export interface VxeLayoutContainerMethods extends LayoutContainerMethods { }

export interface LayoutContainerPrivateMethods { }
export interface VxeLayoutContainerPrivateMethods extends LayoutContainerPrivateMethods { }

export type VxeLayoutContainerEmits = []

export namespace VxeLayoutContainerDefines {
  export interface LayoutContainerEventParams extends VxeComponentEvent {
    $layoutContainer: VxeLayoutContainerConstructor
  }
}

export type VxeLayoutContainerEventProps = {}

export interface VxeLayoutContainerListeners { }

export namespace VxeLayoutContainerEvents { }

export namespace VxeLayoutContainerSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutContainerSlots {
  default: (params: VxeLayoutContainerSlotTypes.DefaultSlotParams) => any
}

export const LayoutContainer: typeof VxeLayoutContainer
export default VxeLayoutContainer
