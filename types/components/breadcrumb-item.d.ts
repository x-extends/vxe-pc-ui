import { RenderFunction, SetupContext, Ref, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBreadcrumbItem: defineVxeComponent<VxeBreadcrumbItemProps, VxeBreadcrumbItemEventProps>
export type VxeBreadcrumbItemComponent = DefineComponent<VxeBreadcrumbItemProps, VxeBreadcrumbItemEmits>

export type VxeBreadcrumbItemInstance = ComponentPublicInstance<VxeBreadcrumbItemProps, VxeBreadcrumbItemConstructor>

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

export namespace VxeBreadcrumbItemSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeBreadcrumbItemSlots {
  /**
   * 自定义显示内容模板
   */
  default: (params: VxeBreadcrumbItemSlotTypes.DefaultSlotParams) => any
}

export const BreadcrumbItem: typeof VxeBreadcrumbItem
export default VxeBreadcrumbItem
