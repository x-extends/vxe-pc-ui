import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBreadcrumbItem: DefineVxeComponentApp<VxeBreadcrumbItemProps, VxeBreadcrumbItemEventProps, VxeBreadcrumbItemSlots>
export type VxeBreadcrumbItemComponent = DefineVxeComponentOptions<VxeBreadcrumbItemProps>

export type VxeBreadcrumbItemInstance = DefineVxeComponentInstance<{
  reactData: BreadcrumbItemReactData
}, VxeBreadcrumbItemProps, BreadcrumbItemPrivateComputed, BreadcrumbItemMethods>

export type VxeBreadcrumbItemConstructor = VxeBreadcrumbItemInstance

export interface BreadcrumbItemPrivateRef {
}
export interface VxeBreadcrumbItemPrivateRef extends BreadcrumbItemPrivateRef { }

export namespace VxeBreadcrumbItemPropTypes {
  export type Title = string
  export type RouterLink = {
    path?: string
    name?: string | number | null
    query?: any
    params?: any
  }
}

export interface VxeBreadcrumbItemProps {
  title?: VxeBreadcrumbItemPropTypes.Title
  routerLink?: VxeBreadcrumbItemPropTypes.RouterLink
}

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
  export interface BreadcrumbItemEventParams extends VxeComponentEventParams {
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
  default?: (params: VxeBreadcrumbItemSlotTypes.DefaultSlotParams) => any
}

export const BreadcrumbItem: typeof VxeBreadcrumbItem
export default VxeBreadcrumbItem
