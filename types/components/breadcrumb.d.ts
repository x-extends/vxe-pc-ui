import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeBreadcrumbItemProps } from './breadcrumb-item'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBreadcrumb: defineVxeComponent<VxeBreadcrumbProps, VxeBreadcrumbEventProps, VxeBreadcrumbSlots>
export type VxeBreadcrumbComponent = DefineComponent<VxeBreadcrumbProps, VxeBreadcrumbEmits>

export type VxeBreadcrumbInstance = ComponentPublicInstance<VxeBreadcrumbProps, VxeBreadcrumbConstructor>

export interface VxeBreadcrumbConstructor extends VxeComponentBaseOptions, VxeBreadcrumbMethods {
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
  export type Options = VxeBreadcrumbItemProps[]
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
  dispatchEvent(type: ValueOf<VxeBreadcrumbEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeBreadcrumbMethods extends BreadcrumbMethods { }

export interface BreadcrumbPrivateMethods {
  handleClickLink(evnt: KeyboardEvent, item?: VxeBreadcrumbItemProps): void
 }
export interface VxeBreadcrumbPrivateMethods extends BreadcrumbPrivateMethods { }

export type VxeBreadcrumbEmits = [
  'click'
]

export namespace VxeBreadcrumbDefines {
  export interface BreadcrumbEventParams extends VxeComponentEventParams {
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
