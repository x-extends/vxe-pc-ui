import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentPermissionCodeType, ValueOf, VxeComponentStatusType } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLink: DefineVxeComponentApp<VxeLinkProps, VxeLinkEventProps, VxeLinkSlots, VxeLinkMethods>
export type VxeLinkComponent = DefineVxeComponentOptions<VxeLinkProps>

export type VxeLinkInstance = DefineVxeComponentInstance<{
  reactData: LinkReactData
}, VxeLinkProps, VxeLinkPrivateComputed, VxeLinkMethods>

export type VxeLinkConstructor = VxeLinkInstance

export interface LinkPrivateRef {
}
export interface VxeLinkPrivateRef extends LinkPrivateRef { }

export namespace VxeLinkPropTypes {
  export type Href = null | string
  export type Target = null | '' | '_blank' | '_self' | '_parent' | '_top'
  export type Status = VxeComponentStatusType
  export type Title = string | number
  export type Icon = string
  export type Disabled = boolean
  export type RouterLink = {
    path?: string
    name?: string | number | null
    query?: any
    params?: any
    target?: null | '' | '_blank' | '_self' | '_parent' | '_top'
  }
  export type Underline = boolean
  export type PermissionCode = VxeComponentPermissionCodeType
  export type Content = string | number
  export type Size = VxeComponentSizeType
}

export interface VxeLinkProps {
  href?: VxeLinkPropTypes.Href
  target?: VxeLinkPropTypes.Target
  status?: VxeLinkPropTypes.Status
  disabled?: VxeLinkPropTypes.Disabled
  title?: VxeLinkPropTypes.Title
  icon?: VxeLinkPropTypes.Icon
  routerLink?: VxeLinkPropTypes.RouterLink
  underline?: VxeLinkPropTypes.Underline
  /**
   * 权限码
   */
  permissionCode?: VxeLinkPropTypes.PermissionCode
  content?: VxeLinkPropTypes.Content
  size?: VxeLinkPropTypes.Size
}

export interface LinkPrivateComputed {
}
export interface VxeLinkPrivateComputed extends LinkPrivateComputed { }

export interface LinkReactData {
}

export interface LinkMethods {
  dispatchEvent(type: ValueOf<VxeLinkEmits>, params: Record<string, any>, evnt: Event | null): void
}
export interface VxeLinkMethods extends LinkMethods { }

export interface LinkPrivateMethods { }
export interface VxeLinkPrivateMethods extends LinkPrivateMethods { }

export type VxeLinkEmits = [
  'click'
]

export namespace VxeLinkDefines {
  export interface LinkEventParams extends VxeComponentEventParams {
    $link: VxeLinkConstructor
  }

  export interface ClickEventParams extends LinkEventParams { }
}

export type VxeLinkEventProps = {
  onClick?: VxeLinkEvents.Click
}

export interface VxeLinkListeners {
  click?: VxeLinkEvents.Click
}

export namespace VxeLinkEvents {
  export type Click = (params: VxeLinkDefines.ClickEventParams) => void
}

export namespace VxeLinkSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLinkSlots {
  default?: (params: VxeLinkSlotTypes.DefaultSlotParams) => any
  icon?: (params: VxeLinkSlotTypes.DefaultSlotParams) => any
}

export const Link: typeof VxeLink
export default VxeLink
