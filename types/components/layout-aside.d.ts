import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutAside: defineVxeComponent<VxeLayoutAsideProps, VxeLayoutAsideEventProps>

export type VxeLayoutAsideInstance = ComponentPublicInstance<VxeLayoutAsideProps, VxeLayoutAsideConstructor>

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
  export type Width = string | number
  export type Collapsed = boolean
  export type CollapseWidth = string | number
  export type Padding = boolean
}

export type VxeLayoutAsideProps = {
  width?: VxeLayoutAsidePropTypes.Width
  collapsed?: VxeLayoutAsidePropTypes.Collapsed
  collapseWidth?: VxeLayoutAsidePropTypes.CollapseWidth
  padding?: VxeLayoutAsidePropTypes.Padding
}

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

export namespace VxeLayoutAsideSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutAsideSlots {
  default: (params: VxeLayoutAsideSlotTypes.DefaultSlotParams) => any
}

export const LayoutAside: typeof VxeLayoutAside
export default VxeLayoutAside
