import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutAside: defineVxeComponent<VxeLayoutAsideProps, VxeLayoutAsideEventProps, VxeLayoutAsideSlots>
export type VxeLayoutAsideComponent = DefineComponent<VxeLayoutAsideProps & VxeLayoutAsideEventProps>

export type VxeLayoutAsideInstance = ComponentPublicInstance<VxeLayoutAsideProps, VxeLayoutAsideConstructor>

export interface VxeLayoutAsideConstructor extends VxeComponentBaseOptions, VxeLayoutAsideMethods {
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
  export type Loading = boolean
  export type Padding = boolean
}

export type VxeLayoutAsideProps = {
  width?: VxeLayoutAsidePropTypes.Width
  collapsed?: VxeLayoutAsidePropTypes.Collapsed
  collapseWidth?: VxeLayoutAsidePropTypes.CollapseWidth
  loading?: VxeLayoutAsidePropTypes.Loading
  padding?: VxeLayoutAsidePropTypes.Padding
}

export interface LayoutAsidePrivateComputed {
}
export interface VxeLayoutAsidePrivateComputed extends LayoutAsidePrivateComputed { }

export interface LayoutAsideReactData {}

export interface LayoutAsideMethods {
  dispatchEvent(type: ValueOf<VxeLayoutAsideEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutAsideMethods extends LayoutAsideMethods { }

export interface LayoutAsidePrivateMethods { }
export interface VxeLayoutAsidePrivateMethods extends LayoutAsidePrivateMethods { }

export type VxeLayoutAsideEmits = []

export namespace VxeLayoutAsideDefines {
  export interface LayoutAsideEventParams extends VxeComponentEventParams {
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
