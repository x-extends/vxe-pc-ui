import { RenderFunction, SetupContext, Ref } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

declare const VxeLayoutBody: defineVxeComponent<VxeLayoutBodyProps, VxeLayoutBodyEventProps>

export interface VxeLayoutBodyConstructor extends VxeComponentBase, VxeLayoutBodyMethods {
  props: VxeLayoutBodyProps
  context: SetupContext<VxeLayoutBodyEmits>
  reactData: LayoutBodyReactData
  getRefMaps(): LayoutBodyPrivateRef
  getComputeMaps(): LayoutBodyPrivateComputed
  renderVN: RenderFunction
}

export interface LayoutBodyPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLayoutBodyPrivateRef extends LayoutBodyPrivateRef { }

export namespace VxeLayoutBodyPropTypes {
}

export type VxeLayoutBodyProps = {}

export interface LayoutBodyPrivateComputed {
}
export interface VxeLayoutBodyPrivateComputed extends LayoutBodyPrivateComputed { }

export interface LayoutBodyReactData {
}

export interface LayoutBodyMethods {
}
export interface VxeLayoutBodyMethods extends LayoutBodyMethods { }

export interface LayoutBodyPrivateMethods { }
export interface VxeLayoutBodyPrivateMethods extends LayoutBodyPrivateMethods { }

export type VxeLayoutBodyEmits = []

export namespace VxeLayoutBodyDefines {
  export interface LayoutBodyEventParams extends VxeComponentEvent {
    $layoutBody: VxeLayoutBodyConstructor
  }
}

export type VxeLayoutBodyEventProps = {}

export interface VxeLayoutBodyListeners { }

export namespace VxeLayoutBodyEvents { }

export interface VxeLayoutBodySlots {
}

export default VxeLayoutBody
