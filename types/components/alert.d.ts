import { DefineVxeComponentApp, DefineVxeComponentOptions, DefineVxeComponentInstance, VxeComponentEventParams, VxeComponentSizeType, VxeComponentStatusType, ValueOf } from '@vxe-ui/core'

/* eslint-disable @typescript-eslint/no-empty-interface,no-use-before-define,@typescript-eslint/ban-types */

export declare const VxeAlert: DefineVxeComponentApp<VxeAlertProps, VxeAlertEventProps, VxeAlertSlots, VxeAlertMethods>
export type VxeAlertComponent = DefineVxeComponentOptions<VxeAlertProps>

export type VxeAlertInstance = DefineVxeComponentInstance<{
  reactData: AlertReactData
}, VxeAlertProps, VxeAlertPrivateComputed, VxeAlertMethods>

export type VxeAlertConstructor = VxeAlertInstance

export interface AlertPrivateRef {
}
export type VxeAlertPrivateRef = AlertPrivateRef

export namespace VxeAlertPropTypes {
  export type Title = string | number
  export type Content = string | number
  export type Status = VxeComponentStatusType
  export type ShowIcon = boolean
  export type ShowClose = boolean
  export type Icon = string
  export type Size = VxeComponentSizeType
}

export interface VxeAlertProps {
  title?: VxeAlertPropTypes.Title
  content?: VxeAlertPropTypes.Content
  status?: VxeAlertPropTypes.Status
  showIcon?: VxeAlertPropTypes.ShowIcon
  showClose?: VxeAlertPropTypes.ShowClose
  icon?: VxeAlertPropTypes.Icon
  size?: VxeAlertPropTypes.Size
}

export interface AlertPrivateComputed {
}
export type VxeAlertPrivateComputed = AlertPrivateComputed

export interface AlertReactData {
}

export interface AlertMethods {
  dispatchEvent(type: ValueOf<VxeAlertEmits>, params: Record<string, any>, evnt: Event | null): void
}
export type VxeAlertMethods = AlertMethods

export interface AlertPrivateMethods { }
export type VxeAlertPrivateMethods = AlertPrivateMethods

export type VxeAlertEmits = [
  'close'
]

export namespace VxeAlertDefines {
  export interface AlertEventParams extends VxeComponentEventParams {
    $alert: VxeAlertConstructor
  }
}

export type VxeAlertEventProps = {}

export interface VxeAlertListeners { }

export namespace VxeAlertEvents { }

export namespace VxeAlertSlotTypes {
  export interface DefaultSlotParams {}
}

export interface VxeAlertSlots {
  default?: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
  title?: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
  icon?: (params: VxeAlertSlotTypes.DefaultSlotParams) => any
}

export const Alert: typeof VxeAlert
export default VxeAlert
