import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../util'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeLayoutContainer: defineVxeComponent<VxeLayoutContainerProps, VxeLayoutContainerEventProps>

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

export interface VxeLayoutContainerSlots {
}

export default VxeLayoutContainer
