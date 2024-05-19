import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeTreeSelect: defineVxeComponent<VxeTreeSelectProps, VxeTreeSelectEventProps>
export type VxeTreeSelectComponent = DefineComponent<VxeTreeSelectProps, VxeTreeSelectEmits>

export type VxeTreeSelectInstance = ComponentPublicInstance<VxeTreeSelectProps, VxeTreeSelectConstructor>

export interface VxeTreeSelectConstructor extends VxeComponentBase, VxeTreeSelectMethods {
  props: VxeTreeSelectProps
  context: SetupContext<VxeTreeSelectEmits>
  reactData: TreeSelectReactData
  getRefMaps(): TreeSelectPrivateRef
  getComputeMaps(): TreeSelectPrivateComputed
  renderVN: RenderFunction
}

export interface TreeSelectPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeTreeSelectPrivateRef extends TreeSelectPrivateRef { }

export namespace VxeTreeSelectPropTypes {
}

export type VxeTreeSelectProps = {
}

export interface TreeSelectPrivateComputed {
}
export interface VxeTreeSelectPrivateComputed extends TreeSelectPrivateComputed { }

export interface TreeSelectReactData {
}

export interface TreeSelectMethods {
}
export interface VxeTreeSelectMethods extends TreeSelectMethods { }

export interface TreeSelectPrivateMethods { }
export interface VxeTreeSelectPrivateMethods extends TreeSelectPrivateMethods { }

export type VxeTreeSelectEmits = []

export namespace VxeTreeSelectDefines {
  export interface TreeSelectEventParams extends VxeComponentEvent {
    $treeSelect: VxeTreeSelectConstructor
  }
}

export type VxeTreeSelectEventProps = {}

export interface VxeTreeSelectListeners { }

export namespace VxeTreeSelectEvents { }

export namespace VxeTreeSelectSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeTreeSelectSlots {
  default: (params: VxeTreeSelectSlotTypes.DefaultSlotParams) => any
}

export const TreeSelect: typeof VxeTreeSelect
export default VxeTreeSelect
