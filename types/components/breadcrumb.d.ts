import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBreadcrumb: defineVxeComponent<VxeBreadcrumbProps, VxeBreadcrumbEventProps>
export type VxeBreadcrumbComponent = DefineComponent<VxeBreadcrumbProps, VxeBreadcrumbEmits>

export type VxeBreadcrumbInstance = ComponentPublicInstance<VxeBreadcrumbProps, VxeBreadcrumbConstructor>

export interface VxeBreadcrumbConstructor extends VxeComponentBase, VxeBreadcrumbMethods {
  props: VxeBreadcrumbProps
  context: SetupContext<VxeBreadcrumbEmits>
  reactData: BreadcrumbReactData
  getRefMaps(): BreadcrumbPrivateRef
  getComputeMaps(): BreadcrumbPrivateComputed
  renderVN: RenderFunction
}

export interface BreadcrumbPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeBreadcrumbPrivateRef extends BreadcrumbPrivateRef { }

export namespace VxeBreadcrumbPropTypes {
  export type Separator = string
}

export type VxeBreadcrumbProps = {
  separator?: VxeBreadcrumbPropTypes.Separator
}

export interface BreadcrumbPrivateComputed {
}
export interface VxeBreadcrumbPrivateComputed extends BreadcrumbPrivateComputed { }

export interface BreadcrumbReactData {
}

export interface BreadcrumbMethods {
}
export interface VxeBreadcrumbMethods extends BreadcrumbMethods { }

export interface BreadcrumbPrivateMethods { }
export interface VxeBreadcrumbPrivateMethods extends BreadcrumbPrivateMethods { }

export type VxeBreadcrumbEmits = []

export namespace VxeBreadcrumbDefines {
  export interface BreadcrumbEventParams extends VxeComponentEvent {
    $breadcrumb: VxeBreadcrumbConstructor
  }
}

export type VxeBreadcrumbEventProps = {}

export interface VxeBreadcrumbListeners { }

export namespace VxeBreadcrumbEvents { }

export namespace VxeBreadcrumbSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeBreadcrumbSlots {
  default: (params: VxeBreadcrumbSlotTypes.DefaultSlotParams) => any
}

export const Breadcrumb: typeof VxeBreadcrumb
export default VxeBreadcrumb
