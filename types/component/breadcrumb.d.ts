import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeBreadcrumb: defineVxeComponent<VxeBreadcrumbProps, VxeBreadcrumbEventProps>

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

export interface VxeBreadcrumbSlots {
}

export default VxeBreadcrumb
