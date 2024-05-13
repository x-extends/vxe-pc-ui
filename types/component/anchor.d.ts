import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent, ValueOf } from '../tool'
import { VxeAnchorLinkProps, VxeAnchorLinkPropTypes, VxeAnchorLinkDefines } from './anchor-link'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeAnchor: defineVxeComponent<VxeAnchorProps, VxeAnchorEventProps>

export interface VxeAnchorConstructor extends VxeComponentBase, VxeAnchorMethods {
  props: VxeAnchorProps
  context: SetupContext<VxeAnchorEmits>
  reactData: AnchorReactData
  getRefMaps(): AnchorPrivateRef
  getComputeMaps(): AnchorPrivateComputed
  renderVN: RenderFunction
}

export interface AnchorPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeAnchorPrivateRef extends AnchorPrivateRef { }

export namespace VxeAnchorPropTypes {
  export type ModelValue = string | null
  export type Options = VxeAnchorLinkProps[]
  export type Container = string | HTMLElement | ((params: {
    $anchor: VxeAnchorConstructor
  }) => HTMLElement)
  export type ShowMarker = boolean
}

export type VxeAnchorProps = {
  modelValue?: VxeAnchorPropTypes.ModelValue
  options?: VxeAnchorPropTypes.Options
  container?: VxeAnchorPropTypes.Container
  showMarker?: VxeAnchorPropTypes.ShowMarker
}

export interface AnchorPrivateComputed {
}
export interface VxeAnchorPrivateComputed extends AnchorPrivateComputed { }

export interface AnchorReactData {
  activeHref: VxeAnchorPropTypes.ModelValue | undefined
  staticLinks: VxeAnchorLinkDefines.LinkConfig[]
}

export interface AnchorMethods {
  dispatchEvent(type: ValueOf<VxeAnchorEmits>, params: any, evnt: Event): void
}
export interface VxeAnchorMethods extends AnchorMethods { }

export interface AnchorPrivateMethods {
  handleClickLink(evnt: KeyboardEvent, href?: VxeAnchorLinkPropTypes.Href)
}
export interface VxeAnchorPrivateMethods extends AnchorPrivateMethods { }

export type VxeAnchorEmits = [
  'update:modelValue',
  'change',
  'click'
]

export namespace VxeAnchorDefines {
  export interface AnchorEventParams extends VxeComponentEvent {
    $anchor: VxeAnchorConstructor
  }
}

export type VxeAnchorEventProps = {}

export interface VxeAnchorListeners { }

export namespace VxeAnchorEvents { }

export interface VxeAnchorSlots {
}

export default VxeAnchor
