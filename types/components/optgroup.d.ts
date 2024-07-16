import { RenderFunction, SetupContext, Ref, ComponentPublicInstance, DefineComponent } from 'vue'
import { defineVxeComponent, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeOptionPropTypes } from './option'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeOptgroup: defineVxeComponent<VxeOptgroupProps, VxeOptgroupEventProps, VxeOptgroupSlots>
export type VxeOptgroupComponent = DefineComponent<VxeOptgroupProps, VxeOptgroupEmits>

export type VxeOptgroupInstance = ComponentPublicInstance<VxeOptgroupProps, VxeOptgroupConstructor>

export interface VxeOptgroupConstructor extends VxeComponentBaseOptions, VxeOptgroupMethods {
  props: VxeOptgroupProps
  context: SetupContext<VxeOptgroupEmits>
  reactData: OptgroupReactData
  getRefMaps(): OptgroupPrivateRef
  getComputeMaps(): OptgroupPrivateComputed
  renderVN: RenderFunction
}

export interface OptgroupPrivateRef {
  refElem: Ref<HTMLDivElement | undefined>
}
export interface VxeOptgroupPrivateRef extends OptgroupPrivateRef { }

export namespace VxeOptgroupPropTypes {
}

export type VxeOptgroupProps = {
  /**
   * 显示内容
   */
  label?: VxeOptionPropTypes.Label
  /**
   * 是否禁用
   */
  visible?: VxeOptionPropTypes.Visible
  className?: VxeOptionPropTypes.ClassName
  /**
   * 是否禁用
   */
  disabled?: VxeOptionPropTypes.Disabled
}

export interface OptgroupPrivateComputed {
}
export interface VxeOptgroupPrivateComputed extends OptgroupPrivateComputed { }

export interface OptgroupReactData {
}

export interface OptgroupMethods {
}
export interface VxeOptgroupMethods extends OptgroupMethods { }

export interface OptgroupPrivateMethods { }
export interface VxeOptgroupPrivateMethods extends OptgroupPrivateMethods { }

export type VxeOptgroupEmits = []

export namespace VxeOptgroupDefines {
  export interface OptgroupEventParams extends VxeComponentEventParams {
    $optgroup: VxeOptgroupConstructor
  }
}

export type VxeOptgroupEventProps = {}

export interface VxeOptgroupListeners { }

export namespace VxeOptgroupEvents { }

export namespace VxeOptgroupSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeOptgroupSlots {
  default: (params: VxeOptgroupSlotTypes.DefaultSlotParams) => any
}

export const Optgroup: typeof VxeOptgroup
export default VxeOptgroup
