import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeOptionPropTypes } from './option'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeOptgroup: DefineVxeComponentApp<VxeOptgroupProps, VxeOptgroupEventProps, VxeOptgroupSlots>
export type VxeOptgroupComponent = DefineVxeComponentOptions<VxeOptgroupProps>

export type VxeOptgroupInstance = DefineVxeComponentInstance<{
  reactData: OptgroupReactData
}, VxeOptgroupProps, VxeOptgroupPrivateComputed, VxeOptgroupMethods>

export type VxeOptgroupConstructor = VxeOptgroupInstance

export interface OptgroupPrivateRef {
}
export interface VxeOptgroupPrivateRef extends OptgroupPrivateRef { }

export namespace VxeOptgroupPropTypes {
  export type Value = VxeOptionPropTypes.Value
  export type Label = VxeOptionPropTypes.Label
  export type Visible = VxeOptionPropTypes.Visible
  export type ClassName = VxeOptionPropTypes.ClassName
  export type Disabled = VxeOptionPropTypes.Disabled
  export type Slots = VxeOptionPropTypes.Slots
}

export interface VxeOptgroupProps {
  /**
   * 显示内容
   */
  label?: VxeOptgroupPropTypes.Label
  /**
   * 是否禁用
   */
  visible?: VxeOptgroupPropTypes.Visible
  className?: VxeOptgroupPropTypes.ClassName
  /**
   * 是否禁用
   */
  disabled?: VxeOptgroupPropTypes.Disabled
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
