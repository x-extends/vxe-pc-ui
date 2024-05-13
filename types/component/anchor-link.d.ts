import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeAnchorLink: defineVxeComponent<VxeAnchorLinkProps, VxeAnchorLinkEventProps>

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

export interface VxeAnchorLinkSlots {
}

export default VxeAnchorLink
