import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'
import { VxeFormItemProps } from './form-item'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeFormGroup: DefineVxeComponentApp<VxeFormGroupProps, VxeFormGroupEventProps, VxeFormGroupSlots, VxeFormGroupMethods>
export type VxeFormGroupComponent = DefineVxeComponentOptions<VxeFormGroupProps>

export type VxeFormGroupInstance = DefineVxeComponentInstance<{
  reactData: FormGroupReactData
}, VxeFormGroupProps, VxeFormGroupPrivateComputed, VxeFormGroupMethods>

export type VxeFormGroupConstructor = VxeFormGroupInstance

export interface FormGroupPrivateRef {
}
export interface VxeFormGroupPrivateRef extends FormGroupPrivateRef { }

export namespace VxeFormGroupPropTypes {
}

export interface VxeFormGroupProps extends VxeFormItemProps {}

export interface FormGroupPrivateComputed {
}
export interface VxeFormGroupPrivateComputed extends FormGroupPrivateComputed { }

export interface FormGroupReactData {
}

export interface FormGroupMethods {
}
export interface VxeFormGroupMethods extends FormGroupMethods { }

export interface FormGroupPrivateMethods { }
export interface VxeFormGroupPrivateMethods extends FormGroupPrivateMethods { }

export type VxeFormGroupEmits = []

export namespace VxeFormGroupDefines {
  export interface FormGroupEventParams extends VxeComponentEventParams {
    $formGroup: VxeFormGroupConstructor
  }
}

export type VxeFormGroupEventProps = {}

export interface VxeFormGroupListeners { }

export namespace VxeFormGroupEvents { }

export namespace VxeFormGroupSlotTypes {
  export interface DefaultSlotParams {
    [key: string]: any
  }
}

export interface VxeFormGroupSlots {
  default: (params: VxeFormGroupSlotTypes.DefaultSlotParams) => any
}

export const FormGroup: typeof VxeFormGroup
export default VxeFormGroup
