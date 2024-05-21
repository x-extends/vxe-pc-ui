import { RenderFunction, SetupContext, Ref, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormGather: defineVxeComponent<VxeFormGatherProps, VxeFormGatherEventProps>
export type VxeFormGatherComponent = DefineComponent<VxeFormGatherProps, VxeFormGatherEmits>

export interface VxeFormGatherConstructor extends VxeComponentBaseOptions, VxeFormGatherMethods {
  props: VxeFormGatherProps
  context: SetupContext<VxeFormGatherEmits>
  reactData: FormGatherReactData
  getRefMaps(): FormGatherPrivateRef
  getComputeMaps(): FormGatherPrivateComputed
  renderVN: RenderFunction
}

export interface FormGatherPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeFormGatherPrivateRef extends FormGatherPrivateRef { }

export namespace VxeFormGatherPropTypes {
}

export type VxeFormGatherProps = {
  /**
   * 栅格占据的列数（共 24 分栏）
   */
  span?: VxeFormItemPropTypes.Span
  /**
   * 给表单项附加 className
   */
  className?: VxeFormItemPropTypes.ClassName
}

export interface FormGatherPrivateComputed {
}
export interface VxeFormGatherPrivateComputed extends FormGatherPrivateComputed { }

export interface FormGatherReactData {
}

export interface FormGatherMethods {
}
export interface VxeFormGatherMethods extends FormGatherMethods { }

export interface FormGatherPrivateMethods { }
export interface VxeFormGatherPrivateMethods extends FormGatherPrivateMethods { }

export type VxeFormGatherEmits = []

export namespace VxeFormGatherDefines {
  export interface FormGatherEventParams extends VxeComponentEventParams {
    $formGather: VxeFormGatherConstructor
  }
}

export type VxeFormGatherEventProps = {}

export interface VxeFormGatherListeners { }

export namespace VxeFormGatherEvents { }

export namespace VxeFormGatherSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxeFormGatherSlots {
  default: (params: VxeFormGatherSlotTypes.DefaultSlotParams) => any
}

export const FormGather: typeof VxeFormGather
export default VxeFormGather
