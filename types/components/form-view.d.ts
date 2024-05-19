import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBase, VxeComponentEvent } from '../tool'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormView: defineVxeComponent<VxeFormViewProps, VxeFormViewEventProps>
export type VxeFormViewComponent = DefineComponent<VxeFormViewProps, VxeFormViewEmits>

export type VxeFormViewInstance = ComponentPublicInstance<VxeFormViewProps, VxeFormViewConstructor>

export interface VxeFormViewConstructor extends VxeComponentBase, VxeFormViewMethods {
  props: VxeFormViewProps
  context: SetupContext<VxeFormViewEmits>
  reactData: FormViewReactData
  getRefMaps(): FormViewPrivateRef
  getComputeMaps(): FormViewPrivateComputed
  renderVN: RenderFunction
}

export interface FormViewPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeFormViewPrivateRef extends FormViewPrivateRef { }

export namespace VxeFormViewPropTypes {
}

export type VxeFormViewProps = {
}

export interface FormViewPrivateComputed {
}
export interface VxeFormViewPrivateComputed extends FormViewPrivateComputed { }

export interface FormViewReactData {
}

export interface FormViewMethods {
}
export interface VxeFormViewMethods extends FormViewMethods { }

export interface FormViewPrivateMethods { }
export interface VxeFormViewPrivateMethods extends FormViewPrivateMethods { }

export type VxeFormViewEmits = []

export namespace VxeFormViewDefines {
  export interface FormViewEventParams extends VxeComponentEvent {
    $formView: VxeFormViewConstructor
  }
}

export type VxeFormViewEventProps = {}

export interface VxeFormViewListeners { }

export namespace VxeFormViewEvents { }

export namespace VxeFormViewSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeFormViewSlots {
  default: (params: VxeFormViewSlotTypes.DefaultSlotParams) => any
}

export const FormView: typeof VxeFormView
export default VxeFormView
