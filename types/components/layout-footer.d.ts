import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, VxeComponentAlignType, ValueOf } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLayoutFooter: defineVxeComponent<VxeLayoutFooterProps, VxeLayoutFooterEventProps, VxeLayoutFooterSlots>
export type VxeLayoutFooterComponent = DefineComponent<VxeLayoutFooterProps & VxeLayoutFooterEventProps>

export type VxeLayoutFooterInstance = ComponentPublicInstance<VxeLayoutFooterProps, VxeLayoutFooterConstructor>

export interface VxeLayoutFooterConstructor extends VxeComponentBaseOptions, VxeLayoutFooterMethods {
  props: VxeLayoutFooterProps
  context: SetupContext<VxeLayoutFooterEmits>
  reactData: LayoutFooterReactData
  getRefMaps(): LayoutFooterPrivateRef
  getComputeMaps(): LayoutFooterPrivateComputed
  renderVN: RenderFunction
}

export interface LayoutFooterPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutFooterPrivateRef extends LayoutFooterPrivateRef { }

export namespace VxeLayoutFooterPropTypes {
  export type Fixed = boolean
  export type Align = VxeComponentAlignType
}

export type VxeLayoutFooterProps = {
  fixed?: VxeLayoutFooterPropTypes.Fixed
  align?: VxeLayoutFooterPropTypes.Align
}

export interface LayoutFooterPrivateComputed {
}
export interface VxeLayoutFooterPrivateComputed extends LayoutFooterPrivateComputed { }

export interface LayoutFooterReactData {
}

export interface LayoutFooterMethods {
  dispatchEvent(type: ValueOf<VxeLayoutFooterEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLayoutFooterMethods extends LayoutFooterMethods { }

export interface LayoutFooterPrivateMethods { }
export interface VxeLayoutFooterPrivateMethods extends LayoutFooterPrivateMethods { }

export type VxeLayoutFooterEmits = []

export namespace VxeLayoutFooterDefines {
  export interface LayoutFooterEventParams extends VxeComponentEventParams {
    $layoutFooter: VxeLayoutFooterConstructor
  }
}

export type VxeLayoutFooterEventProps = {}

export interface VxeLayoutFooterListeners { }

export namespace VxeLayoutFooterEvents { }

export namespace VxeLayoutFooterSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLayoutFooterSlots {
  default: (params: VxeLayoutFooterSlotTypes.DefaultSlotParams) => any
}

export const LayoutFooter: typeof VxeLayoutFooter
export default VxeLayoutFooter
