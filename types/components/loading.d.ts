import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeLoading: defineVxeComponent<VxeLoadingProps, VxeLoadingEventProps>
export type VxeLoadingComponent = DefineComponent<VxeLoadingProps, VxeLoadingEmits>

export type VxeLoadingInstance = ComponentPublicInstance<VxeLoadingProps, VxeLoadingConstructor>

export interface VxeLoadingConstructor extends VxeComponentBase, VxeLoadingMethods {
  props: VxeLoadingProps
  context: SetupContext<VxeLoadingEmits>
  reactData: LoadingReactData
  getRefMaps(): LoadingPrivateRef
  getComputeMaps(): LoadingPrivateComputed
  renderVN: RenderFunction
}

export interface LoadingPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeLoadingPrivateRef extends LoadingPrivateRef { }

export namespace VxeLoadingPropTypes {
  export type ModelValue = boolean
  export type Icon = string
  export type Text = string
}

export type VxeLoadingProps = {
  modelValue?: VxeLoadingPropTypes.ModelValue
  icon?: VxeLoadingPropTypes.Icon
  text?: VxeLoadingPropTypes.Text
}

export interface LoadingPrivateComputed {
}
export interface VxeLoadingPrivateComputed extends LoadingPrivateComputed { }

export interface LoadingReactData {
}

export interface LoadingMethods {
}
export interface VxeLoadingMethods extends LoadingMethods { }

export interface LoadingPrivateMethods { }
export interface VxeLoadingPrivateMethods extends LoadingPrivateMethods { }

export type VxeLoadingEmits = []

export namespace VxeLoadingDefines {
  export interface LoadingEventParams extends VxeComponentEvent {
    $loading: VxeLoadingConstructor
  }
}

export type VxeLoadingEventProps = {}

export interface VxeLoadingListeners { }

export namespace VxeLoadingEvents { }

export namespace VxeLoadingSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeLoadingSlots {
  default: (params: VxeLoadingSlotTypes.DefaultSlotParams) => any
}

export const Loading: typeof VxeLoading
export default VxeLoading
