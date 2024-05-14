import { RenderFunction, SetupContext, Ref, ComponentPublicInstance } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAnchorLink: defineVxeComponent<VxeAnchorLinkProps, VxeAnchorLinkEventProps>

export type VxeAnchorLinkInstance = ComponentPublicInstance<VxeAnchorLinkProps, VxeAnchorLinkConstructor>

export interface VxeAnchorLinkConstructor extends VxeComponentBase, VxeAnchorLinkMethods {
  props: VxeAnchorLinkProps
  context: SetupContext<VxeAnchorLinkEmits>
  reactData: AnchorLinkReactData
  linkConfig: VxeAnchorLinkDefines.LinkConfig
  getRefMaps(): AnchorLinkPrivateRef
  getComputeMaps(): AnchorLinkPrivateComputed
  renderVN: RenderFunction
}

export interface AnchorLinkPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeAnchorLinkPrivateRef extends AnchorLinkPrivateRef { }

export namespace VxeAnchorLinkPropTypes {
  export type Content = string | number
  export type Title = string | number
  export type Href = string
}

export type VxeAnchorLinkProps = {
  content?: VxeAnchorLinkPropTypes.Content
  title?: VxeAnchorLinkPropTypes.Title
  href?: VxeAnchorLinkPropTypes.Href

  children?: VxeAnchorLinkProps[]
}

export interface AnchorLinkPrivateComputed {
}
export interface VxeAnchorLinkPrivateComputed extends AnchorLinkPrivateComputed { }

export interface AnchorLinkReactData {
}

export interface AnchorLinkMethods {
}
export interface VxeAnchorLinkMethods extends AnchorLinkMethods { }

export interface AnchorLinkPrivateMethods { }
export interface VxeAnchorLinkPrivateMethods extends AnchorLinkPrivateMethods { }

export type VxeAnchorLinkEmits = []

export namespace VxeAnchorLinkDefines {
  export interface LinkConfig {
    id: string
    href: VxeAnchorPropTypes.ModelValue | undefined
    children: StaticLinkObj[]
  }

  export interface AnchorLinkEventParams extends VxeComponentEvent {
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
  default: (params: VxeAnchorLinkSlotTypes.DefaultSlotParams) => any
  /**
   * 自定义子项模板
   */
  sub: (params: VxeAnchorLinkSlotTypes.SubSlotParams) => any
}

export const AnchorLink: typeof VxeAnchorLink
export default VxeAnchorLink
