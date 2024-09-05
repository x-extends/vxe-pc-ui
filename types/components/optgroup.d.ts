import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentBaseOptions, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeOptionPropTypes } from './option'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeOptgroup: DefineVxeComponentApp<VxeOptgroupProps, VxeOptgroupEventProps, VxeOptgroupSlots>
export type VxeOptgroupComponent = DefineVxeComponentOptions<VxeOptgroupProps, VxeOptgroupEventProps>

export type VxeOptgroupInstance = DefineVxeComponentInstance<VxeOptgroupProps, VxeOptgroupConstructor>

export interface VxeOptgroupConstructor extends VxeComponentBaseOptions, VxeOptgroupMethods {
  reactData: OptgroupReactData
}

export interface OptgroupPrivateRef {
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
  default?: (params: VxeOptgroupSlotTypes.DefaultSlotParams) => any
}

export const Optgroup: typeof VxeOptgroup
export default VxeOptgroup
