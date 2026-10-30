import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams } from '@vxe-ui/core'

/* eslint-disable no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeStepItem: DefineVxeComponentApp<VxeStepItemProps, VxeStepItemEventProps, VxeStepItemSlots, VxeStepItemMethods>
export type VxeStepItemComponent = DefineVxeComponentOptions<VxeStepItemProps>

export type VxeStepItemInstance = DefineVxeComponentInstance<
  {},
  VxeStepItemProps,
  VxeStepItemPrivateComputed,
  VxeStepItemMethods
>

export type VxeStepItemConstructor = VxeStepItemInstance

export interface StepItemPrivateRef {
}
export interface VxeStepItemPrivateRef extends StepItemPrivateRef {}

export namespace VxeStepItemPropTypes {
  export type Title = string | number
  export type Content = string | number
  export type Status = 'default' | 'process' | 'finish' | 'error'
}

export interface VxeStepItemProps {
  title?: VxeStepItemPropTypes.Title
  content?: VxeStepItemPropTypes.Content
  status?: VxeStepItemPropTypes.Status
}

export interface StepItemPrivateComputed {}
export interface VxeStepItemPrivateComputed extends StepItemPrivateComputed {}

export interface StepItemMethods {}
export interface VxeStepItemMethods extends StepItemMethods {}

export interface StepItemPrivateMethods {}
export interface VxeStepItemPrivateMethods extends StepItemPrivateMethods {}

export type VxeStepItemEmits = []

export namespace VxeStepItemDefines {
  export interface StepItemEventParams extends VxeComponentEventParams {
    $stepItem: VxeStepItemConstructor
  }
}

export type VxeStepItemEventProps = {}

export interface VxeStepItemListeners {}

export namespace VxeStepItemSlotTypes {
  export interface DefaultSlotParams {
    item: any
  }
  export interface TitleSlotParams {
    item: any
  }
}

export interface VxeStepItemSlots {
  default?: (params: VxeStepItemSlotTypes.DefaultSlotParams) => any
  title?: (params: VxeStepItemSlotTypes.TitleSlotParams) => any
}

export const StepItem: typeof VxeStepItem
export default VxeStepItem
