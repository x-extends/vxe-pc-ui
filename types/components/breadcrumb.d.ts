import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, ValueOf } from '@vxe-ui/core'
import { VxeBreadcrumbItemProps } from './breadcrumb-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeBreadcrumb: DefineVxeComponentApp<VxeBreadcrumbProps, VxeBreadcrumbEventProps, VxeBreadcrumbSlots, VxeBreadcrumbMethods>
export type VxeBreadcrumbComponent = DefineVxeComponentOptions<VxeBreadcrumbProps>

export type VxeBreadcrumbInstance = DefineVxeComponentInstance<{
  reactData: BreadcrumbReactData
}, VxeBreadcrumbProps, VxeBreadcrumbPrivateComputed, VxeBreadcrumbMethods>

export type VxeBreadcrumbConstructor = VxeBreadcrumbInstance

export interface BreadcrumbPrivateRef {
}
export interface VxeBreadcrumbPrivateRef extends BreadcrumbPrivateRef { }

export namespace VxeBreadcrumbPropTypes {
  export type Separator = string
  export type Options = VxeBreadcrumbItemProps[]
}

export interface VxeBreadcrumbProps {
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
  handleClickLink(evnt: MouseEvent, item?: VxeBreadcrumbItemProps): void
 }
export interface VxeBreadcrumbPrivateMethods extends BreadcrumbPrivateMethods { }

export type VxeBreadcrumbEmits = [
  'click'
]

export namespace VxeBreadcrumbDefines {
  export interface BreadcrumbEventParams extends VxeComponentEventParams {
    $breadcrumb: VxeBreadcrumbConstructor
  }

  export interface ClickEventParams extends BreadcrumbEventParams {
    option: VxeBreadcrumbItemProps
  }
}

export type VxeBreadcrumbEventProps = {
  onClick?: VxeBreadcrumbEvents.Click
}

export interface VxeBreadcrumbListeners {
  click?: VxeBreadcrumbEvents.Click
}

export namespace VxeBreadcrumbEvents {
  export type Click = (params: VxeBreadcrumbDefines.ClickEventParams) => void
}

export namespace VxeBreadcrumbSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeBreadcrumbSlots {
  default?: (params: VxeBreadcrumbSlotTypes.DefaultSlotParams) => any
}

export const Breadcrumb: typeof VxeBreadcrumb
export default VxeBreadcrumb
