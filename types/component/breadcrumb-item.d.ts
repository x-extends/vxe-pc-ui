import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeBreadcrumbItem: defineVxeComponent<VxeBreadcrumbItemProps, VxeBreadcrumbItemEventProps>

export interface VxeBreadcrumbItemConstructor extends VxeComponentBase, VxeBreadcrumbItemMethods {
  props: VxeBreadcrumbItemProps
  context: SetupContext<VxeBreadcrumbItemEmits>
  reactData: BreadcrumbItemReactData
  getRefMaps(): BreadcrumbItemPrivateRef
  getComputeMaps(): BreadcrumbItemPrivateComputed
  renderVN: RenderFunction
}

export interface BreadcrumbItemPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeBreadcrumbItemPrivateRef extends BreadcrumbItemPrivateRef { }

export namespace VxeBreadcrumbItemPropTypes {
}

export type VxeBreadcrumbItemProps = {}

export interface BreadcrumbItemPrivateComputed {
}
export interface VxeBreadcrumbItemPrivateComputed extends BreadcrumbItemPrivateComputed { }

export interface BreadcrumbItemReactData {
}

export interface BreadcrumbItemMethods {
}
export interface VxeBreadcrumbItemMethods extends BreadcrumbItemMethods { }

export interface BreadcrumbItemPrivateMethods { }
export interface VxeBreadcrumbItemPrivateMethods extends BreadcrumbItemPrivateMethods { }

export type VxeBreadcrumbItemEmits = []

export namespace VxeBreadcrumbItemDefines {
  export interface BreadcrumbItemEventParams extends VxeComponentEvent {
    $breadcrumbItem: VxeBreadcrumbItemConstructor
  }
}

export type VxeBreadcrumbItemEventProps = {}

export interface VxeBreadcrumbItemListeners { }

export namespace VxeBreadcrumbItemEvents { }

export interface VxeBreadcrumbItemSlots {
}

export default VxeBreadcrumbItem
