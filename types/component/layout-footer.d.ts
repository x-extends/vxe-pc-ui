import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeLayoutFooter: defineVxeComponent<VxeLayoutFooterProps, VxeLayoutFooterEventProps>

export interface VxeLayoutFooterConstructor extends VxeComponentBase, VxeLayoutFooterMethods {
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
}

export type VxeLayoutFooterProps = {}

export interface LayoutFooterPrivateComputed {
}
export interface VxeLayoutFooterPrivateComputed extends LayoutFooterPrivateComputed { }

export interface LayoutFooterReactData {
}

export interface LayoutFooterMethods {
}
export interface VxeLayoutFooterMethods extends LayoutFooterMethods { }

export interface LayoutFooterPrivateMethods { }
export interface VxeLayoutFooterPrivateMethods extends LayoutFooterPrivateMethods { }

export type VxeLayoutFooterEmits = []

export namespace VxeLayoutFooterDefines {
  export interface LayoutFooterEventParams extends VxeComponentEvent {
    $layoutFooter: VxeLayoutFooterConstructor
  }
}

export type VxeLayoutFooterEventProps = {}

export interface VxeLayoutFooterListeners { }

export namespace VxeLayoutFooterEvents { }

export interface VxeLayoutFooterSlots {
}

export default VxeLayoutFooter
