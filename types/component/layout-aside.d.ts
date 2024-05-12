import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../util'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeLayoutAside: defineVxeComponent<VxeLayoutAsideProps, VxeLayoutAsideEventProps>

export interface VxeLayoutAsideConstructor extends VxeComponentBase, VxeLayoutAsideMethods {
  props: VxeLayoutAsideProps
  context: SetupContext<VxeLayoutAsideEmits>
  reactData: LayoutAsideReactData
  getRefMaps(): LayoutAsidePrivateRef
  getComputeMaps(): LayoutAsidePrivateComputed
  renderVN: RenderFunction
}

export interface LayoutAsidePrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutAsidePrivateRef extends LayoutAsidePrivateRef { }

export namespace VxeLayoutAsidePropTypes {
}

export type VxeLayoutAsideProps = {}

export interface LayoutAsidePrivateComputed {
}
export interface VxeLayoutAsidePrivateComputed extends LayoutAsidePrivateComputed { }

export interface LayoutAsideReactData {}

export interface LayoutAsideMethods {
}
export interface VxeLayoutAsideMethods extends LayoutAsideMethods { }

export interface LayoutAsidePrivateMethods { }
export interface VxeLayoutAsidePrivateMethods extends LayoutAsidePrivateMethods { }

export type VxeLayoutAsideEmits = []

export namespace VxeLayoutAsideDefines {
  export interface LayoutAsideEventParams extends VxeComponentEvent {
    $layoutAside: VxeLayoutAsideConstructor
  }
}

export type VxeLayoutAsideEventProps = {}

export interface VxeLayoutAsideListeners { }

export namespace VxeLayoutAsideEvents { }

export interface VxeLayoutAsideSlots {
}

export default VxeLayoutAside
