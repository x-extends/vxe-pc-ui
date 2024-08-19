import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutContainer: defineVxeComponent<VxeLayoutContainerProps, VxeLayoutContainerEventProps, VxeLayoutContainerSlots>
export type VxeLayoutContainerComponent = DefineComponent<VxeLayoutContainerProps & VxeLayoutContainerEventProps>

export type VxeLayoutContainerInstance = ComponentPublicInstance<VxeLayoutContainerProps, VxeLayoutContainerConstructor>

export interface VxeLayoutContainerConstructor extends VxeComponentBaseOptions, VxeLayoutContainerMethods {
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
  export type Vertical = boolean
}

export type VxeLayoutContainerProps = {
  vertical?: VxeLayoutContainerPropTypes.Vertical
}

export interface LayoutContainerPrivateComputed {
}
export interface VxeLayoutContainerPrivateComputed extends LayoutContainerPrivateComputed { }

export interface LayoutContainerReactData {
}

export interface LayoutContainerMethods {
  dispatchEvent(type: ValueOf<VxeLayoutContainerEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutContainerMethods extends LayoutContainerMethods { }

export interface LayoutContainerPrivateMethods { }
export interface VxeLayoutContainerPrivateMethods extends LayoutContainerPrivateMethods { }

export type VxeLayoutContainerEmits = []

export namespace VxeLayoutContainerDefines {
  export interface LayoutContainerEventParams extends VxeComponentEventParams {
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
