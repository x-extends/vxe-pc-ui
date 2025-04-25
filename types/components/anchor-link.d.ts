import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeAnchorPropTypes } from './anchor'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAnchorLink: DefineVxeComponentApp<VxeAnchorLinkProps, VxeAnchorLinkEventProps, VxeAnchorLinkSlots, VxeAnchorLinkMethods>
export type VxeAnchorLinkComponent = DefineVxeComponentOptions<VxeAnchorLinkProps>

export type VxeAnchorLinkInstance = DefineVxeComponentInstance<{
  linkConfig: VxeAnchorLinkDefines.LinkConfig
  reactData: AnchorLinkReactData
}, VxeAnchorLinkProps, VxeAnchorLinkPrivateComputed, VxeAnchorLinkMethods>

export type VxeAnchorLinkConstructor = VxeAnchorLinkInstance

export interface AnchorLinkPrivateRef {
}
export type VxeAnchorLinkPrivateRef = AnchorLinkPrivateRef

export namespace VxeAnchorLinkPropTypes {
  export type Content = string | number
  export type Title = string | number
  export type Href = string
}

export interface VxeAnchorLinkProps {
  content?: VxeAnchorLinkPropTypes.Content
  title?: VxeAnchorLinkPropTypes.Title
  href?: VxeAnchorLinkPropTypes.Href

  children?: VxeAnchorLinkProps[]
}

export interface AnchorLinkPrivateComputed {
}
export type VxeAnchorLinkPrivateComputed = AnchorLinkPrivateComputed

export interface AnchorLinkReactData {
}

export interface AnchorLinkMethods {
}
export type VxeAnchorLinkMethods = AnchorLinkMethods

export interface AnchorLinkPrivateMethods { }
export type VxeAnchorLinkPrivateMethods = AnchorLinkPrivateMethods

export type VxeAnchorLinkEmits = []

export namespace VxeAnchorLinkDefines {
  export interface LinkConfig {
    id: string
    href: VxeAnchorPropTypes.ModelValue | undefined
    children: LinkConfig[]
  }

  export interface AnchorLinkEventParams extends VxeComponentEventParams {
    $anchorLink: VxeAnchorLinkConstructor
  }
}

export type VxeAnchorLinkEventProps = {}

export interface VxeAnchorLinkListeners { }

export namespace VxeAnchorLinkEvents { }

export namespace VxeAnchorLinkSlotTypes {
  export interface DefaultSlotParams {}
  export interface SubSlotParams {}
}
export interface VxeAnchorLinkSlots {
  /**
   * 自定义显示内容模板
   */
  default?: (params: VxeAnchorLinkSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义子项模板
   */
  sub?: (params: VxeAnchorLinkSlotTypes.SubSlotParams) => any
}

export const AnchorLink: typeof VxeAnchorLink
export default VxeAnchorLink
